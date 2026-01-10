# logistics/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import math

from .models import (
    Customer, Shipment, ShipmentStatusHistory,
    Route, RouteStop, Invoice, InvoiceItem
)
from .serializers import (
    CustomerSerializer, ShipmentSerializer, ShipmentListSerializer,
    ShipmentTrackingSerializer, ShipmentStatusHistorySerializer,
    RouteSerializer, RouteStopSerializer, RouteOptimizationRequestSerializer,
    InvoiceSerializer, InvoiceCreateSerializer, InvoiceItemSerializer
)
from fleet.models import Vehicle, Driver
from core.permissions import CanEdit, IsDispatcher, IsManager
from core.views import create_notification, create_audit_log


class CustomerViewSet(viewsets.ModelViewSet):
    """Müşteri yönetimi API."""
    queryset = Customer.objects.all().order_by('name')
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, CanEdit]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        customer_type = self.request.query_params.get('type')
        search = self.request.query_params.get('search')

        if customer_type:
            queryset = queryset.filter(customer_type=customer_type)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(contact_person__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Müşteri istatistikleri."""
        queryset = self.get_queryset()
        return Response({
            'total': queryset.count(),
            'vip': queryset.filter(customer_type='VIP').count(),
            'standard': queryset.filter(customer_type='STANDARD').count(),
            'new': queryset.filter(customer_type='NEW').count(),
            'total_revenue': float(queryset.aggregate(total=Sum('total_revenue'))['total'] or 0)
        })


class ShipmentViewSet(viewsets.ModelViewSet):
    """Sevkiyat yönetimi API."""
    queryset = Shipment.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, CanEdit]

    def get_serializer_class(self):
        if self.action == 'list':
            return ShipmentListSerializer
        return ShipmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        status_filter = self.request.query_params.get('status')
        customer_id = self.request.query_params.get('customer')
        vehicle_id = self.request.query_params.get('vehicle')
        driver_id = self.request.query_params.get('driver')
        priority = self.request.query_params.get('priority')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        if driver_id:
            queryset = queryset.filter(driver_id=driver_id)
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset

    def perform_create(self, serializer):
        shipment = serializer.save()
        # Durum geçmişine ekle
        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            status=shipment.status,
            changed_by=self.request.user,
            notes="Sevkiyat oluşturuldu"
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Sevkiyat durumunu güncelle."""
        shipment = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if new_status not in dict(Shipment.STATUS_CHOICES):
            return Response(
                {'error': 'Geçersiz durum'},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = shipment.status
        shipment.status = new_status

        # Teslimat tamamlandıysa
        if new_status == 'DELIVERED':
            shipment.actual_delivery = timezone.now()
            shipment.recipient_name = request.data.get('recipient_name', '')

            # Sürücü istatistiklerini güncelle
            if shipment.driver:
                shipment.driver.total_deliveries += 1
                shipment.driver.successful_deliveries += 1
                shipment.driver.save()

            # Müşteri istatistiklerini güncelle
            shipment.customer.total_shipments += 1
            shipment.customer.total_revenue += shipment.total_price
            shipment.customer.save()

            # Aracı boşa al
            if shipment.vehicle:
                shipment.vehicle.status = 'IDLE'
                shipment.vehicle.save()

        # Yola çıktıysa
        if new_status == 'DISPATCHED':
            if shipment.vehicle:
                shipment.vehicle.status = 'TRANSIT'
                shipment.vehicle.save()
            if shipment.driver:
                shipment.driver.is_available = False
                shipment.driver.save()

        shipment.save()

        # Durum geçmişine ekle
        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            status=new_status,
            changed_by=request.user,
            notes=notes,
            latitude=request.data.get('latitude'),
            longitude=request.data.get('longitude'),
            address=request.data.get('address')
        )

        # Bildirim oluştur
        create_notification(
            user=request.user,
            title=f"Sevkiyat Durumu Güncellendi",
            message=f"{shipment.reference_number} durumu {old_status} -> {new_status} olarak güncellendi",
            notification_type='SHIPMENT',
            related_object_type='Shipment',
            related_object_id=shipment.id
        )

        serializer = self.get_serializer(shipment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Sevkiyat istatistikleri."""
        queryset = self.get_queryset()
        total = queryset.count()
        delivered = queryset.filter(status='DELIVERED').count()

        return Response({
            'total': total,
            'pending': queryset.filter(status='PENDING').count(),
            'confirmed': queryset.filter(status='CONFIRMED').count(),
            'dispatched': queryset.filter(status='DISPATCHED').count(),
            'in_transit': queryset.filter(status='IN_TRANSIT').count(),
            'delivered': delivered,
            'cancelled': queryset.filter(status='CANCELLED').count(),
            'delivery_rate': round(delivered / max(total, 1) * 100, 1),
            'total_revenue': float(
                queryset.filter(status='DELIVERED').aggregate(
                    total=Sum('price')
                )['total'] or 0
            )
        })


# ===========================================
# CUSTOMER PORTAL - PUBLIC TRACKING
# ===========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def track_shipment(request, tracking_token):
    """Müşteri portalı - sevkiyat takibi (public)."""
    try:
        shipment = Shipment.objects.get(tracking_token=tracking_token)
        serializer = ShipmentTrackingSerializer(shipment)
        return Response(serializer.data)
    except Shipment.DoesNotExist:
        return Response(
            {'error': 'Sevkiyat bulunamadı'},
            status=status.HTTP_404_NOT_FOUND
        )


# ===========================================
# ROUTE OPTIMIZATION
# ===========================================

class RouteViewSet(viewsets.ModelViewSet):
    """Rota yönetimi API."""
    queryset = Route.objects.all().order_by('-created_at')
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated, IsDispatcher]

    @action(detail=False, methods=['post'])
    def optimize(self, request):
        """Rota optimizasyonu."""
        serializer = RouteOptimizationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        shipment_ids = data['shipment_ids']
        vehicle_id = data['vehicle_id']
        driver_id = data.get('driver_id')
        start_lat = float(data['start_lat'])
        start_lng = float(data['start_lng'])
        optimize_for = data['optimize_for']

        # Sevkiyatları al
        shipments = Shipment.objects.filter(id__in=shipment_ids)
        if not shipments.exists():
            return Response(
                {'error': 'Sevkiyat bulunamadı'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Basit nearest neighbor algoritması ile optimizasyon
        optimized_order = self._optimize_route(
            shipments, start_lat, start_lng, optimize_for
        )

        # Rota oluştur
        route = Route.objects.create(
            name=f"Rota - {timezone.now().strftime('%d.%m.%Y %H:%M')}",
            vehicle_id=vehicle_id,
            driver_id=driver_id,
            start_location=data['start_location'],
            start_lat=data['start_lat'],
            start_lng=data['start_lng'],
            status='PLANNED',
            total_stops=len(optimized_order)
        )

        # Durakları oluştur
        total_distance = 0
        prev_lat, prev_lng = start_lat, start_lng

        for seq, shipment in enumerate(optimized_order, 1):
            dest_lat = float(shipment.destination_lat or start_lat)
            dest_lng = float(shipment.destination_lng or start_lng)

            distance = self._haversine_distance(prev_lat, prev_lng, dest_lat, dest_lng)
            total_distance += distance

            RouteStop.objects.create(
                route=route,
                shipment=shipment,
                sequence=seq,
                stop_type='DELIVERY',
                service_time_mins=15
            )

            prev_lat, prev_lng = dest_lat, dest_lng

        route.total_distance_km = Decimal(str(round(total_distance, 2)))
        route.total_duration_mins = int(total_distance / 50 * 60)  # 50km/h ortalama
        route.save()

        return Response(RouteSerializer(route).data, status=status.HTTP_201_CREATED)

    def _optimize_route(self, shipments, start_lat, start_lng, optimize_for):
        """Nearest neighbor algoritması ile rota optimizasyonu."""
        remaining = list(shipments)
        ordered = []
        current_lat, current_lng = start_lat, start_lng

        while remaining:
            nearest = None
            nearest_distance = float('inf')

            for shipment in remaining:
                dest_lat = float(shipment.destination_lat or current_lat)
                dest_lng = float(shipment.destination_lng or current_lng)
                distance = self._haversine_distance(
                    current_lat, current_lng, dest_lat, dest_lng
                )

                if distance < nearest_distance:
                    nearest_distance = distance
                    nearest = shipment

            if nearest:
                ordered.append(nearest)
                remaining.remove(nearest)
                current_lat = float(nearest.destination_lat or current_lat)
                current_lng = float(nearest.destination_lng or current_lng)

        return ordered

    def _haversine_distance(self, lat1, lon1, lat2, lon2):
        """İki nokta arasındaki mesafeyi km cinsinden hesapla."""
        R = 6371  # Dünya yarıçapı (km)

        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)

        a = math.sin(delta_lat / 2) ** 2 + \
            math.cos(lat1_rad) * math.cos(lat2_rad) * \
            math.sin(delta_lon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return R * c

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Rotayı başlat."""
        route = self.get_object()
        route.status = 'IN_PROGRESS'
        route.actual_start = timezone.now()
        route.save()

        # Aracı transit yap
        if route.vehicle:
            route.vehicle.status = 'TRANSIT'
            route.vehicle.save()

        return Response(RouteSerializer(route).data)

    @action(detail=True, methods=['post'])
    def complete_stop(self, request, pk=None):
        """Durak tamamla."""
        route = self.get_object()
        stop_id = request.data.get('stop_id')

        try:
            stop = route.stops.get(id=stop_id)
            stop.completed = True
            stop.completed_at = timezone.now()
            stop.actual_arrival = timezone.now()
            stop.save()

            # Tüm duraklar tamamlandıysa rotayı kapat
            if not route.stops.filter(completed=False).exists():
                route.status = 'COMPLETED'
                route.actual_end = timezone.now()
                route.save()

                if route.vehicle:
                    route.vehicle.status = 'IDLE'
                    route.vehicle.save()

            return Response(RouteSerializer(route).data)
        except RouteStop.DoesNotExist:
            return Response(
                {'error': 'Durak bulunamadı'},
                status=status.HTTP_404_NOT_FOUND
            )


# ===========================================
# INVOICING
# ===========================================

class InvoiceViewSet(viewsets.ModelViewSet):
    """Fatura yönetimi API."""
    queryset = Invoice.objects.all().order_by('-issue_date')
    permission_classes = [IsAuthenticated, IsManager]

    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        return InvoiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        status_filter = self.request.query_params.get('status')
        customer_id = self.request.query_params.get('customer')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        return queryset

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Faturayı ödenmiş olarak işaretle."""
        invoice = self.get_object()
        invoice.status = 'PAID'
        invoice.paid_date = timezone.now().date()
        invoice.payment_method = request.data.get('payment_method', 'BANK_TRANSFER')
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Faturayı gönder."""
        invoice = self.get_object()
        invoice.status = 'SENT'
        invoice.save()

        # Bildirim oluştur (gerçek uygulamada email gönderilir)
        create_notification(
            user=request.user,
            title="Fatura Gönderildi",
            message=f"{invoice.invoice_number} numaralı fatura {invoice.customer.name}'a gönderildi",
            notification_type='INFO'
        )

        return Response(InvoiceSerializer(invoice).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Fatura istatistikleri."""
        queryset = self.get_queryset()
        return Response({
            'total': queryset.count(),
            'draft': queryset.filter(status='DRAFT').count(),
            'sent': queryset.filter(status='SENT').count(),
            'paid': queryset.filter(status='PAID').count(),
            'overdue': queryset.filter(status='OVERDUE').count(),
            'total_amount': float(queryset.aggregate(total=Sum('total'))['total'] or 0),
            'paid_amount': float(
                queryset.filter(status='PAID').aggregate(total=Sum('total'))['total'] or 0
            ),
            'pending_amount': float(
                queryset.filter(status__in=['SENT', 'OVERDUE']).aggregate(
                    total=Sum('total')
                )['total'] or 0
            )
        })


# ===========================================
# DASHBOARD - REAL DATA
# ===========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Dashboard istatistikleri - gerçek veriler."""
    # Araç istatistikleri
    vehicle_stats = {
        'total': Vehicle.objects.count(),
        'idle': Vehicle.objects.filter(status='IDLE').count(),
        'transit': Vehicle.objects.filter(status='TRANSIT').count(),
        'maintenance': Vehicle.objects.filter(status='MAINTENANCE').count(),
    }
    vehicle_stats['utilization_rate'] = round(
        vehicle_stats['transit'] / max(vehicle_stats['total'], 1) * 100, 1
    )

    # Sürücü istatistikleri
    driver_stats = {
        'total': Driver.objects.count(),
        'available': Driver.objects.filter(is_available=True).count(),
        'on_duty': Driver.objects.filter(is_available=False).count(),
    }

    # Sevkiyat istatistikleri
    shipment_stats = {
        'total': Shipment.objects.count(),
        'pending': Shipment.objects.filter(status='PENDING').count(),
        'in_progress': Shipment.objects.filter(status__in=['CONFIRMED', 'DISPATCHED', 'IN_TRANSIT']).count(),
        'delivered': Shipment.objects.filter(status='DELIVERED').count(),
        'cancelled': Shipment.objects.filter(status='CANCELLED').count(),
    }
    shipment_stats['delivery_rate'] = round(
        shipment_stats['delivered'] / max(shipment_stats['total'], 1) * 100, 1
    )

    # Gelir istatistikleri
    total_revenue = Shipment.objects.filter(status='DELIVERED').aggregate(
        total=Sum('price')
    )['total'] or 0

    # Bu ayki gelir
    this_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0)
    monthly_revenue = Shipment.objects.filter(
        status='DELIVERED',
        actual_delivery__gte=this_month_start
    ).aggregate(total=Sum('price'))['total'] or 0

    # Son aktiviteler
    recent_shipments = Shipment.objects.order_by('-updated_at')[:5]
    recent_activities = [
        {
            'id': str(s.id),
            'type': 'shipment',
            'title': f"{s.reference_number}",
            'description': f"{s.origin} -> {s.destination}",
            'status': s.status,
            'time': s.updated_at.isoformat()
        }
        for s in recent_shipments
    ]

    # Harita için araç konumları
    from fleet.models import VehicleLocation
    from django.db.models import Max

    fleet_data = []
    for vehicle in Vehicle.objects.filter(status='TRANSIT'):
        last_loc = vehicle.locations.order_by('-timestamp').first()
        if last_loc:
            fleet_data.append({
                'id': str(vehicle.id),
                'plate': vehicle.plate_number,
                'status': vehicle.status,
                'lat': float(last_loc.latitude),
                'lng': float(last_loc.longitude),
                'speed': float(last_loc.speed),
                'heading': last_loc.heading
            })

    return Response({
        'status': 'success',
        'vehicles': vehicle_stats,
        'drivers': driver_stats,
        'shipments': shipment_stats,
        'revenue': {
            'total': float(total_revenue),
            'monthly': float(monthly_revenue),
            'currency': 'TL'
        },
        'recent_activities': recent_activities,
        'fleet': fleet_data
    })

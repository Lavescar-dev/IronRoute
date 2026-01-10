# fleet/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
import random
from decimal import Decimal

from .models import Vehicle, Driver, VehicleLocation, MaintenanceRecord, FuelRecord
from .serializers import (
    VehicleSerializer, VehicleDetailSerializer, DriverSerializer, DriverDetailSerializer,
    VehicleLocationSerializer, MaintenanceRecordSerializer, FuelRecordSerializer,
    FleetMapSerializer
)
from core.permissions import CanEdit, IsDispatcher


class VehicleViewSet(viewsets.ModelViewSet):
    """Araç yönetimi API."""
    queryset = Vehicle.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, CanEdit]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VehicleDetailSerializer
        return VehicleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        status_filter = self.request.query_params.get('status')
        vehicle_type = self.request.query_params.get('type')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if vehicle_type:
            queryset = queryset.filter(vehicle_type=vehicle_type)

        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Müsait araçları listele."""
        vehicles = self.get_queryset().filter(status='IDLE')
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Araç istatistikleri."""
        queryset = self.get_queryset()
        return Response({
            'total': queryset.count(),
            'idle': queryset.filter(status='IDLE').count(),
            'transit': queryset.filter(status='TRANSIT').count(),
            'maintenance': queryset.filter(status='MAINTENANCE').count(),
            'utilization_rate': round(
                queryset.filter(status='TRANSIT').count() / max(queryset.count(), 1) * 100, 1
            )
        })

    @action(detail=False, methods=['get'])
    def map(self, request):
        """Harita için araç konumları."""
        vehicles = self.get_queryset()
        serializer = FleetMapSerializer(vehicles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        """Araç konumunu güncelle."""
        vehicle = self.get_object()
        serializer = VehicleLocationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(vehicle=vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def location_history(self, request, pk=None):
        """Araç konum geçmişi."""
        vehicle = self.get_object()
        limit = int(request.query_params.get('limit', 100))
        locations = vehicle.locations.all()[:limit]
        serializer = VehicleLocationSerializer(locations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def simulate_locations(self, request):
        """Demo için araç konumlarını simüle et."""
        vehicles = Vehicle.objects.filter(status='TRANSIT')

        # Türkiye koordinatları
        base_locations = [
            (41.0082, 28.9784),  # İstanbul
            (39.9334, 32.8597),  # Ankara
            (38.4192, 27.1287),  # İzmir
            (37.0000, 35.3213),  # Adana
            (40.1885, 29.0610),  # Bursa
        ]

        for vehicle in vehicles:
            base = random.choice(base_locations)
            VehicleLocation.objects.create(
                vehicle=vehicle,
                latitude=Decimal(str(base[0] + random.uniform(-0.5, 0.5))),
                longitude=Decimal(str(base[1] + random.uniform(-0.5, 0.5))),
                speed=Decimal(str(random.uniform(60, 120))),
                heading=random.randint(0, 360),
                fuel_level=random.randint(20, 100),
                engine_on=True
            )

        return Response({'message': f'{vehicles.count()} araç konumu güncellendi'})


class DriverViewSet(viewsets.ModelViewSet):
    """Sürücü yönetimi API."""
    queryset = Driver.objects.all().order_by('first_name')
    permission_classes = [IsAuthenticated, CanEdit]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DriverDetailSerializer
        return DriverSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        available = self.request.query_params.get('available')
        if available is not None:
            queryset = queryset.filter(is_available=available.lower() == 'true')

        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Müsait sürücüleri listele."""
        drivers = self.get_queryset().filter(is_available=True)
        serializer = self.get_serializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Sürücü istatistikleri."""
        queryset = self.get_queryset()
        return Response({
            'total': queryset.count(),
            'available': queryset.filter(is_available=True).count(),
            'on_duty': queryset.filter(is_available=False).count(),
            'utilization_rate': round(
                queryset.filter(is_available=False).count() / max(queryset.count(), 1) * 100, 1
            )
        })

    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        """Sürücü müsaitlik durumunu değiştir."""
        driver = self.get_object()
        driver.is_available = not driver.is_available
        driver.save()
        serializer = self.get_serializer(driver)
        return Response(serializer.data)


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    """Bakım kayıtları API."""
    queryset = MaintenanceRecord.objects.all().order_by('-scheduled_date')
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [IsAuthenticated, CanEdit]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        vehicle_id = self.request.query_params.get('vehicle')
        status_filter = self.request.query_params.get('status')

        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Yaklaşan bakımlar."""
        upcoming = self.get_queryset().filter(
            status='SCHEDULED',
            scheduled_date__gte=timezone.now().date()
        ).order_by('scheduled_date')[:10]
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)


class FuelRecordViewSet(viewsets.ModelViewSet):
    """Yakıt kayıtları API."""
    queryset = FuelRecord.objects.all().order_by('-fill_date')
    serializer_class = FuelRecordSerializer
    permission_classes = [IsAuthenticated, CanEdit]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        vehicle_id = self.request.query_params.get('vehicle')
        driver_id = self.request.query_params.get('driver')

        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        if driver_id:
            queryset = queryset.filter(driver_id=driver_id)

        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Yakıt istatistikleri."""
        from django.db.models import Sum, Avg

        queryset = self.get_queryset()
        return Response({
            'total_liters': queryset.aggregate(total=Sum('liters'))['total'] or 0,
            'total_cost': float(queryset.aggregate(total=Sum('total_cost'))['total'] or 0),
            'avg_price_per_liter': float(queryset.aggregate(avg=Avg('price_per_liter'))['avg'] or 0),
            'record_count': queryset.count()
        })


class VehicleLocationViewSet(viewsets.ModelViewSet):
    """Araç konum API - GPS tracking."""
    queryset = VehicleLocation.objects.all().order_by('-timestamp')
    serializer_class = VehicleLocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        vehicle_id = self.request.query_params.get('vehicle')
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)

        return queryset

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Tüm araçların son konumları."""
        from django.db.models import Max

        # Her araç için en son konum
        latest_ids = VehicleLocation.objects.values('vehicle').annotate(
            latest_id=Max('id')
        ).values_list('latest_id', flat=True)

        locations = VehicleLocation.objects.filter(id__in=latest_ids)
        serializer = self.get_serializer(locations, many=True)
        return Response(serializer.data)

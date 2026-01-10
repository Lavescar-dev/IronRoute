# logistics/serializers.py
from rest_framework import serializers
from .models import (
    Customer, Shipment, ShipmentStatusHistory,
    Route, RouteStop, Invoice, InvoiceItem
)
from fleet.serializers import VehicleSerializer, DriverSerializer


class CustomerSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_customer_type_display', read_only=True)
    shipments_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'address', 'city', 'contact_person', 'email', 'phone',
            'tax_number', 'tax_office', 'customer_type', 'type_display',
            'total_shipments', 'total_revenue', 'notes', 'shipments_count',
            'created_at', 'updated_at'
        ]

    def get_shipments_count(self, obj):
        return obj.shipments.count()


class ShipmentStatusHistorySerializer(serializers.ModelSerializer):
    status_display = serializers.SerializerMethodField()
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = ShipmentStatusHistory
        fields = [
            'id', 'status', 'status_display', 'changed_by', 'changed_by_name',
            'notes', 'latitude', 'longitude', 'address', 'created_at'
        ]

    def get_status_display(self, obj):
        return dict(Shipment.STATUS_CHOICES).get(obj.status, obj.status)


class ShipmentListSerializer(serializers.ModelSerializer):
    """Liste için minimal sevkiyat bilgisi."""
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    driver_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'reference_number', 'tracking_token',
            'customer', 'customer_name', 'vehicle', 'vehicle_plate',
            'driver', 'driver_name',
            'origin', 'destination', 'status', 'status_display',
            'priority', 'priority_display', 'price', 'total_price',
            'estimated_delivery', 'created_at'
        ]

    def get_driver_name(self, obj):
        if obj.driver:
            return f"{obj.driver.first_name} {obj.driver.last_name}"
        return None


class ShipmentSerializer(serializers.ModelSerializer):
    """Detaylı sevkiyat bilgisi."""
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    driver_details = DriverSerializer(source='driver', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tracking_url = serializers.CharField(read_only=True)
    status_history = ShipmentStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'reference_number', 'tracking_token', 'tracking_url',
            'customer', 'customer_name', 'vehicle', 'vehicle_details',
            'driver', 'driver_details',
            'origin', 'origin_lat', 'origin_lng',
            'destination', 'destination_lat', 'destination_lng',
            'status', 'status_display', 'priority', 'priority_display',
            'weight_kg', 'volume_m3', 'package_count', 'cargo_description',
            'price', 'extra_charges', 'discount', 'total_price',
            'pickup_date', 'estimated_delivery', 'actual_delivery',
            'distance_km', 'estimated_duration_mins',
            'recipient_name', 'recipient_signature', 'delivery_photo', 'delivery_notes',
            'notes', 'status_history',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reference_number', 'tracking_token']


class ShipmentTrackingSerializer(serializers.ModelSerializer):
    """Müşteri portalı için public takip bilgisi."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    status_history = ShipmentStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'reference_number', 'origin', 'destination',
            'status', 'status_display',
            'estimated_delivery', 'actual_delivery',
            'recipient_name', 'status_history'
        ]


# ===========================================
# ROUTE OPTIMIZATION SERIALIZERS
# ===========================================

class RouteStopSerializer(serializers.ModelSerializer):
    shipment_reference = serializers.CharField(source='shipment.reference_number', read_only=True)
    shipment_destination = serializers.CharField(source='shipment.destination', read_only=True)
    stop_type_display = serializers.CharField(source='get_stop_type_display', read_only=True)

    class Meta:
        model = RouteStop
        fields = [
            'id', 'shipment', 'shipment_reference', 'shipment_destination',
            'sequence', 'stop_type', 'stop_type_display',
            'time_window_start', 'time_window_end',
            'estimated_arrival', 'actual_arrival',
            'service_time_mins', 'completed', 'completed_at'
        ]


class RouteSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    driver_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = [
            'id', 'name', 'vehicle', 'vehicle_plate', 'driver', 'driver_name',
            'status', 'status_display',
            'start_location', 'start_lat', 'start_lng',
            'total_distance_km', 'total_duration_mins', 'total_stops',
            'planned_start', 'planned_end', 'actual_start', 'actual_end',
            'notes', 'stops',
            'created_at', 'updated_at'
        ]

    def get_driver_name(self, obj):
        if obj.driver:
            return f"{obj.driver.first_name} {obj.driver.last_name}"
        return None


class RouteOptimizationRequestSerializer(serializers.Serializer):
    """Rota optimizasyonu istek serializer."""
    shipment_ids = serializers.ListField(child=serializers.UUIDField())
    vehicle_id = serializers.UUIDField()
    driver_id = serializers.UUIDField(required=False)
    start_location = serializers.CharField(max_length=200)
    start_lat = serializers.DecimalField(max_digits=10, decimal_places=7)
    start_lng = serializers.DecimalField(max_digits=10, decimal_places=7)
    optimize_for = serializers.ChoiceField(
        choices=['distance', 'time', 'balanced'],
        default='balanced'
    )


# ===========================================
# INVOICING SERIALIZERS
# ===========================================

class InvoiceItemSerializer(serializers.ModelSerializer):
    shipment_reference = serializers.CharField(source='shipment.reference_number', read_only=True)

    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'shipment', 'shipment_reference',
            'description', 'quantity', 'unit_price', 'total'
        ]
        read_only_fields = ['total']


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name',
            'status', 'status_display',
            'issue_date', 'due_date', 'paid_date',
            'subtotal', 'tax_rate', 'tax_amount', 'discount', 'total',
            'payment_method', 'payment_method_display', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['invoice_number', 'tax_amount', 'total']


class InvoiceCreateSerializer(serializers.ModelSerializer):
    """Fatura oluşturma serializer."""
    shipment_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Invoice
        fields = [
            'customer', 'issue_date', 'due_date',
            'subtotal', 'tax_rate', 'discount',
            'payment_method', 'notes', 'shipment_ids'
        ]

    def create(self, validated_data):
        shipment_ids = validated_data.pop('shipment_ids', [])
        invoice = Invoice.objects.create(**validated_data)

        # Sevkiyatlardan fatura kalemleri oluştur
        if shipment_ids:
            from .models import Shipment
            shipments = Shipment.objects.filter(id__in=shipment_ids)
            for shipment in shipments:
                InvoiceItem.objects.create(
                    invoice=invoice,
                    shipment=shipment,
                    description=f"Sevkiyat: {shipment.reference_number} ({shipment.origin} -> {shipment.destination})",
                    quantity=1,
                    unit_price=shipment.total_price,
                    total=shipment.total_price
                )

            # Subtotal güncelle
            invoice.subtotal = sum(item.total for item in invoice.items.all())
            invoice.save()

        return invoice

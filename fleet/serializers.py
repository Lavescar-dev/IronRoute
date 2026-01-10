# fleet/serializers.py
from rest_framework import serializers
from .models import Vehicle, Driver, VehicleLocation, MaintenanceRecord, FuelRecord


class VehicleLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleLocation
        fields = [
            'id', 'latitude', 'longitude', 'altitude', 'speed', 'heading',
            'fuel_level', 'engine_on', 'address', 'timestamp'
        ]
        read_only_fields = ['timestamp']


class VehicleSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_vehicle_type_display', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    last_location = VehicleLocationSerializer(read_only=True)
    active_shipments_count = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id', 'plate_number', 'vehicle_type', 'type_display',
            'brand', 'model', 'model_year', 'capacity_kg', 'status', 'status_display',
            'vin_number', 'fuel_type', 'fuel_type_display', 'current_km',
            'insurance_expiry', 'inspection_expiry',
            'last_location', 'active_shipments_count',
            'created_at', 'updated_at'
        ]

    def get_active_shipments_count(self, obj):
        return obj.shipments.exclude(status__in=['DELIVERED', 'CANCELLED']).count()


class VehicleDetailSerializer(VehicleSerializer):
    """Detaylı araç bilgisi - bakım ve yakıt kayıtları dahil."""
    maintenance_records = serializers.SerializerMethodField()
    recent_locations = serializers.SerializerMethodField()

    class Meta(VehicleSerializer.Meta):
        fields = VehicleSerializer.Meta.fields + ['maintenance_records', 'recent_locations']

    def get_maintenance_records(self, obj):
        records = obj.maintenance_records.all()[:5]
        return MaintenanceRecordSerializer(records, many=True).data

    def get_recent_locations(self, obj):
        locations = obj.locations.all()[:20]
        return VehicleLocationSerializer(locations, many=True).data


class DriverSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    delivery_success_rate = serializers.FloatField(read_only=True)
    active_shipments_count = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'phone', 'email',
            'license_number', 'license_expiry', 'is_available',
            'total_deliveries', 'successful_deliveries', 'delivery_success_rate', 'rating',
            'active_shipments_count',
            'created_at', 'updated_at'
        ]

    def get_active_shipments_count(self, obj):
        return obj.shipments.exclude(status__in=['DELIVERED', 'CANCELLED']).count()


class DriverDetailSerializer(DriverSerializer):
    """Detaylı sürücü bilgisi."""
    recent_shipments = serializers.SerializerMethodField()

    class Meta(DriverSerializer.Meta):
        fields = DriverSerializer.Meta.fields + ['recent_shipments']

    def get_recent_shipments(self, obj):
        from logistics.serializers import ShipmentListSerializer
        shipments = obj.shipments.all()[:10]
        return ShipmentListSerializer(shipments, many=True).data


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    type_display = serializers.CharField(source='get_maintenance_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MaintenanceRecord
        fields = [
            'id', 'vehicle', 'vehicle_plate', 'maintenance_type', 'type_display',
            'status', 'status_display', 'description', 'scheduled_date', 'completed_date',
            'odometer_reading', 'cost', 'service_provider', 'notes',
            'created_at', 'updated_at'
        ]


class FuelRecordSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    driver_name = serializers.CharField(source='driver.full_name', read_only=True)
    consumption_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = FuelRecord
        fields = [
            'id', 'vehicle', 'vehicle_plate', 'driver', 'driver_name',
            'liters', 'price_per_liter', 'total_cost',
            'odometer_reading', 'fuel_station', 'fill_date',
            'consumption_rate', 'created_at'
        ]


# ===========================================
# GPS TRACKING SERIALIZERS
# ===========================================

class VehicleLocationBulkSerializer(serializers.Serializer):
    """Toplu konum güncelleme için serializer."""
    vehicle_id = serializers.UUIDField()
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    speed = serializers.DecimalField(max_digits=6, decimal_places=2, default=0)
    heading = serializers.IntegerField(default=0)
    fuel_level = serializers.IntegerField(required=False)
    engine_on = serializers.BooleanField(default=True)


class FleetMapSerializer(serializers.ModelSerializer):
    """Harita için minimal araç bilgisi."""
    last_location = VehicleLocationSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = ['id', 'plate_number', 'status', 'status_display', 'last_location']

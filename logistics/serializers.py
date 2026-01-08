from rest_framework import serializers
from .models import Customer, Shipment
from fleet.serializers import VehicleSerializer, DriverSerializer # Tırı ve Şoförü de gösterelim

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    # ID yerine detaylı bilgi göstermek için (Nested Serializer)
    # Read_only yapıyoruz ki yeni kayıt eklerken sadece ID gönderelim, 
    # okurken detay görelim.
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    driver_details = DriverSerializer(source='driver', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'

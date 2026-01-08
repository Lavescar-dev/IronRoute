from rest_framework import serializers
from .models import Vehicle, Driver

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__' # Tüm alanları (plaka, model vs) çevir.

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


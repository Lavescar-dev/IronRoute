from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Güvenlik Kilidi
from .models import Vehicle, Driver
from .serializers import VehicleSerializer, DriverSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    """
    Araçlar için otomatik CRUD (Ekle/Sil/Getir) işlemleri.
    Sadece giriş yapmış (Token sahibi) kullanıcılar erişebilir.
    """
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated] # Kapıdaki güvenlik

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all().order_by('first_name')
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]

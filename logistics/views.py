from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Shipment, Customer
from .serializers import ShipmentSerializer, CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class ShipmentViewSet(viewsets.ModelViewSet):
    """
    Sipariş Yönetimi.
    Ekstra özellik: Sadece kendi siparişlerini görsünler vs. ilerde buraya eklenecek.
    Şimdilik herkes her şeyi görüyor (Admin mantığı).
    """
    queryset = Shipment.objects.all().order_by('-created_at')
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

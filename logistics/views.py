from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Modeller ve Serializerlar
from .models import Shipment, Customer
from .serializers import ShipmentSerializer, CustomerSerializer

# Servisler
from src.data_generator import DataGenerator

# --- VIEWSETS (CRUD İşlemleri) ---
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all().order_by('-created_at')
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

# --- DASHBOARD ENDPOINT (Tek Sorumluluk: Veri Dağıtımı) ---
@csrf_exempt
def dashboard_stats(request):
    try:
        # 1. Veri Üretimi
        gen = DataGenerator()
        sim_stats = gen.get_delivery_stats()
        telemetry = gen.get_fleet_telemetry()
        
        # 2. İş Mantığı (Hesaplamalar)
        # Not: İleride bu hesaplamalar bir 'Service' sınıfına taşınabilir.
        revenue = sim_stats.get('Teslim Edildi', 0) * 450
        
        # 3. Yanıt Hazırlama
        response_data = {
            "status": "success",
            "meta": {
                "total_vehicles": 5,
                "monthly_revenue": revenue,
            },
            "stats": {
                "active_vehicles": sim_stats.get('Yolda', 0),
                "available_vehicles": sim_stats.get('Hazırlanıyor', 0),
                "maintenance_vehicles": sim_stats.get('İade', 0),
            },
            "fleet": telemetry
        }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

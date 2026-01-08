from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShipmentViewSet, CustomerViewSet, dashboard_stats

router = DefaultRouter()
router.register(r'shipments', ShipmentViewSet)
router.register(r'customers', CustomerViewSet)

urlpatterns = [
    # ÖNCE ÖZEL YOLLAR (Django yukarıdan aşağı okur)
    # Eğer router bunu yutuyorsa, en tepeye koymak çözer.
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),

    # SONRA OTOMATİK YOLLAR
    path('', include(router.urls)),
]

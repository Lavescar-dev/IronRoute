# fleet/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehicleViewSet, DriverViewSet,
    MaintenanceRecordViewSet, FuelRecordViewSet, VehicleLocationViewSet
)

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'maintenance', MaintenanceRecordViewSet)
router.register(r'fuel-records', FuelRecordViewSet)
router.register(r'vehicle-locations', VehicleLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

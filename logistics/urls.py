# logistics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShipmentViewSet, CustomerViewSet, RouteViewSet, InvoiceViewSet,
    dashboard_stats, track_shipment
)

router = DefaultRouter()
router.register(r'shipments', ShipmentViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    # Dashboard
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),

    # Public tracking (no auth required)
    path('track/<str:tracking_token>/', track_shipment, name='track-shipment'),

    # Router URLs
    path('', include(router.urls)),
]

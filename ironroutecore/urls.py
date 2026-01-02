from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# ViewSet'lerimiz
from fleet.views import VehicleViewSet, DriverViewSet
from logistics.views import ShipmentViewSet, CustomerViewSet

# --- Swagger Ayarları ---
schema_view = get_schema_view(
   openapi.Info(
      title="IronRoute Logistics API",
      default_version='v1',
      description="Lavescar Lojistik Yönetim Paneli API Dokümantasyonu",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="lavescar@ironroute.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# --- Router ---
router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'customers', CustomerViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Swagger URL'leri (Dokümantasyon)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

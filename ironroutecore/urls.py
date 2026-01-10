"""
IronRoute Core URL Configuration

This module defines the URL routing for the entire application.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


# ===========================================
# SWAGGER/OPENAPI CONFIGURATION
# ===========================================

schema_view = get_schema_view(
    openapi.Info(
        title="IronRoute Logistics API",
        default_version='v1',
        description="""
        ## IronRoute Lojistik Yonetim Paneli API Dokumantasyonu

        Bu API, IronRoute lojistik yonetim sisteminin tum islevlerine erisim saglar.

        ### Moduller:
        - **Fleet**: Arac ve surucu yonetimi
        - **Logistics**: Sevkiyat ve musteri yonetimi
        - **Dashboard**: Istatistikler ve raporlama

        ### Kimlik Dogrulama:
        JWT (JSON Web Token) tabanli kimlik dogrulama kullanilmaktadir.
        Token almak icin `/api/token/` endpoint'ini kullanin.
        """,
        terms_of_service="https://www.ironroute.com/terms/",
        contact=openapi.Contact(email="api@ironroute.com"),
        license=openapi.License(name="Proprietary License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


# ===========================================
# URL PATTERNS
# ===========================================

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),

    # ===========================================
    # API ENDPOINTS
    # ===========================================

    # Core Module (users, notifications, audit logs)
    path('api/', include('core.urls')),

    # Fleet Module (vehicles, drivers, maintenance, fuel, locations)
    path('api/', include('fleet.urls')),

    # Logistics Module (shipments, customers, routes, invoices, dashboard)
    path('api/', include('logistics.urls')),

    # ===========================================
    # AUTHENTICATION
    # ===========================================

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ===========================================
    # API DOCUMENTATION
    # ===========================================

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

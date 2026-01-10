# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, NotificationViewSet, AuditLogViewSet, SystemSettingViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'settings', SystemSettingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

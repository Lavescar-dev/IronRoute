# core/views.py
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone

from .models import UserProfile, Notification, AuditLog, SystemSetting
from .serializers import (
    UserSerializer, UserCreateSerializer, UserProfileSerializer,
    NotificationSerializer, AuditLogSerializer, SystemSettingSerializer
)
from .permissions import IsAdmin, IsManager, CanEdit


class UserViewSet(viewsets.ModelViewSet):
    """Kullanıcı yönetimi - sadece adminler."""
    queryset = User.objects.all().select_related('profile')
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Mevcut kullanıcı bilgilerini döndür."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Mevcut kullanıcının profilini güncelle."""
        profile = request.user.profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ModelViewSet):
    """Bildirim yönetimi - kullanıcı kendi bildirimlerini görür."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Okunmamış bildirimleri döndür."""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response({
            'count': notifications.count(),
            'notifications': serializer.data
        })

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Tüm bildirimleri okundu olarak işaretle."""
        count = self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'marked_count': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Tek bildirimi okundu olarak işaretle."""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'status': 'marked as read'})


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Denetim kayıtları - sadece adminler görebilir."""
    queryset = AuditLog.objects.all().select_related('user')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtreleme
        user_id = self.request.query_params.get('user')
        action = self.request.query_params.get('action')
        model = self.request.query_params.get('model')

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if action:
            queryset = queryset.filter(action=action)
        if model:
            queryset = queryset.filter(model_name=model)

        return queryset


class SystemSettingViewSet(viewsets.ModelViewSet):
    """Sistem ayarları - adminler düzenleyebilir, herkes okuyabilir."""
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Admin değilse sadece public ayarları göster
        if not (hasattr(self.request.user, 'profile') and self.request.user.profile.is_admin):
            queryset = queryset.filter(is_public=True)

        return queryset


# ===========================================
# UTILITY FUNCTIONS
# ===========================================

def create_notification(user, title, message, notification_type='INFO', channel='IN_APP',
                        related_object_type=None, related_object_id=None):
    """Bildirim oluşturma yardımcı fonksiyonu."""
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        channel=channel,
        related_object_type=related_object_type,
        related_object_id=related_object_id
    )


def create_audit_log(user, action, model_name, object_id=None, object_repr=None,
                     changes=None, request=None):
    """Denetim kaydı oluşturma yardımcı fonksiyonu."""
    ip_address = None
    user_agent = None

    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]

    return AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=str(object_id) if object_id else None,
        object_repr=object_repr,
        changes=changes or {},
        ip_address=ip_address,
        user_agent=user_agent
    )

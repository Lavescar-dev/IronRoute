# core/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Notification, AuditLog, SystemSetting


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'role_display', 'phone', 'avatar',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'is_admin', 'is_manager', 'is_dispatcher', 'can_edit', 'can_view_reports',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['is_admin', 'is_manager', 'is_dispatcher', 'can_edit', 'can_view_reports']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'profile', 'role']
        read_only_fields = ['date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """Yeni kullanıcı oluşturmak için serializer."""
    password = serializers.CharField(write_only=True, min_length=4)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='VIEWER')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        role = validated_data.pop('role', 'VIEWER')
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Profil otomatik oluşturulur (signal ile), rolü güncelle
        user.profile.role = role
        user.profile.save()

        return user


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'type_display',
            'channel', 'channel_display', 'is_read', 'read_at',
            'related_object_type', 'related_object_id',
            'created_at', 'time_ago'
        ]
        read_only_fields = ['created_at']

    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return "Az önce"
        elif diff < timedelta(hours=1):
            mins = int(diff.total_seconds() / 60)
            return f"{mins} dakika önce"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} saat önce"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days} gün önce"
        else:
            return obj.created_at.strftime("%d.%m.%Y")


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'username', 'action', 'action_display',
            'model_name', 'object_id', 'object_repr', 'changes',
            'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['created_at']


class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['id', 'key', 'value', 'description', 'is_public', 'updated_at']

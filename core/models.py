# core/models.py
import uuid
import secrets
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class TimeStampedModel(models.Model):
    """
    Bu soyut (abstract) model, tüm tablolarımızın atasıdır.
    Her tabloya otomatik olarak UUID ve zaman damgası ekler.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ===========================================
# ROLE-BASED ACCESS CONTROL (RBAC)
# ===========================================

class UserProfile(models.Model):
    """
    Kullanıcı profili - Rol bazlı yetkilendirme için.
    """
    ROLE_CHOICES = (
        ('ADMIN', 'Sistem Yöneticisi'),
        ('MANAGER', 'Filo Müdürü'),
        ('DISPATCHER', 'Sevkiyat Sorumlusu'),
        ('DRIVER', 'Sürücü'),
        ('CUSTOMER', 'Müşteri'),
        ('VIEWER', 'Salt Görüntüleyici'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='VIEWER')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefon")
    avatar = models.URLField(blank=True, null=True, verbose_name="Profil Fotoğrafı")

    # Bildirim tercihleri
    email_notifications = models.BooleanField(default=True, verbose_name="E-posta Bildirimleri")
    sms_notifications = models.BooleanField(default=False, verbose_name="SMS Bildirimleri")
    push_notifications = models.BooleanField(default=True, verbose_name="Push Bildirimleri")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Kullanıcı Profili"
        verbose_name_plural = "Kullanıcı Profilleri"

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"

    @property
    def is_admin(self):
        return self.role == 'ADMIN'

    @property
    def is_manager(self):
        return self.role in ['ADMIN', 'MANAGER']

    @property
    def is_dispatcher(self):
        return self.role in ['ADMIN', 'MANAGER', 'DISPATCHER']

    @property
    def can_edit(self):
        return self.role in ['ADMIN', 'MANAGER', 'DISPATCHER']

    @property
    def can_view_reports(self):
        return self.role in ['ADMIN', 'MANAGER', 'DISPATCHER', 'VIEWER']


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Yeni kullanıcı oluşturulduğunda otomatik profil oluştur."""
    if created:
        # Superuser ise ADMIN rolü ver
        role = 'ADMIN' if instance.is_superuser else 'VIEWER'
        UserProfile.objects.create(user=instance, role=role)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Kullanıcı kaydedildiğinde profili de kaydet."""
    if hasattr(instance, 'profile'):
        instance.profile.save()


# ===========================================
# NOTIFICATION SYSTEM
# ===========================================

class Notification(TimeStampedModel):
    """
    Bildirim sistemi - Email, SMS, Push bildirimleri.
    """
    TYPE_CHOICES = (
        ('INFO', 'Bilgilendirme'),
        ('SUCCESS', 'Başarılı'),
        ('WARNING', 'Uyarı'),
        ('ERROR', 'Hata'),
        ('SHIPMENT', 'Sevkiyat Bildirimi'),
        ('VEHICLE', 'Araç Bildirimi'),
        ('SYSTEM', 'Sistem Bildirimi'),
    )

    CHANNEL_CHOICES = (
        ('IN_APP', 'Uygulama İçi'),
        ('EMAIL', 'E-posta'),
        ('SMS', 'SMS'),
        ('PUSH', 'Push Bildirim'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200, verbose_name="Başlık")
    message = models.TextField(verbose_name="Mesaj")
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='INFO')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='IN_APP')

    is_read = models.BooleanField(default=False, verbose_name="Okundu mu?")
    read_at = models.DateTimeField(null=True, blank=True, verbose_name="Okunma Zamanı")

    # İlgili nesne (opsiyonel)
    related_object_type = models.CharField(max_length=50, blank=True, null=True)
    related_object_id = models.UUIDField(blank=True, null=True)

    class Meta:
        verbose_name = "Bildirim"
        verbose_name_plural = "Bildirimler"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"


# ===========================================
# AUDIT LOG (Denetim Kaydı)
# ===========================================

class AuditLog(models.Model):
    """
    Tüm önemli işlemlerin kaydı - güvenlik ve takip için.
    """
    ACTION_CHOICES = (
        ('CREATE', 'Oluşturma'),
        ('UPDATE', 'Güncelleme'),
        ('DELETE', 'Silme'),
        ('LOGIN', 'Giriş'),
        ('LOGOUT', 'Çıkış'),
        ('EXPORT', 'Dışa Aktarma'),
        ('STATUS_CHANGE', 'Durum Değişikliği'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50, verbose_name="Model Adı")
    object_id = models.CharField(max_length=100, blank=True, null=True)
    object_repr = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nesne Açıklaması")

    changes = models.JSONField(default=dict, blank=True, verbose_name="Değişiklikler")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Denetim Kaydı"
        verbose_name_plural = "Denetim Kayıtları"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action} - {self.model_name}"


# ===========================================
# SYSTEM SETTINGS
# ===========================================

class SystemSetting(models.Model):
    """
    Sistem ayarları - dinamik konfigürasyon.
    """
    key = models.CharField(max_length=100, unique=True, verbose_name="Ayar Anahtarı")
    value = models.TextField(verbose_name="Değer")
    description = models.TextField(blank=True, null=True, verbose_name="Açıklama")
    is_public = models.BooleanField(default=False, verbose_name="Herkese Açık")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sistem Ayarı"
        verbose_name_plural = "Sistem Ayarları"

    def __str__(self):
        return self.key

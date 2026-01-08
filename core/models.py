# core/models.py
import uuid
from django.db import models

class TimeStampedModel(models.Model):
    """
    Bu soyut (abstract) model, tüm tablolarımızın atasıdır.
    Her tabloya otomatik olarak UUID ve zaman damgası ekler.
    """
    # ID yerine UUID kullanıyoruz (Güvenlik ve Benzersizlik için)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Kayıt ne zaman oluşturuldu?
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Kayıt en son ne zaman güncellendi?
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # Bu satır kritik! Veritabanında bunun için tablo yaratılmaz.

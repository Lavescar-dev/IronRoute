from django.db import models
from core.models import TimeStampedModel
from fleet.models import Vehicle, Driver # Filo modülünden ithal ettik

class Customer(TimeStampedModel):
    """
    Yükü taşıtan müşteriler (Firmalar).
    """
    name = models.CharField(max_length=100, verbose_name="Firma Adı")
    address = models.TextField(verbose_name="Adres")
    contact_person = models.CharField(max_length=50, verbose_name="Yetkili Kişi")
    email = models.EmailField(verbose_name="E-posta")

    def __str__(self):
        return self.name

class Shipment(TimeStampedModel):
    """
    Ana Sipariş / Sevkiyat Modeli.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Sipariş Alındı'),
        ('DISPATCHED', 'Araç Atandı / Yola Çıktı'),
        ('DELIVERED', 'Teslim Edildi'),
        ('CANCELLED', 'İptal'),
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='shipments', verbose_name="Müşteri")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments', verbose_name="Atanan Araç")
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments', verbose_name="Sürücü")
    
    origin = models.CharField(max_length=100, verbose_name="Yükleme Noktası")
    destination = models.CharField(max_length=100, verbose_name="Teslimat Noktası")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Taşıma Ücreti (TL)")

    def __str__(self):
        return f"Sevkiyat: {self.origin} -> {self.destination}"

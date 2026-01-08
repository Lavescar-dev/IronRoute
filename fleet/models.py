from django.db import models
from core.models import TimeStampedModel

class Vehicle(TimeStampedModel):
    """
    Şirketin sahip olduğu araçlar (Kamyon, Tır, Panelvan).
    """
    VEHICLE_TYPES = (
        ('TRUCK', 'Tır Çekici'),
        ('LORRY', 'Kamyon (Kırkayak)'),
        ('VAN', 'Panelvan'),
        ('PICKUP', 'Kamyonet'),
    )
    
    STATUS_CHOICES = (
        ('IDLE', 'Garajda / Boş'),
        ('TRANSIT', 'Yolda / Seferde'),
        ('MAINTENANCE', 'Bakımda'),
    )

    plate_number = models.CharField(max_length=20, unique=True, verbose_name="Plaka")
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPES, default='TRUCK')
    brand = models.CharField(max_length=50, verbose_name="Marka")
    model_year = models.PositiveIntegerField(verbose_name="Model Yılı")
    capacity_kg = models.PositiveIntegerField(verbose_name="Yük Kapasitesi (KG)")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='IDLE')

    def __str__(self):
        return f"{self.plate_number} - {self.get_vehicle_type_display()}"

class Driver(TimeStampedModel):
    """
    Araçları kullanacak şoförler.
    """
    first_name = models.CharField(max_length=50, verbose_name="Ad")
    last_name = models.CharField(max_length=50, verbose_name="Soyad")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    license_number = models.CharField(max_length=50, unique=True, verbose_name="Ehliyet No")
    is_available = models.BooleanField(default=True, verbose_name="Müsait mi?")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

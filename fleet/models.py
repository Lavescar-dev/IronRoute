from django.db import models
from django.contrib.auth.models import User
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
    model = models.CharField(max_length=50, blank=True, null=True, verbose_name="Model")
    model_year = models.PositiveIntegerField(verbose_name="Model Yılı")
    capacity_kg = models.PositiveIntegerField(verbose_name="Yük Kapasitesi (KG)")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='IDLE')

    # Ek araç bilgileri
    vin_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Şasi No")
    fuel_type = models.CharField(max_length=20, default='DIESEL', choices=(
        ('DIESEL', 'Dizel'),
        ('GASOLINE', 'Benzin'),
        ('LPG', 'LPG'),
        ('ELECTRIC', 'Elektrik'),
        ('HYBRID', 'Hibrit'),
    ), verbose_name="Yakıt Tipi")
    current_km = models.PositiveIntegerField(default=0, verbose_name="Güncel KM")
    insurance_expiry = models.DateField(null=True, blank=True, verbose_name="Sigorta Bitiş")
    inspection_expiry = models.DateField(null=True, blank=True, verbose_name="Muayene Bitiş")

    class Meta:
        verbose_name = "Araç"
        verbose_name_plural = "Araçlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.plate_number} - {self.get_vehicle_type_display()}"

    @property
    def last_location(self):
        """Son konum bilgisini döndür."""
        return self.locations.order_by('-timestamp').first()


class Driver(TimeStampedModel):
    """
    Araçları kullanacak şoförler.
    """
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='driver_profile', verbose_name="Kullanıcı Hesabı")
    first_name = models.CharField(max_length=50, verbose_name="Ad")
    last_name = models.CharField(max_length=50, verbose_name="Soyad")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    email = models.EmailField(blank=True, null=True, verbose_name="E-posta")
    license_number = models.CharField(max_length=50, unique=True, verbose_name="Ehliyet No")
    license_expiry = models.DateField(null=True, blank=True, verbose_name="Ehliyet Bitiş")
    is_available = models.BooleanField(default=True, verbose_name="Müsait mi?")

    # Performans metrikleri
    total_deliveries = models.PositiveIntegerField(default=0, verbose_name="Toplam Teslimat")
    successful_deliveries = models.PositiveIntegerField(default=0, verbose_name="Başarılı Teslimat")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00, verbose_name="Puan")

    class Meta:
        verbose_name = "Sürücü"
        verbose_name_plural = "Sürücüler"
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def delivery_success_rate(self):
        if self.total_deliveries == 0:
            return 100.0
        return round((self.successful_deliveries / self.total_deliveries) * 100, 1)


# ===========================================
# GPS TRACKING - REAL-TIME LOCATION
# ===========================================

class VehicleLocation(models.Model):
    """
    Araç konum takibi - GPS verileri.
    Her araç için gerçek zamanlı konum kaydı.
    """
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='locations')

    # Konum bilgileri
    latitude = models.DecimalField(max_digits=10, decimal_places=7, verbose_name="Enlem")
    longitude = models.DecimalField(max_digits=10, decimal_places=7, verbose_name="Boylam")
    altitude = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, verbose_name="Rakım (m)")

    # Hareket bilgileri
    speed = models.DecimalField(max_digits=6, decimal_places=2, default=0, verbose_name="Hız (km/s)")
    heading = models.PositiveIntegerField(default=0, verbose_name="Yön (derece)")

    # Araç telemetrisi
    fuel_level = models.PositiveIntegerField(null=True, blank=True, verbose_name="Yakıt Seviyesi (%)")
    engine_on = models.BooleanField(default=False, verbose_name="Motor Açık")

    # Adres (reverse geocoding ile doldurulabilir)
    address = models.CharField(max_length=300, blank=True, null=True, verbose_name="Adres")

    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Zaman Damgası")

    class Meta:
        verbose_name = "Araç Konumu"
        verbose_name_plural = "Araç Konumları"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['vehicle', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]

    def __str__(self):
        return f"{self.vehicle.plate_number} - {self.latitude}, {self.longitude}"


# ===========================================
# VEHICLE MAINTENANCE TRACKING
# ===========================================

class MaintenanceRecord(TimeStampedModel):
    """
    Araç bakım kayıtları.
    """
    TYPE_CHOICES = (
        ('SCHEDULED', 'Planlı Bakım'),
        ('REPAIR', 'Arıza/Tamir'),
        ('INSPECTION', 'Muayene'),
        ('TIRE', 'Lastik Değişimi'),
        ('OIL', 'Yağ Değişimi'),
        ('BRAKE', 'Fren Bakımı'),
        ('OTHER', 'Diğer'),
    )

    STATUS_CHOICES = (
        ('SCHEDULED', 'Planlandı'),
        ('IN_PROGRESS', 'Devam Ediyor'),
        ('COMPLETED', 'Tamamlandı'),
        ('CANCELLED', 'İptal Edildi'),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name="Bakım Tipi")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')

    description = models.TextField(verbose_name="Açıklama")
    scheduled_date = models.DateField(verbose_name="Planlanan Tarih")
    completed_date = models.DateField(null=True, blank=True, verbose_name="Tamamlanma Tarihi")

    odometer_reading = models.PositiveIntegerField(null=True, blank=True, verbose_name="KM Sayacı")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Maliyet (TL)")

    service_provider = models.CharField(max_length=100, blank=True, null=True, verbose_name="Servis Sağlayıcı")
    notes = models.TextField(blank=True, null=True, verbose_name="Notlar")

    class Meta:
        verbose_name = "Bakım Kaydı"
        verbose_name_plural = "Bakım Kayıtları"
        ordering = ['-scheduled_date']

    def __str__(self):
        return f"{self.vehicle.plate_number} - {self.get_maintenance_type_display()}"


# ===========================================
# FUEL RECORDS
# ===========================================

class FuelRecord(TimeStampedModel):
    """
    Yakıt alım kayıtları.
    """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_records')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='fuel_records')

    liters = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Litre")
    price_per_liter = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Litre Fiyatı (TL)")
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Toplam Tutar (TL)")

    odometer_reading = models.PositiveIntegerField(verbose_name="KM Sayacı")
    fuel_station = models.CharField(max_length=100, blank=True, null=True, verbose_name="İstasyon")

    fill_date = models.DateTimeField(verbose_name="Alım Tarihi")

    class Meta:
        verbose_name = "Yakıt Kaydı"
        verbose_name_plural = "Yakıt Kayıtları"
        ordering = ['-fill_date']

    def __str__(self):
        return f"{self.vehicle.plate_number} - {self.liters}L"

    @property
    def consumption_rate(self):
        """Yakıt tüketim oranı hesapla (L/100km)."""
        previous_record = FuelRecord.objects.filter(
            vehicle=self.vehicle,
            fill_date__lt=self.fill_date
        ).order_by('-fill_date').first()

        if previous_record and self.odometer_reading > previous_record.odometer_reading:
            distance = self.odometer_reading - previous_record.odometer_reading
            return round((self.liters / distance) * 100, 2)
        return None

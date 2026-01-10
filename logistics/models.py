import secrets
from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel
from fleet.models import Vehicle, Driver


class Customer(TimeStampedModel):
    """
    Yükü taşıtan müşteriler (Firmalar).
    """
    # İsteğe bağlı kullanıcı hesabı (müşteri portalı için)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='customer_profile', verbose_name="Portal Hesabı")

    name = models.CharField(max_length=100, verbose_name="Firma Adı")
    address = models.TextField(verbose_name="Adres")
    city = models.CharField(max_length=50, blank=True, null=True, verbose_name="Şehir")
    contact_person = models.CharField(max_length=50, verbose_name="Yetkili Kişi")
    email = models.EmailField(verbose_name="E-posta")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefon")
    tax_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="Vergi No")
    tax_office = models.CharField(max_length=100, blank=True, null=True, verbose_name="Vergi Dairesi")

    # Müşteri kategorisi
    customer_type = models.CharField(max_length=20, default='STANDARD', choices=(
        ('VIP', 'VIP Müşteri'),
        ('STANDARD', 'Standart'),
        ('NEW', 'Yeni Müşteri'),
    ), verbose_name="Müşteri Tipi")

    # İstatistikler
    total_shipments = models.PositiveIntegerField(default=0, verbose_name="Toplam Sevkiyat")
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Toplam Ciro")

    notes = models.TextField(blank=True, null=True, verbose_name="Notlar")

    class Meta:
        verbose_name = "Müşteri"
        verbose_name_plural = "Müşteriler"
        ordering = ['name']

    def __str__(self):
        return self.name


class Shipment(TimeStampedModel):
    """
    Ana Sipariş / Sevkiyat Modeli.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Sipariş Alındı'),
        ('CONFIRMED', 'Onaylandı'),
        ('DISPATCHED', 'Araç Atandı / Yola Çıktı'),
        ('IN_TRANSIT', 'Yolda'),
        ('DELIVERED', 'Teslim Edildi'),
        ('CANCELLED', 'İptal'),
    )

    PRIORITY_CHOICES = (
        ('LOW', 'Düşük'),
        ('NORMAL', 'Normal'),
        ('HIGH', 'Yüksek'),
        ('URGENT', 'Acil'),
    )

    # Referans numarası (müşteri takibi için)
    reference_number = models.CharField(max_length=20, unique=True, blank=True, verbose_name="Referans No")

    # Public tracking token (müşteri portalı için - giriş gerektirmeden takip)
    tracking_token = models.CharField(max_length=32, unique=True, blank=True, verbose_name="Takip Kodu")

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='shipments', verbose_name="Müşteri")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments', verbose_name="Atanan Araç")
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments', verbose_name="Sürücü")

    # Lokasyon bilgileri
    origin = models.CharField(max_length=100, verbose_name="Yükleme Noktası")
    origin_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, verbose_name="Yükleme Enlem")
    origin_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, verbose_name="Yükleme Boylam")

    destination = models.CharField(max_length=100, verbose_name="Teslimat Noktası")
    destination_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, verbose_name="Teslimat Enlem")
    destination_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True, verbose_name="Teslimat Boylam")

    # Durum ve öncelik
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='NORMAL', verbose_name="Öncelik")

    # Yük bilgileri
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Ağırlık (KG)")
    volume_m3 = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="Hacim (m³)")
    package_count = models.PositiveIntegerField(default=1, verbose_name="Paket Sayısı")
    cargo_description = models.TextField(blank=True, null=True, verbose_name="Yük Açıklaması")

    # Fiyatlandırma
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Taşıma Ücreti (TL)")
    extra_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Ek Ücretler (TL)")
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="İndirim (TL)")

    # Tarihler
    pickup_date = models.DateTimeField(null=True, blank=True, verbose_name="Yükleme Tarihi")
    estimated_delivery = models.DateTimeField(null=True, blank=True, verbose_name="Tahmini Teslimat")
    actual_delivery = models.DateTimeField(null=True, blank=True, verbose_name="Gerçek Teslimat")

    # Rota bilgisi
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="Mesafe (KM)")
    estimated_duration_mins = models.PositiveIntegerField(null=True, blank=True, verbose_name="Tahmini Süre (dk)")

    # Teslimat onayı
    recipient_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Teslim Alan")
    recipient_signature = models.TextField(blank=True, null=True, verbose_name="İmza (Base64)")
    delivery_photo = models.URLField(blank=True, null=True, verbose_name="Teslimat Fotoğrafı")
    delivery_notes = models.TextField(blank=True, null=True, verbose_name="Teslimat Notları")

    notes = models.TextField(blank=True, null=True, verbose_name="Notlar")

    class Meta:
        verbose_name = "Sevkiyat"
        verbose_name_plural = "Sevkiyatlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_number}: {self.origin} -> {self.destination}"

    def save(self, *args, **kwargs):
        if not self.reference_number:
            # SHP-2024-XXXXX formatında referans numarası oluştur
            import datetime
            year = datetime.datetime.now().year
            last = Shipment.objects.filter(reference_number__startswith=f'SHP-{year}').count()
            self.reference_number = f'SHP-{year}-{str(last + 1).zfill(5)}'

        if not self.tracking_token:
            self.tracking_token = secrets.token_hex(16)

        super().save(*args, **kwargs)

    @property
    def total_price(self):
        return self.price + self.extra_charges - self.discount

    @property
    def tracking_url(self):
        return f"/track/{self.tracking_token}"


# ===========================================
# SHIPMENT STATUS HISTORY
# ===========================================

class ShipmentStatusHistory(models.Model):
    """
    Sevkiyat durum geçmişi - her durum değişikliği kaydedilir.
    """
    id = models.BigAutoField(primary_key=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Shipment.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, null=True, verbose_name="Notlar")

    # Konum bilgisi (durum değişikliği anında)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    address = models.CharField(max_length=300, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Durum Geçmişi"
        verbose_name_plural = "Durum Geçmişleri"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.shipment.reference_number} - {self.status}"


# ===========================================
# ROUTE OPTIMIZATION
# ===========================================

class Route(TimeStampedModel):
    """
    Optimized rota planı - birden fazla teslimat noktası içerebilir.
    """
    STATUS_CHOICES = (
        ('DRAFT', 'Taslak'),
        ('PLANNED', 'Planlandı'),
        ('IN_PROGRESS', 'Devam Ediyor'),
        ('COMPLETED', 'Tamamlandı'),
        ('CANCELLED', 'İptal'),
    )

    name = models.CharField(max_length=100, verbose_name="Rota Adı")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, related_name='routes')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, related_name='routes')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Rota başlangıç noktası
    start_location = models.CharField(max_length=200, verbose_name="Başlangıç Noktası")
    start_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    start_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    # Optimizasyon metrikleri
    total_distance_km = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Toplam Mesafe (KM)")
    total_duration_mins = models.PositiveIntegerField(default=0, verbose_name="Toplam Süre (dk)")
    total_stops = models.PositiveIntegerField(default=0, verbose_name="Durak Sayısı")

    planned_start = models.DateTimeField(null=True, blank=True, verbose_name="Planlanan Başlangıç")
    planned_end = models.DateTimeField(null=True, blank=True, verbose_name="Planlanan Bitiş")
    actual_start = models.DateTimeField(null=True, blank=True, verbose_name="Gerçek Başlangıç")
    actual_end = models.DateTimeField(null=True, blank=True, verbose_name="Gerçek Bitiş")

    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Rota"
        verbose_name_plural = "Rotalar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.total_stops} durak"


class RouteStop(models.Model):
    """
    Rota üzerindeki durak noktaları.
    """
    id = models.BigAutoField(primary_key=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='route_stops')

    # Sıralama
    sequence = models.PositiveIntegerField(verbose_name="Sıra")

    # Durak tipi
    stop_type = models.CharField(max_length=20, choices=(
        ('PICKUP', 'Yükleme'),
        ('DELIVERY', 'Teslimat'),
    ), default='DELIVERY')

    # Zaman penceresi
    time_window_start = models.TimeField(null=True, blank=True, verbose_name="Pencere Başlangıç")
    time_window_end = models.TimeField(null=True, blank=True, verbose_name="Pencere Bitiş")

    # Tahmini ve gerçek varış
    estimated_arrival = models.DateTimeField(null=True, blank=True)
    actual_arrival = models.DateTimeField(null=True, blank=True)

    # Durak süresi
    service_time_mins = models.PositiveIntegerField(default=15, verbose_name="Hizmet Süresi (dk)")

    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Rota Durağı"
        verbose_name_plural = "Rota Durakları"
        ordering = ['route', 'sequence']
        unique_together = ['route', 'sequence']

    def __str__(self):
        return f"{self.route.name} - Durak {self.sequence}"


# ===========================================
# INVOICING / BILLING
# ===========================================

class Invoice(TimeStampedModel):
    """
    Fatura modeli.
    """
    STATUS_CHOICES = (
        ('DRAFT', 'Taslak'),
        ('SENT', 'Gönderildi'),
        ('PAID', 'Ödendi'),
        ('OVERDUE', 'Vadesi Geçmiş'),
        ('CANCELLED', 'İptal'),
    )

    # Fatura numarası
    invoice_number = models.CharField(max_length=20, unique=True, blank=True, verbose_name="Fatura No")

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Tarihler
    issue_date = models.DateField(verbose_name="Düzenleme Tarihi")
    due_date = models.DateField(verbose_name="Vade Tarihi")
    paid_date = models.DateField(null=True, blank=True, verbose_name="Ödeme Tarihi")

    # Tutarlar
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Ara Toplam")
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=20, verbose_name="KDV Oranı (%)")
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="KDV Tutarı")
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="İndirim")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Genel Toplam")

    # Ödeme bilgileri
    payment_method = models.CharField(max_length=20, blank=True, null=True, choices=(
        ('CASH', 'Nakit'),
        ('BANK_TRANSFER', 'Havale/EFT'),
        ('CREDIT_CARD', 'Kredi Kartı'),
        ('CHECK', 'Çek'),
    ), verbose_name="Ödeme Yöntemi")

    notes = models.TextField(blank=True, null=True, verbose_name="Notlar")

    class Meta:
        verbose_name = "Fatura"
        verbose_name_plural = "Faturalar"
        ordering = ['-issue_date']

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import datetime
            year = datetime.datetime.now().year
            last = Invoice.objects.filter(invoice_number__startswith=f'INV-{year}').count()
            self.invoice_number = f'INV-{year}-{str(last + 1).zfill(5)}'

        # Toplam hesapla
        self.tax_amount = self.subtotal * (self.tax_rate / 100)
        self.total = self.subtotal + self.tax_amount - self.discount

        super().save(*args, **kwargs)


class InvoiceItem(models.Model):
    """
    Fatura kalemleri.
    """
    id = models.BigAutoField(primary_key=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    shipment = models.ForeignKey(Shipment, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoice_items')

    description = models.CharField(max_length=200, verbose_name="Açıklama")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Miktar")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Birim Fiyat")
    total = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Toplam")

    class Meta:
        verbose_name = "Fatura Kalemi"
        verbose_name_plural = "Fatura Kalemleri"

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.description}"

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)

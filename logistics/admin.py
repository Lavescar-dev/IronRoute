from django.contrib import admin
from .models import Customer, Shipment

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'email')
    search_fields = ('name',)

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('origin', 'destination', 'status', 'vehicle', 'price')
    list_filter = ('status',)
    search_fields = ('origin', 'destination', 'tracking_code')

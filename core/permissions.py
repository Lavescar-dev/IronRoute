# core/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Sadece ADMIN rolüne sahip kullanıcılar."""
    message = "Bu işlem için Sistem Yöneticisi yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.is_admin


class IsManager(permissions.BasePermission):
    """ADMIN veya MANAGER rolüne sahip kullanıcılar."""
    message = "Bu işlem için Yönetici yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.is_manager


class IsDispatcher(permissions.BasePermission):
    """ADMIN, MANAGER veya DISPATCHER rolüne sahip kullanıcılar."""
    message = "Bu işlem için Sevkiyat Sorumlusu yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.is_dispatcher


class CanEdit(permissions.BasePermission):
    """Düzenleme yetkisi olan kullanıcılar (ADMIN, MANAGER, DISPATCHER)."""
    message = "Bu işlem için düzenleme yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # GET, HEAD, OPTIONS - herkes okuyabilir
        if request.method in permissions.SAFE_METHODS:
            return True

        # POST, PUT, PATCH, DELETE - sadece yetkili kullanıcılar
        return hasattr(request.user, 'profile') and request.user.profile.can_edit


class CanViewReports(permissions.BasePermission):
    """Rapor görüntüleme yetkisi olan kullanıcılar."""
    message = "Bu işlem için rapor görüntüleme yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and request.user.profile.can_view_reports


class IsOwnerOrAdmin(permissions.BasePermission):
    """Nesnenin sahibi veya admin kullanıcılar."""
    message = "Bu nesneyi düzenleme yetkiniz bulunmuyor."

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        # Admin her şeyi düzenleyebilir
        if hasattr(request.user, 'profile') and request.user.profile.is_admin:
            return True

        # Nesnenin sahibi kontrolü
        if hasattr(obj, 'user'):
            return obj.user == request.user

        return False


class IsDriverOrDispatcher(permissions.BasePermission):
    """Sürücü veya sevkiyat sorumlusu."""
    message = "Bu işlem için sürücü veya sevkiyat sorumlusu yetkisi gereklidir."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        profile = getattr(request.user, 'profile', None)
        if not profile:
            return False

        return profile.role in ['ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER']


class IsCustomerOrStaff(permissions.BasePermission):
    """Müşteri (kendi verileri için) veya personel."""
    message = "Bu verilere erişim yetkiniz bulunmuyor."

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        profile = getattr(request.user, 'profile', None)
        if not profile:
            return False

        # Personel her şeyi görebilir
        if profile.role in ['ADMIN', 'MANAGER', 'DISPATCHER']:
            return True

        # Müşteri sadece kendi verilerini görebilir
        if profile.role == 'CUSTOMER':
            if hasattr(obj, 'customer'):
                customer_profile = getattr(obj.customer, 'user', None)
                return customer_profile == request.user
            if hasattr(obj, 'user'):
                return obj.user == request.user

        return False

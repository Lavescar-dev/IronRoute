#!/bin/bash
# ===========================================
# IronRoute Setup Script
# ===========================================
# Bu script clone sonrasi tek komutla kurulum yapar
# VPS veya local icin kullanilabilir

set -e

echo "=========================================="
echo "  IronRoute Kurulum Basliyor..."
echo "=========================================="

# Renk kodlari
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# .env dosyasi yoksa .env.example'dan olustur ve SECRET_KEY uret
if [ ! -f .env ]; then
    echo -e "${YELLOW}[1/4]${NC} .env dosyasi olusturuluyor..."
    cp .env.example .env

    # Guclu SECRET_KEY uret
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null || openssl rand -base64 50 | tr -d '\n')
    if [ -n "$SECRET_KEY" ]; then
        sed -i "s|change-this-to-a-random-secret-key|${SECRET_KEY}|" .env
    fi

    echo -e "${GREEN}OK${NC} .env dosyasi olusturuldu"
else
    echo -e "${GREEN}OK${NC} .env dosyasi zaten mevcut"
fi

# Docker compose build ve baslat
echo -e "${YELLOW}[2/4]${NC} Docker container'lari baslatiliyor..."
docker compose up -d --build

# Backend'in hazir olmasini bekle
echo -e "${YELLOW}[3/4]${NC} Backend hazir olana kadar bekleniyor..."
echo "  Veritabani ve migration'lar calisiyor..."
sleep 15

# Superuser olustur (yoksa)
echo -e "${YELLOW}[4/4]${NC} Admin kullanicisi kontrol ediliyor..."
docker exec ironroute_backend python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ironroutecore.settings')
import django
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@ironroute.com', '1234')
    print('Admin kullanicisi olusturuldu: admin / 1234')
else:
    print('Admin kullanicisi zaten mevcut')
"

echo ""
echo "=========================================="
echo -e "${GREEN}  IronRoute Kurulumu Tamamlandi!${NC}"
echo "=========================================="
echo ""
echo "  Uygulama:  http://ironroute.lavescar.com.tr"
echo "  Admin:     http://ironroute.lavescar.com.tr/admin/"
echo "  API Docs:  http://ironroute.lavescar.com.tr/swagger/"
echo ""
echo "  Giris Bilgileri:"
echo "  ----------------"
echo "  Kullanici: admin"
echo "  Sifre:     1234"
echo ""
echo "=========================================="

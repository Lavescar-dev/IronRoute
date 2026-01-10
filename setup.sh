#!/bin/bash
# ===========================================
# IronRoute Quick Setup Script
# ===========================================
# Bu script clone sonrası tek komutla kurulum yapar

set -e

echo "=========================================="
echo "  IronRoute Kurulum Başlıyor..."
echo "=========================================="

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# .env dosyası yoksa .env.example'dan oluştur
if [ ! -f .env ]; then
    echo -e "${YELLOW}[1/4]${NC} .env dosyası oluşturuluyor..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env dosyası oluşturuldu"
else
    echo -e "${GREEN}✓${NC} .env dosyası zaten mevcut"
fi

# Docker compose build ve başlat
echo -e "${YELLOW}[2/4]${NC} Docker container'ları başlatılıyor..."
docker compose up -d --build

# Backend'in hazır olmasını bekle
echo -e "${YELLOW}[3/4]${NC} Backend hazır olana kadar bekleniyor..."
sleep 10

# Superuser oluştur (yoksa)
echo -e "${YELLOW}[4/4]${NC} Admin kullanıcısı kontrol ediliyor..."
docker exec ironroute_backend python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ironroutecore.settings')
import django
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@ironroute.com', '1234')
    print('Admin kullanıcısı oluşturuldu: admin / 1234')
else:
    print('Admin kullanıcısı zaten mevcut')
"

echo ""
echo "=========================================="
echo -e "${GREEN}  IronRoute Kurulumu Tamamlandı!${NC}"
echo "=========================================="
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/swagger/"
echo ""
echo "  Giriş Bilgileri:"
echo "  ----------------"
echo "  Kullanıcı: admin"
echo "  Şifre:     1234"
echo ""
echo "=========================================="

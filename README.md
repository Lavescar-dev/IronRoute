# IronRoute Core

Lojistik ve filo yönetimi için profesyonel CRM uygulaması.

## Özellikler

- **Filo Yönetimi**: Araç takibi, durum izleme, kapasite yönetimi
- **Sürücü Yönetimi**: Sürücü kayıtları, müsaitlik durumu, atamalar
- **Sevkiyat Takibi**: Gönderim oluşturma, durum güncelleme, rota planlama
- **Müşteri Yönetimi**: Müşteri kayıtları, iletişim bilgileri
- **Raporlama**: Analiz, istatistikler, Excel/PDF/CSV export
- **Dashboard**: Gerçek zamanlı istatistikler, KPI'lar, aktivite akışı

## Teknolojiler

### Backend
- Python 3.11
- Django 5.0 + Django REST Framework
- PostgreSQL 15
- JWT Authentication

### Frontend
- React 18 + Vite
- Redux Toolkit + RTK Query
- Material-UI (MUI) v6
- Recharts (grafikler)

### Altyapı
- Docker + Docker Compose
- Nginx (production)

## Kurulum

### Gereksinimler
- Docker & Docker Compose
- Node.js 18+ (lokal geliştirme için)
- Python 3.11+ (lokal geliştirme için)

### Hızlı Başlangıç (Docker)

```bash
# Repository'yi klonla
git clone https://github.com/Lavescar-dev/IronRoute.git
cd IronRoute

# Environment dosyasını oluştur
cp .env.example .env

# Container'ları başlat
docker compose up -d

# Admin kullanıcısı oluştur
docker exec ironroute_backend python manage.py createsuperuser
```

Uygulama aşağıdaki adreslerde çalışacak:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

### Lokal Geliştirme

#### Backend
```bash
# Virtual environment oluştur
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Veritabanını oluştur
python manage.py migrate

# Sunucuyu başlat
python manage.py runserver
```

#### Frontend
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev
```

## Proje Yapısı

```
IronRoute-Core/
├── core/                    # Django core app
├── fleet/                   # Filo yönetimi API
├── logistics/               # Sevkiyat yönetimi API
├── ironroutecore/           # Django settings
├── frontend/
│   ├── src/
│   │   ├── components/      # React componentleri
│   │   │   ├── common/      # Ortak componentler
│   │   │   └── Layout.jsx   # Ana layout
│   │   ├── pages/           # Sayfa componentleri
│   │   ├── store/           # Redux store
│   │   │   ├── slices/      # Redux slices
│   │   │   └── api/         # RTK Query API
│   │   ├── services/        # API servisleri
│   │   ├── utils/           # Yardımcı fonksiyonlar
│   │   └── config/          # Konfigürasyonlar
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## API Endpoints

### Authentication
- `POST /api/token/` - JWT token al
- `POST /api/token/refresh/` - Token yenile

### Vehicles (Araçlar)
- `GET /api/vehicles/` - Tüm araçlar
- `POST /api/vehicles/` - Yeni araç
- `GET /api/vehicles/{id}/` - Araç detay
- `PUT /api/vehicles/{id}/` - Araç güncelle
- `DELETE /api/vehicles/{id}/` - Araç sil

### Drivers (Sürücüler)
- `GET /api/drivers/` - Tüm sürücüler
- `POST /api/drivers/` - Yeni sürücü
- `GET /api/drivers/{id}/` - Sürücü detay
- `PUT /api/drivers/{id}/` - Sürücü güncelle
- `DELETE /api/drivers/{id}/` - Sürücü sil

### Shipments (Sevkiyatlar)
- `GET /api/shipments/` - Tüm sevkiyatlar
- `POST /api/shipments/` - Yeni sevkiyat
- `GET /api/shipments/{id}/` - Sevkiyat detay
- `PUT /api/shipments/{id}/` - Sevkiyat güncelle
- `DELETE /api/shipments/{id}/` - Sevkiyat sil

### Customers (Müşteriler)
- `GET /api/customers/` - Tüm müşteriler
- `POST /api/customers/` - Yeni müşteri
- `GET /api/customers/{id}/` - Müşteri detay
- `PUT /api/customers/{id}/` - Müşteri güncelle
- `DELETE /api/customers/{id}/` - Müşteri sil

### Dashboard
- `GET /api/dashboard/stats/` - Dashboard istatistikleri

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=ironroute_db
DB_USER=ironroute_user
DB_PASSWORD=ironroute_pass
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env.development)
```env
VITE_API_URL=http://localhost:8000/api/
VITE_APP_NAME=IronRoute
VITE_APP_VERSION=1.0.0
```

## Kullanım

### Giriş
1. http://localhost:5173 adresine git
2. Kullanıcı adı ve şifre ile giriş yap
3. Dashboard'da genel bakış görüntülenecek

### Filo Yönetimi
1. Sol menüden "Araçlar" sekmesine tıkla
2. "Yeni Araç" butonu ile araç ekle
3. Tablo üzerinden düzenle/sil işlemleri yap

### Sevkiyat Oluşturma
1. "Sevkiyatlar" sekmesine git
2. "Yeni Sevkiyat" butonuna tıkla
3. Müşteri, araç ve rota bilgilerini gir
4. Durum takibini yap

### Raporlar
1. "Raporlar" sekmesine git
2. İstediğiniz raporu seç
3. Excel, PDF veya CSV olarak indir

## Lisans

MIT License

## İletişim

- GitHub: [IronRoute-Core](https://github.com/username/IronRoute-Core)

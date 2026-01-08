# 1. Python 3.12 kullan
FROM python:3.12-slim

# 2. Çalışma klasörü
WORKDIR /app

# 3. Kütüphaneleri kur
COPY requirements.txt .
# --no-cache-dir ile imajı şişirmiyoruz
RUN pip install --no-cache-dir -r requirements.txt
# Not: psycopg2 ve gunicorn ileride Web sunucusu için lazım olacak, şimdilik kalabilir.
RUN pip install psycopg2-binary gunicorn

# 4. Kodları kopyala
COPY . .

# 5. Başlat (GÜNCELLENDİ)
# Şu an web sunucusunu (manage.py) değil, test simülasyonunu (src/main.py) çalıştırıyoruz.
CMD ["python", "src/main.py"]
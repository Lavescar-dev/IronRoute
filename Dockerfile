# 1. Python 3.12 kullan
FROM python:3.12-slim

# 2. Çalışma klasörü
WORKDIR /app

# 3. Kütüphaneleri kur
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2-binary gunicorn

# 4. Kodları kopyala
COPY . .

# 5. Başlat
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

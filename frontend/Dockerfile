# 1. Node.js v20 kullan
FROM node:20-alpine

# 2. Çalışma klasörü
WORKDIR /app

# 3. Paketleri yükle
COPY package.json ./
RUN npm install

# 4. Kodları kopyala
COPY . .

# 5. Başlat
CMD ["npm", "run", "dev", "--", "--host"]

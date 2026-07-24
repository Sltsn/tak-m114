# AgroKlinik — Kurulum

## Gereksinimler
- Node.js 18+
- npm

## Adımlar

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. Veritabanını kur (tablo + test verisi)
```bash
npm run db:setup
```
Bu komut üç iş yapar:
1. `prisma db push` — `prisma/schema.prisma`'dan tabloları `prisma/dev.db` içinde oluşturur
2. `prisma generate` — Prisma Client'ı yeniden üretir
3. `node scripts/seed.mjs` — Test kullanıcıları ve örnek verileri ekler

### 3. Uygulamayı başlat
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde açılır.

## Test Hesapları

| Kullanıcı | Şifre   | Meslek           |
|-----------|---------|------------------|
| demo      | demo123 | Çiftçi           |
| uzman     | uzman123| Ziraat Mühendisi |

## Veritabanı
- Tür: **SQLite** (yerel dosya)
- Dosya: `prisma/dev.db`
- Şema: `prisma/schema.prisma`

Veritabanını sıfırlamak için:
```bash
npm run db:setup
```

## Sorun Giderme

### "Giriş yapılamıyor" hatası
1. `npm run db:setup` çalıştırıldığından emin ol
2. `prisma/dev.db` dosyasının var olduğunu kontrol et
3. Tarayıcı konsolunda hata mesajını incele

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run db:generate
```

### Port çakışması
```bash
npm run dev -- -p 3001
```

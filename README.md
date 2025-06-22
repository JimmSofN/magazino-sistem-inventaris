Sistem Inventaris Magazino

# Laravel 12 + Next.js Starter Kit

Fullstack starter kit menggunakan **Laravel 12 (API only)** dan **Next.js (React Frontend)**.  
Dibuat untuk membantu kamu memulai proyek web modern dengan arsitektur backend-frontend yang terpisah.

---
## 🔧 Tech Stack

- 🧱 **Backend**: Laravel 12 
- 💅 **Frontend**: Next.js (Shadcn UI + TailwindCSS)
- 🔐 Auth: Laravel breeze
- 🗃️ Database: PostgreSQL (bisa diganti) / optional 

---

## 🚀 Instalasi
### 1. Clone Repository

git clone https://github.com/JimmSofN/magazino-sistem-inventaris.git
cd magazino-sistem-inventaris

### 2. Install Dependency Laravel dan react

composer install
npm i

### 3. Salin file environment

cp .env.example .env

### 4. Generate app key

php artisan key:generate

### 5. Migrasi dan seed database

php artisan migrate --seed

### 6. Jalankan Next.js

npm run dev

### 7. Jalankan Laravel

php artisan serve














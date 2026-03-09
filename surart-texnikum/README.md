# Surart Texnikum Clone (Monorepo Scaffold)

This repository contains a full-stack scaffold for the Surart Texnikum website:

- `frontend/` public React app
- `admin/` admin React app
- `backend/` Laravel API scaffold

## Quick start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin
```bash
cd admin
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

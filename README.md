# 🌴 L.A Group — Sistem Informasi Rental Kendaraan & Paket Wisata

Sistem informasi berbasis web untuk manajemen rental kendaraan dan paket wisata **L.A Group** yang dibangun menggunakan **Next.js 15**, **Prisma ORM**, dan **PostgreSQL (Supabase)**.

---

## 🛠 Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Bahasa** | TypeScript |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 5 |
| **Storage** | Supabase Storage |
| **Styling** | Tailwind CSS v4 |
| **Animasi** | Framer Motion |
| **Internasionalisasi** | next-intl (ID/EN) |
| **Testing** | Jest + ts-jest |
| **Validasi** | Zod |
| **Email** | Nodemailer (Gmail SMTP) |

## 📁 Struktur Proyek

```
La-Group-Official/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Routing multi-bahasa
│   │   ├── (public)/         # Halaman publik (user)
│   │   └── dashboard/        # Halaman dashboard (operator)
│   └── api/                  # Backend API Routes (Controller)
├── components/               # Komponen UI yang dapat digunakan ulang
│   ├── atoms/                # Komponen dasar (Button, Badge, dll)
│   ├── molecules/            # Komponen gabungan (ImageUpload, dll)
│   └── organisms/            # Komponen kompleks (Navbar, Forms, dll)
├── features/                 # Fitur-fitur utama (View layer)
│   ├── vehicles-pricelist/   # Fitur katalog kendaraan
│   ├── tourpackages/         # Fitur paket wisata
│   ├── dashboard/            # Fitur dashboard operator
│   └── about-us/             # Fitur halaman tentang kami
├── hooks/                    # Custom React Hooks
│   ├── useVehicles.ts        # State & filter manajemen kendaraan
│   └── useTours.ts           # State & filter manajemen paket wisata
├── lib/                      # Library & utilitas
│   ├── prisma.ts             # Prisma Client instance
│   └── supabase/storage.ts   # Supabase Storage helper
├── prisma/                   # Konfigurasi database (Model layer)
│   ├── schema.prisma         # Definisi skema database
│   └── seed-admin.js         # Script seeder akun admin
├── types/                    # Definisi TypeScript types
│   └── index.ts
├── messages/                 # File terjemahan (i18n)
│   ├── id.json               # Bahasa Indonesia
│   └── en.json               # Bahasa Inggris
├── __tests__/                # Unit test files
│   ├── api/                  # Test untuk API Routes
│   └── services/             # Test untuk frontend services
├── jest.config.ts            # Konfigurasi Jest
└── jest.setup.ts             # Setup global mock Jest
```

---

## 💻 Persyaratan Sistem

- **Node.js** v18.0.0 atau lebih baru
- **npm** v8.0.0 atau lebih baru
- Akun **Supabase** (gratis tersedia di [supabase.com](https://supabase.com))
- Akun **Gmail** dengan App Password aktif (untuk fitur email)

---

## 🚀 Panduan Setup

### 1. Clone Repository

```bash
git clone <url-repository>
cd La-Group-Official
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root proyek berdasarkan template berikut:

```env
# ── DATABASE (Supabase PostgreSQL) ─────────────────────────
# Gunakan Connection Pooling untuk operasi normal
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Gunakan Direct Connection untuk migrasi/push schema
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# ── SUPABASE STORAGE ────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# ── JWT SECRET ──────────────────────────────────────────────
JWT_SECRET="your-random-secret-key-min-32-chars"
```

> **Cara mendapatkan kredensial Supabase:**
> 1. Buka project di [supabase.com/dashboard](https://supabase.com/dashboard)
> 2. Masuk ke **Settings → Database** untuk mendapatkan `DATABASE_URL` dan `DIRECT_URL`
> 3. Masuk ke **Settings → API** untuk mendapatkan `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`

> **Cara membuat Gmail App Password:**
> 1. Buka [myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Aktifkan **2-Step Verification**
> 3. Buat **App Password** baru, pilih "Mail" sebagai aplikasi
> 4. Gunakan 16 karakter yang dihasilkan sebagai `SMTP_PASS`

---

## 🗄 Setup Database

### Push Schema ke Supabase

```bash
npx prisma db push
```

Perintah ini akan membuat semua tabel di database Supabase Anda berdasarkan [`prisma/schema.prisma`](./prisma/schema.prisma).

### Generate Prisma Client

```bash
npx prisma generate
```


## ▶️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Akses aplikasi di: **[http://localhost:3000](http://localhost:3000)**

### Production Build

```bash
npm run build
npm run start
```

---

## 🧪 Menjalankan Unit Test

Proyek ini dilengkapi dengan **38 unit test cases** menggunakan Jest yang menguji API Routes dan Frontend Services tanpa membutuhkan koneksi database nyata.

```bash
npm run test
```

Atau dengan mode verbose untuk melihat detail setiap test case:

```bash
npx jest --verbose
```

**Cakupan pengujian:**

| File Test | Scope | Test Cases |
|---|---|---|
| `vehicles.route.test.ts` | API Kendaraan (GET/POST/PUT/DELETE) | 14 |
| `tours.route.test.ts` | API Paket Wisata (GET/POST/PUT/DELETE) | 5 |
| `bookings.route.test.ts` | API Booking Kendaraan + Report | 4 |
| `tour-bookings.route.test.ts` | API Booking Tour + Report | 3 |
| `vehicles.service.test.ts` | Frontend Service Kendaraan | 7 |
| `tours.service.test.ts` | Frontend Service Paket Wisata | 5 |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan penelitian/skripsi. Hak cipta © 2025 L.A Group.

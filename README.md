# Genesis AI

Platform AI mandiri (self-hosted) dengan 98 model bahasa besar yang berjalan lokal di server Anda sendiri. Tanpa API key eksternal. Tanpa batasan. Tanpa biaya bulanan.

## Fitur Utama

- **98 Model AI** — Dari 7 kategori: General Purpose, Coding, Reasoning, Creative, Technical, Multilingual, Utilities
- **Self-Hosted** — Semua model berjalan lokal, data tidak pernah keluar server
- **Neo-Classical Dark UI** — Antarmuka elegan dengan tema gelap dan aksen emas
- **3D Data Core** — Efek visual Three.js dengan monolith server dan partikel holografik
- **10 Mode AI** — Pintar, Biasa, Koding, Thinking, Kreatif, Analisis, Percakapan, Akademik, Keamanan, Multibahasa
- **Project Management** — Kelola dan organisasi chat dalam proyek
- **Preset System** — Simpan kombinasi pengaturan sebagai preset
- **Full-Stack** — React 18 + TypeScript frontend, tRPC + Drizzle ORM + MySQL backend

## Teknologi

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Three.js + @react-three/fiber (3D background)
- Framer Motion (animasi)
- React Markdown + remark-gfm
- Zustand (state management)

### Backend
- tRPC 11.x + Hono (API router)
- Drizzle ORM + MySQL (database)
- OAuth 2.0 (autentikasi)
- Redis (cache & rate limiting)

## Instalasi

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- Redis 7+

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd genesis-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi database dan OAuth Anda

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Docker Compose

```bash
# Build dan jalankan dengan Docker Compose
docker-compose up -d
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET_KEY` | Secret key untuk JWT |
| `KIMI_AUTH_URL` | URL autentikasi OAuth |
| `APP_ID` | OAuth app ID |
| `APP_SECRET` | OAuth app secret |
| `OWNER_UNION_ID` | Admin user union ID |

## API Endpoints (tRPC)

| Router | Procedures |
|--------|-----------|
| `auth` | me, logout |
| `chat` | create, list, getById, update, delete, addMessage, getMessages, sendCompletion |
| `model` | list, getById, getByCategory, getCategories |
| `project` | create, list, getById, update, delete |
| `preset` | create, list, update, delete |
| `settings` | get, update |

## Arsitektur Database

- **users** — Data pengguna (OAuth)
- **chats** — Sesi chat
- **messages** — Pesan dalam chat
- **projects** — Proyek/folder
- **presets** — Preset pengaturan tersimpan
- **user_settings** — Pengaturan pengguna

## Lisensi

MIT License
# voxixboln

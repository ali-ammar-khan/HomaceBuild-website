# HomaceBuild and Realators — Real Estate Digital Platform

A high-performance, secure digital real estate platform engineered for **HomaceBuild and Realators**, specializing in genuine property acquisitions, plots, houses, and commercial real estate across **Bahria Town**, **DHA**, and the **Islamabad/Rawalpindi** region.

---

## 1. Architectural Highlights

- **Framework**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React.
- **Portability**: Standardized `standalone` build output for zero-vendor-lockin deployment (Docker, VPS, Coolify, or Vercel Pro).
- **Database & RLS**: PostgreSQL with Row-Level Security (RLS) separating Public, Agent, and Administrator operations.
- **Measurement Architecture**: Native Marla and Kanal units with database-enforced immutable calculations for square feet footprint and normalized search indexing. Configurable across Bahria/DHA/CDA (225 sq ft) and Punjab revenue standards.
- **Lead Protection & Security**: Server actions with Zod validation, invisible bot honeypot, IP hash rate limiting, and role escalation prevention triggers.
- **Technical & Semantic SEO**: Schema.org JSON-LD generation (`LandPlot`, `SingleFamilyResidence`, `CommercialProperty`, `RealEstateAgent`), dynamic XML sitemap, and robots.txt.

---

## 2. Quick Start & Setup

### A. Environment Configuration
Copy `.env.example` to `.env.local` and set your credentials:

```bash
cp .env.example .env.local
```

Populate the keys:
- `NEXT_PUBLIC_SITE_URL`: Your production or local domain (e.g. `http://localhost:3000`).
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Official Pakistani WhatsApp number in international format without `+` (e.g. `923001234567`).
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your private Supabase Service Role Key (kept strictly on trusted server).

### B. Database Setup
1. Open your Supabase Project Dashboard and navigate to the **SQL Editor**.
2. Run the full contents of [`schema.sql`](./schema.sql).
3. Create a public storage bucket named `property-images` with allowed MIME types (`image/jpeg`, `image/png`, `image/webp`) and a 5 MB maximum file size.

### C. Initial Administrator Provisioning
To ensure no unauthorized user can escalate themselves to an administrator:
1. Sign up your first user account through `/login` or via the Supabase Auth Console.
2. In the Supabase SQL Editor, run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = '<USER_AUTH_UUID>';
   ```
3. This user now has full administrative privileges over listings, agent assignments, and customer inquiries.

---

## 3. Development & Build Commands

```bash
# Run local development server
npm run dev

# Compile production build
npm run build

# Start production server
npm start
```

---

## 4. Docker Deployment

The application includes a production-ready, multi-stage [`Dockerfile`](./Dockerfile):

```bash
# Build Docker image
docker build -t homace-website .

# Run container
docker run -p 3000:3000 --env-file .env.local homace-website
```

---

## 5. Data & Media Migration Commands

- **Database Dump**:
  ```bash
  pg_dump -h db.<ref>.supabase.co -U postgres -d postgres -F c -b -v -f homace_db.dump
  ```
- **Database Restore**:
  ```bash
  pg_restore -h <target_host> -U <target_user> -d <target_db> -v homace_db.dump
  ```
- **Image Storage Sync**:
  ```bash
  rclone sync supabase:property-images s3:your-new-bucket --progress
  ```


---

## 6. Property Media Architecture & Storage Provider Portability

### A. Storage Key Structure
All property images are organized with collision-resistant object keys:
```
properties/{propertyId}/{uuid}-{sanitizedFilename}.{ext}
```
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max File Size**: 5 MB per file
- **Cache Header**: `Cache-Control: 31536000` (1-year immutable caching)

### B. Provider-Agnostic Storage Architecture
The media system uses a centralized adapter pattern in [`src/lib/storage/propertyMedia.ts`](./src/lib/storage/propertyMedia.ts):
- **Database Storage**: The database only stores relative storage keys or CDN URLs in `properties.images` (array) and `properties.featured_image` (string).
- **Public URL Resolution**: Handled via `resolvePublicImageUrl(pathOrUrl)` which dynamically maps relative paths to the active CDN domain.
- **Provider Switching (e.g. Supabase -> Cloudflare R2 / AWS S3 / MinIO)**:
  1. Transfer existing objects via `rclone` (see Section 5).
  2. In [`src/lib/storage/propertyMedia.ts`](./src/lib/storage/propertyMedia.ts), replace the `supabase.storage` calls with the `@aws-sdk/client-s3` (S3/R2 client).
  3. No changes are needed in UI components, property cards, detail pages, or the PostgreSQL database schema.

### C. Public Resilience & Fallback Handling
- Public image rendering uses [`SafeImage.tsx`](./src/components/ui/SafeImage.tsx) which wraps `next/image` with automatic error boundaries. If an image returns 404 or fails to load, it automatically falls back to the official company placeholder (`/HomaceLogo.png`) without breaking the UI layout or causing Cumulative Layout Shift (CLS = 0).

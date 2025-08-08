
# Refresh v0.3

**New in this version**
- ✅ **Row Level Security (RLS)** policies for Supabase projects
- ✅ **Projects dashboard** (`/projects`) with view & delete
- ✅ **Google Drive export** via **service account** (`/api/export/drive`)
- Everything from v0.2 (Gemini/OpenAI, Supabase Auth, Stripe checkout, PDF export)

## Setup

1) Install deps
```bash
npm install
```

2) Env
```bash
cp .env.example .env.local
# Fill in AI keys, Supabase URL/key, Stripe keys, and Google Drive service account JSON + Folder ID
```
- For Google Drive:
  - Create a **service account** in Google Cloud (enable Drive API)
  - Put the JSON in `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` (single line JSON)
  - Create a folder in Drive, copy its **Folder ID** to `GOOGLE_DRIVE_FOLDER_ID`
  - **Share that folder** with the service account email so it can write to it

3) Supabase
- Run `SUPABASE_SCHEMA.sql` then `SUPABASE_RLS.sql` in the SQL Editor
- RLS ensures users can only access their own projects

4) Run
```bash
npm run dev
```

5) Stripe (optional)
```bash
npm run webhook
# paste the whsec into STRIPE_WEBHOOK_SECRET
```

## Usage
- Sign in at `/auth`
- Build content at `/builder/*` → **Save** → Open `/projects`
- Open a project to **Send to Google Drive** (creates a PDF in your shared folder)

## Notes
- API routes validate the current user via **Authorization: Bearer <access_token>** and rely on **RLS**.
- For production, consider adding a user profile table to persist subscription state from Stripe webhooks.

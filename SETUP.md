# 🏰 CrownForge V2 — Full Setup Guide

> Complete guide to install, configure, and run the Next.js + Firebase rebuild.

---

## ✅ PREREQUISITES

Make sure you have these installed before starting:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | any | `git --version` |

Download Node.js from: https://nodejs.org

---

## 📦 STEP 1 — Create the Next.js Project

Open a terminal and run:

```bash
cd "C:\LOBBIES\1\cf site\test\1"

npx create-next-app@latest crownforge-v2 ^
  --typescript ^
  --tailwind ^
  --eslint ^
  --app ^
  --src-dir ^
  --import-alias "@/*"

cd crownforge-v2
```

> **On Mac/Linux** replace `^` (line continuation) with `\`

---

## 📥 STEP 2 — Install Extra Packages

```bash
npm install firebase firebase-admin framer-motion lucide-react clsx tailwind-merge react-hot-toast next-themes
```

---

## 📋 STEP 3 — Copy Generated Files

Copy everything from the `nextjs/` folder into your new `crownforge-v2/` folder.
Replace any files that already exist (globals.css, tailwind.config.ts, etc.)

```bash
# From inside cownforgeweb-main folder:
xcopy /E /Y nextjs\* "C:\LOBBIES\1\cf site\test\1\crownforge-v2\"
```

---

## 🖼️ STEP 4 — Copy Your Image Assets

```bash
xcopy /E /Y "assets\images" "C:\LOBBIES\1\cf site\test\1\crownforge-v2\public\images\"
```

Your images will then be at `/public/images/` and served as `/images/...` in the app.

---

## 🔥 STEP 5 — Firebase Project Setup

### 5a. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"** → Name it `crownforge-web` → Continue
3. Disable Google Analytics (optional) → Create project

### 5b. Enable Firestore
1. Left sidebar → **Firestore Database** → Create database
2. Choose **Production mode** → Select a region (e.g. `asia-south1` for India)
3. Click **Enable**

### 5c. Enable Authentication
1. Left sidebar → **Authentication** → Get Started
2. Click **Email/Password** provider → Enable it → Save

### 5d. Get Web App Config
1. Left sidebar → **Project Settings** (gear icon) → **General** tab
2. Scroll to **"Your apps"** → Click **Web** icon `</>`
3. Register app as `crownforge-web` → Copy the config object

### 5e. Get Admin SDK Key
1. **Project Settings** → **Service accounts** tab
2. Click **"Generate new private key"** → Download the JSON file
3. Open the JSON file — you'll need `project_id`, `client_email`, `private_key`

---

## 🔑 STEP 6 — Environment Variables

Create your `.env.local` file:

```bash
copy .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
# From your Firebase Web App config (Step 5d)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crownforge-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crownforge-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crownforge-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=797474444783
NEXT_PUBLIC_FIREBASE_APP_ID=1:797...

# From your service account JSON (Step 5e)
FIREBASE_PROJECT_ID=crownforge-web
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@crownforge-web.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

> ⚠️ Keep `.env.local` PRIVATE — never commit it to Git

---

## 🔐 STEP 7 — Deploy Firestore Security Rules

Install Firebase CLI if you haven't:
```bash
npm install -g firebase-tools
firebase login
```

Then deploy the rules:
```bash
cd "C:\LOBBIES\1\cf site\test\1\crownforge-v2"
firebase init firestore
# Select your project: crownforge-web
# When asked for rules file: type firestore.rules
# When asked for indexes file: press Enter (keep default)

firebase deploy --only firestore:rules
```

---

## 👑 STEP 8 — Create Your First Admin User

### 8a. Create a Firebase user
1. Firebase Console → **Authentication** → **Users** tab
2. Click **"Add user"** → Enter your email + password → Add user
3. Copy the **UID** shown in the users table

### 8b. Add them to the admins collection
1. Firebase Console → **Firestore Database**
2. Click **"Start collection"** → Collection ID: `admins`
3. Document ID: paste your UID from step 8a
4. Add field: `role` (string) = `super_admin`
5. Click **Save**

That's it — that email/password now has full admin access.

---

## 🚀 STEP 9 — Run the Dev Server

```bash
cd "C:\LOBBIES\1\cf site\test\1\crownforge-v2"
npm run dev
```

Open your browser: **http://localhost:3000**

Admin panel: **http://localhost:3000/admin/login**

---

## 🏗️ STEP 10 — Build for Production

```bash
npm run build
npm run start
```

Or deploy to **Vercel** (recommended):
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Next.js
# Add your .env.local variables in Vercel dashboard
```

---

## 🛡️ STEP 11 — Restrict Your Firebase API Key

1. Go to https://console.cloud.google.com
2. Select your Firebase project
3. APIs & Services → Credentials
4. Click your Web API key → Under "Application restrictions" → HTTP referrers
5. Add: `localhost:3000/*` and `yourdomain.com/*`
6. Save

This prevents anyone else from using your API key.

---

## 📁 FINAL PROJECT STRUCTURE

```
crownforge-v2/
├── public/
│   └── images/
│       ├── logos/
│       └── team/
├── src/
│   ├── app/
│   │   ├── (public)/          ← All public pages
│   │   │   ├── layout.tsx     (Navbar + Footer)
│   │   │   ├── page.tsx       (Home)
│   │   │   ├── games/
│   │   │   ├── about/
│   │   │   ├── news/
│   │   │   ├── careers/
│   │   │   │   └── apply/
│   │   │   └── contact/
│   │   ├── admin/             ← Protected admin panel
│   │   │   ├── login/
│   │   │   ├── layout.tsx     (Auth guard + Sidebar)
│   │   │   ├── page.tsx       (Dashboard)
│   │   │   ├── news/
│   │   │   ├── messages/
│   │   │   ├── applications/
│   │   │   └── careers/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── firebase.ts        (Client SDK)
│   │   ├── firebase-admin.ts  (Server SDK)
│   │   └── auth-context.tsx   (useAuth hook)
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── firestore.rules
├── .env.local          ← YOUR SECRETS (never commit)
├── .env.local.example  ← Template (safe to commit)
└── PROGRESS.md
```

---

## 🐛 COMMON ISSUES

### "Firebase: No Firebase App"
Make sure `.env.local` exists and has valid values. Restart dev server after editing it.

### Admin panel shows loading forever
Your user UID is not in the Firestore `admins` collection. See Step 8.

### Images not showing
Make sure images are in `public/images/` not `assets/images/`.
File names are case-sensitive — check exact spelling.

### Firestore permission denied on forms
Re-deploy `firestore.rules` using `firebase deploy --only firestore:rules`

### "Module not found: lucide-react"
Run `npm install` — packages may not be installed yet.

---

## 🆘 NEED HELP?

- Firebase docs: https://firebase.google.com/docs
- Next.js docs: https://nextjs.org/docs
- Email: crownforgebusiness@gmail.com

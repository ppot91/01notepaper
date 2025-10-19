# 📰 NotePaper – Newspaper-Inspired Notes App

NotePaper is a my first Next.js, Supabase project. I've learned using Cursor + Codex, pushing to Git and deploying with Railway and making it accessible via Https.
It is a desktop-first, black & white notes experience inspired by the typography of the *New York Times*. Built as a candidate-quality showcase for responsive UI work, Supabase integration, and modern Next.js 14 architecture.

## ✨ Highlights

- **Fully client-side Next.js 14 App Router** with strict TypeScript and Tailwind CSS.
- **Supabase Auth + Row-Level Security** to keep every user’s notes private by design.
- **Markdown editor** with autosave, optimistic updates, and keyboard shortcuts for power users.
- **Infinite-scroll sidebar** with search, starred filtering, and NYT-like typography cues.
- **Toast notifications, optimistic CRUD**, and desktop-grade focus states for accessibility.

## 🧩 Tech Stack

- Next.js 14 (App Router, CSR-only)
- React 18, SWR Infinite
- Tailwind CSS with custom NYT-style theme
- Supabase Auth & PostgREST client
- Markdown editor via `@uiw/react-md-editor`
- TypeScript strict mode + ESLint core-web-vitals

## 🚀 Deployed Example

- Production: `[https://your-railway-url-here](https://01notepaper-production.up.railway.app/)`
- Backend: Supabase project `xhkspqwchpicbatjkoeo`
- Deployment platform: Railway

## 🧪 Core Features

- Sign in / Sign up with Supabase email auth
- Secure notes CRUD (create, update, delete, star)
- Autosave after 800 ms pause or on blur
- Infinite scroll + search across title/content
- Keyboard shortcuts:
  - `Ctrl/Cmd + N` – New note
  - `Ctrl/Cmd + S` – Save note
  - `Ctrl/Cmd + F` – Focus search
  - `Ctrl/Cmd + Shift + S` – Toggle star
- Accessible focus states and toast feedback

## 🛠 Local Setup

```bash
git clone https://github.com/you/notepaper.git
cd notepaper
npm install
npm run dev
```
<img width="1908" height="1023" alt="image" src="https://github.com/user-attachments/assets/ce0fa5fd-8d5e-4b71-b56e-8f2cc838fd95" />


https://github.com/user-attachments/assets/e14dcf0f-1122-4d83-9448-11001095047e





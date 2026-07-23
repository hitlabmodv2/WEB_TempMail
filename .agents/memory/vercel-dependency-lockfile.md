---
name: Vercel dependency lockfile
description: Deployment Vercel harus memakai dependency metadata yang dapat diakses dari registry publik.
---

Vercel tidak dapat menginstal dependency dari URL registry internal Replit yang kadang tersimpan di `package-lock.json`.

**Why:** Build Vercel dapat gagal saat `npm install`, lalu Function API tampak sebagai `FUNCTION_INVOCATION_FAILED` walaupun kode lokal berjalan normal.

**How to apply:** Untuk proyek ini, simpan lockfile dengan URL registry publik, gunakan Node.js 24.x di `package.json`, dan jangan menambahkan `nodejs24.x` ke `functions.runtime` karena Vercel memperlakukannya sebagai runtime package yang tidak valid.
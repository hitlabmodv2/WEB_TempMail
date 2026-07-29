<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=NovaMail&fontSize=72&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Instant%20Disposable%20Email%20%E2%80%94%20Real-Time%20Inbox&descAlignY=55&descSize=16" width="100%" />

<br/>

<img src="https://img.shields.io/badge/🚀_Version-V3.0.0-6366f1?style=for-the-badge&logoColor=white" alt="V3.0.0" />
<img src="https://img.shields.io/badge/📅_Updated-29_July_2026-ec4899?style=for-the-badge&logoColor=white" alt="Updated" />
<img src="https://img.shields.io/badge/Status-LIVE-22c55e?style=for-the-badge&logo=statuspage&logoColor=white" alt="Status" />

<br/><br/>

<a href="https://webtempmail.netlify.app/">
  <img src="https://img.shields.io/badge/🌐_Live_Demo-webtempmail.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
</a>

<br/><br/>

<a href="https://github.com/hitlabmodv2/WEB_TempMail/stargazers">
  <img src="https://img.shields.io/github/stars/hitlabmodv2/WEB_TempMail?style=for-the-badge&logo=github&label=Stars&color=FFD700" alt="Stars" />
</a>
<a href="https://github.com/hitlabmodv2/WEB_TempMail/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/hitlabmodv2/WEB_TempMail?style=for-the-badge&label=License&color=22c55e" alt="License" />
</a>
<img src="https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Platform-Netlify%20%2F%20Replit-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Platform" />
<img src="https://img.shields.io/badge/Made_with-❤️-ef4444?style=for-the-badge" alt="Made with love" />

<br/><br/>

**Buat alamat email sekali pakai dalam hitungan detik.**
Gratis · Aman · Tanpa registrasi · Langsung pakai.

<br/>

<a href="#-fitur">✨ Fitur</a> &nbsp;·&nbsp;
<a href="#-yang-baru-di-v300">🆕 V3.0.0</a> &nbsp;·&nbsp;
<a href="#-deploy">🚀 Deploy</a> &nbsp;·&nbsp;
<a href="#-jalankan-lokal">🛠️ Lokal</a> &nbsp;·&nbsp;
<a href="#-api-endpoints">🔌 API</a> &nbsp;·&nbsp;
<a href="#️-tech-stack">⚙️ Stack</a>

</div>

<br/>

---

## 🆕 Yang Baru di V3.0.0

> 🎯 Fokus pada stabilitas serverless, anti bug email berubah, dan kebersihan UI.

<div align="center">

| # | Perubahan | Detail |
|:---:|---|---|
| 🍪 | **Email tidak berubah saat refresh / cold start** | Ganti `express-session` (MemoryStore, hilang saat cold start) ke **`cookie-session`** — semua data sesi disimpan langsung di cookie browser, bukan di memory server. Email tetap sama walau Netlify cold start berkali-kali. |
| 🔁 | **Retry otomatis saat rate limit 429** | `createMailbox` retry hingga 4x dengan backoff 1s → 2s → 4s → 8s. `fetchMailbox` retry 3x. Tidak langsung error ke user saat upstream API sibuk. |
| 📦 | **Fix Netlify build error (registry Replit)** | `package-lock.json` dibersihkan dari URL registry internal Replit (`package-firewall.replit.local`) dan `.npmrc` ditambahkan agar build Netlify selalu pakai `registry.npmjs.org`. |
| 📖 | **Tab baru "Cara Pakai"** | Panduan 6 langkah dipindah ke tab penuh setara Inbox / Info Server / Developer. Grid 3 kolom (desktop) → 2 kolom (tablet) → 1 kolom (HP). |
| 🚫 | **Hapus referensi "temp-mail.org" dari UI** | Semua teks yang menyebut `temp-mail.org` diganti label netral (**Multi Provider**, **NovaMail**) agar tampilan lebih profesional. |
| 🛡️ | **Logika restore disederhanakan** | Tidak ada lagi double `enforceDefaultDomain` yang bisa menimpa email yang baru dipulihkan. |

</div>

---

## ✨ Fitur

<div align="center">

```
╔══════════════════════════════════════════════════════════════════╗
║  📮 Email Instan     🔄 Auto-Refresh 5s    🌐 Multi-Provider    ║
║  📱 Responsive       🎨 Dark UI Modern     📲 QR Code Share     ║
║  🔔 Smart Notif      📊 Server Monitor     🔒 Zero Storage      ║
║  📖 Panduan Tab      🛡️ Email Stabil       🚫 Anti Spam         ║
╚══════════════════════════════════════════════════════════════════╝
```

</div>

| Fitur | Deskripsi |
|---|---|
| 📮 **Email Instan** | Alamat email siap pakai tanpa daftar, dalam < 2 detik |
| 🔄 **Inbox Real-Time** | Auto-refresh setiap 5 detik, tidak perlu reload halaman |
| 🔔 **Notif Kontekstual** | Suara berbeda untuk OTP 🔐, Promo 🎁, Alert ⚠️, Welcome 🎉, Biasa 📧 |
| 🌐 **Multi Provider** | Dua provider email, ganti kapan saja tanpa reload |
| 📲 **QR Code** | Share alamat email dengan scan QR dari HP lain |
| 📊 **Server Info** | Monitor CPU, RAM, uptime, dan jumlah sesi aktif secara real-time |
| 🎨 **Dark UI Modern** | Tampilan responsif mobile & desktop, nyaman di mata |
| 📖 **Tab Cara Pakai** | Panduan 6 langkah dalam grid kartu — langsung dari tab navigasi |
| 🛡️ **Email Stabil** | Email tidak berubah saat refresh atau Netlify cold start (cookie-session) |
| 🔒 **Privacy** | Tidak ada data disimpan permanen — tanpa tracking, tanpa iklan |

---

## 🔔 Sistem Notif Suara Cerdas

NovaMail hadir dengan **notifikasi suara kontekstual** — berbeda tergantung jenis email yang masuk:

| Jenis | Kata Kunci Terdeteksi | Karakter Suara |
|:---:|---|---|
| 🔐 **OTP / Verifikasi** | otp, kode, code, verify, confirm, token, 2fa, pin | Beep ganda nada tinggi — terasa urgent |
| ⚠️ **Alert / Keamanan** | alert, warning, security, suspicious, unauthorized | Tiga nada naik rendah → tinggi |
| 🎁 **Promo / Diskon** | promo, diskon, sale, cashback, gratis, voucher | Ding ceria 3 nada (do-mi-sol) |
| 🎉 **Welcome / Daftar** | welcome, congratulations, akun baru, registrasi | Melodi naik 4 nada gembira |
| 📧 **Email Biasa** | *(lainnya)* | Ding bersih 2 nada |

> 💡 Tombol 🔔 di inbox untuk mute/unmute semua notif sekaligus.

---

## 🐛 Detail Bug Fix V3.0.0

### 1. Email Berubah Saat Refresh (Cold Start)

**Penyebab:** Netlify Functions serverless bisa restart kapan saja. Sebelumnya token mailbox disimpan di Map memory server — hilang setiap restart → email baru terus dibuat.

**Fix:** Pakai `cookie-session` — seluruh data sesi (token mailbox) disimpan di **cookie browser**, bukan server. Browser kirim cookie tiap request → server baca token → email tetap sama.

```
Netlify cold start → memory server kosong
   │
   └─ Browser kirim cookie → { mailToken: "bearer-xyz" }
              │
              └─ Server baca cookie → fetchMailbox(token) → email tetap ✅
```

### 2. Rate Limit 429 dari Upstream API

**Penyebab:** `web2.temp-mail.org` membatasi request dari IP Netlify.

**Fix:** Retry otomatis dengan exponential backoff sebelum menyerah dan menampilkan error ke user.

```
Request gagal 429
   ├─ Retry 1 → tunggu 1s
   ├─ Retry 2 → tunggu 2s
   ├─ Retry 3 → tunggu 4s
   └─ Retry 4 → tunggu 8s → baru tampilkan error ✅
```

### 3. Netlify Build Error (Registry Internal Replit)

**Penyebab:** `package-lock.json` berisi URL `package-firewall.replit.local` (registry internal Replit) yang tidak bisa diakses server Netlify.

**Fix:** `package-lock.json` di-regenerate bersih + `.npmrc` dikunci ke `registry.npmjs.org`.

---

## 🚀 Deploy

<div align="center">

### ☁️ Deploy ke Netlify — Sekali Klik

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail">
  <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="40"/>
</a>

</div>

**Setelah deploy**, tambahkan environment variable ini di Netlify:

```
Site settings → Environment variables → Add variable
```

| Key | Value |
|---|---|
| `SESSION_SECRET` | *(string panjang & acak, contoh: `novamail-secret-2026-xYzAbC`)* |

### 🐳 Docker

```bash
docker build -t novamail .
docker run -p 5000:5000 -e SESSION_SECRET=your-secret novamail
```

### ⚡ Replit

Import repo langsung ke Replit, lalu jalankan workflow `Start application`. Server otomatis berjalan di port 5000.

---

## 🛠️ Jalankan Lokal

```bash
# 1. Clone repo
git clone https://github.com/hitlabmodv2/WEB_TempMail.git
cd WEB_TempMail

# 2. Install dependencies
npm install

# 3. Jalankan server
npm start
```

Buka **[http://localhost:5000](http://localhost:5000)** di browser.

> **Node.js 18+** diperlukan. Direkomendasikan **Node.js 24.x**.

---

## 📂 Struktur Proyek

```text
WEB_TempMail/
│
├── 📁 public/
│   └── index.html              ← Frontend SPA (UI lengkap, 4 tab panel)
│
├── 📁 src/scrape/
│   ├── scraper.js              ← TMailScraper (provider tmail, self-hosted)
│   └── tempMailOrgScraper.js   ← TempMailOrgScraper (provider tempMailOrg)
│
├── 📁 api/
│   └── index.js                ← Express app serverless (Netlify entry point)
│
├── 📁 netlify/functions/
│   └── api.js                  ← Netlify Function wrapper
│
├── 📁 data/
│   └── stats.dat               ← Statistik visit & online (persisten, self-hosted)
│
├── server.js                   ← Express server (self-hosted / lokal / Replit)
├── netlify.toml                ← Konfigurasi Netlify
├── .npmrc                      ← Registry npm dikunci ke registry.npmjs.org
├── Dockerfile                  ← Container build
└── package.json                ← Dependencies & scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|:---:|---|---|
| `GET` | `/api/messages` | Ambil email aktif & isi inbox |
| `POST` | `/api/delete` | Hapus email aktif, generate yang baru |
| `POST` | `/api/change` | Ganti email baru (web2 API tidak support pilih nama) |
| `GET` | `/api/view/:id` | Baca isi pesan tertentu |
| `GET` | `/api/reset` | Reset sesi, buat email baru |
| `GET` | `/api/provider` | Cek provider aktif sesi |
| `POST` | `/api/provider` | Ganti provider aktif |
| `POST` | `/api/heartbeat` | Tracking pengunjung online (kirim tiap 30 detik) |
| `GET` | `/api/stats` | Online count, total visit, peak online |
| `GET` | `/api/server-info` | Info CPU, RAM, uptime, sesi aktif, Node.js runtime |

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Teknologi |
|:---:|---|
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white) |
| **Backend** | ![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white) |
| **HTTP Client** | ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white) + `wreq-js` (Cloudflare bypass) |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) |
| **Audio** | Web Audio API (kontekstual, tanpa file eksternal) |
| **Session** | `cookie-session` (data di cookie browser, serverless-safe) |
| **Hosting** | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white) / ![Replit](https://img.shields.io/badge/Replit-F26207?logo=replit&logoColor=white) / Docker |

</div>

---

## 📝 Lisensi

Dirilis di bawah lisensi **MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />

**NovaMail V3.0.0** — *Updated 29 July 2026*

Made with ❤️ by [hitlabmodv2](https://github.com/hitlabmodv2) &nbsp;·&nbsp; Powered by [Netlify](https://webtempmail.netlify.app/)

⭐ *Kalau project ini berguna, jangan lupa kasih bintang!* ⭐

</div>

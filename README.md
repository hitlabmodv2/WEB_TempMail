<div align="center">

# 📬 NovaMail

<img src="https://img.shields.io/badge/Update-V2.0.0-blueviolet?style=for-the-badge&logo=sparkles&logoColor=white" alt="V2.0.0" />

### ⚡ TempMail Instan · Inbox Real-Time · Tanpa Registrasi

<p>
  <strong>Buat alamat email sekali pakai dalam hitungan detik — gratis, aman, dan langsung siap digunakan.</strong>
</p>

<p>
  <a href="https://webtempmail.netlify.app/">
    <img src="https://img.shields.io/badge/🌐 Live Demo-webtempmail.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p>
  <a href="https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://img.shields.io/github/stars/hitlabmodv2/WEB_TempMail?style=for-the-badge&logo=github&label=Stars&color=FFD700" alt="GitHub stars" />
  </a>
  <a href="https://github.com/hitlabmodv2/WEB_TempMail/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/hitlabmodv2/WEB_TempMail?style=for-the-badge&label=License&color=green" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 24" />
  <img src="https://img.shields.io/badge/Platform-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

<p>
  <a href="#-fitur">✨ Fitur</a> ·
  <a href="#-deploy">🚀 Deploy</a> ·
  <a href="#-jalankan-lokal">🛠️ Lokal</a> ·
  <a href="#-api-endpoints">🔌 API</a> ·
  <a href="#️-tech-stack">⚙️ Tech Stack</a>
</p>

</div>

---

## 🆕 Yang Baru di V2.0.0

> Pembaruan besar — lebih cepat, lebih stabil, dan kini di-host di **Netlify**.

| 🔧 Perubahan | 📝 Detail |
|---|---|
| 🌐 **Platform baru** | Migrasi dari Vercel → **Netlify** untuk performa lebih konsisten |
| 🔄 **Dual provider** | Dukungan `temp-mail.org` + `tmail` — otomatis fallback |
| 📊 **Info Server** | Halaman monitoring CPU, RAM, dan uptime server real-time |
| 🔔 **Notifikasi audio** | Bunyi notifikasi saat email baru masuk |
| 🎨 **UI diperbarui** | Dark UI lebih halus, responsif di semua perangkat |
| 🔒 **Keamanan** | Session secret via environment variable |

---

## ✨ Fitur

<div align="center">

| 📮 Email Instan | 🔄 Inbox Real-Time | 🌐 Multi Provider |
|:---:|:---:|:---:|
| Tanpa registrasi | Auto-refresh 5 detik | temp-mail.org & tmail |

| 📱 Responsif | 🎨 Dark UI Modern | 📲 QR Code |
|:---:|:---:|:---:|
| Mobile & desktop | Nyaman di mata | Share email cepat |

| 🔔 Notifikasi | 📊 Info Server | 🔒 Aman |
|:---:|:---:|:---:|
| Audio saat email masuk | Monitoring real-time | Tanpa data tersimpan |

</div>

---

## 🚀 Deploy

<div align="center">

### ☁️ Deploy Sekali Klik

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail">
  <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="36" />
</a>

</div>

### 🐳 Docker

```bash
docker build -t novamail .
docker run -p 5000:5000 novamail
```

> **Catatan:** Setelah deploy ke Netlify, set environment variable `SESSION_SECRET` di dashboard Netlify → Site settings → Environment variables.

---

## 🛠️ Jalankan Lokal

```bash
# Clone repository
git clone https://github.com/hitlabmodv2/WEB_TempMail.git
cd WEB_TempMail

# Install dependencies
npm install

# Jalankan server
npm start
```

Buka [`http://localhost:5000`](http://localhost:5000) di browser.

---

## 📂 Struktur Proyek

```text
WEB_TempMail/
├── 📁 public/
│   └── index.html              # Frontend single-page app
├── 📁 src/scrape/
│   ├── scraper.js              # Logic scraper TMailScraper
│   └── tempMailOrgScraper.js   # Logic scraper temp-mail.org
├── 📁 api/
│   └── index.js                # Entry point serverless (Netlify/Vercel)
├── 📁 netlify/functions/
│   └── api.js                  # Netlify Function wrapper
├── 📁 data/
│   └── stats.dat               # Statistik visit & online (persisten)
├── server.js                   # Express server utama (self-hosted)
├── netlify.toml                # Konfigurasi Netlify
├── Dockerfile                  # Container build
└── package.json                # Dependencies
```

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|:---:|---|---|
| `GET` | `/api/messages` | Ambil email aktif beserta isi inbox |
| `POST` | `/api/delete` | Hapus email dan generate yang baru |
| `POST` | `/api/change` | Ganti nama email (domain tetap) |
| `GET` | `/api/view/:id` | Baca isi pesan tertentu |
| `GET` | `/api/reset` | Reset sesi, dapatkan email baru |
| `POST` | `/api/heartbeat` | Tracking pengunjung online |
| `GET` | `/api/stats` | Statistik online, total visit, peak |
| `GET` | `/api/provider` | Cek provider aktif |
| `POST` | `/api/provider` | Ganti provider email |
| `GET` | `/api/server-info` | Info runtime & monitoring server |

---

## ⚙️ Tech Stack

<div align="center">

| Bagian | Teknologi |
|:---:|---|
| **Runtime** | Node.js 24.x |
| **Backend** | Express.js |
| **HTTP Client** | Axios (session + CSRF handling) |
| **Frontend** | HTML · CSS · Vanilla JS · FontAwesome · Inter |
| **Session** | `express-session` |
| **Hosting** | Netlify (Serverless Functions) |
| **Container** | Docker |

</div>

---

## 📝 Lisensi

NovaMail dirilis di bawah lisensi **MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.

<div align="center">

---

<sub>Made with ❤️ by <a href="https://github.com/hitlabmodv2">hitlabmodv2</a> · Powered by <a href="https://webtempmail.netlify.app/">Netlify</a></sub>

</div>

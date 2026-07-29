<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=NovaMail&fontSize=72&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Instant%20Disposable%20Email%20%E2%80%94%20Real-Time%20Inbox&descAlignY=55&descSize=16" width="100%" />

<br/>

<!-- Version & Date -->
<img src="https://img.shields.io/badge/🚀_Version-V2.0.0-6366f1?style=for-the-badge&logoColor=white" alt="V2.0.0" />
<img src="https://img.shields.io/badge/📅_Updated-29_July_2026-ec4899?style=for-the-badge&logoColor=white" alt="Updated" />
<img src="https://img.shields.io/badge/Status-LIVE-22c55e?style=for-the-badge&logo=statuspage&logoColor=white" alt="Status" />

<br/><br/>

<!-- Live Demo -->
<a href="https://webtempmail.netlify.app/">
  <img src="https://img.shields.io/badge/🌐_Live_Demo-webtempmail.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
</a>

<br/><br/>

<!-- Badges -->
<a href="https://github.com/hitlabmodv2/WEB_TempMail/stargazers">
  <img src="https://img.shields.io/github/stars/hitlabmodv2/WEB_TempMail?style=for-the-badge&logo=github&label=Stars&color=FFD700" alt="Stars" />
</a>
<a href="https://github.com/hitlabmodv2/WEB_TempMail/blob/main/LICENSE">
  <img src="https://img.shields.io/github/license/hitlabmodv2/WEB_TempMail?style=for-the-badge&label=License&color=22c55e" alt="License" />
</a>
<img src="https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Platform-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
<img src="https://img.shields.io/badge/Made_with-❤️-ef4444?style=for-the-badge" alt="Made with love" />

<br/><br/>

**Buat alamat email sekali pakai dalam hitungan detik.**
Gratis · Aman · Tanpa registrasi · Langsung pakai.

<br/>

<a href="#-fitur">✨ Fitur</a> &nbsp;·&nbsp;
<a href="#-yang-baru-di-v200">🆕 V2.0.0</a> &nbsp;·&nbsp;
<a href="#-deploy">🚀 Deploy</a> &nbsp;·&nbsp;
<a href="#-jalankan-lokal">🛠️ Lokal</a> &nbsp;·&nbsp;
<a href="#-api-endpoints">🔌 API</a> &nbsp;·&nbsp;
<a href="#️-tech-stack">⚙️ Stack</a>

</div>

<br/>

---

## 🆕 Yang Baru di V2.0.0

> 🎯 Pembaruan besar — lebih cepat, lebih cerdas, lebih stabil.

<div align="center">

| # | Perubahan | Detail |
|:---:|---|---|
| 🌐 | **Platform baru** | Migrasi ke **Netlify** — deploy lebih cepat & stabil |
| 🔄 | **Dual provider** | `temp-mail.org` + `tmail` dengan fallback otomatis |
| 🔔 | **Suara kontekstual** | Notif berbeda untuk OTP, Promo, Alert, Welcome, & Email biasa |
| 📊 | **Server Monitor** | Halaman monitoring CPU, RAM, uptime, dan sesi aktif |
| 🎯 | **Deteksi email baru** | Tracking pakai ID unik — tidak ada notif yang terlewat |
| 🔒 | **Keamanan** | Session secret via environment variable |
| 🐛 | **Bug fix notif** | Notif kini bunyi setiap email baru, bukan hanya sekali |

</div>

---

## ✨ Fitur

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║  📮 Email Instan    🔄 Auto-Refresh 5s    🌐 Multi-Provider  ║
║  📱 Responsive      🎨 Dark UI Modern     📲 QR Code Share   ║
║  🔔 Smart Notif     📊 Server Monitor     🔒 Zero Storage    ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

| Fitur | Deskripsi |
|---|---|
| 📮 **Email Instan** | Alamat email siap pakai tanpa daftar, dalam < 1 detik |
| 🔄 **Inbox Real-Time** | Auto-refresh setiap 5 detik, tidak perlu reload halaman |
| 🔔 **Notif Kontekstual** | Suara berbeda untuk OTP 🔐, Promo 🎁, Alert ⚠️, Welcome 🎉, Biasa 📧 |
| 🌐 **Dual Provider** | Gunakan `temp-mail.org` atau `tmail`, ganti kapan saja |
| 📲 **QR Code** | Share alamat email dengan scan QR |
| 📊 **Server Info** | Monitor CPU, RAM, uptime, dan jumlah sesi aktif |
| 🎨 **Dark UI** | Tampilan modern, nyaman di mata, responsif mobile & desktop |
| 🔒 **Privacy** | Tidak ada data yang disimpan secara permanen |

---

## 🔔 Sistem Notif Suara Cerdas

NovaMail V2.0.0 hadir dengan **notifikasi suara kontekstual** — berbeda tergantung jenis email yang masuk:

| Jenis | Kata Kunci Terdeteksi | Suara |
|:---:|---|---|
| 🔐 **OTP / Verifikasi** | otp, kode, code, verify, confirm, token, 2fa, pin | Beep ganda nada tinggi — urgent |
| ⚠️ **Alert / Keamanan** | alert, warning, security, suspicious, unauthorized | Tiga nada naik rendah → tinggi |
| 🎁 **Promo / Diskon** | promo, diskon, sale, cashback, gratis, voucher | Ding ceria 3 nada (do-mi-sol) |
| 🎉 **Welcome / Daftar** | welcome, congratulations, akun baru, registrasi | Melodi naik 4 nada gembira |
| 📧 **Email Biasa** | *(lainnya)* | Ding bersih 2 nada |

> 💡 Tombol 🔔 di inbox untuk mute/unmute semua notif sekaligus.

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
| `SESSION_SECRET` | *(buat string panjang & acak, contoh: `novamail-secret-2026-xYzAbC`)* |

### 🐳 Docker

```bash
docker build -t novamail .
docker run -p 5000:5000 -e SESSION_SECRET=your-secret novamail
```

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
│   ├── index.html              ← Frontend single-page app (UI lengkap)
│   └── sounds/
│       └── notif.mp3           ← Fallback audio lokal
│
├── 📁 src/scrape/
│   ├── scraper.js              ← TMailScraper (provider tmail)
│   └── tempMailOrgScraper.js   ← Scraper temp-mail.org
│
├── 📁 api/
│   └── index.js                ← Express app (serverless entry point)
│
├── 📁 netlify/functions/
│   └── api.js                  ← Netlify Function wrapper
│
├── 📁 data/
│   └── stats.dat               ← Statistik visit & online (persisten)
│
├── server.js                   ← Express server (self-hosted / lokal)
├── netlify.toml                ← Konfigurasi Netlify
├── Dockerfile                  ← Container build
└── package.json                ← Dependencies & scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|:---:|---|---|
| `GET` | `/api/messages` | Ambil email aktif & isi inbox |
| `POST` | `/api/delete` | Hapus email, generate yang baru |
| `POST` | `/api/change` | Ganti nama email (domain tetap) |
| `GET` | `/api/view/:id` | Baca isi pesan tertentu |
| `GET` | `/api/reset` | Reset sesi, email baru |
| `GET` | `/api/provider` | Cek provider aktif sesi |
| `POST` | `/api/provider` | Ganti provider (`tmail` / `tempMailOrg`) |
| `POST` | `/api/heartbeat` | Tracking pengunjung online |
| `GET` | `/api/stats` | Online count, total visit, peak |
| `GET` | `/api/server-info` | Info CPU, RAM, uptime, runtime |

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Teknologi |
|:---:|---|
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white) |
| **Backend** | ![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white) |
| **HTTP Client** | ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white) |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) |
| **Audio** | Web Audio API (kontekstual, tanpa file tambahan) |
| **Hosting** | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white) |
| **Container** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) |

</div>

---

## 📝 Lisensi

Dirilis di bawah lisensi **MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />

**NovaMail V2.0.0** — *Updated 29 July 2026*

Made with ❤️ by [hitlabmodv2](https://github.com/hitlabmodv2) &nbsp;·&nbsp; Powered by [Netlify](https://webtempmail.netlify.app/)

⭐ *Kalau project ini berguna, jangan lupa kasih bintang!* ⭐

</div>

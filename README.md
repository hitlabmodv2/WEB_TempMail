<div align="center">

# 📬 NovaMail

### TempMail instan dengan inbox real-time

<p>
  <strong>Buat email sekali pakai tanpa daftar, tanpa ribet, dan langsung siap digunakan.</strong>
</p>

<p>
  <a href="https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://img.shields.io/github/stars/hitlabmodv2/WEB_TempMail?style=for-the-badge&logo=github&label=Stars" alt="GitHub stars" />
  </a>
  <a href="https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://img.shields.io/github/license/hitlabmodv2/WEB_TempMail?style=for-the-badge&label=License" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 24" />
</p>

<p>
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  &nbsp;
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
</p>

<p>
  <a href="#-fitur">Fitur</a> ·
  <a href="#-jalankan-lokal">Jalankan Lokal</a> ·
  <a href="#-api-endpoints">API</a> ·
  <a href="#️-tech-stack">Tech Stack</a>
</p>

</div>

---

## ✨ Fitur

<div align="center">

| 📮 Email instan | 🔄 Inbox real-time | 🌐 Domain default |
|:---:|:---:|:---:|
| Tanpa registrasi | Auto-refresh 5 detik | `us.seebestdeals.com` |

| 📱 Responsif | 🎨 Tampilan modern | 📲 QR Code |
|:---:|:---:|:---:|
| Mobile & desktop | Dark UI yang nyaman | Share email dengan cepat |

</div>

---

## 🚀 Deploy

<div align="center">

### Deploy sekali klik

<a href="https://vercel.com/new/clone?repository-url=https://github.com/hitlabmodv2/WEB_TempMail">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>
&nbsp;
<a href="https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail">
  <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
</a>

</div>

### Docker

```bash
docker build -t novamail .
docker run -p 5000:5000 novamail
```

---

## 🛠️ Jalankan Lokal

```bash
git clone https://github.com/hitlabmodv2/WEB_TempMail.git
cd WEB_TempMail
npm install
npm start
```

Buka [`http://localhost:5000`](http://localhost:5000) di browser.

---

## 📂 Struktur Proyek

```text
.
├── public/index.html       # Frontend single-file
├── server.js               # Server Express utama
├── src/scrape/scraper.js   # Logic scraper TempMail
├── api/index.js            # Entry serverless Vercel
├── netlify/functions/      # Netlify function wrapper
├── vercel.json             # Konfigurasi Vercel
├── netlify.toml            # Konfigurasi Netlify
└── Dockerfile              # Container build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|:---:|---|---|
| `GET` | `/api/messages` | Ambil email aktif dan isi inbox |
| `POST` | `/api/delete` | Hapus email dan buat email baru |
| `POST` | `/api/change` | Ganti nama email; domain tetap `us.seebestdeals.com` |
| `GET` | `/api/view/:id` | Baca isi pesan tertentu |
| `GET` | `/api/reset` | Reset session dan dapatkan email baru |
| `GET` | `/api/server-info` | Lihat informasi runtime server |

---

## ⚙️ Tech Stack

<div align="center">

| Bagian | Teknologi |
|:---:|---|
| **Backend** | Node.js 24.x + Express |
| **Scraping** | Axios dengan session dan CSRF |
| **Frontend** | HTML, CSS, JavaScript vanilla, FontAwesome, Inter |
| **Session** | `express-session` in-memory |

</div>

---

## 📝 Lisensi

NovaMail dirilis di bawah lisensi **MIT** — bebas digunakan dan dimodifikasi.

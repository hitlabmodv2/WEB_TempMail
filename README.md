# 📬 NovaMail — TempMail Web

> Disposable email instan, tanpa daftar, real-time inbox. Powered by `tmail.etokom.com`.

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  &nbsp;
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
</p>

---

## ✨ Fitur

- 📮 Email sekali pakai instan — tanpa daftar
- 🔄 Auto-refresh inbox tiap 5 detik
- 🌐 Multi-domain (`t.etokom.com`, `us.seebestdeals.com`, `gift4zone.top`)
- 📱 UI responsif (mobile + desktop)
- 🎨 Dark mode modern
- 📊 Server info & developer panel built-in
- 📲 QR code untuk share email cepat

---

## 🚀 Deploy

### Vercel (1-klik)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hitlabmodv2/WEB_TempMail)

### Netlify (1-klik)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hitlabmodv2/WEB_TempMail)

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

Buka http://localhost:5000

---

## 📂 Struktur Proyek

```
.
├── public/index.html       # Frontend (single-file UI)
├── server.js               # Server Express utama
├── src/scrape/scraper.js   # Logic scraper TempMail
├── api/index.js            # Entry serverless (Vercel/Netlify)
├── netlify/functions/      # Netlify function wrapper
├── vercel.json             # Config Vercel
├── netlify.toml            # Config Netlify
└── Dockerfile              # Container build
```

---

## 🔌 API Endpoints

| Method | Path | Deskripsi |
|--------|------|-----------|
| `GET`  | `/api/messages`     | Ambil email aktif + isi inbox |
| `POST` | `/api/delete`       | Hapus email (auto buat baru) |
| `POST` | `/api/change`       | Ganti email (`{ name, domain }`) |
| `GET`  | `/api/view/:id`     | Baca isi pesan |
| `GET`  | `/api/reset`        | Reset session, dapat email baru |
| `GET`  | `/api/server-info`  | Info server runtime |

---

## ⚙️ Tech Stack

- **Backend** — Node.js + Express
- **Scraping** — Axios (session + CSRF based)
- **Frontend** — HTML/CSS/JS vanilla, FontAwesome, Inter font
- **Session** — `express-session` (in-memory)

---

## 📝 Lisensi

MIT — bebas dipakai & dimodifikasi.

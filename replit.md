# TempMail Scraper

A real-time disposable email web app powered by scraping tmail.etokom.com.

## Architecture

- **Backend**: Express.js server (`server.js`) acting as a proxy/scraper
- **Scraper**: `src/scrape/scraper.js` — session-based scraper using axios
- **Frontend**: `public/index.html` — single-file responsive UI (mobile + desktop)

## How It Works

1. Each browser session gets its own scraper instance (stored in `scraperStore` Map by session ID)
2. On first request, the scraper fetches a session + CSRF token from tmail.etokom.com
3. The scraper posts to `tmail.etokom.com/get_messages` with proper cookies/CSRF
4. The frontend polls `/api/messages` every 5 seconds for real-time updates

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/messages` | Get current email + inbox messages |
| POST | `/api/delete` | Delete current email (new one auto-created) |
| POST | `/api/change` | Change email (body: `{ name, domain }`) |
| GET | `/api/view/:id` | View a specific email message |
| GET | `/api/reset` | Reset session and get fresh email |

## Available Domains

- `t.etokom.com`
- `us.seebestdeals.com`
- `gift4zone.top`

## Run

```bash
node server.js
```

Server starts on port 5000 (configurable via `PORT` env var).

## Dependencies

- `express` — web server
- `express-session` — per-user session management
- `axios` — HTTP scraping
- `cors` — cross-origin support

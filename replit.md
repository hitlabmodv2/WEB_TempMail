# NovaMail

Instant disposable email (temp mail) web app with real-time inbox.

## Stack
- **Backend**: Node.js 24.x + Express
- **Scraping**: Axios — scrapes `us.seebestdeals.com` for temp mailboxes
- **Frontend**: Single-file vanilla HTML/CSS/JS (`public/index.html`)
- **Session**: `express-session` (in-memory)

## Run
```bash
npm install
npm start          # or: node server.js
```
Server listens on port 5000 (or `$PORT`).

## Key files
| Path | Purpose |
|---|---|
| `server.js` | Express server + all API routes |
| `src/scrape/scraper.js` | TempMail scraper logic |
| `public/index.html` | Frontend single-page app |
| `api/index.js` | Serverless entry point (Vercel/Netlify) |
| `data/stats.dat` | Persisted visit/peak stats |

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages` | Fetch active email + inbox |
| POST | `/api/delete` | Delete email, create new one |
| POST | `/api/change` | Change email name (domain stays `us.seebestdeals.com`) |
| GET | `/api/view/:id` | Read a specific message |
| GET | `/api/reset` | Reset session, get fresh email |
| POST | `/api/heartbeat` | Online visitor tracking |
| GET | `/api/stats` | Online count, total visits, peak |
| GET | `/api/server-info` | Runtime/system info |

## User preferences

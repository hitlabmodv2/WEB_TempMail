const express       = require('express');
const cookieSession = require('cookie-session');
const cors          = require('cors');
const axios         = require('axios');

const app = express();

// ── Waktu launch site (tetap, tidak reset walau serverless cold start) ────
// Ganti nilai ini setiap kali kamu deploy ulang dari awal.
const _instanceStart = process.env.SITE_LAUNCH_TIME
  ? parseInt(process.env.SITE_LAUNCH_TIME, 10)
  : new Date('2026-07-29T00:00:00Z').getTime();

// ── Stats in-memory ────────────────────────────────────────────────────────
let siteStats = { total_visits: 0, peak_online: 0 };
const onlineMap = new Map();
const HEARTBEAT_TTL = 2 * 60 * 1000;
function countOnline() {
  const now = Date.now();
  let c = 0;
  onlineMap.forEach(v => { if (now - v.lastSeen < HEARTBEAT_TTL) c++; });
  return c;
}
setInterval(() => {
  const now = Date.now();
  onlineMap.forEach((v, k) => { if (now - v.lastSeen >= HEARTBEAT_TTL) onlineMap.delete(k); });
}, 60000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie-session: data disimpan LANGSUNG di cookie browser (bukan server memory)
// → email tetap sama walau Netlify cold start berkali-kali
app.use(cookieSession({
  name: 'nm_sess',
  secret: process.env.SESSION_SECRET || 'tmail-scraper-secret-2026',
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
}));

// ── Axios-based TempMail scraper (serverless-compatible) ───────────────────
const WEB2 = 'https://web2.temp-mail.org';

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://temp-mail.org',
  'Referer': 'https://temp-mail.org/en/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function createMailbox(retries = 4) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.post(`${WEB2}/mailbox`, {}, {
        headers: HEADERS,
        timeout: 15000,
      });
      const { token, mailbox } = res.data;
      if (!token || !mailbox) throw new Error('No token/mailbox in response');
      return { token, mailbox };
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      // Jika bukan 429/503 langsung lempar tanpa retry
      if (status && status !== 429 && status !== 503) throw err;
      // Exponential backoff: 1s, 2s, 4s, 8s
      const delay = Math.pow(2, i) * 1000;
      console.warn(`[createMailbox] attempt ${i + 1} gagal (${status || err.message}), retry dalam ${delay}ms…`);
      await sleep(delay);
    }
  }
  throw new Error('Layanan email sedang sibuk, coba lagi dalam beberapa saat. (' + (lastErr?.response?.status || lastErr?.message) + ')');
}

async function fetchMailbox(token, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(`${WEB2}/messages`, {
        headers: { ...HEADERS, Authorization: `Bearer ${token}` },
        timeout: 15000,
      });
      return res.data; // { mailbox, messages: [] }
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      if (status && status !== 429 && status !== 503) throw err;
      const delay = Math.pow(2, i) * 1000;
      console.warn(`[fetchMailbox] attempt ${i + 1} gagal (${status || err.message}), retry dalam ${delay}ms…`);
      await sleep(delay);
    }
  }
  throw lastErr;
}

// Simpan token di req.session (cookie) bukan Map memory
// → email tetap sama walau Netlify cold start
async function getOrCreateSession(req) {
  if (!req.session.mailToken) {
    const { token, mailbox } = await createMailbox();
    req.session.mailToken = token;
    req.session.mailbox   = mailbox;
  }
  return { token: req.session.mailToken, mailbox: req.session.mailbox };
}

function normalizeMessage(m) {
  return {
    id:       m._id || m.id || '',
    from:     m.from || m.fromAddress || '',
    from_name: m.fromName || m.from_name || m.from || '',
    subject:  m.subject || '(no subject)',
    date:     m.createdAt || m.date || '',
    is_seen:  m.seen || false,
    preview:  m.intro || m.preview || '',
  };
}

// ── GET /api/messages ──────────────────────────────────────────────────────
app.get('/api/messages', async (req, res) => {
  try {
    let sess = await getOrCreateSession(req);
    let data;
    try {
      data = await fetchMailbox(sess.token);
    } catch (e) {
      // Token kadaluarsa (401) — buat mailbox baru, simpan ke session cookie
      if (e.response?.status === 401) {
        const fresh = await createMailbox();
        req.session.mailToken = fresh.token;
        req.session.mailbox   = fresh.mailbox;
        sess = fresh;
        data = await fetchMailbox(sess.token);
      } else throw e;
    }
    if (!data.mailbox) return res.json({ success: false, error: 'No mailbox in response' });
    req.session.mailbox = data.mailbox;
    res.json({
      success: true,
      data: {
        mailbox:  data.mailbox,
        messages: (data.messages || []).map(normalizeMessage),
        histories: [],
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── POST /api/delete ───────────────────────────────────────────────────────
app.post('/api/delete', async (req, res) => {
  try {
    const { token, mailbox } = await createMailbox();
    req.session.mailToken = token;
    req.session.mailbox   = mailbox;
    res.json({ success: true, data: { mailbox, messages: [], histories: [] } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── POST /api/change ───────────────────────────────────────────────────────
// web2 gratis tidak support pilih nama/domain → buat mailbox baru
app.post('/api/change', async (req, res) => {
  try {
    const { token, mailbox } = await createMailbox();
    req.session.mailToken = token;
    req.session.mailbox   = mailbox;
    res.json({ success: true, data: { mailbox, messages: [], histories: [] } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/view/:id ──────────────────────────────────────────────────────
app.get('/api/view/:id', async (req, res) => {
  try {
    const token = req.session.mailToken;
    if (!token) return res.json({ success: false, error: 'Session tidak ditemukan' });
    const r = await axios.get(`${WEB2}/messages/${req.params.id}`, {
      headers: { ...HEADERS, Authorization: `Bearer ${token}` },
      timeout: 15000,
    });
    const d = r.data;
    const body = d.bodyHtml || d.bodyText || d.body || '';
    res.json({ success: true, subject: d.subject || '', from: d.from || '', date: d.createdAt || d.date || '', body, html: body });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/reset ─────────────────────────────────────────────────────────
app.get('/api/reset', async (req, res) => {
  try {
    const { token, mailbox } = await createMailbox();
    req.session.mailToken = token;
    req.session.mailbox   = mailbox;
    res.json({ success: true, data: { mailbox, messages: [], histories: [] } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── GET /api/provider ──────────────────────────────────────────────────────
app.get('/api/provider', (req, res) => res.json({ provider: 'tempMailOrg' }));

// ── POST /api/provider ─────────────────────────────────────────────────────
app.post('/api/provider', async (req, res) => {
  // Serverless hanya pakai tempMailOrg — abaikan permintaan ganti provider
  try {
    const sess = await getOrCreateSession(req);
    const data = await fetchMailbox(sess.token);
    res.json({ success: true, provider: 'tempMailOrg', data: { mailbox: data.mailbox, messages: (data.messages || []).map(normalizeMessage), histories: [] } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── POST /api/heartbeat ────────────────────────────────────────────────────
app.post('/api/heartbeat', (req, res) => {
  // cookie-session tidak punya .id — pakai mailbox sebagai identifier unik
  const sid = req.session.mailbox || req.headers['x-forwarded-for'] || 'anon';
  const ex = onlineMap.get(sid);
  if (!ex) { siteStats.total_visits++; onlineMap.set(sid, { lastSeen: Date.now() }); }
  else ex.lastSeen = Date.now();
  const online = countOnline();
  if (online > siteStats.peak_online) siteStats.peak_online = online;
  res.json({ ok: true });
});

// ── GET /api/stats ─────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({ online: countOnline(), total_visits: siteStats.total_visits, peak_online: siteStats.peak_online });
});

// ── GET /api/server-info ───────────────────────────────────────────────────
app.get('/api/server-info', (req, res) => {
  const os = require('os');
  const v8 = require('v8');

  const totalMem  = os.totalmem();
  const freeMem   = os.freemem();
  const usedMem   = totalMem - freeMem;
  const cpus      = os.cpus() || [];
  const loadAvg   = os.loadavg ? os.loadavg() : [0, 0, 0];
  const sysUptime = os.uptime  ? os.uptime()  : 0;
  const memUsage  = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();

  const toMB = b => (b / 1024 / 1024).toFixed(1);
  const toGB = b => (b / 1024 / 1024 / 1024).toFixed(2);
  const fmt  = s => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return { days: d, hours: h, mins: m, secs: sec, raw: Math.floor(s) };
  };

  const runtime = process.env.NETLIFY            ? 'Netlify Functions'
                : process.env.VERCEL             ? 'Vercel Serverless'
                : process.env.AWS_LAMBDA_FUNCTION_NAME ? 'AWS Lambda'
                : 'Node.js';

  res.json({
    success: true,
    system: {
      platform:    os.platform(),
      type:        os.type    ? os.type()    : 'Linux',
      release:     os.release ? os.release() : 'N/A',
      arch:        os.arch(),
      nodeVersion: process.version,
      v8Version:   process.versions.v8,
      npmVersion:  process.versions.node,
      osUptime:    fmt(sysUptime),
    },
    memory: {
      total:       toGB(totalMem) + ' GB',
      used:        toMB(usedMem)  + ' MB',
      free:        toMB(freeMem)  + ' MB',
      usedPercent: Math.round((usedMem / totalMem) * 100),
      freePercent: Math.round((freeMem / totalMem) * 100),
      totalRaw:    totalMem,
      usedRaw:     usedMem,
      freeRaw:     freeMem,
    },
    cpu: {
      model:       cpus[0]?.model?.trim() || 'Serverless CPU',
      cores:       cpus.length || 1,
      speed:       cpus[0]?.speed ? cpus[0].speed + ' MHz' : 'N/A',
      loadAvg1:    loadAvg[0].toFixed(2),
      loadAvg5:    loadAvg[1].toFixed(2),
      loadAvg15:   loadAvg[2].toFixed(2),
    },
    process: {
      pid:             process.pid,
      uptime:          fmt(process.uptime()),
      heapUsed:        toMB(memUsage.heapUsed)  + ' MB',
      heapTotal:       toMB(memUsage.heapTotal) + ' MB',
      heapUsedPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      rss:             toMB(memUsage.rss)      + ' MB',
      external:        toMB(memUsage.external) + ' MB',
      heapSizeLimit:   toGB(heapStats.heap_size_limit) + ' GB',
      env:             process.env.NODE_ENV || 'production',
      port:            process.env.PORT || 'N/A',
    },
    webUptime: fmt(Math.floor((Date.now() - _instanceStart) / 1000)),
    app: {
      activeSessions:       0,
      totalSessionsCreated: 0,
      framework:            'Express.js',
      runtime,
      serverless:           !!(process.env.NETLIFY || process.env.VERCEL),
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

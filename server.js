const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const TMailScraper        = require('./src/scrape/scraper');
const TempMailOrgScraper  = require('./src/scrape/tempMailOrgScraper');

// ── Stats persistence (data/stats.dat) ────────────────────────────────────
const STATS_FILE = path.join(__dirname, 'data', 'stats.dat');

function readStats() {
  try {
    const lines = fs.readFileSync(STATS_FILE, 'utf8').trim().split('\n');
    const obj = {};
    lines.forEach(l => {
      const [k, v] = l.split('=');
      if (k && v !== undefined) obj[k.trim()] = Number(v.trim());
    });
    return {
      total_visits: obj.total_visits || 0,
      peak_online:  obj.peak_online  || 0,
    };
  } catch { return { total_visits: 0, peak_online: 0 }; }
}

function writeStats(stats) {
  try {
    const content = `total_visits=${stats.total_visits}\npeak_online=${stats.peak_online}\n`;
    fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
    fs.writeFileSync(STATS_FILE, content, 'utf8');
  } catch(e) { console.error('Stats write error:', e.message); }
}

let siteStats = readStats();

// ── Online visitor tracking (heartbeat) ───────────────────────────────────
// Map: sessionId → { lastSeen: timestamp, counted: bool }
const onlineMap = new Map();
const HEARTBEAT_TTL = 2 * 60 * 1000; // 2 menit tanpa heartbeat = offline

function countOnline() {
  const now = Date.now();
  let count = 0;
  onlineMap.forEach((v) => { if (now - v.lastSeen < HEARTBEAT_TTL) count++; });
  return count;
}

// Bersihkan sesi yang sudah offline tiap 1 menit
setInterval(() => {
  const now = Date.now();
  onlineMap.forEach((v, k) => { if (now - v.lastSeen >= HEARTBEAT_TTL) onlineMap.delete(k); });
}, 60 * 1000);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Persistent web start time (survives process restarts) ──────────────────
const START_TIME_FILE = path.join(__dirname, '.web_start_time');
let webStartTime;
try {
  if (fs.existsSync(START_TIME_FILE)) {
    const stored = parseInt(fs.readFileSync(START_TIME_FILE, 'utf8').trim(), 10);
    if (stored && !isNaN(stored)) {
      webStartTime = stored;
    }
  }
} catch (_) {}
if (!webStartTime) {
  webStartTime = Date.now();
  try { fs.writeFileSync(START_TIME_FILE, String(webStartTime)); } catch (_) {}
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'tmail-scraper-secret-2026',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

function getScraper(req) {
  if (!req.session.scraper) {
    req.session.scraper = null;
  }
  if (!req.session._scraper) {
    req.session._scraper = new TMailScraper();
  }
  return req.session._scraper;
}

const scraperStore   = new Map(); // sessionId → scraper instance
const providerStore  = new Map(); // sessionId → 'tmail' | 'tempMailOrg'

function getProviderForSession(sessionId) {
  return providerStore.get(sessionId) || 'tempMailOrg';
}

function getScraperForSession(sessionId) {
  if (!scraperStore.has(sessionId)) {
    scraperStore.set(sessionId, new TMailScraper());
  }
  return scraperStore.get(sessionId);
}

function createScraperForProvider(provider) {
  if (provider === 'tempMailOrg') return new TempMailOrgScraper();
  return new TMailScraper();
}

const FORCED_DOMAIN = 'us.seebestdeals.com';

function randomName(len = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// ── enforceDefaultDomain hanya untuk provider tmail ──────────────────────
async function enforceDefaultDomain(scraper, result) {
  const mailbox = result?.data?.mailbox;
  if (result?.success && mailbox?.toLowerCase().endsWith('@' + FORCED_DOMAIN)) {
    return result;
  }

  const changed = await scraper.changeEmail(randomName(), FORCED_DOMAIN);
  if (changed.success && changed.data?.mailbox?.toLowerCase().endsWith('@' + FORCED_DOMAIN)) {
    return changed;
  }

  return {
    success: false,
    error: `Only @${FORCED_DOMAIN} addresses are supported`,
  };
}

// ── Helper: ambil scraper sesuai provider session ─────────────────────────
function getActiveScraperForSession(sessionId) {
  if (!scraperStore.has(sessionId)) {
    const provider = getProviderForSession(sessionId);
    scraperStore.set(sessionId, createScraperForProvider(provider));
  }
  return scraperStore.get(sessionId);
}

// ── GET /api/provider — cek provider aktif ────────────────────────────────
app.get('/api/provider', (req, res) => {
  res.json({ provider: getProviderForSession(req.session.id) });
});

// ── POST /api/provider — ganti provider ──────────────────────────────────
app.post('/api/provider', async (req, res) => {
  try {
    const { provider } = req.body;
    if (!['tmail', 'tempMailOrg'].includes(provider)) {
      return res.status(400).json({ success: false, error: 'Provider tidak valid. Gunakan: tmail | tempMailOrg' });
    }

    // Tutup scraper lama jika ada
    const old = scraperStore.get(req.session.id);
    if (old && typeof old.close === 'function') await old.close();
    scraperStore.delete(req.session.id);

    providerStore.set(req.session.id, provider);
    req.session.provider = provider;

    const scraper = getActiveScraperForSession(req.session.id);
    const result  = await scraper.getMessages();

    // Terapkan domain default hanya untuk provider tmail
    if (provider === 'tmail') {
      const enforced = await enforceDefaultDomain(scraper, result);
      if (enforced.success && enforced.data?.mailbox) req.session.savedEmail = enforced.data.mailbox;
      return res.json({ success: true, provider, ...enforced });
    }

    if (result.success && result.data?.mailbox) req.session.savedEmail = result.data.mailbox;
    res.json({ success: true, provider, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const provider = getProviderForSession(req.session.id);
    const isNewScraper = !scraperStore.has(req.session.id);
    const scraper = getActiveScraperForSession(req.session.id);

    // Restore email dari client hint (untuk server restart & serverless/Netlify)
    // req.session.savedEmail bekerja di env persistent; req.query.restore adalah fallback
    // yang dikirim frontend dari localStorage saat scraper baru dibuat.
    if (isNewScraper && provider === 'tmail') {
      const hint = req.session.savedEmail || (req.query.restore ? String(req.query.restore) : null);
      if (hint) {
        const savedName = hint.split('@')[0].replace(/[^a-z0-9_.-]/gi, '');
        if (savedName) {
          await scraper.changeEmail(savedName, FORCED_DOMAIN);
        }
      }
    }

    let result = await scraper.getMessages();

    if (provider === 'tmail') {
      if (result.success && result.data && result.data.mailbox) {
        const mailbox = result.data.mailbox;
        if (!mailbox.toLowerCase().endsWith('@' + FORCED_DOMAIN)) {
          result = await enforceDefaultDomain(scraper, result);
        }
      } else {
        result = await enforceDefaultDomain(scraper, result);
      }
    }

    if (result.success && result.data?.mailbox) req.session.savedEmail = result.data.mailbox;
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const provider = getProviderForSession(req.session.id);
    const scraper  = getActiveScraperForSession(req.session.id);
    const result   = await scraper.deleteEmail();
    if (provider === 'tmail') return res.json(await enforceDefaultDomain(scraper, result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/change', async (req, res) => {
  try {
    const { name } = req.body;
    const provider = getProviderForSession(req.session.id);
    const scraper  = getActiveScraperForSession(req.session.id);
    const result   = await scraper.changeEmail(name, FORCED_DOMAIN);
    if (provider === 'tmail') return res.json(await enforceDefaultDomain(scraper, result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/view/:id', async (req, res) => {
  try {
    const { id }  = req.params;
    const scraper = getActiveScraperForSession(req.session.id);
    const result  = await scraper.viewMessage(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Heartbeat — client kirim tiap 30 detik ────────────────────────────────
app.post('/api/heartbeat', (req, res) => {
  const sid = req.session.id;
  const existing = onlineMap.get(sid);
  if (!existing) {
    // Kunjungan baru — tambah total_visits
    siteStats.total_visits++;
    onlineMap.set(sid, { lastSeen: Date.now() });
  } else {
    existing.lastSeen = Date.now();
  }
  // Update peak online
  const online = countOnline();
  if (online > siteStats.peak_online) siteStats.peak_online = online;
  writeStats(siteStats);
  res.json({ ok: true });
});

// ── Stats — online, total visits, peak ────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const online = countOnline();
  res.json({
    online,
    total_visits: siteStats.total_visits,
    peak_online:  siteStats.peak_online,
  });
});

app.get('/api/reset', async (req, res) => {
  try {
    const provider = getProviderForSession(req.session.id);
    const old = scraperStore.get(req.session.id);
    if (old && typeof old.close === 'function') await old.close();
    scraperStore.delete(req.session.id);
    const scraper = getActiveScraperForSession(req.session.id);
    const result  = await scraper.getMessages();
    if (provider === 'tmail') return res.json(await enforceDefaultDomain(scraper, result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/server-info', (req, res) => {
  const os = require('os');
  const v8 = require('v8');

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const cpus = os.cpus();
  const sysUptime = os.uptime();
  const procUptime = process.uptime();
  const loadAvg = os.loadavg();
  const memUsage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();

  const fmt = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return { days: d, hours: h, mins: m, secs: sec, raw: Math.floor(s) };
  };
  const toMB = (b) => (b / 1024 / 1024).toFixed(1);
  const toGB = (b) => (b / 1024 / 1024 / 1024).toFixed(2);

  const activeSessions = scraperStore.size;

  // CPU usage per core (times)
  const cpuTimes = cpus.map((c, i) => ({
    core: i + 1,
    model: c.model?.trim(),
    speed: c.speed ? c.speed + ' MHz' : 'N/A',
    user: c.times.user,
    sys: c.times.sys,
    idle: c.times.idle,
  }));

  // OS release info
  const osRelease = os.release ? os.release() : 'N/A';
  const osType = os.type ? os.type() : 'N/A';

  res.json({
    success: true,
    system: {
      platform: os.platform(),
      type: osType,
      release: osRelease,
      arch: os.arch(),
      nodeVersion: process.version,
      v8Version: process.versions.v8,
      npmVersion: process.versions.node,
      osUptime: fmt(sysUptime),
    },
    webUptime: fmt(Math.floor((Date.now() - webStartTime) / 1000)),
    memory: {
      totalRaw: totalMem,
      freeRaw: freeMem,
      usedRaw: usedMem,
      total: toGB(totalMem) + ' GB',
      used: toMB(usedMem) + ' MB',
      free: toMB(freeMem) + ' MB',
      usedPercent: Math.round((usedMem / totalMem) * 100),
      freePercent: Math.round((freeMem / totalMem) * 100),
    },
    cpu: {
      model: cpus[0]?.model?.trim() || 'Unknown',
      cores: cpus.length,
      speed: cpus[0]?.speed ? cpus[0].speed + ' MHz' : 'N/A',
      loadAvg1: loadAvg[0].toFixed(2),
      loadAvg5: loadAvg[1].toFixed(2),
      loadAvg15: loadAvg[2].toFixed(2),
      cores_detail: cpuTimes,
    },
    process: {
      pid: process.pid,
      uptime: fmt(procUptime),
      heapUsed: toMB(memUsage.heapUsed) + ' MB',
      heapTotal: toMB(memUsage.heapTotal) + ' MB',
      heapUsedPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      rss: toMB(memUsage.rss) + ' MB',
      external: toMB(memUsage.external) + ' MB',
      heapSizeLimit: toGB(heapStats.heap_size_limit) + ' GB',
      env: process.env.NODE_ENV || 'development',
      port: PORT,
    },
    app: {
      activeSessions,
      totalSessionsCreated: scraperStore.size,
      framework: 'Express.js',
      runtime: 'Node.js',
    },
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TempMail server running on port ${PORT}`);
});

const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const TMailScraper = require('../src/scrape/scraper');

const app = express();
const FORCED_DOMAIN = 'us.seebestdeals.com';

// ── Waktu start instance — untuk webUptime ─────────────────────────────────
const _instanceStart = Date.now();

// ── Stats in-memory (persists dalam satu warm instance Vercel) ─────────────
let siteStats = { total_visits: 0, peak_online: 0 };
const onlineMap = new Map();
const HEARTBEAT_TTL = 2 * 60 * 1000;

function countOnline() {
  const now = Date.now();
  let count = 0;
  onlineMap.forEach(v => { if (now - v.lastSeen < HEARTBEAT_TTL) count++; });
  return count;
}
setInterval(() => {
  const now = Date.now();
  onlineMap.forEach((v, k) => { if (now - v.lastSeen >= HEARTBEAT_TTL) onlineMap.delete(k); });
}, 60000);

function randomName(len = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let value = '';
  for (let i = 0; i < len; i++) value += chars[Math.floor(Math.random() * chars.length)];
  return value;
}

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'tmail-scraper-secret-2026',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const scraperStore = new Map();
function getScraperForSession(id) {
  if (!scraperStore.has(id)) scraperStore.set(id, new TMailScraper());
  return scraperStore.get(id);
}

app.get('/api/messages', async (req, res) => {
  try {
    const scraper = getScraperForSession(req.session.id);
    res.json(await enforceDefaultDomain(scraper, await scraper.getMessages()));
  }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/delete', async (req, res) => {
  try {
    const scraper = getScraperForSession(req.session.id);
    res.json(await enforceDefaultDomain(scraper, await scraper.deleteEmail()));
  }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/change', async (req, res) => {
  try {
    const { name } = req.body;
    const scraper = getScraperForSession(req.session.id);
    res.json(await enforceDefaultDomain(scraper, await scraper.changeEmail(name, FORCED_DOMAIN)));
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/view/:id', async (req, res) => {
  try { res.json(await getScraperForSession(req.session.id).viewMessage(req.params.id)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/reset', async (req, res) => {
  try {
    scraperStore.delete(req.session.id);
    const scraper = getScraperForSession(req.session.id);
    res.json(await enforceDefaultDomain(scraper, await scraper.getMessages()));
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Heartbeat ──────────────────────────────────────────────────────────────
app.post('/api/heartbeat', (req, res) => {
  const sid = req.session.id;
  const existing = onlineMap.get(sid);
  if (!existing) {
    siteStats.total_visits++;
    onlineMap.set(sid, { lastSeen: Date.now() });
  } else {
    existing.lastSeen = Date.now();
  }
  const online = countOnline();
  if (online > siteStats.peak_online) siteStats.peak_online = online;
  res.json({ ok: true });
});

// ── Stats ──────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    online: countOnline(),
    total_visits: siteStats.total_visits,
    peak_online: siteStats.peak_online,
  });
});

app.get('/api/server-info', (req, res) => {
  const os = require('os');
  const v8 = require('v8');

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const cpus = os.cpus() || [];
  const sysUptime = os.uptime ? os.uptime() : 0;
  const procUptime = process.uptime();
  const loadAvg = os.loadavg ? os.loadavg() : [0, 0, 0];
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

  const cpuTimes = cpus.map((c, i) => ({
    core: i + 1,
    model: c.model?.trim(),
    speed: c.speed ? c.speed + ' MHz' : 'N/A',
    user: c.times?.user || 0,
    sys: c.times?.sys || 0,
    idle: c.times?.idle || 0,
  }));

  const isServerless = !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const runtime = process.env.VERCEL ? 'Vercel Serverless'
                : process.env.NETLIFY ? 'Netlify Functions'
                : process.env.AWS_LAMBDA_FUNCTION_NAME ? 'AWS Lambda'
                : 'Node.js';

  res.json({
    success: true,
    system: {
      platform: os.platform(),
      type: os.type ? os.type() : 'N/A',
      release: os.release ? os.release() : 'N/A',
      arch: os.arch(),
      nodeVersion: process.version,
      v8Version: process.versions.v8,
      npmVersion: process.versions.node,
      osUptime: fmt(sysUptime),
    },
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
      model: cpus[0]?.model?.trim() || 'Serverless CPU',
      cores: cpus.length || 1,
      speed: cpus[0]?.speed ? cpus[0].speed + ' MHz' : 'N/A',
      loadAvg1: (loadAvg[0] || 0).toFixed(2),
      loadAvg5: (loadAvg[1] || 0).toFixed(2),
      loadAvg15: (loadAvg[2] || 0).toFixed(2),
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
      env: process.env.NODE_ENV || 'production',
      port: process.env.PORT || 'N/A',
    },
    webUptime: fmt(Math.floor((Date.now() - _instanceStart) / 1000)),
    app: {
      activeSessions: scraperStore.size,
      totalSessionsCreated: scraperStore.size,
      framework: 'Express.js',
      runtime,
      serverless: isServerless,
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

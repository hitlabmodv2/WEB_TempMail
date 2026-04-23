const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const TMailScraper = require('./src/scrape/scraper');

const app = express();
const PORT = process.env.PORT || 5000;

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

const scraperStore = new Map();

function getScraperForSession(sessionId) {
  if (!scraperStore.has(sessionId)) {
    scraperStore.set(sessionId, new TMailScraper());
  }
  return scraperStore.get(sessionId);
}

app.get('/api/messages', async (req, res) => {
  try {
    const scraper = getScraperForSession(req.session.id);
    const result = await scraper.getMessages();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const scraper = getScraperForSession(req.session.id);
    const result = await scraper.deleteEmail();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/change', async (req, res) => {
  try {
    const { name, domain } = req.body;
    const scraper = getScraperForSession(req.session.id);
    const result = await scraper.changeEmail(name, domain);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/view/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scraper = getScraperForSession(req.session.id);
    const result = await scraper.viewMessage(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/reset', async (req, res) => {
  try {
    scraperStore.delete(req.session.id);
    const scraper = getScraperForSession(req.session.id);
    const result = await scraper.getMessages();
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

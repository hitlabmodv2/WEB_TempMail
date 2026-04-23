const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const TMailScraper = require('../src/scrape/scraper');

const app = express();

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
  try { res.json(await getScraperForSession(req.session.id).getMessages()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/delete', async (req, res) => {
  try { res.json(await getScraperForSession(req.session.id).deleteEmail()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/change', async (req, res) => {
  try {
    const { name, domain } = req.body;
    res.json(await getScraperForSession(req.session.id).changeEmail(name, domain));
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/view/:id', async (req, res) => {
  try { res.json(await getScraperForSession(req.session.id).viewMessage(req.params.id)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/reset', async (req, res) => {
  try {
    scraperStore.delete(req.session.id);
    res.json(await getScraperForSession(req.session.id).getMessages());
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/server-info', (req, res) => {
  res.json({
    success: true,
    system: { platform: 'serverless', nodeVersion: process.version },
    app: { activeSessions: scraperStore.size, framework: 'Express.js', runtime: 'Serverless' },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

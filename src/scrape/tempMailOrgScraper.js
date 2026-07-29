/**
 * TempMailOrgScraper — scraper untuk temp-mail.org via web2 API
 * Bypass Cloudflare menggunakan wreq-js dengan profil firefox_133
 *
 * Endpoint:
 *   POST   https://web2.temp-mail.org/mailbox         → {token, mailbox}
 *   GET    https://web2.temp-mail.org/messages        → {mailbox, messages:[]}
 *   GET    https://web2.temp-mail.org/messages/:id    → detail pesan
 */

const { createSession } = require('wreq-js');

const WEB2_BASE = 'https://web2.temp-mail.org';
const WARMUP_URL = 'https://temp-mail.org/en/';

class TempMailOrgScraper {
  constructor() {
    this.session  = null;
    this.token    = null;
    this.mailbox  = null;
    this.initialized = false;
  }

  _headers(withAuth = false) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'https://temp-mail.org',
      'Referer': 'https://temp-mail.org/en/',
      ...(withAuth && this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
    };
  }

  async init() {
    try {
      if (this.session) {
        try { await this.session.close(); } catch (_) {}
      }

      // Buat sesi baru dengan profil Firefox (bypass Cloudflare)
      this.session = await createSession({ browser: 'firefox_133', os: 'windows' });

      // Warm-up: kunjungi homepage dulu agar Cloudflare cookie terpasang
      await this.session.fetch(WARMUP_URL);

      // Buat mailbox baru
      const res = await this.session.fetch(`${WEB2_BASE}/mailbox`, {
        method: 'POST',
        headers: this._headers(),
      });

      if (!res.ok) {
        throw new Error(`mailbox POST gagal: HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.token || !data.mailbox) {
        throw new Error('Response tidak ada token/mailbox: ' + JSON.stringify(data));
      }

      this.token   = data.token;
      this.mailbox = data.mailbox;
      this.initialized = true;
      return true;
    } catch (err) {
      console.error('[TempMailOrg] init error:', err.message);
      this.initialized = false;
      return false;
    }
  }

  async _ensureInit() {
    if (!this.initialized || !this.token) {
      await this.init();
    }
  }

  async getMessages() {
    await this._ensureInit();
    try {
      const res = await this.session.fetch(`${WEB2_BASE}/messages`, {
        headers: this._headers(true),
      });

      // Token kadaluarsa → reinit
      if (res.status === 401) {
        await this.init();
        const res2 = await this.session.fetch(`${WEB2_BASE}/messages`, {
          headers: this._headers(true),
        });
        return this._parseMessages(res2);
      }

      return this._parseMessages(res);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async _parseMessages(res) {
    try {
      const data = await res.json();
      // Format: { mailbox: "xxx@yyy.com", messages: [...] }
      if (!data.mailbox) return { success: false, error: 'No mailbox in response', raw: data };
      this.mailbox = data.mailbox;
      return {
        success: true,
        data: {
          mailbox: data.mailbox,
          messages: (data.messages || []).map(m => this._normalizeMessage(m)),
          histories: [],
        },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  _normalizeMessage(m) {
    return {
      id:      m._id  || m.id  || '',
      from:    m.from || m.fromAddress || '',
      subject: m.subject || '(no subject)',
      date:    m.createdAt || m.date || '',
      seen:    m.seen || false,
    };
  }

  async deleteEmail() {
    // web2 tidak punya DELETE endpoint gratis — buat mailbox baru
    try {
      const ok = await this.init();
      if (!ok) return { success: false, error: 'Gagal buat email baru' };
      return {
        success: true,
        data: { mailbox: this.mailbox, messages: [], histories: [] },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async changeEmail(name, domain) {
    // web2 API gratis tidak bisa pilih nama spesifik (butuh premium secret)
    // → buat mailbox baru (random), abaikan name/domain
    return this.deleteEmail();
  }

  async viewMessage(id) {
    await this._ensureInit();
    try {
      const res = await this.session.fetch(`${WEB2_BASE}/messages/${id}`, {
        headers: this._headers(true),
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}` };
      }

      const data = await res.json();

      // Normalisasi field dari web2 API
      const subject = data.subject || '';
      const from    = data.from    || data.fromAddress || '';
      const date    = data.createdAt || data.date || '';
      const body    = data.bodyHtml  || data.bodyText   || data.body || '';

      return { success: true, subject, from, date, body, html: body };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async close() {
    if (this.session) {
      try { await this.session.close(); } catch (_) {}
      this.session = null;
    }
  }
}

module.exports = TempMailOrgScraper;

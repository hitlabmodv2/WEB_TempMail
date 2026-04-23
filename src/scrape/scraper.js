const axios = require('axios');

const BASE_URL = 'https://tmail.etokom.com/';

class TMailScraper {
  constructor() {
    this.cookies = {};
    this.csrfToken = null;
    this.initialized = false;
  }

  _parseCookies(setCookieHeaders) {
    if (!setCookieHeaders) return;
    const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
    for (const header of headers) {
      const parts = header.split(';');
      const [nameVal] = parts;
      const [name, ...rest] = nameVal.split('=');
      this.cookies[name.trim()] = rest.join('=').trim();
    }
  }

  _cookieString() {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  _headers(extra = {}) {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': BASE_URL,
      'Origin': 'https://tmail.etokom.com',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': this._cookieString(),
      ...extra,
    };
  }

  async init() {
    try {
      const res = await axios.get(BASE_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        maxRedirects: 5,
        validateStatus: () => true,
      });

      this._parseCookies(res.headers['set-cookie']);

      const csrfMatch = res.data.match(/content="([^"]+)"[^>]*name="csrf-token"|meta[^>]*name="csrf-token"[^>]*content="([^"]+)"/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1] || csrfMatch[2];
      } else {
        const match = res.data.match(/<meta name="csrf-token" content="([^"]+)"/);
        if (match) this.csrfToken = match[1];
      }

      this.initialized = true;
      return true;
    } catch (err) {
      console.error('Init error:', err.message);
      return false;
    }
  }

  async getMessages() {
    if (!this.initialized) await this.init();

    try {
      const res = await axios.post(BASE_URL + 'get_messages', {
        _token: this.csrfToken,
        captcha: '',
      }, {
        headers: this._headers({
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.csrfToken,
        }),
        maxRedirects: 5,
        validateStatus: () => true,
      });

      this._parseCookies(res.headers['set-cookie']);

      if (res.data && res.data.mailbox) {
        return { success: true, data: res.data };
      }

      return { success: false, error: 'No mailbox in response', raw: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async deleteEmail() {
    if (!this.initialized) await this.init();

    try {
      const res = await axios.post(BASE_URL + 'delete', {
        _token: this.csrfToken,
      }, {
        headers: this._headers({
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.csrfToken,
        }),
        maxRedirects: 5,
        validateStatus: () => true,
      });

      this._parseCookies(res.headers['set-cookie']);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async changeEmail(name, domain) {
    if (!this.initialized) await this.init();

    try {
      const res = await axios.post(BASE_URL + 'change', {
        _token: this.csrfToken,
        name,
        domain,
      }, {
        headers: this._headers({
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.csrfToken,
        }),
        maxRedirects: 5,
        validateStatus: () => true,
      });

      this._parseCookies(res.headers['set-cookie']);

      if (res.data && res.data.mailbox) {
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to change email', raw: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async viewMessage(id) {
    if (!this.initialized) await this.init();

    try {
      const res = await axios.get(BASE_URL + 'view/' + id, {
        headers: this._headers({
          'Accept': 'text/html,application/xhtml+xml',
        }),
        maxRedirects: 5,
        validateStatus: () => true,
      });

      this._parseCookies(res.headers['set-cookie']);

      const bodyMatch = res.data.match(/id="myContent"[^>]*src="([^"]+)"/);
      const srcDoc = res.data.match(/srcdoc="([^"]+)"/);

      let subject = '';
      let from = '';
      let body = '';
      let date = '';

      const subjectMatch = res.data.match(/class="mail-view-header-subject"[^>]*>([^<]+)</);
      if (subjectMatch) subject = subjectMatch[1].trim();

      const fromMatch = res.data.match(/class="mail-view-header-from"[^>]*>[\s\S]*?<span[^>]*>([^<]+)</);
      if (fromMatch) from = fromMatch[1].trim();

      const dateMatch = res.data.match(/class="mail-view-header-date"[^>]*>[\s\S]*?<span[^>]*>([^<]+)</);
      if (dateMatch) date = dateMatch[1].trim();

      if (bodyMatch) {
        const iframeUrl = bodyMatch[1];
        const bodyRes = await axios.get(iframeUrl, {
          headers: this._headers({ 'Accept': 'text/html' }),
          validateStatus: () => true,
        });
        body = bodyRes.data;
      } else {
        const iframeMatch = res.data.match(/<iframe[^>]+id="myContent"[\s\S]*?<\/iframe>/);
        if (iframeMatch) {
          const srcMatch = iframeMatch[0].match(/src="([^"]+)"/);
          if (srcMatch) {
            const bodyRes = await axios.get(srcMatch[1].startsWith('http') ? srcMatch[1] : BASE_URL + srcMatch[1], {
              headers: this._headers({ 'Accept': 'text/html' }),
              validateStatus: () => true,
            });
            body = bodyRes.data;
          }
        }
      }

      return { success: true, subject, from, date, body, html: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = TMailScraper;

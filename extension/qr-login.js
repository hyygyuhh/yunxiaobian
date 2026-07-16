/**
 * 网易云音乐二维码登录（EAPI）
 * 基于 Mine-Radio Bridge 的 eapi.js 移植
 *
 * 依赖：crypto-es.js（通过 importScripts 全局加载 CryptoJS）
 * 通过 importScripts 引入，函数挂载在全局 QrLogin 命名空间
 */

const QrLogin = (() => {
  const EAPI_KEY = 'e82ckenh8dichen8';
  const EAPI_BASE = 'https://interface.music.163.com';
  const EAPI_UA = 'NeteaseMusic 9.0.90/5038 (iPhone; iOS 16.2; zh_CN)';

  // ── EAPI 加密（使用全局 CryptoJS，与 Mine-Radio eapi.js 一致） ──

  function eapiEncrypt(url, object) {
    const text = typeof object === 'object' ? JSON.stringify(object) : String(object || '');
    const message = `nobody${url}use${text}md5forencrypt`;
    const digest = CryptoJS.MD5(message).toString();
    const payload = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(payload),
      CryptoJS.enc.Utf8.parse(EAPI_KEY),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
    );
    return { params: encrypted.ciphertext.toString().toUpperCase() };
  }

  // ── EAPI 请求 ──

  async function eapiRequest(path, data) {
    const uri = path.startsWith('/api/') ? path : `/api/${path.replace(/^\//, '')}`;
    const apiPath = uri.slice(5);
    const encrypted = eapiEncrypt(uri, data || {});
    const resp = await fetch(`${EAPI_BASE}/eapi/${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': EAPI_UA,
        'Cookie': 'os=ios; appver=9.0.90; versioncode=140; channel=distribution',
      },
      body: new URLSearchParams(encrypted).toString(),
      credentials: 'include',
    });

    let body = {};
    try { body = await resp.json(); } catch { body = {}; }

    let setCookies = [];
    try {
      if (resp.headers && typeof resp.headers.getSetCookie === 'function') {
        setCookies = resp.headers.getSetCookie() || [];
      }
    } catch {}

    return { status: resp.status, body, setCookies };
  }

  // ── Cookie 写入 ──

  async function writeLoginCookies(cookieText) {
    const pairs = cookieText.split(';').map(s => s.trim()).filter(Boolean);
    for (const pair of pairs) {
      const eq = pair.indexOf('=');
      if (eq <= 0) continue;
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (!name || !value) continue;

      const urls = [
        'https://music.163.com/',
        'https://interface.music.163.com/',
        'https://interface3.music.163.com/',
        'https://.163.com/',
      ];
      for (const url of urls) {
        try {
          await chrome.cookies.set({
            url, name, value,
            path: '/',
            secure: true,
            httpOnly: name === 'MUSIC_U',
          });
        } catch { /* ignore */ }
      }
    }
  }

  // ── 公共 API ──

  return {
    /**
     * 获取二维码 unikey
     */
    async getQrKey() {
      const { body } = await eapiRequest('/api/login/qrcode/unikey', { type: 3 });
      const key = body.unikey || body.uniKey || (body.data && (body.data.unikey || body.data.uniKey)) || '';
      if (!key) {
        throw new Error(body.message || body.msg || `获取二维码 key 失败 (code=${body.code})`);
      }
      return { key, code: body.code || 200 };
    },

    /**
     * 生成二维码图片 URL
     */
    getQrImage(key) {
      const url = `https://music.163.com/login?codekey=${encodeURIComponent(key)}`;
      return {
        url,
        img: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(url)}`,
      };
    },

    /**
     * 检查二维码扫描状态
     * code: 800=过期, 801=等待扫码, 802=已扫码待确认, 803=登录成功
     */
    async checkQrStatus(key) {
      key = String(key || '').trim();
      if (!key) return { code: 800, message: '缺少二维码 key', loggedIn: false };

      let body = {};
      let setCookies = [];

      try {
        const raw = await eapiRequest('/api/login/qrcode/client/login', { key, type: 3 });
        body = raw.body || {};
        setCookies = raw.setCookies || [];
      } catch (err) {
        return {
          code: 801,
          message: err?.message || '扫码状态查询失败',
          loggedIn: false,
        };
      }

      const code = Number(body.code || 0);
      const profile = body.profile || (body.data && body.data.profile) || {};

      let cookieText = '';
      if (Array.isArray(body.cookie)) {
        cookieText = body.cookie.filter(Boolean).join('; ');
      } else {
        cookieText = String(body.cookie || (body.data && body.data.cookie) || '').trim();
      }
      if (!cookieText && setCookies.length) {
        cookieText = setCookies.map(c => String(c || '').split(';')[0]).filter(Boolean).join('; ');
      }

      if (code === 803) {
        if (cookieText) {
          await writeLoginCookies(cookieText);
        }
        return {
          code: 803,
          message: body.message || '授权登录成功',
          nickname: profile.nickname || body.nickname || '',
          avatar: profile.avatarUrl || body.avatarUrl || '',
          loggedIn: true,
          cookie: cookieText,
        };
      }

      return {
        code,
        message: body.message || ({
          800: '二维码已过期',
          801: '等待扫码',
          802: '已扫码，请在手机上确认',
        }[code] || ''),
        nickname: profile.nickname || '',
        avatar: profile.avatarUrl || '',
        loggedIn: false,
      };
    },
  };
})();

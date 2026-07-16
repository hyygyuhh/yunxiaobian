importScripts('api.bundle.js')

const NETEASE_URLS = [
  'https://music.163.com/',
  'https://music.163.com',
  'https://music.163.com/weapi/',
  'https://interface.music.163.com/',
  'https://interface3.music.163.com/',
  'https://y.music.163.com/',
  'https://y.music.163.com',
]

const NETEASE_DOMAINS = ['music.163.com', '.music.163.com', '163.com', '.163.com']

const ORDERED_KEYS = [
  'MUSIC_U',
  '__csrf',
  'NMTID',
  'MUSIC_A',
  'sDeviceId',
  'WM_NI',
  'WM_NIKE',
  'WEVNSM',
  'WNMCID',
]

function mergeCookies(map, cookies = []) {
  for (const cookie of cookies) {
    if (!cookie?.name) continue
    const prev = map.get(cookie.name)
    if (!prev || (cookie.value?.length || 0) > (prev.value?.length || 0)) {
      map.set(cookie.name, cookie.value)
    }
  }
}

function mergeDocumentCookie(map, docCookie) {
  if (!docCookie) return
  for (const part of docCookie.split(';')) {
    const segment = part.trim()
    if (!segment) continue
    const eqIndex = segment.indexOf('=')
    if (eqIndex <= 0) continue
    const key = segment.slice(0, eqIndex).trim()
    const value = segment.slice(eqIndex + 1).trim()
    if (key && value) map.set(key, value)
  }
}

async function collectCookiesFromUrl(map, url) {
  try {
    const cookies = await chrome.cookies.getAll({ url })
    mergeCookies(map, cookies)
  } catch {
    // ignore invalid url
  }

  for (const name of ['MUSIC_U', '__csrf', 'NMTID']) {
    try {
      const item = await chrome.cookies.get({ url, name })
      if (item?.value) map.set(name, item.value)
    } catch {
      // ignore
    }
  }
}

async function readPageCookie(tabId) {
  if (!tabId) return ''
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.cookie,
    })
    return result || ''
  } catch {
    return ''
  }
}

async function getNeteaseCookies(options = {}) {
  const map = new Map()

  for (const url of NETEASE_URLS) {
    await collectCookiesFromUrl(map, url)
  }

  for (const domain of NETEASE_DOMAINS) {
    try {
      const cookies = await chrome.cookies.getAll({ domain })
      mergeCookies(
        map,
        cookies.filter((c) => c.domain?.includes('163.com')),
      )
    } catch {
      // ignore
    }
  }

  if (options.tabUrl?.includes('163.com')) {
    await collectCookiesFromUrl(map, options.tabUrl)
  }

  if (options.tabId) {
    mergeDocumentCookie(map, await readPageCookie(options.tabId))
  }

  const used = new Set()
  const parts = []

  for (const name of ORDERED_KEYS) {
    if (map.has(name)) {
      parts.push(`${name}=${map.get(name)}`)
      used.add(name)
    }
  }

  for (const [name, value] of map.entries()) {
    if (!used.has(name)) parts.push(`${name}=${value}`)
  }

  const hasMusicU = Boolean(map.get('MUSIC_U'))
  const hasCsrf = Boolean(map.get('__csrf'))
  const names = [...map.keys()]

  return {
    cookieString: parts.join('; '),
    hasMusicU,
    hasCsrf,
    count: map.size,
    names,
  }
}

async function copyText(text) {
  const tabs = await chrome.tabs.query({
    url: [
      'https://music.163.com/*',
      'https://*.music.163.com/*',
      'http://localhost:3100/*',
      'http://127.0.0.1:3100/*',
    ],
  })

  if (tabs.length) {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (value) => navigator.clipboard.writeText(value),
      args: [text],
    })
    return true
  }

  return false
}

async function copyCookie(showNotice = true, options = {}) {
  const { cookieString, hasMusicU, hasCsrf, names } =
    await getNeteaseCookies(options)
  if (!hasMusicU) {
    const hint = names.length
      ? `已检测到 ${names.join(', ')}，但缺少 MUSIC_U`
      : '未检测到任何网易云 Cookie'
    return {
      ok: false,
      error: `${hint}。请先在浏览器打开 music.163.com 并完成网页登录（不是客户端 App）`,
      names,
      hasCsrf,
    }
  }

  const copied = await copyText(cookieString)
  if (!copied) {
    return {
      ok: false,
      error: '复制失败，请先打开 music.163.com 或 localhost:3100 页面后重试',
      hasCsrf,
    }
  }

  if (showNotice) {
    chrome.notifications.create(`copy-${Date.now()}`, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: '网易云 Cookie 助手',
      message: hasCsrf
        ? 'Cookie 已复制到剪贴板'
        : 'Cookie 已复制（缺少 __csrf，服务端将尝试自动补全）',
    })
  }

  await chrome.storage.local.set({
    lastCookie: cookieString,
    lastCopyAt: Date.now(),
  })

  return { ok: true, cookieString, hasMusicU: true, hasCsrf }
}

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (changeInfo.removed) return
  if (!changeInfo.cookie.domain?.includes('163.com')) return
  if (!['MUSIC_U', '__csrf', 'MUSIC_A'].includes(changeInfo.cookie.name)) return

  const { autoCopy } = await chrome.storage.sync.get({ autoCopy: true })
  if (!autoCopy) return
  if (changeInfo.cookie.name !== 'MUSIC_U') return

  await copyCookie(true)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const options = {
    tabUrl: message.tabUrl,
    tabId: sender.tab?.id,
  }

  if (message.type === 'GET_COOKIE') {
    getNeteaseCookies(options)
      .then(({ cookieString, hasMusicU, hasCsrf, count, names }) => {
        sendResponse({ ok: hasMusicU, cookieString, hasMusicU, hasCsrf, count, names })
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }))
    return true
  }

  if (message.type === 'COPY_COOKIE') {
    copyCookie(message.showNotice !== false, options)
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, error: err.message }))
    return true
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get({ autoCopy: true }).then(sendResponse)
    return true
  }

  if (message.type === 'SET_AUTO_COPY') {
    chrome.storage.sync
      .set({ autoCopy: !!message.autoCopy })
      .then(() => sendResponse({ ok: true }))
    return true
  }

  if (message.type === 'API') {
    handleExtensionApi(message.request)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: err.message || String(err) }))
    return true
  }

  if (message.type === 'OPEN_APP') {
    chrome.tabs.create({ url: chrome.runtime.getURL('app/index.html') })
    sendResponse({ ok: true })
    return true
  }
})

async function handleExtensionApi(request = {}) {
  if (!globalThis.NeApiRouter?.handleApiRequest) {
    throw new Error('扩展 API 未加载，请在项目目录运行 npm run build:extension')
  }

  const result = await NeApiRouter.handleApiRequest(request)

  if (result?.headers?.['x-ne-binary'] === '1' && result.body) {
    const bytes =
      result.body instanceof Uint8Array
        ? result.body
        : new Uint8Array(result.body.buffer || result.body)
    return {
      status: result.status,
      headers: result.headers,
      body: Array.from(bytes),
      binary: true,
    }
  }

  return result
}

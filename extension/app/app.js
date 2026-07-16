const COOKIE_KEY = 'ncm_cookie'
const PROFILE_CACHE_KEY = 'ncm_profile_cache'
const HIDDEN_SHEET_IDS_KEY = 'ncm_hidden_sheet_ids'
const SHEET_UPLOAD_TIMES_KEY = 'ncm_sheet_upload_times'

const COVER_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="#f0f0f0" width="80" height="80" rx="6"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#999" font-size="28" font-family="sans-serif">♪</text></svg>',
  )

function normalizeCoverUrl(cover) {
  if (!cover) return ''
  const base = String(cover).replace(/\?.*$/, '')
  return `${base}?param=80y80`
}

function songCoverUrl(cover) {
  const full = normalizeCoverUrl(cover)
  if (!full) return COVER_PLACEHOLDER
  if (/music\.126\.net/i.test(full)) {
    return `/api/img?url=${encodeURIComponent(full)}`
  }
  return full
}

function bindSongCover(img, cover) {
  const direct = normalizeCoverUrl(cover)
  img.src = songCoverUrl(cover)
  img.referrerPolicy = 'no-referrer'
  img.onerror = () => {
    if (img.src.includes('/api/img') && direct) {
      img.onerror = () => {
        img.onerror = null
        img.src = COVER_PLACEHOLDER
      }
      img.src = direct
      return
    }
    img.onerror = null
    img.src = COVER_PLACEHOLDER
  }
}

const urlInput = document.getElementById('urlInput')
const keywordInput = document.getElementById('keywordInput')
const excludeLiveSongs = document.getElementById('excludeLiveSongs')
const excludeNoCopyrightSongs = document.getElementById('excludeNoCopyrightSongs')
const excludeCoverSongs = document.getElementById('excludeCoverSongs')
const excludeCompilationAlbumSongs = document.getElementById('excludeCompilationAlbumSongs')
const excludeAccompanimentSongs = document.getElementById('excludeAccompanimentSongs')
const excludeAccompanimentWrap = document.getElementById('excludeAccompanimentWrap')
const searchScopeInputs = document.querySelectorAll('input[name="searchScope"]')
const chartSelect = document.getElementById('chartSelect')
const scanLimit = document.getElementById('scanLimit')
const linkPanel = document.getElementById('linkPanel')
const searchPanel = document.getElementById('searchPanel')
const chartPanel = document.getElementById('chartPanel')
const modeButtons = document.querySelectorAll('.mode-btn')
const analyzeBtn = document.getElementById('analyzeBtn')
const onlyWithSheets = document.getElementById('onlyWithSheets')
const filterBar = document.getElementById('filterBar')
const filterSection = document.getElementById('filterSection')
const saveSection = document.getElementById('saveSection')
const modeDesc = document.getElementById('modeDesc')
const analyzeBtnLabel = analyzeBtn.querySelector('.btn-label')
const filterMaxTotal = document.getElementById('filterMaxTotal')
const filterMaxPiano = document.getElementById('filterMaxPiano')
const maxTotalInput = document.getElementById('maxTotalInput')
const maxPianoInput = document.getElementById('maxPianoInput')
const excludeNotUploadableSongs = document.getElementById('excludeNotUploadableSongs')
const createPlaylistBar = document.getElementById('createPlaylistBar')
const playlistNameInput = document.getElementById('playlistNameInput')
const privatePlaylist = document.getElementById('privatePlaylist')
const createPlaylistBtn = document.getElementById('createPlaylistBtn')
const createPlaylistHint = document.getElementById('createPlaylistHint')
const createPlaylistFields = document.getElementById('createPlaylistFields')
const existingPlaylistFields = document.getElementById('existingPlaylistFields')
const existingPlaylistSelect = document.getElementById('existingPlaylistSelect')
const refreshPlaylistsBtn = document.getElementById('refreshPlaylistsBtn')
const playlistModeInputs = document.querySelectorAll('input[name="playlistMode"]')
const statusEl = document.getElementById('status')
const summaryEl = document.getElementById('summary')
const sourceInfoEl = document.getElementById('sourceInfo')
const resultsSectionEl = document.getElementById('resultsSection')
const resultsEl = document.getElementById('results')
const songCardTpl = document.getElementById('songCardTpl')
const loginBtn = document.getElementById('loginBtn')
const logoutBtn = document.getElementById('logoutBtn')
const loginGuest = document.getElementById('loginGuest')
const loginUser = document.getElementById('loginUser')
const loginNickname = document.getElementById('loginNickname')
const loginAvatar = document.getElementById('loginAvatar')
const cookieModal = document.getElementById('cookieModal')
const cookieInput = document.getElementById('cookieInput')
const cookieStatus = document.getElementById('cookieStatus')
const confirmCookieBtn = document.getElementById('confirmCookieBtn')
const closeCookieBtn = document.getElementById('closeCookieBtn')
const analyzePanel = document.getElementById('analyzePanel')
const sheetPanel = document.getElementById('sheetPanel')
const sheetPermission = document.getElementById('sheetPermission')
const sheetUploadForm = document.getElementById('sheetUploadForm')
const sheetSongId = document.getElementById('sheetSongId')
const sheetName = document.getElementById('sheetName')
const sheetType = document.getElementById('sheetType')
const sheetKind = document.getElementById('sheetKind')
const sheetMusicKey = document.getElementById('sheetMusicKey')
const sheetPlayVersion = document.getElementById('sheetPlayVersion')
const sheetPdfFile = document.getElementById('sheetPdfFile')
const checkSheetPermBtn = document.getElementById('checkSheetPermBtn')
const submitSheetBtn = document.getElementById('submitSheetBtn')
const sheetUploadHint = document.getElementById('sheetUploadHint')
const sheetUploadStatus = document.getElementById('sheetUploadStatus')
const batchFolderInput = document.getElementById('batchFolderInput')
const batchMaxItems = document.getElementById('batchMaxItems')
const batchIntervalSec = document.getElementById('batchIntervalSec')
const batchSearchIntervalSec = document.getElementById('batchSearchIntervalSec')
const batchInstrumentType = document.getElementById('batchInstrumentType')
const batchKindJianpu = document.getElementById('batchKindJianpu')
const batchKindWuxian = document.getElementById('batchKindWuxian')
const batchSkipUnmatched = document.getElementById('batchSkipUnmatched')
const batchScanBtn = document.getElementById('batchScanBtn')
const batchResolveBtn = document.getElementById('batchResolveBtn')
const batchStartBtn = document.getElementById('batchStartBtn')
const batchStopBtn = document.getElementById('batchStopBtn')
const batchUploadStatus = document.getElementById('batchUploadStatus')
const batchUploadSummary = document.getElementById('batchUploadSummary')
const batchUploadList = document.getElementById('batchUploadList')
const ugcPanel = document.getElementById('ugcPanel')
const ugcProfile = document.getElementById('ugcProfile')
const ugcDailyReward = document.getElementById('ugcDailyReward')
const ugcAuditTasks = document.getElementById('ugcAuditTasks')
const ugcOfficialTasks = document.getElementById('ugcOfficialTasks')
const ugcHonorRoll = document.getElementById('ugcHonorRoll')
const ugcExamPanel = document.getElementById('ugcExamPanel')
const ugcExamContent = document.getElementById('ugcExamContent')
const ugcExamCloseBtn = document.getElementById('ugcExamCloseBtn')
const ugcExamPanelTitle = document.getElementById('ugcExamPanelTitle')
const ugcAuditHistory = document.getElementById('ugcAuditHistory')
const ugcAuditHistorySummary = document.getElementById('ugcAuditHistorySummary')
const ugcRefreshAuditHistoryBtn = document.getElementById('ugcRefreshAuditHistoryBtn')
const ugcAuditHistoryCollapse = document.getElementById('ugcAuditHistoryCollapse')
const ugcClaimVipBtn = document.getElementById('ugcClaimVipBtn')
const ugcIntegration = document.getElementById('ugcIntegration')
const ugcLottery = document.getElementById('ugcLottery')
const ugcMall = document.getElementById('ugcMall')
const ugcRefreshLotteryBtn = document.getElementById('ugcRefreshLotteryBtn')
const ugcRefreshMallBtn = document.getElementById('ugcRefreshMallBtn')
const ugcSignBtn = document.getElementById('ugcSignBtn')
const loadIntegrationBtn = document.getElementById('loadIntegrationBtn')
const ugcType = document.getElementById('ugcType')
const ugcAudit = document.getElementById('ugcAudit')
const ugcAuditField = document.getElementById('ugcAuditField')
const loadUgcBtn = document.getElementById('loadUgcBtn')
const ugcList = document.getElementById('ugcList')
const previewModal = document.getElementById('previewModal')
const previewTitle = document.getElementById('previewTitle')
const previewMeta = document.getElementById('previewMeta')
const previewPages = document.getElementById('previewPages')
const closePreviewBtn = document.getElementById('closePreviewBtn')
const wikiModal = document.getElementById('wikiModal')
const wikiTitle = document.getElementById('wikiTitle')
const wikiContent = document.getElementById('wikiContent')
const closeWikiBtn = document.getElementById('closeWikiBtn')
const mallModal = document.getElementById('mallModal')
const mallModalTitle = document.getElementById('mallModalTitle')
const mallModalBody = document.getElementById('mallModalBody')
const mallModalFooter = document.getElementById('mallModalFooter')
const mallModalBackBtn = document.getElementById('mallModalBackBtn')
const closeMallModalBtn = document.getElementById('closeMallModalBtn')
const ugcOpenMallModalBtn = document.getElementById('ugcOpenMallModalBtn')
const tabButtons = document.querySelectorAll('.tab')
const backToTopBtn = document.getElementById('backToTopBtn')
const ugcRefreshAllBtn = document.getElementById('ugcRefreshAllBtn')

const TAB_STORAGE_KEY = 'ne_active_tab'
const UGC_SECTION_IDS = [
  'ugcSectionOverview',
  'ugcSectionReward',
  'ugcSectionLottery',
  'ugcSectionMall',
  'ugcSectionAudit',
  'ugcSectionOfficial',
  'ugcSectionHonor',
  'ugcSectionRecords',
]

let modalScrollLock = 0
let ugcNavObserver = null
let activeTab = 'analyze'
let inputMode = 'link'
let ugcOffset = 0
let ugcDashboard = null
let ugcExamState = null
let ugcAuditHistoryLoaded = false
let ugcHonorType = 0
let userPlaylists = []
let sheetUploadOffset = 0
let sheetUploadConfig = null
let batchJobs = []
let batchFileMap = new Map()
let batchAbort = null
let uploadedSheetKeyCache = null
let lastData = null

const MALL_INLINE_PAGE_SIZE = 6
const MALL_MODAL_PAGE_SIZE = 8
const INTEGRATION_PAGE_SIZE = 10
const UGC_LIST_PAGE_SIZE = 20
const SHEET_UPLOAD_PAGE_SIZE = 20

let mallProductEntries = []
let mallInlinePage = 1
let mallModalPage = 1
let mallModalView = 'list'
let mallModalProductIndex = null
let integrationPage = 1
let integrationTotal = 0
let ugcListPage = 1
let ugcListTotal = 0
let sheetUploadPage = 1
let sheetUploadTotal = 0

function buildPaginationHtml({ page, pageSize, total, id }) {
  if (!total || total <= pageSize) return ''
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return `
    <nav class="ui-pagination" data-pagination-id="${escapeHtml(id)}" aria-label="分页">
      <button type="button" class="btn-secondary btn-sm ui-page-btn" data-page="prev" ${safePage <= 1 ? 'disabled' : ''}>上一页</button>
      <span class="ui-page-info">${safePage} / ${totalPages}</span>
      <button type="button" class="btn-secondary btn-sm ui-page-btn" data-page="next" ${safePage >= totalPages ? 'disabled' : ''}>下一页</button>
    </nav>
  `
}

function bindPagination(container, id, pageSize, getPage, setPage, getTotal, onPageChange) {
  if (!container) return
  container.querySelectorAll(`[data-pagination-id="${id}"]`).forEach((nav) => {
    if (nav.dataset.bound === '1') return
    nav.dataset.bound = '1'
    nav.addEventListener('click', (event) => {
      const btn = event.target.closest('.ui-page-btn')
      if (!btn || btn.disabled) return
      const total = getTotal()
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      let nextPage = getPage()
      if (btn.dataset.page === 'prev') nextPage -= 1
      if (btn.dataset.page === 'next') nextPage += 1
      nextPage = Math.min(Math.max(1, nextPage), totalPages)
      if (nextPage === getPage()) return
      setPage(nextPage)
      onPageChange(nextPage)
    })
  })
}

function paginateItems(items, page, pageSize) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    total,
    totalPages,
  }
}

function flattenMallProducts(mall) {
  const entries = []
  for (const item of mall?.inStock || []) entries.push({ item, soldOut: false })
  for (const item of mall?.outStock || []) entries.push({ item, soldOut: true })
  return entries
}

function buildUploadListKey(songId, kindCode) {
  return `${String(songId)}:${String(kindCode ?? '')}`
}

function getBatchJobKind(job) {
  return job.format === 'wuxian'
    ? Number(batchKindWuxian?.value || 5)
    : Number(batchKindJianpu?.value || 1)
}
let batchLimits = {
  MAX_ITEMS: 50,
  DEFAULT_MAX_ITEMS: 20,
  MIN_INTERVAL_MS: 5000,
  DEFAULT_INTERVAL_MS: 10000,
  MAX_INTERVAL_MS: 120000,
  MIN_SEARCH_INTERVAL_MS: 2000,
  DEFAULT_SEARCH_INTERVAL_MS: 3000,
}

const SHEET_UPLOAD_STATUS = {
  0: '待审核',
  1: '审核中',
  4: '部分通过',
  5: '审核通过',
  '-5': '未通过',
}

function getCookie() {
  return localStorage.getItem(COOKIE_KEY) || ''
}

function formatMusicKeyLabel(key) {
  if (globalThis.MusicKey?.formatMusicKeyLabel) {
    return globalThis.MusicKey.formatMusicKeyLabel(key)
  }
  const raw = String(key || '').trim()
  if (!raw) return ''
  return /调$/u.test(raw) ? raw : `${raw}调`
}

function normalizeMusicKeyForUpload(key) {
  if (globalThis.MusicKey?.normalizeMusicKeyForUpload) {
    return globalThis.MusicKey.normalizeMusicKeyForUpload(key)
  }
  return String(key || '').trim().replace(/调+$/u, '')
}

function resolveAppSheetNameFromTypeSelect(selectEl) {
  if (!selectEl?.value) return '乐谱'
  const label = selectEl.selectedOptions?.[0]?.textContent?.trim() || ''
  if (!label) return '乐谱'
  return label.endsWith('谱') ? label : `${label}谱`
}

function syncManualSheetName() {
  if (!sheetName) return
  sheetName.value = resolveAppSheetNameFromTypeSelect(sheetType)
}

function getHiddenSheetIds() {
  try {
    const raw = localStorage.getItem(HIDDEN_SHEET_IDS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(list) ? list.map(String) : [])
  } catch {
    return new Set()
  }
}

function hideSheetFromList(sheetId) {
  if (!sheetId) return
  const hidden = getHiddenSheetIds()
  hidden.add(String(sheetId))
  localStorage.setItem(HIDDEN_SHEET_IDS_KEY, JSON.stringify([...hidden]))
}

function filterHiddenSheetItems(items = []) {
  const hidden = getHiddenSheetIds()
  if (!hidden.size) return items
  return items.filter((item) => !hidden.has(String(item.id)))
}

function readSheetUploadTimeMap() {
  try {
    const raw = localStorage.getItem(SHEET_UPLOAD_TIMES_KEY)
    const map = raw ? JSON.parse(raw) : {}
    return map && typeof map === 'object' ? map : {}
  } catch {
    return {}
  }
}

function recordSheetUploadTime(songId, sheetId, timestamp = Date.now()) {
  const map = readSheetUploadTimeMap()
  if (songId) map[`song:${songId}`] = timestamp
  if (sheetId) map[`sheet:${sheetId}`] = timestamp
  localStorage.setItem(SHEET_UPLOAD_TIMES_KEY, JSON.stringify(map))
}

function resolveSheetUploadTime(item = {}) {
  if (item.createTime) return item.createTime
  const map = readSheetUploadTimeMap()
  return map[`sheet:${item.id}`] || map[`song:${item.songId}`] || null
}

function enrichSheetUploadTimes(items = []) {
  return items.map((item) => {
    const createTime = resolveSheetUploadTime(item)
    return createTime ? { ...item, createTime } : item
  })
}

function formatClientError(value, fallback = '请求失败') {
  if (value == null || value === '') return fallback
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text || text === '[object Object]') return fallback
    return text
  }
  if (value instanceof Error) {
    const msg = value.message
    if (msg && msg !== '[object Object]') return msg
    return fallback
  }
  if (typeof value === 'object') {
    const nested = value.error ?? value.message ?? value.msg ?? value.reason
    if (nested != null && nested !== value) {
      const nestedText = formatClientError(nested, '')
      if (nestedText) return nestedText
    }
    try {
      const json = JSON.stringify(value)
      if (json && json !== '{}' && json !== '[object Object]') {
        return json.length > 240 ? `${json.slice(0, 240)}…` : json
      }
    } catch {
      // ignore
    }
  }
  return fallback
}

async function parseJsonResponse(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    const staleServer = /Cannot POST \/api\//i.test(text)
    if (text.trimStart().startsWith('<')) {
      throw new Error(
        staleServer
          ? '本地服务版本过旧，请在项目目录执行 npm start 重启（http://localhost:3100）'
          : '服务返回了 HTML 而非 JSON，请确认 npm start 已启动',
      )
    }
    throw new Error(`无法解析服务响应 (${res.status})`)
  }
}

function isRetryableClientError(message) {
  return /ECONNRESET|ETIMEDOUT|ECONNREFUSED|502|503|504|timeout|aborted|socket hang up|暂时不可用|上游无响应|HTML|无法解析|版本过旧|fetch|服务繁忙|频繁|Unexpected end/i.test(
    String(message || ''),
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPostApi(url, body, { retries = 3 } = {}) {
  let lastErr
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await parseJsonResponse(res)
      if (!data.ok) {
        const errMsg = formatClientError(data.error, `请求失败 (${res.status})`)
        if (attempt < retries - 1 && isRetryableClientError(errMsg)) {
          await sleep(500 * (attempt + 1))
          continue
        }
        throw new Error(errMsg)
      }
      return data
    } catch (err) {
      lastErr = err
      const msg = err?.message || String(err)
      const retryable =
        isRetryableClientError(msg) || err?.name === 'TypeError' || /failed to fetch/i.test(msg)
      if (attempt < retries - 1 && retryable) {
        await sleep(500 * (attempt + 1))
        continue
      }
      throw err
    }
  }
  throw lastErr
}

let serverFeatures = null

async function preloadServerFeatures() {
  try {
    const res = await fetch('/api/health')
    const data = await parseJsonResponse(res)
    if (data.ok) serverFeatures = data.features || []
  } catch {
    serverFeatures = null
  }
}

async function ensureServerReady(requiredFeatures = []) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (!serverFeatures) {
      await preloadServerFeatures()
    }
    if (serverFeatures) {
      const missing = requiredFeatures.filter((f) => !serverFeatures.includes(f))
      if (!missing.length) return
      serverFeatures = null
    }
    if (attempt < 2) await sleep(300)
  }
  if (!serverFeatures) {
    throw new Error('无法连接本地服务，请先运行 npm start（http://localhost:3100）')
  }
  throw new Error(
    '本地服务版本过旧，请在项目目录执行 npm start 重启（http://localhost:3100）',
  )
}

function setCookie(cookie) {
  if (cookie) localStorage.setItem(COOKIE_KEY, cookie)
}

/** Update stored cookie without dropping APP deviceId / android fields. */
function setCookieMerged(nextCookie) {
  if (!nextCookie) return
  const current = getCookie()
  if (current && (/(?:^|;\s*)deviceId=/i.test(current) || /(?:^|;\s*)sDeviceId=/i.test(current))) {
    setCookie(mergePreservingAppCookie(current, nextCookie))
  } else {
    setCookie(nextCookie)
  }
}

function clearCookie() {
  localStorage.removeItem(COOKIE_KEY)
  clearLoginProfileCache()
}

function sanitizeCookieInput(raw) {
  let text = String(raw || '')
    .trim()
    .replace(/^cookie:\s*/i, '')

  text = text.replace(/\r\n/g, '\n')
  text = text.replace(/\n(?=[A-Za-z_][A-Za-z0-9_]*=)/g, '; ')
  text = text.replace(/[\r\n\t]+/g, '')

  text = text
    .replace(/\s*;\s*/g, '; ')
    .replace(/^;\s*|;\s*$/g, '')
    .trim()

  const xMusicU = text.match(/(?:^|[;\s])x-music-u[=:]\s*([A-Za-z0-9]+)/i)
  if (xMusicU && !/(?:^|;)\s*MUSIC_U=/i.test(text)) {
    text = `${text}; MUSIC_U=${xMusicU[1]}`
  }

  return text
}

function parseCookiePairs(raw) {
  const map = new Map()
  for (const part of String(raw || '').split(';')) {
    const segment = part.trim()
    if (!segment) continue
    const eq = segment.indexOf('=')
    if (eq <= 0) continue
    map.set(segment.slice(0, eq).trim(), segment.slice(eq + 1).trim())
  }
  return map
}

function cookiePairsToString(map) {
  return [...map.entries()]
    .filter(([k, v]) => k && v != null && v !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join('; ')
}

function isAppCookieString(raw) {
  const text = String(raw || '')
  return /(?:^|;\s*)deviceId=/i.test(text) || /(?:^|;\s*)sDeviceId=/i.test(text)
}

/** Keep APP xeapi fields from the pasted cookie; never let web login wipe MUSIC_U. */
function mergePreservingAppCookie(pasted, serverCookie) {
  const original = parseCookiePairs(sanitizeCookieInput(pasted))
  const server = parseCookiePairs(serverCookie || '')
  const hasAppDevice = original.has('deviceId') || original.has('sDeviceId')
  if (!hasAppDevice) {
    return cookiePairsToString(server.size ? server : original) || String(pasted || '').trim()
  }

  // Lock APP identity tokens. Web login_status Set-Cookie / PC normalize often returns
  // a different (or empty) MUSIC_U and forces os=pc — that marks cookie「失效」for xeapi.
  for (const key of ['__csrf', 'NMTID']) {
    if (server.has(key) && server.get(key)) original.set(key, server.get(key))
  }
  return cookiePairsToString(original)
}

function getCookiePasteStats(raw) {
  const sanitized = sanitizeCookieInput(raw)
  const musicU = sanitized.match(/(?:^|;\s*)MUSIC_U=([^;]+)/i)?.[1] || ''
  const musicA = sanitized.match(/(?:^|;\s*)MUSIC_A=([^;]+)/i)?.[1] || ''
  const deviceId = sanitized.match(/(?:^|;\s*)deviceId=([^;]+)/i)?.[1] || ''
  const sDeviceId = sanitized.match(/(?:^|;\s*)sDeviceId=([^;]+)/i)?.[1] || ''
  return {
    length: sanitized.length,
    musicULength: musicU.length,
    musicALength: musicA.length,
    hasMusicU: Boolean(musicU),
    hasMusicA: Boolean(musicA),
    hasDeviceId: Boolean(deviceId || sDeviceId),
  }
}

function cacheLoginProfile(data = {}) {
  if (!data.nickname) return
  try {
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify({
        nickname: data.nickname,
        avatarUrl: data.avatarUrl || '',
      }),
    )
  } catch {
    // ignore quota errors
  }
}

function getCachedLoginProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function clearLoginProfileCache() {
  localStorage.removeItem(PROFILE_CACHE_KEY)
}

function isAuthCookieError(message) {
  return /Cookie 无效|Cookie 已失效|未登录|MUSIC_U|MUSIC_A|登录状态无效|请先登录|401|403/i.test(
    String(message || ''),
  )
}

function showLoginGuestUI() {
  loginGuest?.classList.remove('hidden')
  loginUser?.classList.add('hidden')
  setUserAvatar('', '')
}

function showLoginUserUI(nickname, avatarUrl) {
  if (loginNickname) loginNickname.textContent = nickname || '已登录'
  setUserAvatar(avatarUrl || '', nickname || '')
  loginGuest?.classList.add('hidden')
  loginUser?.classList.remove('hidden')
}

function applyCachedLoginUI(fallback = false) {
  const cached = getCachedLoginProfile()
  if (cached?.nickname) {
    showLoginUserUI(cached.nickname, cached.avatarUrl)
    return true
  }
  if (fallback && getCookie()) {
    showLoginUserUI('已登录', '')
    return true
  }
  return false
}

function setStatus(text, loading = false) {
  statusEl.textContent = text
  statusEl.classList.remove('hidden', 'loading', 'success-link')
  statusEl.classList.toggle('loading', loading)
}

function hideStatus() {
  statusEl.classList.add('hidden')
}

function showSuccess(message, link) {
  statusEl.className = 'status success-link'
  statusEl.innerHTML = `${escapeHtml(message)}${
    link ? ` · <a href="${escapeHtml(link)}" target="_blank" rel="noopener">打开歌单</a>` : ''
  }`
  statusEl.classList.remove('hidden')
}

let toastTimer = null
function showToast(message, type = 'info') {
  let el = document.getElementById('appToast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'appToast'
    el.className = 'app-toast'
    el.setAttribute('role', 'status')
    el.setAttribute('aria-live', 'polite')
    document.body.appendChild(el)
  }
  el.textContent = message
  el.className = `app-toast ${type} visible`
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3200)
}

function lockPageScroll() {
  modalScrollLock += 1
  document.body.classList.add('modal-open')
}

function unlockPageScroll() {
  modalScrollLock = Math.max(0, modalScrollLock - 1)
  if (modalScrollLock === 0) document.body.classList.remove('modal-open')
}

function openUgcCollapse(id) {
  document.getElementById(id)?.setAttribute('open', '')
}

function scrollToUgcSection(id, options = {}) {
  const el = document.getElementById(id)
  if (!el) return
  el.querySelectorAll('details.ugc-collapse, details.panel-collapse').forEach((node) => {
    node.open = true
  })
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  document.querySelectorAll('.ugc-section-link').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.ugcTarget === id)
  })
  if (options.openMallModal && id === 'ugcSectionMall') {
    if (ugcDashboard?.mall) openMallModal('list')
    else if (getCookie()) loadUgcMall().then(() => openMallModal('list'))
  }
  if (id === 'ugcSectionAuditHistory' && getCookie() && !ugcAuditHistoryLoaded) {
    loadUgcAuditHistory()
  }
}

function setUgcCollapseSummary(id, text) {
  const el = document.getElementById(id)
  if (el) el.textContent = text || ''
}

function updateUgcMallSummary(mall, options = {}) {
  if (options.needLogin) {
    setUgcCollapseSummary('ugcMallSummary', '登录后查看')
    return
  }
  if (options.loading) {
    setUgcCollapseSummary('ugcMallSummary', '加载中…')
    return
  }
  if (options.error) {
    setUgcCollapseSummary('ugcMallSummary', '加载失败')
    return
  }
  if (!mall) {
    setUgcCollapseSummary('ugcMallSummary', '点击展开查看商品')
    return
  }
  const inStock = mall.inStock?.length || 0
  const outStock = mall.outStock?.length || 0
  if (!inStock && !outStock) {
    setUgcCollapseSummary('ugcMallSummary', '暂无商品')
    return
  }
  const parts = [`${inStock} 件可兑`]
  if (outStock) parts.push(`${outStock} 件已兑完`)
  setUgcCollapseSummary('ugcMallSummary', parts.join(' · '))
}

function updateUgcHonorSummary(records = [], typeName = '', options = {}) {
  if (options.loading) {
    setUgcCollapseSummary('ugcHonorSummary', '加载中…')
    return
  }
  if (!records.length) {
    setUgcCollapseSummary('ugcHonorSummary', typeName ? `${typeName} · 暂无数据` : '点击展开查看排名')
    return
  }
  const top = records[0]
  const label = typeName || '榜单'
  setUgcCollapseSummary(
    'ugcHonorSummary',
    `${label} · ${records.length} 人 · 榜首 ${top.points ?? 0} 分`,
  )
}

function updateUgcLotterySummary(lottery, options = {}) {
  if (options.needLogin) {
    setUgcCollapseSummary('ugcLotterySummary', '登录后查看')
    return
  }
  if (options.loading) {
    setUgcCollapseSummary('ugcLotterySummary', '加载中…')
    return
  }
  if (options.error) {
    setUgcCollapseSummary('ugcLotterySummary', '加载失败')
    return
  }
  if (!lottery?.prizes?.length && lottery?.remainChance == null) {
    setUgcCollapseSummary('ugcLotterySummary', '点击展开')
    return
  }
  const remain = lottery.remainChance != null ? `剩余 ${lottery.remainChance} 次` : '免费/积分抽奖'
  const prizeCount = lottery.prizes?.length ? `${lottery.prizes.length} 个奖品` : ''
  setUgcCollapseSummary('ugcLotterySummary', [remain, prizeCount].filter(Boolean).join(' · '))
}

function updateUgcOfficialSummary(tasks = []) {
  if (!tasks.length) {
    setUgcCollapseSummary('ugcOfficialSummary', '暂无任务')
    return
  }
  setUgcCollapseSummary('ugcOfficialSummary', `${tasks.length} 个官方任务`)
}

function updateUgcRecordsSummary(items = [], options = {}) {
  if (options.loading) {
    setUgcCollapseSummary('ugcRecordsSummary', '加载中…')
    return
  }
  if (!items.length && !ugcListTotal) {
    setUgcCollapseSummary('ugcRecordsSummary', '点击展开加载')
    return
  }
  if (ugcListTotal) {
    setUgcCollapseSummary('ugcRecordsSummary', `共 ${ugcListTotal} 条 · 第 ${ugcListPage} 页`)
    return
  }
  setUgcCollapseSummary('ugcRecordsSummary', `已加载 ${items.length} 条`)
}

function initUgcSectionNav() {
  document.querySelectorAll('.ugc-section-link').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const target = btn.dataset.ugcTarget
      scrollToUgcSection(target, {
        openMallModal: target === 'ugcSectionMall' && (event.altKey || event.metaKey),
      })
    })
  })
  initUgcScrollSpy()
}

function initUgcScrollSpy() {
  if (ugcNavObserver) {
    ugcNavObserver.disconnect()
    ugcNavObserver = null
  }
  if (!('IntersectionObserver' in window)) return

  ugcNavObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      document.querySelectorAll('.ugc-section-link').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.ugcTarget === visible.target.id)
      })
    },
    {
      root: null,
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '70px'} 0px -55% 0px`,
      threshold: [0, 0.15, 0.4],
    },
  )

  UGC_SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id)
    if (el) ugcNavObserver.observe(el)
  })
}

function initBackToTop() {
  if (!backToTopBtn) return
  const onScroll = () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 480)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
  onScroll()
}

const MODE_LABELS = {
  link: { desc: '粘贴歌曲、歌单、专辑或歌手链接', action: '分析链接' },
  search: { desc: '按歌手或歌名搜索并批量查乐谱', action: '搜索乐谱' },
  chart: { desc: '从排行榜批量扫描乐谱', action: '扫描排行榜' },
}

function updateAnalyzeButtonLabel() {
  const label = MODE_LABELS[inputMode]?.action || '查询乐谱'
  if (analyzeBtnLabel) analyzeBtnLabel.textContent = label
}

function setAnalyzeLoading(loading) {
  analyzeBtn.disabled = loading
  analyzeBtn.classList.toggle('is-loading', loading)
  if (analyzeBtnLabel) {
    analyzeBtnLabel.textContent = loading
      ? '查询中…'
      : MODE_LABELS[inputMode]?.action || '查询乐谱'
  }
}

function getPianoCount(item) {
  if (typeof item.pianoSheetCount === 'number') return item.pianoSheetCount
  return (item.sheets || []).filter(
    (s) => s.typeCode === 1 || s.type === '钢琴',
  ).length
}

function getFilterState() {
  return {
    onlyWithSheets: onlyWithSheets.checked,
    maxTotalEnabled: filterMaxTotal.checked,
    maxPianoEnabled: filterMaxPiano.checked,
    maxTotal: Number(maxTotalInput.value),
    maxPiano: Number(maxPianoInput.value),
    excludeNotUploadable: excludeNotUploadableSongs?.checked !== false,
  }
}

function matchesItem(item, filters) {
  const total = item.sheetCount || 0
  const piano = getPianoCount(item)
  const rules = []

  if (filters.excludeNotUploadable && !isSongUploadAllowed(item)) return false
  if (filters.onlyWithSheets && total === 0) return false
  if (filters.maxTotalEnabled) rules.push(total <= filters.maxTotal)
  if (filters.maxPianoEnabled) rules.push(piano <= filters.maxPiano)
  if (!rules.length) return true
  return rules.every(Boolean)
}

function isSongUploadAllowed(item = {}) {
  const uploadOpen =
    item.uploadSheet != null
      ? Number(item.uploadSheet) === 1
      : item.songAllowsUpload !== false && item.canUpload !== false
  if (!uploadOpen) return false
  if (item.existEnableSheet === false) return false

  const limit = Number(
    item.rewardUploadLimit ?? item.hintInfo?.integrationUploadLimit ?? item.hint?.integrationUploadLimit,
  )
  const rewardLimit = Number.isFinite(limit) && limit > 0 ? limit : 5
  const hintCount = item.hintInfo?.uploadNumber ?? item.hint?.uploadNumber
  const listCount = item.sheetCount ?? (item.sheets || []).length
  const hintNum = hintCount != null ? Number(hintCount) : null
  const listNum = listCount != null ? Number(listCount) : null
  const rewardCount =
    item.rewardUploadNumber ??
    (hintNum != null && listNum != null
      ? Math.max(hintNum, listNum)
      : hintNum != null
        ? hintNum
        : listNum || 0)

  if (item.rewardSlotsFull === true || rewardCount >= rewardLimit) return false
  if (item.hintInfo?.integrationOk === false || item.integrationOk === false) return false
  return true
}

function applyFilters(results) {
  return results.filter((item) => matchesItem(item, getFilterState()))
}

function getFilterPayload() {
  return {
    onlyWithSheets: onlyWithSheets.checked,
    maxTotalEnabled: filterMaxTotal.checked,
    maxPianoEnabled: filterMaxPiano.checked,
    maxTotal: Number(maxTotalInput.value),
    maxPiano: Number(maxPianoInput.value),
    excludeNotUploadable: excludeNotUploadableSongs?.checked !== false,
  }
}

function formatAnalyzeExcludeNote(source = {}) {
  const parts = []
  if (source.excludedLive > 0) {
    parts.push(`已排除 ${source.excludedLive} 首 Live/现场版`)
  }
  if (source.excludedAccompaniment > 0) {
    parts.push(`已排除 ${source.excludedAccompaniment} 首伴奏`)
  }
  if (source.excludedNoCopyright > 0) {
    parts.push(`已排除 ${source.excludedNoCopyright} 首无版权`)
  }
  if (source.excludedCover > 0) {
    parts.push(`已排除 ${source.excludedCover} 首翻唱`)
  }
  if (source.excludedCompilationAlbum > 0) {
    parts.push(`已排除 ${source.excludedCompilationAlbum} 首热门华语/群星专辑`)
  }
  if (source.excludedNotUploadable > 0) {
    parts.push(`已排除 ${source.excludedNotUploadable} 首不可上传`)
  }
  return parts.length ? ` · ${parts.join(' · ')}` : ''
}

function syncAnalyzeOptionsVisibility() {
  if (excludeAccompanimentWrap) {
    excludeAccompanimentWrap.classList.toggle('hidden', inputMode !== 'search')
  }
}

function syncFilterSectionVisibility() {
  if (!filterSection) return
  const showInSearch = inputMode === 'search'
  const showAfterResults = Boolean(lastData && inputMode !== 'search')
  const visible = showInSearch || showAfterResults
  filterSection.classList.toggle('hidden', !visible)
  if (visible && showInSearch && filterSection.tagName === 'DETAILS') {
    filterSection.open = true
  }
}

function renderSummary(data, filteredCount) {
  const { summary } = data
  const filters = getFilterState()
  const hasExtraFilter = filters.maxTotalEnabled || filters.maxPianoEnabled

  summaryEl.innerHTML = `
    ${
      summary.scannedCount
        ? `<div class="summary-item"><strong>${summary.scannedCount}</strong><span>扫描歌曲数</span></div>`
        : `<div class="summary-item"><strong>${summary.totalSongs}</strong><span>扫描歌曲数</span></div>`
    }
    <div class="summary-item"><strong>${summary.songsWithSheets}</strong><span>有乐谱歌曲</span></div>
    <div class="summary-item"><strong>${summary.totalSheets}</strong><span>乐谱总数</span></div>
    ${
      hasExtraFilter || data.preFiltered
        ? `<div class="summary-item highlight"><strong>${filteredCount}</strong><span>符合筛选条件</span></div>`
        : ''
    }
  `
  summaryEl.classList.remove('hidden')
  resultsSectionEl?.classList.remove('hidden')
}

function renderSourceInfo(data) {
  const typeLabels = {
    search: '搜索',
    chart: '排行榜',
    artist: '歌手',
    playlist: '歌单',
    album: '专辑',
    song: '单曲',
  }
  const typeBadge = typeLabels[data.type]
    ? `<span class="source-badge">${typeLabels[data.type]}</span>`
    : ''

  if (data.type === 'search' && data.source) {
    const excludedNote = formatAnalyzeExcludeNote(data.source)
    const scannedNote =
      data.source.scannedCount
        ? ` · 已扫描 ${data.source.scannedCount} 首`
        : ''
    const filterNote = data.preFiltered
      ? ` · 筛选：总数≤${data.source.filters?.maxTotal ?? maxTotalInput.value} 且 钢琴≤${data.source.filters?.maxPiano ?? maxPianoInput.value}`
      : ''
    sourceInfoEl.innerHTML = `
      <div class="source-head">
        <h2>搜索：${escapeHtml(data.source.keyword)}</h2>
        ${typeBadge}
      </div>
      <p>共找到 ${data.source.total ?? data.summary.totalSongs} 首相关歌曲${scannedNote}${excludedNote}${filterNote}${data.summary.truncated ? `（已扫描前 ${data.summary.totalSongs} 首）` : ''}</p>
    `
  } else if (data.type === 'chart' && data.chart) {
    const excludedNote = formatAnalyzeExcludeNote(data.source || {})
    sourceInfoEl.innerHTML = `
      <div class="source-head">
        <h2>${escapeHtml(data.chart.name)}</h2>
        ${typeBadge}
      </div>
      <p>共 ${data.chart.trackCount} 首${excludedNote}${data.summary.truncated ? `（已扫描前 ${data.summary.totalSongs} 首）` : ''}</p>
    `
  } else if (data.type === 'artist' && data.artist) {
    const excludedNote = formatAnalyzeExcludeNote(data.source || {})
    const scannedNote =
      data.source?.scannedCount
        ? ` · 已扫描 ${data.source.scannedCount} 首`
        : ''
    const filterNote = data.preFiltered
      ? ` · 筛选：总数≤${data.source.filters?.maxTotal ?? maxTotalInput.value} 且 钢琴≤${data.source.filters?.maxPiano ?? maxPianoInput.value}`
      : ''
    sourceInfoEl.innerHTML = `
      <div class="source-head">
        <h2>${escapeHtml(data.artist.name)}</h2>
        ${typeBadge}
      </div>
      <p>共 ${data.artist.musicSize ?? data.summary.sourceTotal ?? data.summary.totalSongs} 首${scannedNote}${excludedNote}${filterNote}${data.summary.truncated ? `（已扫描前 ${data.summary.totalSongs} 首）` : ''}</p>
    `
  } else if (data.type === 'playlist' && data.playlist) {
    const excludedNote = formatAnalyzeExcludeNote(data.source || {})
    sourceInfoEl.innerHTML = `
      <div class="source-head">
        <h2>${escapeHtml(data.playlist.name)}</h2>
        ${typeBadge}
      </div>
      <p>创建者：${escapeHtml(data.playlist.creator || '未知')} · 共 ${data.playlist.trackCount} 首${excludedNote}${data.summary.truncated ? `（已扫描前 ${data.summary.totalSongs} 首）` : ''}</p>
    `
  } else if (data.type === 'album' && data.album) {
    const excludedNote = formatAnalyzeExcludeNote(data.source || {})
    sourceInfoEl.innerHTML = `
      <div class="source-head">
        <h2>${escapeHtml(data.album.name)}</h2>
        ${typeBadge}
      </div>
      <p>${escapeHtml(data.album.artist)} · 共 ${data.album.size} 首${excludedNote}${data.summary.truncated ? `（已扫描前 ${data.summary.totalSongs} 首）` : ''}</p>
    `
  } else {
    sourceInfoEl.classList.add('hidden')
    return
  }
  sourceInfoEl.classList.remove('hidden')
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSheetItem(sheet) {
  const details = [
    sheet.type,
    sheet.key && `调性 ${sheet.key}`,
    sheet.difficulty && `难度 ${sheet.difficulty}`,
    sheet.bpm ? `BPM ${sheet.bpm}` : '',
    sheet.pages ? `${sheet.pages} 页` : '',
    sheet.version,
    sheet.comments ? `${sheet.comments} 评论` : '',
  ]
    .filter(Boolean)
    .join(' · ')

  const metaLine = sheet.uploader
    ? `上传者：${sheet.uploader}`
    : sheet.source && sheet.source !== '乐谱'
      ? `来源：${sheet.source}`
      : '上传者：请在网易云 App 乐谱详情查看'

  return `
    <div
      class="sheet-item"
      data-sheet-id="${escapeHtml(String(sheet.id))}"
      data-sheet-name="${escapeHtml(sheet.name)}"
      data-sheet-type="${escapeHtml(sheet.type || '')}"
      data-sheet-source="${escapeHtml(sheet.source || '')}"
      data-sheet-uploader="${escapeHtml(sheet.uploader || '')}"
      role="button"
      tabindex="0"
      title="点击预览乐谱"
    >
      <img src="${escapeHtml(sheet.cover)}" alt="${escapeHtml(sheet.name)}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="info">
        <div class="title">${escapeHtml(sheet.name)}</div>
        <div class="detail">${escapeHtml(details)}</div>
        <div class="detail sheet-meta-line">${escapeHtml(metaLine)}</div>
        <div class="detail sheet-preview-hint">点击预览</div>
      </div>
    </div>
  `
}

function renderSongCard(item, filters) {
  const node = songCardTpl.content.cloneNode(true)
  const cover = node.querySelector('.cover')
  const name = node.querySelector('.name')
  const artists = node.querySelector('.artists')
  const album = node.querySelector('.album')
  const badges = node.querySelector('.badges')
  const grid = node.querySelector('.sheet-grid')
  const empty = node.querySelector('.empty-sheets')

  const song = item.song
  const pianoCount = getPianoCount(item)
  const matchTotal = filters.maxTotalEnabled && item.sheetCount <= filters.maxTotal
  const matchPiano = filters.maxPianoEnabled && pianoCount <= filters.maxPiano

  bindSongCover(cover, song.cover)
  cover.alt = song.name
  name.textContent = song.name
  artists.textContent = song.artists
  album.textContent = song.album ? `专辑：${song.album}` : ''

  badges.innerHTML = `
    <span class="badge ${item.sheetCount > 0 ? 'has-sheet' : ''}">${item.sheetCount} 份乐谱</span>
    <span class="badge ${pianoCount > 0 ? 'has-sheet' : ''}">${pianoCount} 份钢琴谱</span>
    ${matchTotal ? '<span class="badge filter-match">总数偏少</span>' : ''}
    ${matchPiano ? '<span class="badge filter-match">钢琴谱偏少</span>' : ''}
    ${isSongUploadAllowed(item) ? '<span class="badge">可上传乐谱</span>' : '<span class="badge muted">不可上传</span>'}
    ${item.error ? `<span class="badge">查询失败：${escapeHtml(item.error)}</span>` : ''}
  `

  if (item.sheets?.length) {
    grid.innerHTML = item.sheets.map(renderSheetItem).join('')
  } else {
    grid.classList.add('hidden')
    empty.classList.remove('hidden')
  }

  const card = node.querySelector('.song-card')
  card.dataset.songId = String(song.id)
  return card
}

function formatTime(ts) {
  if (ts == null || ts === '') return ''
  let ms = Number(ts)
  if (Number.isFinite(ms) && ms > 0 && ms < 1e11) ms *= 1000
  if (typeof ts === 'string' && !/^\d+$/.test(ts.trim())) {
    const parsed = Date.parse(ts.replace(/\./g, '-'))
    if (!Number.isNaN(parsed)) ms = parsed
  }
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return String(ts)
  return d.toLocaleString('zh-CN', { hour12: false })
}

function emptyState(message, icon = '—') {
  return `<div class="empty-state card-empty"><div class="empty-state-icon">${icon}</div><p>${escapeHtml(message)}</p></div>`
}

function auditStatusClass(status) {
  const map = {
    5: 'audit-pass',
    0: 'audit-wait',
    1: 'audit-pending',
    '-5': 'audit-reject',
    4: 'audit-partial',
  }
  return map[String(status)] || 'audit-default'
}

function switchTab(name) {
  activeTab = name
  try {
    sessionStorage.setItem(TAB_STORAGE_KEY, name)
  } catch {
    // ignore storage errors
  }
  tabButtons.forEach((btn) => {
    const active = btn.dataset.tab === name
    btn.classList.toggle('active', active)
    btn.setAttribute('aria-selected', active ? 'true' : 'false')
  })
  analyzePanel.classList.toggle('hidden', name !== 'analyze')
  sheetPanel.classList.toggle('hidden', name !== 'sheet')
  ugcPanel.classList.toggle('hidden', name !== 'ugc')

  window.scrollTo({ top: 0, behavior: 'smooth' })

  if (name === 'analyze' && lastData) {
    renderSourceInfo(lastData)
    renderResults(lastData)
  } else if (name === 'sheet') {
    initSheetPanel()
  } else if (name === 'ugc') {
    syncUgcFilterUI()
    loadUgcDevote()
  }
}

function openPreviewModal() {
  previewModal.classList.remove('hidden')
  lockPageScroll()
}

function closePreviewModal() {
  previewModal.classList.add('hidden')
  unlockPageScroll()
  previewPages.innerHTML = ''
  if (previewMeta) {
    previewMeta.innerHTML = ''
    previewMeta.classList.add('hidden')
  }
}

function renderPreviewMeta(sheetItem) {
  if (!previewMeta || !sheetItem) return

  const name = sheetItem.dataset.sheetName || '乐谱'
  const type = sheetItem.dataset.sheetType
  const source = sheetItem.dataset.sheetSource
  const uploader = sheetItem.dataset.sheetUploader

  const lines = [
    type ? `类型：${type}` : '',
    source && source !== '乐谱' ? `来源：${source}` : '',
    uploader ? `上传者：${uploader}` : '',
  ].filter(Boolean)

  previewMeta.innerHTML = `
    <p class="preview-meta-title">${escapeHtml(name)}</p>
    ${lines.length ? `<p class="preview-meta-detail">${escapeHtml(lines.join(' · '))}</p>` : ''}
    ${
      uploader
        ? ''
        : '<p class="preview-meta-hint">公开接口未返回上传者昵称，完整信息请在网易云 App 打开该乐谱查看</p>'
    }
  `
  previewMeta.classList.remove('hidden')
}

function openWikiModal() {
  wikiModal.classList.remove('hidden')
  lockPageScroll()
}

function closeWikiModalFn() {
  wikiModal.classList.add('hidden')
  unlockPageScroll()
  wikiContent.innerHTML = ''
}

async function openSheetPreview(sheetId, title, sheetItem, songId) {
  previewTitle.textContent = title || '乐谱预览'
  renderPreviewMeta(sheetItem)
  previewPages.innerHTML = `<div class="empty-state"><div class="empty-state-icon">…</div><p>正在加载预览</p></div>`
  openPreviewModal()

  const resolvedSongId =
    songId ||
    sheetItem?.dataset?.songId ||
    sheetItem?.closest?.('[data-song-id]')?.dataset?.songId

  try {
    const res = await fetch('/api/sheet/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sheetId,
        songId: resolvedSongId || undefined,
        cookie: getCookie() || undefined,
      }),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)

    if (!data.pages?.length) {
      previewPages.innerHTML = '<p class="empty-sheets">暂无预览页面</p>'
      return
    }

    previewPages.innerHTML = `
      ${data.partial ? '<p class="hint preview-partial-hint">仅返回封面预览，完整乐谱请在 App 中查看</p>' : ''}
      ${data.pages
        .map(
          (p, i) => `
          <figure class="preview-page">
            <img src="${escapeHtml(p.url)}" alt="第 ${p.pageNumber ?? i + 1} 页" loading="lazy" />
            <figcaption>第 ${p.pageNumber ?? i + 1} 页</figcaption>
          </figure>
        `,
        )
        .join('')}
    `
  } catch (err) {
    previewPages.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
  }
}

async function openSongWiki(songId, songName) {
  wikiTitle.textContent = songName ? `${songName} · 音乐百科` : '音乐百科'
  wikiContent.innerHTML = `<div class="empty-state"><div class="empty-state-icon">…</div><p>正在加载百科</p></div>`
  openWikiModal()

  try {
    const res = await fetch(
      `/api/song/wiki/summary?id=${encodeURIComponent(songId)}`,
    )
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)

    let html = ''

    if (data.basics?.length) {
      html += data.basics
        .map(
          (b) => `
            <section class="wiki-block">
              <h4>${escapeHtml(b.title || '信息')}</h4>
              <p>${escapeHtml((b.values || []).join(' · ') || '—')}</p>
            </section>
          `,
        )
        .join('')
    }

    if (data.sheetBlock) {
      const sb = data.sheetBlock
      html += `
        <section class="wiki-block wiki-sheet-block">
          <h4>${escapeHtml(sb.title || '乐谱')}</h4>
          ${
            sb.sheets?.length
              ? `<div class="wiki-sheet-grid">${sb.sheets
                  .map(
                    (s) => `
                      <div class="wiki-sheet-item">
                        ${s.cover ? `<img src="${escapeHtml(s.cover)}" alt="" loading="lazy" />` : ''}
                        <span>${escapeHtml(s.title || '乐谱')}</span>
                      </div>
                    `,
                  )
                  .join('')}</div>`
              : '<p class="hint">百科中暂无乐谱条目</p>'
          }
          ${sb.canUpload ? '<p class="hint">该歌曲支持上传乐谱</p>' : ''}
        </section>
      `
    }

    wikiContent.innerHTML =
      html || '<p class="empty-sheets">暂无百科内容</p>'
  } catch (err) {
    wikiContent.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
  }
}

function renderUgcProfile(data = {}) {
  if (!ugcProfile) return
  const name = data.name || data.profile?.name || '云小编'
  const avatar = data.avatar || data.profile?.avatar
  const levelDesc = data.levelDesc || data.profile?.levelDesc || '见习云小编'
  const rank = data.rank ?? data.profile?.rank
  const todayPoints = data.todayPoints ?? data.profile?.todayPoints ?? 0
  const totalPoints = data.totalPoints ?? data.profile?.totalPoints ?? 0
  const availablePoints = data.availablePoints ?? data.profile?.availablePoints ?? 0
  const devoteCount = data.devoteCount ?? data.devote?.devoteCount
  const yunbei = data.yunbei ?? data.devote?.yunbei
  const needPoints = data.profile?.needPoints

  ugcProfile.innerHTML = `
    <div class="ugc-profile-card">
      ${avatar ? `<img class="ugc-profile-avatar" src="${escapeHtml(avatar)}" alt="" />` : '<div class="ugc-profile-avatar placeholder">编</div>'}
      <div class="ugc-profile-main">
        <div class="ugc-profile-title">
          <strong>${escapeHtml(name)}</strong>
          <span class="badge">${escapeHtml(levelDesc)}</span>
        </div>
        <p class="hint">${rank != null ? `当前排名 #${rank}` : '排名加载中'}${needPoints != null ? ` · 升级还需 ${needPoints} 积分` : ''}</p>
      </div>
    </div>
    <div class="stat-grid">
      <div class="summary-item highlight"><strong>${todayPoints}</strong><span>今日积分</span></div>
      <div class="summary-item"><strong>${totalPoints}</strong><span>总积分</span></div>
      <div class="summary-item summary-item-link" data-action="open-mall" role="button" tabindex="0" title="点击查看积分商城"><strong>${availablePoints}</strong><span>可用积分</span></div>
      ${devoteCount != null ? `<div class="summary-item"><strong>${devoteCount}</strong><span>贡献条目</span></div>` : ''}
      ${yunbei != null ? `<div class="summary-item"><strong>${yunbei}</strong><span>云贝</span></div>` : ''}
    </div>
  `
  ugcProfile.classList.remove('hidden')
}

function renderUgcDailyReward(data = {}) {
  if (!ugcDailyReward) return
  const todayPoints = data.todayPoints ?? data.profile?.todayPoints ?? 0
  const threshold = data.vip?.threshold ?? data.activity?.goalCount ?? 50
  const percent = Math.min(100, Math.round((todayPoints / threshold) * 100))
  const title = data.vip?.title || `今日积分达 ${threshold} 可领取 1 日黑胶会员`
  const canClaim = data.vip?.canClaim === true

  ugcDailyReward.innerHTML = `
    <div class="ugc-reward-card">
      <div class="ugc-reward-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${todayPoints}/${threshold}</span>
      </div>
      <div class="ugc-progress"><div class="ugc-progress-bar" style="width:${percent}%"></div></div>
      <p class="hint">${canClaim ? '已达领取条件，可点击下方按钮领取' : `还差 ${Math.max(0, threshold - todayPoints)} 分`}</p>
    </div>
  `
  ugcDailyReward.classList.remove('hidden')

  if (ugcClaimVipBtn) {
    ugcClaimVipBtn.disabled = !canClaim
    ugcClaimVipBtn.textContent = canClaim ? '领取 1 日黑胶' : `领取 1 日黑胶（${todayPoints}/${threshold}）`
  }
}

function renderUgcLottery(lottery, options = {}) {
  if (!ugcLottery) return
  updateUgcLotterySummary(lottery, options)

  if (options.needLogin) {
    ugcLottery.innerHTML = emptyState('登录后可查看每日抽奖', '—')
    return
  }

  if (options.loading) {
    ugcLottery.innerHTML = emptyState('正在加载奖池…', '…')
    return
  }

  if (options.error) {
    ugcLottery.innerHTML = `<p class="empty-sheets">${escapeHtml(options.error)}</p>`
    return
  }

  if (!lottery?.prizes?.length && lottery?.remainChance == null) {
    ugcLottery.innerHTML = emptyState('暂无抽奖活动', '○')
    return
  }

  const remain =
    lottery.remainChance != null ? `剩余免费次数 ${lottery.remainChance}` : '剩余次数未知'
  const dailyFree =
    lottery.dailyFreeChance != null ? ` · 每日 ${lottery.dailyFreeChance} 次` : ''
  const pointsCost = lottery.pointsDrawCost ?? 200

  ugcLottery.innerHTML = `
    <div class="ugc-lottery-card">
      <div class="ugc-lottery-head">
        <div>
          <strong>${escapeHtml(lottery.activityName || '云小编每日抽奖')}</strong>
          <p class="hint">${escapeHtml(remain)}${escapeHtml(dailyFree)} · 积分抽奖 ${pointsCost} 分/次</p>
        </div>
        <div class="ugc-lottery-actions">
          <button type="button" class="btn-primary btn-sm ugc-draw-btn" data-entry-type="6" ${lottery.remainChance === 0 ? 'disabled' : ''}>免费抽奖</button>
          <button type="button" class="btn-secondary btn-sm ugc-draw-btn" data-entry-type="7">积分抽奖</button>
        </div>
      </div>
      ${
        lottery.prizes?.length
          ? `<div class="lottery-prize-grid">${lottery.prizes
              .map(
                (prize) => `
                  <div class="lottery-prize">
                    ${
                      prize.image
                        ? `<img src="${escapeHtml(prize.image)}" alt="" loading="lazy" />`
                        : '<div class="lottery-prize-placeholder">奖</div>'
                    }
                    <span>${escapeHtml(prize.name || '奖品')}</span>
                  </div>
                `,
              )
              .join('')}</div>`
          : '<p class="hint">奖池加载中</p>'
      }
      <p class="hint ugc-lottery-note">若提示缺少验证码，请从 APP 抓包 do/lottery 请求体复制 checkToken 后重试。</p>
      <label class="field ugc-lottery-token">
        <span class="field-label">checkToken（可选）</span>
        <input id="ugcLotteryCheckToken" type="text" placeholder="从 APP 抓包复制 checkToken" />
      </label>
    </div>
  `
}

function isDisplayableMallStatus(text) {
  if (!text || typeof text !== 'string') return false
  const trimmed = text.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return false
  return true
}

function renderMallProductCard(entry, index, { compact = false } = {}) {
  const { item, soldOut } = entry
  return `
    <button type="button" class="ugc-mall-item${soldOut ? ' sold-out' : ''}" data-mall-index="${index}" aria-label="查看 ${escapeHtml(item.name || '商品')}">
      ${
        item.image
          ? `<img class="ugc-mall-img" src="${escapeHtml(item.image)}" alt="" loading="lazy" />`
          : '<div class="ugc-mall-img placeholder">礼</div>'
      }
      <div class="ugc-mall-main">
        <strong>${escapeHtml(item.name || '商品')}</strong>
        <p class="hint">${item.points != null ? `${item.points} 积分` : '积分待定'}${item.stock != null ? ` · 库存 ${item.stock}` : ''}</p>
        ${isDisplayableMallStatus(item.statusName) ? `<p class="hint">${escapeHtml(item.statusName)}</p>` : ''}
        ${
          soldOut
            ? '<span class="badge muted">已兑完</span>'
            : '<span class="hint">点击查看详情</span>'
        }
      </div>
    </button>
  `
}

function renderMallProductDetail(entry) {
  const { item, soldOut } = entry
  const statusText = isDisplayableMallStatus(item.statusName) ? item.statusName : soldOut ? '已兑完' : '可兑换'
  return `
    <div class="mall-product-detail">
      <div class="mall-product-hero">
        ${
          item.image
            ? `<img class="ugc-mall-img" src="${escapeHtml(item.image)}" alt="" />`
            : '<div class="ugc-mall-img placeholder">礼</div>'
        }
        <div class="mall-product-meta">
          <strong>${escapeHtml(item.name || '商品')}</strong>
          <p class="hint">${item.points != null ? `${item.points} 积分` : '积分待定'}</p>
          ${item.stock != null ? `<p class="hint">库存 ${item.stock}</p>` : ''}
          <p class="hint">状态：${escapeHtml(statusText)}</p>
          ${item.type != null ? `<p class="hint">类型代码 ${escapeHtml(String(item.type))}</p>` : ''}
        </div>
      </div>
      <p class="hint ugc-mall-note">兑换请在网易云 APP 积分商城完成；本工具仅展示商品与库存状态。</p>
      <div class="mall-product-actions">
        ${
          item.url && !soldOut
            ? `<a class="btn-primary btn-sm" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">在网易云打开</a>`
            : ''
        }
        <button type="button" class="btn-secondary btn-sm" data-mall-action="back">返回列表</button>
      </div>
    </div>
  `
}

function openMallModal(view = 'list', productIndex = null) {
  mallModalView = view
  mallModalProductIndex = productIndex
  if (view === 'list') mallModalPage = mallInlinePage
  renderMallModalContent()
  mallModal?.classList.remove('hidden')
  lockPageScroll()
}

function closeMallModal() {
  mallModal?.classList.add('hidden')
  mallModalView = 'list'
  mallModalProductIndex = null
  if (mallModalBody) mallModalBody.innerHTML = ''
  if (mallModalFooter) mallModalFooter.innerHTML = ''
  mallModalBackBtn?.classList.add('hidden')
  unlockPageScroll()
}

function renderMallModalContent() {
  if (!mallModalBody || !mallModalTitle) return

  if (mallModalView === 'product' && mallModalProductIndex != null) {
    const entry = mallProductEntries[mallModalProductIndex]
    if (!entry) {
      mallModalView = 'list'
    } else {
      mallModalTitle.textContent = entry.item.name || '商品详情'
      mallModalBackBtn?.classList.remove('hidden')
      mallModalBody.innerHTML = renderMallProductDetail(entry)
      if (mallModalFooter) mallModalFooter.innerHTML = ''
      return
    }
  }

  mallModalTitle.textContent = '积分商城'
  mallModalBackBtn?.classList.add('hidden')

  if (!mallProductEntries.length) {
    mallModalBody.innerHTML = emptyState('暂无商品', '○')
    if (mallModalFooter) mallModalFooter.innerHTML = ''
    return
  }

  const paged = paginateItems(mallProductEntries, mallModalPage, MALL_MODAL_PAGE_SIZE)
  mallModalPage = paged.page

  mallModalBody.innerHTML = `
    <div class="mall-modal-toolbar">
      <p class="hint ugc-mall-meta">共 ${paged.total} 件商品 · 弹窗浏览</p>
    </div>
    <div class="ugc-mall-grid">${paged.items.map(({ item, soldOut }, offset) => {
      const index = (paged.page - 1) * MALL_MODAL_PAGE_SIZE + offset
      return renderMallProductCard({ item, soldOut }, index)
    }).join('')}</div>
    ${buildPaginationHtml({ page: paged.page, pageSize: MALL_MODAL_PAGE_SIZE, total: paged.total, id: 'mall-modal' })}
  `

  if (mallModalFooter) {
    mallModalFooter.innerHTML = `
      <button type="button" class="btn-secondary btn-sm" data-mall-action="goto-section">定位到页面商城</button>
      <button type="button" class="btn-text" data-mall-action="close">关闭</button>
    `
  }

  bindPagination(
    mallModalBody,
    'mall-modal',
    MALL_MODAL_PAGE_SIZE,
    () => mallModalPage,
    (page) => {
      mallModalPage = page
    },
    () => mallProductEntries.length,
    () => renderMallModalContent(),
  )
}

function handleMallInteraction(event) {
  const backBtn = event.target.closest('[data-mall-action="back"]')
  if (backBtn) {
    mallModalView = 'list'
    renderMallModalContent()
    return
  }

  const actionBtn = event.target.closest('[data-mall-action]')
  if (actionBtn) {
    const action = actionBtn.dataset.mallAction
    if (action === 'close') {
      closeMallModal()
      return
    }
    if (action === 'goto-section') {
      closeMallModal()
      scrollToUgcSection('ugcSectionMall')
      return
    }
  }

  const card = event.target.closest('[data-mall-index]')
  if (!card) return
  const index = Number(card.dataset.mallIndex)
  if (!Number.isFinite(index) || !mallProductEntries[index]) return

  if (mallModal && !mallModal.classList.contains('hidden')) {
    mallModalView = 'product'
    mallModalProductIndex = index
    renderMallModalContent()
    return
  }

  openMallModal('product', index)
}

function renderUgcMall(mall, options = {}) {
  if (!ugcMall) return
  updateUgcMallSummary(mall, options)

  if (options.needLogin) {
    ugcMall.innerHTML = emptyState('登录后可查看积分商城', '—')
    return
  }

  if (options.loading) {
    ugcMall.innerHTML = emptyState('正在加载商品…', '…')
    return
  }

  if (options.error) {
    ugcMall.innerHTML = `<p class="empty-sheets">${escapeHtml(options.error)}</p>`
    return
  }

  const inStock = mall?.inStock || []
  const outStock = mall?.outStock || []

  if (!inStock.length && !outStock.length) {
    mallProductEntries = []
    ugcMall.innerHTML = emptyState('暂无商品', '○')
    return
  }

  mallProductEntries = flattenMallProducts(mall)
  if (mallInlinePage > Math.ceil(mallProductEntries.length / MALL_INLINE_PAGE_SIZE)) {
    mallInlinePage = 1
  }

  const paged = paginateItems(mallProductEntries, mallInlinePage, MALL_INLINE_PAGE_SIZE)
  mallInlinePage = paged.page

  ugcMall.innerHTML = `
    ${
      mall?.convertibleNum != null
        ? `<p class="hint ugc-mall-meta">当前可兑换 ${mall.convertibleNum} 件 · 共 ${mallProductEntries.length} 件商品</p>`
        : `<p class="hint ugc-mall-meta">共 ${mallProductEntries.length} 件商品</p>`
    }
    <div class="ugc-mall-grid">${paged.items
      .map(({ item, soldOut }, offset) => {
        const index = (paged.page - 1) * MALL_INLINE_PAGE_SIZE + offset
        return renderMallProductCard({ item, soldOut }, index)
      })
      .join('')}</div>
    ${buildPaginationHtml({ page: paged.page, pageSize: MALL_INLINE_PAGE_SIZE, total: paged.total, id: 'mall-inline' })}
    <p class="hint ugc-mall-note">点击商品查看详情；兑换请在网易云 APP 完成。也可点「弹窗浏览」全屏查看。</p>
  `

  bindPagination(
    ugcMall,
    'mall-inline',
    MALL_INLINE_PAGE_SIZE,
    () => mallInlinePage,
    (page) => {
      mallInlinePage = page
    },
    () => mallProductEntries.length,
    () => renderUgcMall(mall),
  )
}

function renderUgcAuditTasks(tasks = [], examInfo = null) {
  if (!ugcAuditTasks) return

  const examHint =
    examInfo && examInfo.hasPassExamination === false
      ? '<p class="hint ugc-exam-hint">首次参与审核需先完成资格测验；若开始失败，请用 APP 内抓取的 Cookie 登录后再试。</p>'
      : ''

  if (!tasks.length) {
    ugcAuditTasks.innerHTML =
      examHint + emptyState('暂无审核任务', '○')
    return
  }

  ugcAuditTasks.innerHTML =
    examHint +
    tasks
    .map(
      (task) => `
        <article class="ugc-task-card">
          <div class="ugc-task-head">
            <strong>${escapeHtml(task.taskName || task.auditTypeName)}</strong>
            <span class="badge">+${task.point ?? 0} 分/题</span>
          </div>
          <p class="hint">${escapeHtml(task.subTitle || '开始审核赚积分')}</p>
          <p class="ugc-meta">今日已审 ${task.auditCount ?? 0} 题</p>
          <button type="button" class="btn-primary btn-sm ugc-start-exam-btn" data-audit-type="${task.auditType}" ${task.btnDisabled ? 'disabled' : ''}>
            ${escapeHtml(task.btnLabel || (task.btnDisabled ? '今日已完成' : '开始审核'))}
          </button>
        </article>
      `,
    )
    .join('')
}

function renderUgcOfficialTasks(tasks = []) {
  if (!ugcOfficialTasks) return
  updateUgcOfficialSummary(tasks)

  if (!tasks.length) {
    ugcOfficialTasks.innerHTML = emptyState('暂无官方任务', '○')
    return
  }

  ugcOfficialTasks.innerHTML = tasks
    .map(
      (task) => `
        <article class="ugc-task-card official">
          ${task.taskPic ? `<img class="ugc-task-cover" src="${escapeHtml(task.taskPic)}" alt="" loading="lazy" />` : ''}
          <div class="ugc-task-body">
            <div class="ugc-task-head">
              <strong>${escapeHtml(task.taskName || '官方任务')}</strong>
              <span class="badge">+${task.rewardPayNum ?? 0} 分</span>
            </div>
            <p class="hint">${escapeHtml(task.taskDesc || '')}</p>
            <p class="ugc-meta">资源 ${task.resCont ?? '—'} · 参与 ${task.userCont ?? '—'}</p>
          </div>
        </article>
      `,
    )
    .join('')
}

function renderUgcHonorRoll(records = [], typeName = '', options = {}) {
  if (!ugcHonorRoll) return
  updateUgcHonorSummary(records, typeName, options)

  if (!records.length) {
    ugcHonorRoll.innerHTML = emptyState(`暂无${typeName || '榜单'}数据`, '○')
    return
  }

  ugcHonorRoll.innerHTML = records
    .slice(0, 20)
    .map(
      (item) => `
        <article class="ugc-honor-item">
          <span class="ugc-honor-rank">${item.rank ?? '—'}</span>
          ${item.userImage ? `<img class="ugc-honor-avatar" src="${escapeHtml(item.userImage)}" alt="" loading="lazy" />` : ''}
          <div class="ugc-honor-main">
            <strong>${escapeHtml(item.userName || '匿名')}</strong>
            <span class="hint">${escapeHtml(item.level || '')}</span>
          </div>
          <span class="ugc-honor-points">${item.points ?? 0}</span>
        </article>
      `,
    )
    .join('')
}

function renderUgcExamQuestion(state = {}) {
  if (!ugcExamPanel || !ugcExamContent) return
  if (ugcExamPanelTitle) ugcExamPanelTitle.textContent = '资格测验'
  const q = state.question || {}
  const progress = q.auditCount != null && q.auditTaskCount != null
    ? `${q.auditCount}/${q.auditTaskCount}`
    : ''
  const options = Array.isArray(q.options) ? q.options : []
  const optionsHtml = options.length
    ? `<div class="ugc-exam-options" role="group" aria-label="可选答案">
        ${options
          .map(
            (opt) => `
              <button type="button" class="ugc-exam-option" data-answer-id="${escapeHtml(opt.id)}" data-answer-value="${escapeHtml(opt.value)}" data-answer-label="${escapeHtml(opt.label)}">
                ${escapeHtml(opt.label)}
              </button>
            `,
          )
          .join('')}
      </div>`
    : `<label class="field">
        <span class="field-label">你的答案</span>
        <input id="ugcExamAnswerInput" type="text" placeholder="输入判断结果，如：原唱 / 日语 / 华语流行" />
      </label>`

  ugcExamContent.innerHTML = `
    <div class="ugc-exam-card">
      <div class="ugc-exam-head">
        <strong>${escapeHtml(state.auditTypeName || '审核题目')}</strong>
        ${progress ? `<span class="hint">进度 ${progress}</span>` : ''}
      </div>
      <div class="ugc-exam-song">
        ${q.coverUrl ? `<img src="${escapeHtml(q.coverUrl)}" alt="" loading="lazy" />` : ''}
        <div>
          <strong>${escapeHtml(q.resName || '未知歌曲')}</strong>
          <p class="hint">${escapeHtml(q.artists || '')}</p>
          ${q.songUrl ? `<audio controls preload="none" src="${escapeHtml(q.songUrl)}"></audio>` : ''}
        </div>
      </div>
      <p class="ugc-exam-prompt">请判断：<strong>${escapeHtml(q.questionContent || '—')}</strong></p>
      ${q.lyric ? `<pre class="ugc-exam-lyric">${escapeHtml(String(q.lyric).slice(0, 1200))}</pre>` : ''}
      ${optionsHtml}
      <div class="ugc-exam-actions">
        ${options.length ? '' : '<button id="ugcExamSubmitBtn" type="button" class="btn-primary">提交并下一题</button>'}
        <button id="ugcExamSkipBtn" type="button" class="btn-secondary">刷新题目</button>
      </div>
      <p id="ugcExamStatus" class="hint"></p>
    </div>
  `
  ugcExamPanel.classList.remove('hidden')

  document.getElementById('ugcExamSubmitBtn')?.addEventListener('click', submitUgcExamAnswer)
  document.getElementById('ugcExamSkipBtn')?.addEventListener('click', () => loadUgcExamQuestion())
  ugcExamContent.querySelectorAll('.ugc-exam-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      ugcExamContent.querySelectorAll('.ugc-exam-option').forEach((el) => {
        el.classList.toggle('active', el === btn)
      })
      submitUgcExamAnswer({
        answerId: btn.dataset.answerId,
        answer: btn.dataset.answerValue || btn.dataset.answerLabel,
        selectContent: btn.dataset.answerLabel,
        content: btn.dataset.answerLabel,
      })
    })
  })
}

function voteJudgementLabel(j) {
  if (Number(j) === 1) return '同意'
  if (Number(j) === 2) return '不同意'
  return `判定${j ?? '—'}`
}

function voteHistoryStatusLabel(s) {
  if (Number(s) === 1) return '得分'
  if (Number(s) === 3) return '未得分'
  return `状态${s ?? '—'}`
}

function renderUgcVoteAudit(state = {}) {
  if (!ugcExamPanel || !ugcExamContent) return
  if (ugcExamPanelTitle) ugcExamPanelTitle.textContent = '正在审核'

  const items = Array.isArray(state.queue) ? state.queue : []
  const index = state.index || 0
  const item = items[index]
  const guides = Array.isArray(state.guides) ? state.guides : []
  const lastResult = state.lastResult

  if (!item) {
    ugcExamContent.innerHTML = `
      <div class="ugc-exam-card">
        <p class="hint">${escapeHtml(state.message || '暂无待审核歌曲')}</p>
        <div class="ugc-exam-actions">
          <button id="ugcVoteReloadBtn" type="button" class="btn-primary">重新拉取</button>
        </div>
        <p id="ugcExamStatus" class="hint"></p>
      </div>
    `
    ugcExamPanel.classList.remove('hidden')
    document.getElementById('ugcVoteReloadBtn')?.addEventListener('click', () => {
      startUgcAudit(state.auditType, state.auditTypeName)
    })
    return
  }

  const progress =
    item.auditCount != null && item.auditTaskCount != null
      ? `${item.auditCount}/${item.auditTaskCount}`
      : ''
  const queueProgress = items.length > 1 ? `本批 ${index + 1}/${items.length}` : ''
  const currentGuide = guides.find((g) => String(g.tagId) === String(item.tagId))
  const guidesHtml = guides.length
    ? `<aside class="ugc-tag-guides">
        <div class="ugc-tag-guides-head">
          <strong>标签参考</strong>
          <span class="hint">共 ${guides.length} 个</span>
        </div>
        <div class="ugc-tag-guide-list">
          ${guides
            .map((guide) => {
              const example = guide.examples?.[0]
              const active = String(guide.tagId) === String(item.tagId)
              return `
                <article class="ugc-tag-guide-item${active ? ' active' : ''}">
                  <div class="ugc-tag-guide-head">
                    <strong>${escapeHtml(guide.tagName || '')}</strong>
                    ${active ? '<span class="badge">当前</span>' : ''}
                  </div>
                  <p class="hint">${escapeHtml(guide.guideText || '')}</p>
                  ${
                    example
                      ? `<div class="ugc-tag-guide-example">
                          ${example.picUrl ? `<img src="${escapeHtml(example.picUrl)}" alt="" loading="lazy" />` : ''}
                          <div>
                            <strong>${escapeHtml(example.songName || '')}</strong>
                            <span class="hint">${escapeHtml((example.artistName || []).join(' / '))}</span>
                          </div>
                        </div>`
                      : ''
                  }
                </article>
              `
            })
            .join('')}
        </div>
      </aside>`
    : ''

  const resultHtml = lastResult
    ? `<div class="ugc-vote-result">
        <p><strong>${lastResult.success ? '提交成功' : '已提交'}</strong>
          ${lastResult.points != null ? ` · 本次 +${lastResult.points} 分` : ''}
        </p>
        ${lastResult.errorAnalysis ? `<p class="hint">${escapeHtml(lastResult.errorAnalysis)}</p>` : ''}
        ${
          lastResult.dayErrorNum != null
            ? `<p class="hint">今日错误 ${lastResult.dayErrorNum}${
                lastResult.dayErrorNumStandard != null ? ` / ${lastResult.dayErrorNumStandard}` : ''
              }${lastResult.dayErrorNumLimit ? '（已达上限）' : ''}</p>`
            : ''
        }
        ${lastResult.message ? `<p class="hint">${escapeHtml(lastResult.message)}</p>` : ''}
        <button id="ugcVoteNextBtn" type="button" class="btn-primary">
          ${index < items.length - 1 ? '下一首' : '继续拉取'}
        </button>
      </div>`
    : `<div class="ugc-vote-judge">
        <p class="ugc-exam-prompt">请判定初始标签是否正确</p>
        <div class="ugc-vote-actions">
          <button type="button" class="ugc-vote-btn pass" data-judgement="1">
            <strong>同意</strong>
            <span>标签正确</span>
          </button>
          <button type="button" class="ugc-vote-btn reject" data-judgement="2">
            <strong>不同意</strong>
            <span>标签错误</span>
          </button>
        </div>
        <p class="hint">听歌后判断「${escapeHtml(item.initResult || '该标签')}」是否贴切</p>
      </div>`

  ugcExamContent.innerHTML = `
    <div class="ugc-vote-layout${guidesHtml ? '' : ' no-guides'}">
      <div class="ugc-exam-card ugc-vote-main">
        <div class="ugc-exam-head">
          <strong>${escapeHtml(state.auditTypeName || '投票审核')}</strong>
          <span class="hint">${[queueProgress, progress ? `活动 ${progress}` : '', item.points != null ? `积分 ${item.points}` : '']
            .filter(Boolean)
            .join(' · ')}</span>
        </div>
        <div class="ugc-exam-song">
          ${item.coverUrl ? `<img src="${escapeHtml(item.coverUrl)}" alt="" loading="lazy" />` : ''}
          <div>
            <strong>${escapeHtml(item.resName || '未知歌曲')}</strong>
            <p class="hint">${escapeHtml(item.artists || '')}</p>
            ${item.songUrl ? `<audio controls preload="none" src="${escapeHtml(item.songUrl)}"></audio>` : '<p class="hint">暂无试听地址</p>'}
          </div>
        </div>
        <div class="ugc-init-tag">
          <span class="hint">初始判定</span>
          <strong>${escapeHtml(item.initResult || '无')}</strong>
          ${item.tagId != null ? `<span class="hint">tagId ${escapeHtml(String(item.tagId))}</span>` : ''}
          ${currentGuide?.guideText ? `<p class="hint ugc-init-guide">${escapeHtml(currentGuide.guideText)}</p>` : ''}
        </div>
        ${item.lyric ? `<pre class="ugc-exam-lyric">${escapeHtml(String(item.lyric).slice(0, 1200))}</pre>` : ''}
        ${resultHtml}
        <p id="ugcExamStatus" class="hint"></p>
      </div>
      ${guidesHtml}
    </div>
  `
  ugcExamPanel.classList.remove('hidden')
  ugcExamPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  ugcExamContent.querySelectorAll('.ugc-vote-btn').forEach((btn) => {
    btn.addEventListener('click', () => submitUgcVoteJudgement(Number(btn.dataset.judgement)))
  })
  document.getElementById('ugcVoteNextBtn')?.addEventListener('click', advanceUgcVoteQueue)
}

function renderUgcAuditHistory(records = [], total = 0) {
  if (!ugcAuditHistory) return
  if (ugcAuditHistorySummary) {
    ugcAuditHistorySummary.textContent = total ? `共 ${total} 条` : records.length ? `${records.length} 条` : '暂无记录'
  }
  if (!records.length) {
    ugcAuditHistory.innerHTML = emptyState('暂无审核历史', '○')
    return
  }
  ugcAuditHistory.innerHTML = records
    .map(
      (item) => `
        <article class="ugc-audit-history-item">
          ${item.imgUrl ? `<img src="${escapeHtml(item.imgUrl)}" alt="" loading="lazy" />` : ''}
          <div class="ugc-audit-history-main">
            <strong>${escapeHtml(item.resName || '未知歌曲')}</strong>
            <p class="hint">${escapeHtml(item.artists || '')}</p>
            <p class="ugc-meta">
              <span class="badge">${escapeHtml(item.initJudgement || '—')}</span>
              <span>${escapeHtml(voteJudgementLabel(item.userJudgement))}</span>
              <span>${escapeHtml(voteHistoryStatusLabel(item.status))}</span>
              ${item.points != null ? `<span>+${item.points}</span>` : ''}
              ${item.time ? `<span>${escapeHtml(item.time)}</span>` : ''}
            </p>
          </div>
        </article>
      `,
    )
    .join('')
}

function renderUgcStats(data) {
  renderUgcProfile(data)
  renderUgcDailyReward(data)
  renderUgcLottery(data.lottery)
  renderUgcMall(data.mall)

  if (data.signed != null || data.signDays != null) {
    ugcSignBtn.textContent = data.signed ? `已签到（连续 ${data.signDays || 0} 天）` : '今日签到'
    ugcSignBtn.disabled = Boolean(data.signed)
  } else {
    ugcSignBtn.textContent = '今日签到'
    ugcSignBtn.disabled = false
  }
}

function renderUgcIntegration(records, { page = 1, total = 0 } = {}) {
  if (!records?.length) {
    ugcIntegration.innerHTML = emptyState('暂无积分明细', '○')
    ugcIntegration.classList.remove('hidden')
    return
  }

  ugcIntegration.innerHTML = `
    <div class="ugc-integration-wrap">
      ${records
        .map(
          (item) => `
        <article class="ugc-integration-item">
          <div class="ugc-integration-main">
            <strong>${escapeHtml(item.reason || '积分变动')}</strong>
            <span class="${item.amount >= 0 ? 'points-plus' : 'points-minus'}">${item.amount >= 0 ? '+' : ''}${item.amount}</span>
          </div>
          ${item.createTime ? `<p class="ugc-meta">${escapeHtml(formatTime(item.createTime))}</p>` : ''}
        </article>
      `,
        )
        .join('')}
      ${buildPaginationHtml({ page, pageSize: INTEGRATION_PAGE_SIZE, total, id: 'integration' })}
    </div>
  `
  ugcIntegration.classList.remove('hidden')

  bindPagination(
    ugcIntegration,
    'integration',
    INTEGRATION_PAGE_SIZE,
    () => integrationPage,
    (nextPage) => {
      integrationPage = nextPage
    },
    () => integrationTotal,
    (nextPage) => loadIntegrationRecords(nextPage),
  )
}

function renderUgcItems(items, append = false) {
  if (!append) updateUgcRecordsSummary(items)

  if (!items.length && !append) {
    ugcList.innerHTML = emptyState('暂无贡献记录', '○')
    return
  }

  const html = items
    .map(
      (item) => `
        <article class="ugc-item">
          <div class="ugc-item-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="badge type-tag">${escapeHtml(item.typeName)}</span>
          </div>
          <p class="ugc-meta">
            <span class="badge ${auditStatusClass(item.auditStatus)}">${escapeHtml(item.auditStatusName)}</span>
            ${item.score != null ? `<span class="ugc-meta-sep">·</span><span>+${item.score} 积分</span>` : ''}
            ${item.createTime ? `<span class="ugc-meta-sep">·</span><span>${escapeHtml(formatTime(item.createTime))}</span>` : ''}
          </p>
          ${item.reason ? `<p class="ugc-reason">${escapeHtml(item.reason)}</p>` : ''}
        </article>
      `,
    )
    .join('')

  if (append) {
    ugcList.insertAdjacentHTML('beforeend', html)
  } else {
    ugcList.innerHTML = html
  }
}

async function loadUgcDevote() {
  const cookie = getCookie()
  if (!cookie) {
    if (ugcProfile) {
      ugcProfile.innerHTML = emptyState('请先 Cookie 登录', '—')
      ugcProfile.classList.remove('hidden')
    }
    ugcDailyReward?.classList.add('hidden')
    ugcIntegration.classList.add('hidden')
    renderUgcLottery(null, { needLogin: true })
    renderUgcMall(null, { needLogin: true })
    return
  }

  if (ugcProfile) {
    ugcProfile.innerHTML = emptyState('正在加载云小编数据…', '…')
    ugcProfile.classList.remove('hidden')
  }

  try {
    await ensureServerReady(['ugc'])
    const data = await fetchPostApi('/api/ugc/dashboard', { cookie })
    ugcDashboard = data
    renderUgcStats(data)
    renderUgcAuditTasks(data.auditTasks || [], data.examInfo)
    renderUgcOfficialTasks(data.officialTasks || [])
    renderUgcHonorRoll(data.honorRoll?.records || [], data.honorRoll?.typeName)
  } catch (err) {
    if (ugcProfile) {
      ugcProfile.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
      ugcProfile.classList.remove('hidden')
    }
  }
}

async function loadUgcLottery() {
  const cookie = getCookie()
  if (!cookie) {
    renderUgcLottery(null, { needLogin: true })
    return
  }

  renderUgcLottery(null, { loading: true })
  try {
    const data = await fetchPostApi('/api/ugc/lottery/pool', { cookie })
    if (ugcDashboard) ugcDashboard.lottery = data
    renderUgcLottery(data)
  } catch (err) {
    renderUgcLottery(null, { error: err.message || '加载失败' })
  }
}

async function loadUgcMall() {
  const cookie = getCookie()
  if (!cookie) {
    renderUgcMall(null, { needLogin: true })
    return
  }

  renderUgcMall(null, { loading: true })
  try {
    const data = await fetchPostApi('/api/ugc/mall/products', { cookie })
    if (ugcDashboard) ugcDashboard.mall = data
    mallInlinePage = 1
    renderUgcMall(data)
  } catch (err) {
    renderUgcMall(null, { error: err.message || '加载失败' })
  }
}

async function drawUgcLottery(entryType) {
  const cookie = getCookie()
  if (!cookie) return

  const checkToken = document.getElementById('ugcLotteryCheckToken')?.value?.trim()
  const activityId = ugcDashboard?.lottery?.activityId

  try {
    const data = await fetchPostApi('/api/ugc/lottery/draw', {
      cookie,
      entryType: Number(entryType),
      activityId,
      checkToken: checkToken || undefined,
      poolPrizes: ugcDashboard?.lottery?.prizes,
    })

    if (data.won) {
      const prizeLabel = data.prizeLabel || data.prizeName || '未知奖品'
      showToast(`中奖：${prizeLabel}`, 'success')
    } else {
      showToast(data.message || (data.code === 460 ? '很遗憾，未中奖' : '抽奖完成'), 'info')
    }

    await loadUgcLottery()
    await loadUgcDevote()
  } catch (err) {
    showToast(err.message || '抽奖失败', 'error')
  }
}

async function loadUgcHonorRoll(type = ugcHonorType) {
  const cookie = getCookie()
  if (!cookie || !ugcHonorRoll) return

  ugcHonorType = Number(type) || 1
  document.querySelectorAll('.ugc-honor-tab').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.honorType) === ugcHonorType)
  })

  ugcHonorRoll.innerHTML = emptyState('正在加载榜单…', '…')
  updateUgcHonorSummary([], '', { loading: true })
  try {
    const data = await fetchPostApi('/api/ugc/honor-roll', { cookie, type: ugcHonorType })
    renderUgcHonorRoll(data.records || [], data.typeName)
  } catch (err) {
    ugcHonorRoll.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
  }
}

async function claimUgcVipReward() {
  const cookie = getCookie()
  if (!cookie || !ugcClaimVipBtn) return

  ugcClaimVipBtn.disabled = true
  try {
    const data = await fetchPostApi('/api/ugc/vip/claim', { cookie })
    if (!data.ok && data.message) throw new Error(data.message)
    showToast(data.title || data.message || '领取请求已提交', 'success')
    await loadUgcDevote()
  } catch (err) {
    showToast(err.message || '领取失败', 'error')
    ugcClaimVipBtn.disabled = false
  }
}

async function startUgcExamFallback(auditType, auditTypeName) {
  const cookie = getCookie()
  if (!cookie) return

  const start = await fetchPostApi('/api/ugc/exam/start', { cookie, auditType })
  if (!start.taskId) {
    throw new Error(formatClientError(start.raw, '无法开始审核，请稍后再试'))
  }
  ugcExamState = {
    mode: 'exam',
    auditType,
    auditTypeName,
    taskId: start.taskId,
  }
  await loadUgcExamQuestion()
}

async function startUgcAudit(auditType, auditTypeName) {
  const cookie = getCookie()
  if (!cookie) {
    showToast('请先 Cookie 登录', 'error')
    return
  }

  if (ugcExamContent) ugcExamContent.innerHTML = emptyState('正在加载审核任务…', '…')
  ugcExamPanel?.classList.remove('hidden')
  if (ugcExamPanelTitle) ugcExamPanelTitle.textContent = '正在审核'

  try {
    await ensureServerReady(['ugc'])
    const activityId = ugcDashboard?.activity?.activityId
    const data = await fetchPostApi('/api/ugc/audit/start', {
      cookie,
      auditType,
      activityId,
    })
    const queue = Array.isArray(data.items) ? data.items : []
    ugcExamState = {
      mode: 'vote',
      auditType,
      auditTypeName,
      queue,
      index: 0,
      guides: Array.isArray(data.guides) ? data.guides : [],
      lastResult: null,
      message: data.message || null,
    }
    if (!queue.length) {
      const needExam = ugcDashboard?.examInfo?.hasPassExamination === false
      if (needExam) {
        try {
          await startUgcExamFallback(auditType, auditTypeName)
          showToast('请先完成资格测验', 'info')
          return
        } catch {
          /* fall through to empty vote panel */
        }
      }
      renderUgcVoteAudit(ugcExamState)
      return
    }
    renderUgcVoteAudit(ugcExamState)
  } catch (err) {
    const needExam = ugcDashboard?.examInfo?.hasPassExamination === false
    if (needExam) {
      try {
        await startUgcExamFallback(auditType, auditTypeName)
        showToast('投票审核暂不可用，已改用资格测验', 'info')
        return
      } catch {
        /* ignore */
      }
    }
    showToast(formatClientError(err, '开始审核失败'), 'error')
    ugcExamPanel?.classList.add('hidden')
  }
}

async function loadUgcExamQuestion() {
  const cookie = getCookie()
  if (!cookie || !ugcExamState?.taskId || ugcExamState.mode !== 'exam') return

  const statusEl = document.getElementById('ugcExamStatus')
  if (statusEl) statusEl.textContent = '正在加载题目…'

  try {
    const data = await fetchPostApi('/api/ugc/exam/question', {
      cookie,
      taskId: ugcExamState.taskId,
      auditType: ugcExamState.auditType,
    })
    ugcExamState.question = data.question
    renderUgcExamQuestion(ugcExamState)
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || '加载题目失败'
  }
}

async function submitUgcExamAnswer(override = null) {
  const cookie = getCookie()
  const answerInput = document.getElementById('ugcExamAnswerInput')?.value?.trim()
  const statusEl = document.getElementById('ugcExamStatus')
  if (!cookie || ugcExamState?.mode !== 'exam' || !ugcExamState?.taskId || !ugcExamState?.question?.questionId) {
    return
  }

  const payload = override || {}
  const answer = payload.answer ?? answerInput
  if (!answer) {
    if (statusEl) statusEl.textContent = '请先选择或填写答案'
    return
  }

  const submitBtn = document.getElementById('ugcExamSubmitBtn')
  if (submitBtn) submitBtn.disabled = true
  ugcExamContent?.querySelectorAll('.ugc-exam-option').forEach((btn) => {
    btn.disabled = true
  })
  if (statusEl) statusEl.textContent = '正在提交…'

  try {
    const data = await fetchPostApi('/api/ugc/exam/submit', {
      cookie,
      taskId: ugcExamState.taskId,
      auditType: ugcExamState.auditType,
      questionId: ugcExamState.question.questionId,
      answer,
      answerId: payload.answerId,
      selectId: payload.answerId,
      selectContent: payload.selectContent ?? answer,
      content: payload.content ?? answer,
    })
    if (statusEl) {
      statusEl.textContent = data.message || (data.ok ? '提交成功，加载下一题…' : '提交完成')
    }
    await loadUgcDevote()
    await loadUgcExamQuestion()
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || '提交失败'
  } finally {
    if (submitBtn) submitBtn.disabled = false
    ugcExamContent?.querySelectorAll('.ugc-exam-option').forEach((btn) => {
      btn.disabled = false
    })
  }
}

async function submitUgcVoteJudgement(judgement) {
  const cookie = getCookie()
  const statusEl = document.getElementById('ugcExamStatus')
  const item = ugcExamState?.queue?.[ugcExamState.index]
  if (!cookie || ugcExamState?.mode !== 'vote' || !item) return

  ugcExamContent?.querySelectorAll('.ugc-vote-btn').forEach((btn) => {
    btn.disabled = true
  })
  if (statusEl) statusEl.textContent = '正在提交判定…'

  try {
    const data = await fetchPostApi('/api/ugc/audit/submit', {
      cookie,
      taskId: item.taskId,
      resId: item.resId,
      judgement,
      tagId: item.tagId,
      activityId: item.activityId,
      auditType: ugcExamState.auditType,
      auditGoalType: item.auditGoalType,
      initResult: item.initResult,
    })
    ugcExamState.lastResult = data
    renderUgcVoteAudit(ugcExamState)
    await loadUgcDevote()
    ugcAuditHistoryLoaded = false
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || '提交失败'
    ugcExamContent?.querySelectorAll('.ugc-vote-btn').forEach((btn) => {
      btn.disabled = false
    })
  }
}

async function advanceUgcVoteQueue() {
  if (!ugcExamState || ugcExamState.mode !== 'vote') return
  const nextIndex = (ugcExamState.index || 0) + 1
  if (nextIndex < (ugcExamState.queue?.length || 0)) {
    ugcExamState.index = nextIndex
    ugcExamState.lastResult = null
    renderUgcVoteAudit(ugcExamState)
    return
  }
  await startUgcAudit(ugcExamState.auditType, ugcExamState.auditTypeName)
}

function closeUgcExamPanel() {
  ugcExamState = null
  ugcExamPanel?.classList.add('hidden')
  if (ugcExamPanelTitle) ugcExamPanelTitle.textContent = '正在审核'
  if (ugcExamContent) ugcExamContent.innerHTML = ''
}

async function loadUgcAuditHistory() {
  const cookie = getCookie()
  if (!cookie || !ugcAuditHistory) return

  ugcAuditHistory.innerHTML = emptyState('正在加载审核历史…', '…')
  if (ugcAuditHistorySummary) ugcAuditHistorySummary.textContent = '加载中…'
  try {
    await ensureServerReady(['ugc'])
    const data = await fetchPostApi('/api/ugc/audit/history', {
      cookie,
      limit: 20,
      offset: 0,
    })
    ugcAuditHistoryLoaded = true
    renderUgcAuditHistory(data.records || [], data.total || 0)
  } catch (err) {
    ugcAuditHistory.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
    if (ugcAuditHistorySummary) ugcAuditHistorySummary.textContent = '加载失败'
  }
}

async function loadIntegrationRecords(page = 1) {
  const cookie = getCookie()
  if (!cookie) {
    ugcIntegration.innerHTML = emptyState('请先 Cookie 登录', '—')
    ugcIntegration.classList.remove('hidden')
    return
  }

  integrationPage = page
  loadIntegrationBtn.disabled = true
  ugcIntegration.innerHTML = emptyState('正在加载积分明细…', '…')
  ugcIntegration.classList.remove('hidden')

  try {
    await ensureServerReady(['ugc'])
    const data = await fetchPostApi('/api/ugc/integration/records', {
      cookie,
      limit: INTEGRATION_PAGE_SIZE,
      offset: (page - 1) * INTEGRATION_PAGE_SIZE,
    })
    integrationTotal = data.total ?? (data.records || []).length
    renderUgcIntegration(data.records || [], { page, total: integrationTotal })
  } catch (err) {
    ugcIntegration.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
  } finally {
    loadIntegrationBtn.disabled = false
  }
}

async function signUgcToday() {
  const cookie = getCookie()
  if (!cookie) return

  ugcSignBtn.disabled = true
  try {
    const res = await fetch('/api/ugc/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie }),
    })
    const data = await parseJsonResponse(res)
    if (!data.ok) throw new Error(data.error)
    showToast('签到成功', 'success')
    await loadUgcDevote()
    await loadIntegrationRecords()
  } catch (err) {
    showToast(err.message || '签到失败', 'error')
    ugcSignBtn.disabled = false
  }
}

function sheetUploadStatusName(item) {
  if (item.statusName) return item.statusName
  const key = String(item.status ?? '')
  return SHEET_UPLOAD_STATUS[key] || (key ? `状态 ${key}` : '未知状态')
}

function setSheetUploadStatus(message, type = '') {
  sheetUploadStatus.textContent = message || ''
  sheetUploadStatus.className = `sheet-upload-status${type ? ` ${type}` : ''}`
}

function renderSheetPermission(data) {
  if (!data) {
    sheetPermission.classList.add('hidden')
    sheetPermission.innerHTML = ''
    return
  }

  const canUpload = data.canUpload === true
  const cls = canUpload ? 'ok' : 'warn'
  sheetPermission.className = `sheet-permission ${cls}`
  sheetPermission.innerHTML = `
    <p><strong>${canUpload ? '可以上传' : '不可上传'}</strong> · ${escapeHtml(data.note || '')}</p>
    <p class="hint">歌曲开放上传：${data.songAllowsUpload ? '是' : '否'}${
      (data.uploadSheet ?? data.sheetMeta?.uploadSheet) != null
        ? `（uploadSheet=${data.uploadSheet ?? data.sheetMeta?.uploadSheet}）`
        : ''
    }${
      data.existEnableSheet === false
        ? ' · 各版本累计奖励名额已满'
        : data.existEnableSheet === true
          ? ' · 仍有奖励名额'
          : ''
    }</p>
    ${
      data.creatorVerified != null
        ? `<p class="hint">创作者认证：${data.creatorVerified ? '是' : '否'}</p>`
        : ''
    }
    ${
      data.rewardSlotsFull
        ? `<p class="hint">各版本累计奖励名额已满${
            data.rewardUploadNumber != null && data.rewardUploadLimit != null
              ? `（${data.rewardUploadNumber}/${data.rewardUploadLimit}）`
              : ''
          }</p>`
        : data.rewardUploadNumber != null && data.rewardUploadLimit != null
          ? `<p class="hint">各版本累计奖励进度：${data.rewardUploadNumber}/${data.rewardUploadLimit}</p>`
          : data.hintInfo?.uploadNumber != null && data.hintInfo?.integrationUploadLimit != null
            ? `<p class="hint">各版本累计奖励进度：${data.hintInfo.uploadNumber}/${data.hintInfo.integrationUploadLimit}</p>`
            : data.sheetCount != null
              ? `<p class="hint">当前乐谱总数：${data.sheetCount}（各版本累计，满 ${data.rewardUploadLimit ?? 5} 份无奖励）</p>`
              : ''
    }
  `
  sheetPermission.classList.remove('hidden')
}

let manualUploadFileParse = null

function parseManualUploadPdfFilename(filename) {
  const parser = globalThis.CcgqParse?.parseCcgqPdfFilename
  if (!parser) return null
  return parser(filename)
}

function applyParsedKindToManualUpload(parsed) {
  if (!parsed?.defaultKind || !sheetKind?.options?.length) return false
  const target = String(parsed.defaultKind)
  const hasOption = [...sheetKind.options].some((opt) => opt.value === target)
  if (!hasOption) return false
  sheetKind.value = target
  syncManualSheetName()
  return true
}

function buildManualUploadParseHint(parsed) {
  if (!parsed) return ''
  const parts = []
  if (parsed.songId) parts.push(`歌曲 ID ${parsed.songId}`)
  if (parsed.songName) parts.push(`「${parsed.songName}」`)
  if (parsed.musicKey) parts.push(`调号 ${formatMusicKeyLabel(parsed.musicKey)}`)
  if (parsed.format === 'wuxian') parts.push('五线谱')
  else if (parsed.format === 'jianpu') parts.push('简谱')
  return parts.length ? `已从文件名识别：${parts.join(' · ')}` : ''
}

function applyManualUploadFromPdfFile(file) {
  if (!file) {
    manualUploadFileParse = null
    return
  }

  const parsed = parseManualUploadPdfFilename(file.name)
  manualUploadFileParse = parsed

  if (!parsed) {
    setSheetUploadStatus('无法从文件名识别，请手动填写（命名格式见下方批量上传说明）', 'error')
    return
  }

  if (parsed.songId && sheetSongId) {
    const prev = sheetSongId.value.trim()
    if (prev !== String(parsed.songId)) {
      sheetSongId.value = parsed.songId
      resetSheetUploadSelects()
    }
  }

  if (parsed.musicKey && sheetMusicKey) {
    sheetMusicKey.value = parsed.musicKey
  }

  applyParsedKindToManualUpload(parsed)

  const hint = buildManualUploadParseHint(parsed)
  if (!hint) return

  setSheetUploadStatus(
    parsed.songId ? `${hint}，请点击「检查上传权限」` : hint,
    'success',
  )
}

function resetSheetUploadSelects() {
  sheetUploadConfig = null
  if (sheetType) {
    sheetType.innerHTML = '<option value="">先检查权限后加载</option>'
  }
  if (sheetKind) {
    sheetKind.innerHTML = '<option value="">先检查权限后加载</option>'
  }
}

function buildSheetUploadConfig(perm, extra) {
  const source = { ...(perm || {}), ...(extra || {}) }
  const fromInfo =
    source.uploadInfo ||
    (source.ok && source.data ? source.data : null) ||
    source

  const typeList =
    (fromInfo?.typeList?.length ? fromInfo.typeList : null) ||
    source.typeList ||
    source.sheetMeta?.instrumentTypes ||
    []
  const kindList =
    (fromInfo?.kindList?.length ? fromInfo.kindList : null) ||
    source.kindList ||
    []

  return {
    ...(typeof fromInfo === 'object' && fromInfo ? fromInfo : {}),
    typeList,
    kindList,
    playVersionList:
      fromInfo?.playVersionList ||
      source.playVersionList || ['演奏版', '弹唱版'],
    limitVO:
      fromInfo?.limitVO ||
      source.limitVO ||
      source.uploadLimits ||
      null,
  }
}

function populateSheetSelects(config = {}) {
  const fillSelect = (el, list, placeholder, loadingPlaceholder) => {
    if (!el) return false
    const items = list || []
    if (!items.length) {
      el.innerHTML = `<option value="">${escapeHtml(loadingPlaceholder || placeholder)}</option>`
      return false
    }
    el.innerHTML = items
      .map((item) => `<option value="${item.code}">${escapeHtml(item.name)}</option>`)
      .join('')
    return true
  }

  const hasType = fillSelect(sheetType, config.typeList, '暂无乐器分类', '先检查权限后加载')
  const hasKind = fillSelect(sheetKind, config.kindList, '暂无谱面类型', '先检查权限后加载')

  if (config.playVersionList?.length && sheetPlayVersion) {
    sheetPlayVersion.innerHTML = config.playVersionList
      .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
      .join('')
  }

  syncManualSheetName()
  return hasType && hasKind
}

function isSheetUploadListMode() {
  return ugcType?.value === 'sheet-upload'
}

function syncUgcFilterUI() {
  const sheetMode = isSheetUploadListMode()
  if (ugcAuditField) {
    ugcAuditField.classList.toggle('hidden', false)
  }
  if (loadUgcBtn) {
    loadUgcBtn.textContent = sheetMode ? '加载上传列表' : '加载列表'
  }
}

function renderUgcListPagination() {
  let pager = document.getElementById('ugcListPagination')
  if (!ugcListTotal || ugcListTotal <= UGC_LIST_PAGE_SIZE) {
    pager?.remove()
    return
  }

  const html = buildPaginationHtml({
    page: ugcListPage,
    pageSize: UGC_LIST_PAGE_SIZE,
    total: ugcListTotal,
    id: 'ugc-list',
  })

  if (!pager) {
    pager = document.createElement('div')
    pager.id = 'ugcListPagination'
    pager.className = 'ugc-list-pagination'
    ugcList.after(pager)
  }
  pager.innerHTML = html

  bindPagination(
    pager,
    'ugc-list',
    UGC_LIST_PAGE_SIZE,
    () => ugcListPage,
    (page) => {
      ugcListPage = page
    },
    () => ugcListTotal,
    (page) => loadUgcDetail(page),
  )
}

function hideUgcLoadMore() {
  document.getElementById('ugcLoadMoreBtn')?.remove()
  document.getElementById('ugcListPagination')?.remove()
}

function filterSheetUploadItems(items, auditStatus) {
  if (!auditStatus) return items
  return items.filter((item) => String(item.status ?? '') === auditStatus)
}

function renderSheetUploadList(items, total = 0, container = ugcList) {
  if (!container) return

  container.classList.add('sheet-upload-list')

  if (!items?.length) {
    container.innerHTML = emptyState('暂无已上传乐谱', '○')
    return
  }

  container.innerHTML = items
    .map((item) => {
      const displayCover = item.songCover || item.cover
      const sheetThumb =
        item.cover && item.cover !== item.songCover
          ? item.cover
          : ''
      const songTitle = item.songName || (item.songId ? `歌曲 #${item.songId}` : '未知歌曲')
      const sheetTitle = item.name && item.name !== item.songName ? item.name : ''
      const uploadTimeText = item.createTime ? formatTime(item.createTime) : ''
      const metaParts = [
        item.type ? `<span class="sheet-upload-tag">${escapeHtml(item.type)}</span>` : '',
        item.key ? `<span class="sheet-upload-tag">${escapeHtml(item.key)}</span>` : '',
        item.pages != null ? `<span class="sheet-upload-tag">${item.pages} 页</span>` : '',
        item.version ? `<span class="sheet-upload-tag">${escapeHtml(item.version)}</span>` : '',
        uploadTimeText
          ? `<span class="sheet-upload-tag sheet-upload-time">${escapeHtml(uploadTimeText)}</span>`
          : '',
      ].filter(Boolean)

      return `
        <article class="sheet-upload-card" data-sheet-id="${escapeHtml(String(item.id || ''))}" data-song-id="${escapeHtml(String(item.songId || ''))}" data-music-sheet-id="${escapeHtml(String(item.musicSheetId || ''))}" data-upload-record-id="${escapeHtml(String(item.uploadRecordId || ''))}" data-type-code="${escapeHtml(String(item.typeCode ?? ''))}" data-kind-code="${escapeHtml(String(item.kindCode ?? ''))}">
          <div class="sheet-upload-media">
            ${
              displayCover
                ? `<img class="sheet-upload-song-cover" src="${escapeHtml(songCoverUrl(displayCover))}" alt="" loading="lazy" referrerpolicy="no-referrer" data-cover="${escapeHtml(normalizeCoverUrl(displayCover))}" />`
                : `<div class="sheet-upload-song-cover placeholder" aria-hidden="true">♪</div>`
            }
            ${
              sheetThumb
                ? `<img class="sheet-upload-sheet-thumb" src="${escapeHtml(songCoverUrl(sheetThumb))}" alt="" loading="lazy" referrerpolicy="no-referrer" title="乐谱封面" data-cover="${escapeHtml(normalizeCoverUrl(sheetThumb))}" />`
                : ''
            }
          </div>
          <div class="sheet-upload-body">
            <div class="sheet-upload-head">
              <div class="sheet-upload-titles">
                <h4 class="sheet-upload-song">${escapeHtml(songTitle)}</h4>
                ${sheetTitle ? `<p class="sheet-upload-sheet-name">${escapeHtml(sheetTitle)}</p>` : ''}
                ${
                  item.artists || item.album
                    ? `<p class="sheet-upload-sub">${escapeHtml([item.artists, item.album].filter(Boolean).join(' · '))}</p>`
                    : ''
                }
              </div>
              <span class="badge ${auditStatusClass(item.status)} sheet-upload-status-badge">${escapeHtml(sheetUploadStatusName(item))}</span>
            </div>
            ${
              metaParts.length
                ? `<div class="sheet-upload-tags">${metaParts.join('')}</div>`
                : ''
            }
            <p class="sheet-upload-foot">
              ${item.songId ? `<span>ID ${escapeHtml(String(item.songId))}</span>` : ''}
              ${item.id ? `<span class="sheet-upload-foot-sep">·</span><span>乐谱 #${escapeHtml(String(item.id))}</span>` : ''}
              ${
                uploadTimeText
                  ? `<span class="sheet-upload-foot-sep">·</span><span>上传 ${escapeHtml(uploadTimeText)}</span>`
                  : ''
              }
            </p>
          </div>
          <div class="sheet-upload-actions">
            ${
              item.id
                ? `<button type="button" class="btn-secondary btn-sm sheet-preview-btn" data-sheet-id="${escapeHtml(String(item.id))}">预览</button>`
                : ''
            }
            ${
              item.id
                ? `<button type="button" class="btn-text sheet-delete-btn" data-sheet-id="${escapeHtml(String(item.id))}" data-song-id="${escapeHtml(String(item.songId || ''))}">删除</button>`
                : ''
            }
            ${
              item.id
                ? `<button type="button" class="btn-text sheet-hide-btn" data-sheet-id="${escapeHtml(String(item.id))}">从列表隐藏</button>`
                : ''
            }
          </div>
        </article>
      `
    })
    .join('')

  container.querySelectorAll('.sheet-upload-song-cover[data-cover], .sheet-upload-sheet-thumb[data-cover]').forEach((img) => {
    bindSongCover(img, img.dataset.cover)
  })

  if (total > items.length) {
    container.insertAdjacentHTML(
      'beforeend',
      `<p class="hint sheet-upload-total-hint">共 ${total} 条 · 第 ${sheetUploadPage} 页</p>`,
    )
  }
}

function renderSheetUploadPagination() {
  let pager = document.getElementById('sheetUploadPagination')
  if (!sheetUploadTotal || sheetUploadTotal <= SHEET_UPLOAD_PAGE_SIZE) {
    pager?.remove()
    return
  }

  const html = buildPaginationHtml({
    page: sheetUploadPage,
    pageSize: SHEET_UPLOAD_PAGE_SIZE,
    total: sheetUploadTotal,
    id: 'sheet-upload',
  })

  if (!pager) {
    pager = document.createElement('div')
    pager.id = 'sheetUploadPagination'
    pager.className = 'sheet-upload-pagination'
    ugcList.after(pager)
  }
  pager.innerHTML = html

  bindPagination(
    pager,
    'sheet-upload',
    SHEET_UPLOAD_PAGE_SIZE,
    () => sheetUploadPage,
    (page) => {
      sheetUploadPage = page
    },
    () => sheetUploadTotal,
    (page) => loadSheetUploadList(page),
  )
}

async function loadSheetUploadList(page = 1) {
  const cookie = getCookie()
  if (!cookie) {
    ugcList.innerHTML = emptyState('请先 Cookie 登录', '—')
    hideUgcLoadMore()
    return
  }

  sheetUploadPage = page
  ugcList.classList.add('sheet-upload-list')
  ugcList.innerHTML = emptyState('正在加载已上传乐谱…', '…')
  loadUgcBtn.disabled = true
  hideUgcLoadMore()

  try {
    await ensureServerReady(['sheet-upload'])
    const data = await fetchPostApi('/api/sheet/upload/list', {
      cookie,
      offset: (page - 1) * SHEET_UPLOAD_PAGE_SIZE,
      limit: SHEET_UPLOAD_PAGE_SIZE,
      verifyExisting: true,
    })

    const items = enrichSheetUploadTimes(
      filterSheetUploadItems(
        filterHiddenSheetItems(data.items || []),
        ugcAudit.value,
      ),
    )
    sheetUploadTotal = data.total || (data.items || []).length
    renderSheetUploadList(items, sheetUploadTotal, ugcList)
    renderSheetUploadPagination()

    if (data.filteredCount > 0) {
      ugcList.insertAdjacentHTML(
        'afterbegin',
        `<p class="hint sheet-upload-filter-hint">已隐藏 ${data.filteredCount} 条在 App 中已删除的已通过乐谱</p>`,
      )
    }

    if ((data.items || []).length && !items.length) {
      ugcList.innerHTML = emptyState('当前审核状态下没有乐谱', '○')
      hideUgcLoadMore()
    }
  } catch (err) {
    ugcList.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
    hideUgcLoadMore()
  } finally {
    loadUgcBtn.disabled = false
  }
}

function loadContributionList(page = 1) {
  if (isSheetUploadListMode()) {
    return loadSheetUploadList(page)
  }
  ugcList.classList.remove('sheet-upload-list')
  return loadUgcDetail(page)
}

async function checkSheetUploadPermission() {
  const cookie = getCookie()
  const songId = sheetSongId.value.trim()
  if (!cookie) {
    setSheetUploadStatus('请先登录', 'error')
    return
  }
  if (!songId) {
    setSheetUploadStatus('请填写歌曲 ID', 'error')
    return
  }

  checkSheetPermBtn.disabled = true
  setSheetUploadStatus('正在检查权限…')

  try {
    for (let round = 0; round < 2; round++) {
      if (round > 0) {
        setSheetUploadStatus('正在加载分类选项…')
        await sleep(700)
      }

      const perm = await fetchPostApi('/api/sheet/upload-permission', { cookie, songId })
      renderSheetPermission(perm)

      let infoPayload = perm
      if (round > 0 || !perm.uploadInfo?.kindList?.length) {
        try {
          const infoRes = await fetchPostApi('/api/sheet/upload/info', { cookie, songId })
          infoPayload = { ...perm, uploadInfo: infoRes.data || infoRes }
        } catch {
          // 单独 info 失败时仍尝试用权限接口里的数据
        }
      }

      const config = buildSheetUploadConfig(perm, infoPayload)
      const populated = populateSheetSelects(config)
      sheetUploadConfig = populated ? config : null
      if (manualUploadFileParse) {
        applyParsedKindToManualUpload(manualUploadFileParse)
      }

      if (perm.rewardUploadNumber != null && perm.rewardUploadLimit != null) {
        sheetUploadHint.textContent = `各版本累计 ${perm.rewardUploadNumber}/${perm.rewardUploadLimit}`
        sheetUploadHint.classList.remove('hidden')
      } else if (perm.hintInfo?.uploadNumber != null && perm.hintInfo?.integrationUploadLimit != null) {
        sheetUploadHint.classList.remove('hidden')
      } else if (perm.hint?.uploadNumber != null && perm.hint?.integrationUploadLimit != null) {
        sheetUploadHint.textContent = `奖励进度 ${perm.hint.uploadNumber}/${perm.hint.integrationUploadLimit}`
        sheetUploadHint.classList.remove('hidden')
      } else {
        sheetUploadHint.classList.add('hidden')
      }

      if (populated || !perm.canUpload || round === 1) {
        if (!populated && perm.canUpload) {
          setSheetUploadStatus('权限已通过，但分类选项未加载，请稍后再试', 'error')
        } else {
          setSheetUploadStatus(
            perm.canUpload ? '可以上传' : perm.note || '当前歌曲不允许上传',
            perm.canUpload ? 'success' : 'error',
          )
        }
        return
      }
    }
  } catch (err) {
    setSheetUploadStatus(err.message || '检查失败', 'error')
    resetSheetUploadSelects()
  } finally {
    checkSheetPermBtn.disabled = false
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

async function fetchUploadedSheetKeys(cookie) {
  const data = await fetchPostApi('/api/sheet/upload/existing-song-ids', { cookie })
  return new Set((data.keys || []).map(String))
}

async function submitSheetUploadForm(event) {
  event.preventDefault()

  const cookie = getCookie()
  if (!cookie) {
    setSheetUploadStatus('请先登录', 'error')
    return
  }

  const songId = sheetSongId.value.trim()
  const file = sheetPdfFile.files?.[0]
  const type = Number(sheetType.value)
  const kind = Number(sheetKind.value)

  if (!songId || !file) {
    setSheetUploadStatus('请填写歌曲 ID 并选择 PDF', 'error')
    return
  }
  if (!sheetUploadConfig) {
    setSheetUploadStatus('请先点击「检查上传权限」加载分类选项', 'error')
    return
  }
  if (!type || !kind) {
    setSheetUploadStatus('请选择乐器分类和谱面类型', 'error')
    return
  }
  syncManualSheetName()
  if (file.size > 100 * 1024 * 1024) {
    setSheetUploadStatus('PDF 不能超过 100MB', 'error')
    return
  }

  const pdfLimitKb = sheetUploadConfig?.limitVO?.pdfSizeLimit
  if (pdfLimitKb && file.size > pdfLimitKb * 1024) {
    setSheetUploadStatus(
      `PDF 超过账号限制（${Math.round(pdfLimitKb / 1024)}MB）`,
      'error',
    )
    return
  }

  submitSheetBtn.disabled = true
  setSheetUploadStatus('正在上传，请稍候（大文件可能需要几十秒）…')

  try {
    const fileBase64 = await readFileAsBase64(file)
    const res = await fetch('/api/sheet/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cookie,
        songId,
        useAppSheetName: true,
        type,
        kind,
        musicKey: normalizeMusicKeyForUpload(sheetMusicKey.value.trim() || 'C'),
        playVersion: sheetPlayVersion.value,
        filename: file.name,
        fileBase64,
        uploadLimits: sheetUploadConfig?.limitVO || null,
      }),
    })
    const data = await parseJsonResponse(res)
    if (!data.ok) {
      const parts = [data.error || `上传失败 (${res.status})`]
      if (data.step) parts.push(`步骤：${data.step}`)
      if (data.upstreamCode) parts.push(`上游码：${data.upstreamCode}`)
      throw new Error(parts.join(' · '))
    }

    if (data.skipped) {
      setSheetUploadStatus(data.reason || '该歌曲同类型谱面已在乐谱上传列表中，已跳过', 'success')
      await reloadSheetUploadListIfVisible()
      return
    }

    recordSheetUploadTime(songId, data.data?.id ?? data.data?.sheetId ?? data.upload?.fileKey)
    setSheetUploadStatus('上传提交成功', 'success')
    sheetUploadForm.reset()
    sheetUploadConfig = null
    sheetType.innerHTML = '<option value="">先检查权限后加载</option>'
    sheetKind.innerHTML = '<option value="">先检查权限后加载</option>'
    sheetPlayVersion.innerHTML = `
      <option value="演奏版">演奏版</option>
      <option value="弹唱版">弹唱版</option>
    `
    await reloadSheetUploadListIfVisible()
  } catch (err) {
    setSheetUploadStatus(err.message || '上传失败', 'error')
  } finally {
    submitSheetBtn.disabled = false
  }
}

function clampBatchNumber(value, min, max, fallback) {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.min(max, Math.max(min, Math.round(num)))
}

function getBatchMaxItems() {
  return clampBatchNumber(
    batchMaxItems?.value,
    1,
    batchLimits.MAX_ITEMS || 50,
    batchLimits.DEFAULT_MAX_ITEMS || 20,
  )
}

function getBatchIntervalMs() {
  return clampBatchNumber(
    Number(batchIntervalSec?.value) * 1000,
    batchLimits.MIN_INTERVAL_MS || 5000,
    batchLimits.MAX_INTERVAL_MS || 120000,
    batchLimits.DEFAULT_INTERVAL_MS || 10000,
  )
}

function getBatchSearchIntervalMs() {
  return clampBatchNumber(
    Number(batchSearchIntervalSec?.value) * 1000,
    batchLimits.MIN_SEARCH_INTERVAL_MS || 2000,
    batchLimits.MAX_SEARCH_INTERVAL_MS || 30000,
    batchLimits.DEFAULT_SEARCH_INTERVAL_MS || 3000,
  )
}

/** 基准间隔 + 随机浮动（约 ±18% 再加 1.5~6.5 秒） */
function randomBatchDelayMs(baseMs) {
  const minMs = batchLimits.MIN_INTERVAL_MS || 5000
  const maxMs = batchLimits.MAX_INTERVAL_MS || 120000
  const factor = 0.82 + Math.random() * 0.36
  const extra = 1500 + Math.floor(Math.random() * 5001)
  const delay = Math.round(baseMs * factor + extra)
  return Math.min(maxMs, Math.max(minMs, delay))
}

function formatBatchDelaySec(ms) {
  const sec = ms / 1000
  return sec >= 10 ? String(Math.round(sec)) : sec.toFixed(1)
}

function setBatchStatus(text, type = '') {
  if (!batchUploadStatus) return
  batchUploadStatus.textContent = text
  batchUploadStatus.className = `sheet-upload-status${type ? ` ${type}` : ''}`
}

function batchStatusLabel(status) {
  const map = {
    pending: '待处理',
    resolving: '匹配中',
    ready: '待上传',
    running: '上传中',
    ok: '成功',
    fail: '失败',
    skipped: '跳过',
  }
  return map[status] || status
}

function renderBatchSummary(counts = {}) {
  if (!batchUploadSummary) return
  const { total = 0, ok = 0, fail = 0, skipped = 0, ready = 0 } = counts
  batchUploadSummary.classList.remove('hidden')
  batchUploadSummary.innerHTML = [
    `<span class="summary-pill">共 ${total} 条</span>`,
    `<span class="summary-pill">待上传 ${ready}</span>`,
    `<span class="summary-pill">成功 ${ok}</span>`,
    `<span class="summary-pill">跳过 ${skipped}</span>`,
    `<span class="summary-pill">失败 ${fail}</span>`,
  ].join('')
}

function renderBatchList() {
  if (!batchUploadList) return
  if (!batchJobs.length) {
    batchUploadList.innerHTML = '<p class="hint">选择文件夹后点击「扫描文件」</p>'
    renderBatchSummary()
    batchUploadSummary?.classList.add('hidden')
    return
  }

  const counts = { total: batchJobs.length, ok: 0, fail: 0, skipped: 0, ready: 0 }
  for (const job of batchJobs) {
    if (job.status === 'ok') counts.ok++
    else if (job.status === 'fail') counts.fail++
    else if (job.status === 'skipped') counts.skipped++
    else if (job.status === 'ready' || job.status === 'pending') counts.ready++
  }
  renderBatchSummary(counts)

  batchUploadList.innerHTML = batchJobs
    .map((job) => {
      const cls = ['batch-upload-item']
      if (job.status === 'ok') cls.push('is-ok')
      if (job.status === 'fail') cls.push('is-fail')
      if (job.status === 'skipped') cls.push('is-skipped')
      if (job.status === 'running') cls.push('is-running')
      const meta = [
        job.format === 'wuxian' ? '五线谱' : '简谱',
        job.musicKey ? `调号 ${formatMusicKeyLabel(job.musicKey)}` : '',
        job.songId ? `ID ${job.songId}` : '未匹配 ID',
        job.matchedSong?.name ? `匹配 ${job.matchedSong.name}` : '',
        job.error ? job.error : '',
      ]
        .filter(Boolean)
        .join(' · ')
      return `
        <article class="${cls.join(' ')}">
          <span class="batch-upload-item-order">${job.id}</span>
          <div>
            <div class="batch-upload-item-title">${escapeHtml(job.filename)}</div>
            <div class="batch-upload-item-meta">${escapeHtml(job.songName)}${meta ? ` · ${escapeHtml(meta)}` : ''}</div>
          </div>
          <span class="batch-upload-item-badge">${escapeHtml(batchStatusLabel(job.status))}</span>
        </article>
      `
    })
    .join('')
}

async function loadBatchLimits() {
  try {
    const data = await fetchPostApi('/api/sheet/upload/batch-limits', {})
    if (data?.limits) {
      batchLimits = { ...batchLimits, ...data.limits }
      if (batchMaxItems) {
        batchMaxItems.max = String(batchLimits.MAX_ITEMS || 50)
      }
    }
  } catch {
    // 使用内置默认值
  }
}

async function scanBatchFolder() {
  const files = [...(batchFolderInput?.files || [])]
  if (!files.length) {
    setBatchStatus('请先选择文件夹', 'error')
    return
  }

  if (!window.CcgqParse) {
    setBatchStatus('缺少 ccgqParse.js，请刷新页面', 'error')
    return
  }

  batchScanBtn.disabled = true
  batchResolveBtn.disabled = true
  batchStartBtn.disabled = true
  setBatchStatus('正在扫描文件…')

  try {
    batchFileMap = new Map()
    const pdfNames = []
    let manifest = []

    for (const file of files) {
      const rel = file.webkitRelativePath || file.name
      const base = rel.split('/').pop()
      if (!base) continue
      if (base.toLowerCase() === 'manifest.json') {
        try {
          const text = await file.text()
          const parsed = JSON.parse(text)
          manifest = Array.isArray(parsed) ? parsed : parsed.items || []
        } catch {
          // ignore invalid manifest
        }
        continue
      }
      if (!base.toLowerCase().endsWith('.pdf')) continue
      if (window.CcgqParse.isSkippableTempFile(base)) continue
      pdfNames.push(base)
      batchFileMap.set(base.toLowerCase(), file)
    }

    const maxItems = getBatchMaxItems()
    const jobs = window.CcgqParse.buildJobsFromFilenames(pdfNames, { manifest }).slice(0, maxItems)
    batchJobs = jobs.map((job, index) => ({
      ...job,
      id: index + 1,
      status: job.songId ? 'ready' : 'pending',
    }))

    if (!batchJobs.length) {
      setBatchStatus('未识别到 ccgq 格式的 PDF（需 歌名.pdf 或 歌名_调号.pdf）', 'error')
      renderBatchList()
      return
    }

    if (pdfNames.length > maxItems) {
      setBatchStatus(`已扫描 ${pdfNames.length} 个 PDF，按限制仅处理前 ${maxItems} 条`, '')
    } else {
      const withId = batchJobs.filter((j) => j.songId).length
      setBatchStatus(
        withId === batchJobs.length
          ? `已扫描 ${batchJobs.length} 个文件，均已带歌曲 ID，可直接上传`
          : `已扫描 ${batchJobs.length} 个文件，${withId} 个已有歌曲 ID`,
        withId ? 'success' : '',
      )
    }

    renderBatchList()
    batchResolveBtn.disabled = !batchJobs.some((j) => !j.songId)
    batchStartBtn.disabled = !batchJobs.some((j) => j.songId)
  } catch (err) {
    setBatchStatus(err.message || '扫描失败', 'error')
  } finally {
    batchScanBtn.disabled = false
  }
}

async function resolveBatchSongIds() {
  const cookie = getCookie()
  if (!cookie) {
    setBatchStatus('请先登录', 'error')
    return
  }
  if (!batchJobs.length) {
    setBatchStatus('请先扫描文件', 'error')
    return
  }

  batchResolveBtn.disabled = true
  batchStartBtn.disabled = true
  setBatchStatus('正在匹配歌曲 ID（带间隔防封）…')

  try {
    const needResolve = batchJobs.filter((j) => !j.songId)
    if (!needResolve.length) {
      batchJobs = batchJobs.map((j) => ({ ...j, status: 'ready' }))
      setBatchStatus('所有文件已有歌曲 ID', 'success')
      renderBatchList()
      batchStartBtn.disabled = false
      return
    }

    const data = await fetchPostApi('/api/sheet/upload/batch-resolve', {
      items: needResolve.map((j) => ({
        id: j.id,
        filename: j.filename,
        songName: j.songName,
        format: j.format,
        musicKey: j.musicKey,
        artists: j.artists || '',
        songId: j.songId,
      })),
      maxItems: getBatchMaxItems(),
      searchIntervalMs: getBatchSearchIntervalMs(),
    })

    const resolvedMap = new Map((data.items || []).map((item) => [item.id, item]))
    batchJobs = batchJobs.map((job) => {
      const resolved = resolvedMap.get(job.id)
      if (!resolved) return job
      return {
        ...job,
        songId: resolved.songId || job.songId,
        matchedSong: resolved.matchedSong || job.matchedSong,
        error: resolved.error || null,
        status: resolved.songId ? 'ready' : job.songId ? 'ready' : 'pending',
      }
    })

    const matched = batchJobs.filter((j) => j.songId).length
    setBatchStatus(`匹配完成：${matched}/${batchJobs.length} 条已找到歌曲 ID`, matched ? 'success' : 'error')
    renderBatchList()
    batchStartBtn.disabled = matched === 0
  } catch (err) {
    setBatchStatus(err.message || '匹配失败', 'error')
  } finally {
    batchResolveBtn.disabled = false
  }
}

async function uploadOneBatchJob(job, cookie, uploadLimits, uploadedSheetKeys) {
  const file = batchFileMap.get(job.filename.toLowerCase())
  if (!file) throw new Error('找不到本地文件')

  const type = Number(batchInstrumentType?.value || 1)
  const kind = getBatchJobKind(job)

  if (!type || !kind) throw new Error('请设置乐器分类与谱面类型 code')

  const fileBase64 = await readFileAsBase64(file)
  const res = await fetch('/api/sheet/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cookie,
      songId: job.songId,
      useAppSheetName: true,
      type,
      kind,
      musicKey: normalizeMusicKeyForUpload(job.musicKey || 'C'),
      playVersion: '演奏版',
      filename: file.name,
      fileBase64,
      uploadLimits,
      uploadedSheetKeys: uploadedSheetKeys ? [...uploadedSheetKeys] : undefined,
    }),
  })
  const data = await parseJsonResponse(res)
  if (!data.ok) {
    const parts = [data.error || `上传失败 (${res.status})`]
    if (data.step) parts.push(`步骤：${data.step}`)
    if (data.upstreamCode) parts.push(`上游码：${data.upstreamCode}`)
    throw new Error(parts.join(' · '))
  }
  if (data.skipped) {
    return { ...data, skipped: true }
  }
  return data
}

async function startBatchUpload() {
  const cookie = getCookie()
  if (!cookie) {
    setBatchStatus('请先登录', 'error')
    return
  }
  if (!batchJobs.length) {
    setBatchStatus('请先扫描并匹配文件', 'error')
    return
  }

  const baseIntervalMs = getBatchIntervalMs()

  batchAbort = { stopped: false }
  batchStartBtn.disabled = true
  batchResolveBtn.disabled = true
  batchScanBtn.disabled = true
  batchStopBtn.disabled = false
  setBatchStatus(
    `开始批量上传，基准间隔 ${Math.round(baseIntervalMs / 1000)} 秒（每次随机浮动）…`,
  )

  let uploadLimits = sheetUploadConfig?.limitVO || null
  const firstReady = batchJobs.find((j) => j.songId)
  if (!uploadLimits && firstReady?.songId) {
    try {
      const perm = await fetchPostApi('/api/sheet/upload-permission', {
        cookie,
        songId: firstReady.songId,
      })
      uploadLimits = perm.uploadLimits || perm.uploadInfo?.limitVO || null
    } catch {
      // 非致命
    }
  }

  let uploadedSheetKeys = new Set()
  try {
    uploadedSheetKeys = await fetchUploadedSheetKeys(cookie)
    uploadedSheetKeyCache = uploadedSheetKeys
    batchJobs = batchJobs.map((job) => {
      const kind = getBatchJobKind(job)
      const uploadKey = job.songId ? buildUploadListKey(job.songId, kind) : ''
      if (
        uploadKey &&
        uploadedSheetKeys.has(uploadKey) &&
        job.status !== 'ok' &&
        job.status !== 'skipped'
      ) {
        return {
          ...job,
          status: 'skipped',
          error: '同类型谱面已在乐谱上传列表',
        }
      }
      return job
    })
    renderBatchList()
  } catch {
    // 拉取失败时仍由服务端逐条校验
  }

  const uploadQueue = batchJobs.filter((j) => j.status !== 'ok' && j.status !== 'skipped')
  if (!uploadQueue.length) {
    setBatchStatus('没有需要上传的任务（均已跳过或已完成）', 'success')
    batchStartBtn.disabled = false
    batchResolveBtn.disabled = false
    batchScanBtn.disabled = false
    batchStopBtn.disabled = true
    return
  }

  for (let i = 0; i < uploadQueue.length; i++) {
    if (batchAbort?.stopped) {
      setBatchStatus('已手动停止', 'error')
      break
    }

    const job = uploadQueue[i]
    const idx = batchJobs.findIndex((j) => j.id === job.id)
    if (idx < 0) continue

    if (!job.songId) {
      batchJobs[idx] = { ...job, status: 'skipped', error: '未匹配歌曲 ID' }
      renderBatchList()
      continue
    }

    const kind = getBatchJobKind(job)
    const uploadKey = buildUploadListKey(job.songId, kind)
    if (uploadedSheetKeys.has(uploadKey)) {
      batchJobs[idx] = {
        ...job,
        status: 'skipped',
        error: '同类型谱面已在乐谱上传列表',
      }
      renderBatchList()
      continue
    }

    batchJobs[idx] = { ...job, status: 'running', error: null }
    renderBatchList()
    setBatchStatus(`上传中 ${i + 1}/${uploadQueue.length}：${job.filename}`)

    try {
      const result = await uploadOneBatchJob(
        batchJobs[idx],
        cookie,
        uploadLimits,
        uploadedSheetKeys,
      )
      if (result?.skipped) {
        batchJobs[idx] = {
          ...batchJobs[idx],
          status: 'skipped',
          error: result.reason || '同类型谱面已在乐谱上传列表',
        }
      } else {
        uploadedSheetKeys.add(uploadKey)
        recordSheetUploadTime(job.songId, result.data?.id ?? result.data?.sheetId)
        batchJobs[idx] = { ...batchJobs[idx], status: 'ok', error: null }
      }
    } catch (err) {
      batchJobs[idx] = {
        ...batchJobs[idx],
        status: 'fail',
        error: err.message || '上传失败',
      }
    }
    renderBatchList()

    if (i < uploadQueue.length - 1 && !batchAbort?.stopped) {
      const delayMs = randomBatchDelayMs(baseIntervalMs)
      setBatchStatus(`等待 ${formatBatchDelaySec(delayMs)} 秒后继续…`)
      await sleep(delayMs)
    }
  }

  const ok = batchJobs.filter((j) => j.status === 'ok').length
  const fail = batchJobs.filter((j) => j.status === 'fail').length
  const skipped = batchJobs.filter((j) => j.status === 'skipped').length
  if (!batchAbort?.stopped) {
    setBatchStatus(`批量完成：成功 ${ok}，失败 ${fail}，跳过 ${skipped}`, fail ? 'error' : 'success')
    await reloadSheetUploadListIfVisible()
  }

  batchStartBtn.disabled = false
  batchResolveBtn.disabled = false
  batchScanBtn.disabled = false
  batchStopBtn.disabled = true
  batchAbort = null
}

function stopBatchUpload() {
  if (batchAbort) batchAbort.stopped = true
  batchStopBtn.disabled = true
  setBatchStatus('正在停止…')
}

async function deleteUploadedSheet(sheetId, options = {}) {
  const cookie = getCookie()
  if (!cookie || !sheetId) return
  if (!confirm(`确定删除乐谱 #${sheetId} 吗？`)) return

  const payload = {
    cookie,
    sheetId,
    songId: options.songId || undefined,
    musicSheetId: options.musicSheetId || undefined,
    uploadRecordId: options.uploadRecordId || undefined,
    typeCode: options.typeCode || undefined,
    kindCode: options.kindCode || undefined,
  }

  try {
    const res = await fetch('/api/sheet/del', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)
    hideSheetFromList(sheetId)
    await reloadSheetUploadListIfVisible()
    setSheetUploadStatus('删除成功', 'success')
  } catch (err) {
    const message = err.message || '删除失败'
    if (/不存在|已删除|not found|404/i.test(message)) {
      hideSheetFromList(sheetId)
      await reloadSheetUploadListIfVisible()
      setSheetUploadStatus('该乐谱已在 App 中删除，已从列表移除', 'success')
      return
    }
    showToast(message, 'error')
  }
}

async function reloadSheetUploadListIfVisible() {
  if (activeTab === 'ugc' && isSheetUploadListMode()) {
    await loadSheetUploadList()
  }
}

function initSheetPanel() {
  if (!getCookie()) {
    renderSheetPermission(null)
    setSheetUploadStatus('登录后可管理乐谱上传', '')
    return
  }
  setSheetUploadStatus('', '')
}

async function loadUgcDetail(page = 1) {
  const cookie = getCookie()
  if (!cookie) {
    ugcList.innerHTML = emptyState('请先 Cookie 登录', '—')
    hideUgcLoadMore()
    return
  }

  ugcList.classList.remove('sheet-upload-list')
  ugcListPage = page
  ugcList.innerHTML = emptyState('正在加载…', '…')
  updateUgcRecordsSummary([], { loading: true })
  hideUgcLoadMore()
  loadUgcBtn.disabled = true

  try {
    await ensureServerReady(['ugc'])
    const data = await fetchPostApi('/api/ugc/detail', {
      cookie,
      type: ugcType.value === 'all' ? 'all' : Number(ugcType.value),
      auditStatus: ugcAudit.value,
      limit: UGC_LIST_PAGE_SIZE,
      offset: (page - 1) * UGC_LIST_PAGE_SIZE,
    })

    ugcListTotal = data.total || 0
    renderUgcItems(data.items || [], false)
    updateUgcRecordsSummary(data.items || [])
    renderUgcListPagination()
  } catch (err) {
    ugcList.innerHTML = `<p class="empty-sheets">${escapeHtml(err.message || '加载失败')}</p>`
    hideUgcLoadMore()
  } finally {
    loadUgcBtn.disabled = false
  }
}

function getPlaylistMode() {
  return (
    document.querySelector('input[name="playlistMode"]:checked')?.value ||
    'create'
  )
}

function syncPlaylistModeUI() {
  const mode = getPlaylistMode()
  const isExisting = mode === 'existing'
  createPlaylistFields.classList.toggle('hidden', isExisting)
  existingPlaylistFields.classList.toggle('hidden', !isExisting)
  if (isExisting && getCookie()) loadUserPlaylists()
  if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
}

async function loadToplists() {
  if (!chartSelect) return
  chartSelect.innerHTML = '<option value="">加载排行榜…</option>'
  try {
    const res = await fetchWithTimeout('/api/toplist', { method: 'GET' }, 15000)
    const data = await parseJsonResponse(res)
    if (!data.ok) throw new Error(formatClientError(data.error, '加载失败'))
    if (!data.charts?.length) throw new Error('暂无排行榜数据')

    chartSelect.innerHTML = data.charts
      .map(
        (c) =>
          `<option value="${c.id}">${escapeHtml(c.name)}${c.trackCount ? ` (${c.trackCount} 首)` : ''}</option>`,
      )
      .join('')
  } catch (err) {
    const message =
      err?.name === 'AbortError' ? '排行榜加载超时，请稍后重试' : err.message || '排行榜加载失败'
    chartSelect.innerHTML = `<option value="">${escapeHtml(message)}</option>`
  }
}

async function loadUserPlaylists() {
  const cookie = getCookie()
  if (!cookie) {
    existingPlaylistSelect.innerHTML =
      '<option value="">请先登录后加载歌单</option>'
    existingPlaylistSelect.disabled = true
    return
  }

  existingPlaylistSelect.disabled = true
  existingPlaylistSelect.innerHTML = '<option value="">加载中…</option>'

  try {
    const res = await fetch('/api/playlist/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie }),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error)

    if (data.cookie) setCookieMerged(data.cookie)
    userPlaylists = data.playlists || []

    if (!userPlaylists.length) {
      existingPlaylistSelect.innerHTML =
        '<option value="">暂无歌单</option>'
      return
    }

    existingPlaylistSelect.innerHTML = userPlaylists
      .map(
        (p) =>
          `<option value="${p.id}">${escapeHtml(p.name)} (${p.trackCount} 首)</option>`,
      )
      .join('')
    existingPlaylistSelect.disabled = false
  } catch (err) {
    existingPlaylistSelect.innerHTML = `<option value="">${escapeHtml(err.message || '加载失败')}</option>`
  }
}

function getSearchScope() {
  const checked = document.querySelector('input[name="searchScope"]:checked')
  return checked?.value === 'song' ? 'song' : 'artist'
}

function updateKeywordPlaceholder() {
  if (!keywordInput) return
  keywordInput.placeholder =
    getSearchScope() === 'artist'
      ? '输入歌手名，如：林俊杰、周杰伦'
      : '输入歌名，如：晴天、江南'
}

function switchInputMode(mode) {
  inputMode = mode
  modeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode)
  })
  linkPanel.classList.toggle('hidden', mode !== 'link')
  searchPanel.classList.toggle('hidden', mode !== 'search')
  chartPanel.classList.toggle('hidden', mode !== 'chart')

  if (modeDesc) modeDesc.textContent = MODE_LABELS[mode]?.desc || ''
  updateAnalyzeButtonLabel()
  syncFilterSectionVisibility()
  syncAnalyzeOptionsVisibility()

  if (mode === 'search') {
    updateKeywordPlaceholder()
    keywordInput.focus()
  } else if (mode === 'link') urlInput.focus()
}

function getAnalyzePayload() {
  const limit = Number(scanLimit.value) || 80
  const excludeLive = excludeLiveSongs?.checked !== false
  const excludeNoCopyright = excludeNoCopyrightSongs?.checked !== false
  const excludeCover = excludeCoverSongs?.checked !== false
  const excludeCompilationAlbum = excludeCompilationAlbumSongs?.checked !== false
  if (inputMode === 'search') {
    return {
      keywords: keywordInput.value.trim(),
      searchScope: getSearchScope(),
      limit,
      excludeLive,
      excludeNoCopyright,
      excludeCover,
      excludeCompilationAlbum,
      excludeAccompaniment: excludeAccompanimentSongs?.checked !== false,
      filters: getFilterPayload(),
    }
  }
  if (inputMode === 'chart') {
    return {
      chartId: chartSelect.value,
      limit,
      excludeLive,
      excludeNoCopyright,
      excludeCover,
      excludeCompilationAlbum,
      filters: getFilterPayload(),
    }
  }
  return {
    url: urlInput.value.trim(),
    limit,
    excludeLive,
    excludeNoCopyright,
    excludeCover,
    excludeCompilationAlbum,
    filters: getFilterPayload(),
  }
}

function updateCreatePlaylistBar(filteredItems) {
  const loggedIn = !!getCookie()
  const count = filteredItems.length
  const mode = getPlaylistMode()

  if (!lastData) {
    saveSection.classList.add('hidden')
    return
  }

  saveSection.classList.remove('hidden')
  createPlaylistBtn.textContent =
    mode === 'existing'
      ? `添加到已有歌单（${count} 首）`
      : `创建歌单并收藏（${count} 首）`
  createPlaylistBtn.disabled =
    !loggedIn ||
    count === 0 ||
    (mode === 'existing' && !existingPlaylistSelect.value)

  if (!loggedIn) {
    createPlaylistHint.textContent = '请先登录网易云账号'
  } else if (!count) {
    createPlaylistHint.textContent = '当前筛选条件下没有歌曲'
  } else if (mode === 'existing') {
    createPlaylistHint.textContent = '将筛选结果追加到所选歌单'
  } else {
    createPlaylistHint.textContent = '将当前筛选结果保存为新歌单'
  }
}

function renderResults(data) {
  const filters = getFilterState()
  const items = data.preFiltered ? data.results : applyFilters(data.results)

  resultsEl.innerHTML = ''
  renderSummary(data, items.length)
  updateCreatePlaylistBar(items)
  syncFilterSectionVisibility()

  if (!items.length) {
    resultsEl.innerHTML = emptyState('没有符合条件的歌曲', '♪')
    return
  }

  items.forEach((item) => {
    resultsEl.appendChild(renderSongCard(item, filters))
  })
}

function syncFilterInputs() {
  maxTotalInput.disabled = !filterMaxTotal.checked
  maxPianoInput.disabled = !filterMaxPiano.checked
}

function setUserAvatar(avatarUrl, nickname) {
  if (!loginAvatar) return

  loginAvatar.innerHTML = ''
  loginAvatar.className = 'user-avatar'

  if (avatarUrl) {
    const img = document.createElement('img')
    const baseUrl = String(avatarUrl).replace(/\?.*$/, '')
    img.src = `${baseUrl}?param=30y30`
    img.alt = ''
    img.referrerPolicy = 'no-referrer'
    img.onerror = () => {
      setUserAvatar('', nickname)
    }
    loginAvatar.appendChild(img)
    return
  }

  loginAvatar.classList.add('avatar-fallback')
  loginAvatar.textContent = (nickname || '?').trim()[0] || '?'
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function refreshLoginUI(options = {}) {
  const cookie = getCookie()
  if (!cookie) {
    showLoginGuestUI()
    if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
    return
  }

  applyCachedLoginUI(true)

  if (!options.skipServerWait) {
    await preloadServerFeatures()
  }

  let lastErr = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetchWithTimeout(
        '/api/login/status',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cookie: getCookie() }),
        },
        10000,
      )
      const data = await parseJsonResponse(res)
      if (!data.ok) {
        throw new Error(formatClientError(data.error, '登录验证失败'))
      }

      if (data.cookie) setCookieMerged(data.cookie)
      cacheLoginProfile(data)
      showLoginUserUI(data.nickname, data.avatarUrl)

      if (activeTab === 'ugc') loadUgcDevote()
      if (activeTab === 'sheet') initSheetPanel()
      if (getPlaylistMode() === 'existing') loadUserPlaylists()

      if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
      return
    } catch (err) {
      lastErr = err
      if (attempt < 2 && (isRetryableClientError(err.message) || err?.name === 'AbortError')) {
        await sleep(400 * (attempt + 1))
        continue
      }
      break
    }
  }

  if (isAuthCookieError(lastErr?.message)) {
    // APP Cookie 验证失败时不自动清空：网页登出/weapi 误判时会误删本地 HAR Cookie
    if (isAppCookieString(cookie)) {
      applyCachedLoginUI(true)
    } else {
      clearCookie()
      showLoginGuestUI()
    }
  } else {
    applyCachedLoginUI(true)
  }

  if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
}

function openCookieModal() {
  cookieInput.value = getCookie()
  cookieStatus.textContent = ''
  cookieModal.classList.remove('hidden')
  lockPageScroll()
  cookieInput.focus()
}

function closeCookieModal() {
  cookieModal.classList.add('hidden')
  unlockPageScroll()
}

async function submitCookieLogin() {
  const cookie = sanitizeCookieInput(cookieInput.value)
  if (!cookie) {
    cookieStatus.textContent = '请先粘贴 Cookie'
    return
  }

  const stats = getCookiePasteStats(cookie)
  if (!stats.hasMusicU && !stats.hasMusicA) {
    cookieStatus.textContent = '未检测到 MUSIC_U / MUSIC_A，请粘贴完整 APP Cookie'
    return
  }
  if (stats.musicULength > 0 && stats.musicULength < 850) {
    cookieStatus.textContent = `MUSIC_U 仅 ${stats.musicULength} 字符（正常约 898），可能被截断，请重新粘贴`
    return
  }

  confirmCookieBtn.disabled = true
  cookieStatus.textContent = stats.hasDeviceId
    ? `正在验证 APP Cookie…（deviceId 已检测到，MUSIC_U ${stats.musicULength}）`
    : `正在验证 Cookie…（未检测到 deviceId，云小编审核可能失败）`

  try {
    const res = await fetch('/api/login/cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie }),
    })
    const data = await parseJsonResponse(res)
    if (!data.ok) throw new Error(formatClientError(data.error, 'Cookie 验证失败'))

    // Critical: do not replace APP cookie with PC-normalized login cookie
    const saved = mergePreservingAppCookie(cookie, data.cookie)
    setCookie(saved)
    cacheLoginProfile(data)
    closeCookieModal()
    await refreshLoginUI()
    showSuccess(
      stats.hasDeviceId
        ? `登录成功，欢迎 ${data.nickname}（APP Cookie）`
        : `登录成功，欢迎 ${data.nickname}`,
    )
  } catch (err) {
    cookieStatus.textContent = err.message || 'Cookie 验证失败'
  } finally {
    confirmCookieBtn.disabled = false
  }
}

async function savePlaylistFromFilter() {
  if (!lastData) return

  const filteredItems = applyFilters(lastData.results)
  const cookie = getCookie()
  if (!cookie) {
    setStatus('请先登录网易云账号')
    return
  }
  if (!filteredItems.length) {
    setStatus('当前筛选条件下没有可收藏的歌曲')
    return
  }

  const mode = getPlaylistMode()
  const songIds = filteredItems.map((item) => item.song.id)

  createPlaylistBtn.disabled = true
  setStatus(
    mode === 'existing'
      ? `正在添加 ${filteredItems.length} 首歌曲到歌单…`
      : `正在创建歌单并添加 ${filteredItems.length} 首歌曲…`,
    true,
  )

  try {
    let res
    if (mode === 'existing') {
      const playlistId = existingPlaylistSelect.value
      if (!playlistId) throw new Error('请选择目标歌单')

      res = await fetch('/api/playlist/add-to-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, playlistId, songIds }),
      })
    } else {
      res = await fetch('/api/playlist/create-from-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookie,
          name: playlistNameInput.value.trim(),
          songIds,
          privacy: privatePlaylist.checked ? '10' : undefined,
        }),
      })
    }

    const data = await res.json()
    if (!data.ok) throw new Error(data.error)

    if (data.cookie) setCookieMerged(data.cookie)

    const playlistName =
      mode === 'existing'
        ? userPlaylists.find((p) => String(p.id) === String(data.playlistId))
            ?.name || '歌单'
        : data.name

    showSuccess(
      mode === 'existing'
        ? `已向「${playlistName}」添加 ${data.songCount} 首歌曲`
        : `歌单「${data.name}」创建成功，已收藏 ${data.songCount} 首歌曲`,
      data.url,
    )

    if (mode === 'existing') loadUserPlaylists()
  } catch (err) {
    setStatus(err.message || '保存歌单失败')
  } finally {
    createPlaylistBtn.disabled = false
    if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
  }
}

async function analyze() {
  const payload = getAnalyzePayload()

  if (inputMode === 'search' && !payload.keywords) {
    setStatus('请输入搜索关键词')
    return
  }
  if (inputMode === 'chart' && !payload.chartId) {
    setStatus('请选择排行榜')
    return
  }
  if (inputMode === 'link' && !payload.url) {
    setStatus('请先粘贴链接')
    return
  }

  setAnalyzeLoading(true)
  setStatus(
    inputMode === 'search' &&
      (filterMaxTotal.checked ||
        filterMaxPiano.checked ||
        excludeNotUploadableSongs?.checked !== false)
      ? '正在搜索并筛选乐谱偏少的歌曲，可能需要一些时间…'
      : '正在查询乐谱，批量扫描可能需要一些时间…',
    true,
  )
  summaryEl.classList.add('hidden')
  sourceInfoEl.classList.add('hidden')
  resultsSectionEl?.classList.add('hidden')
  if (inputMode !== 'search') {
    filterSection.classList.add('hidden')
  }
  saveSection.classList.add('hidden')
  resultsEl.innerHTML = ''

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!data.ok) throw new Error(data.error || '查询失败')

    lastData = data
    syncFilterSectionVisibility()
    hideStatus()
    renderSourceInfo(data)
    renderResults(data)
  } catch (err) {
    setStatus(err.message || '查询失败')
    summaryEl.classList.add('hidden')
    sourceInfoEl.classList.add('hidden')
    resultsSectionEl?.classList.add('hidden')
    if (inputMode !== 'search') {
      filterSection.classList.add('hidden')
    }
    saveSection.classList.add('hidden')
  } finally {
    setAnalyzeLoading(false)
  }
}

function onFilterChange() {
  syncFilterInputs()
  if (lastData) {
    if (inputMode === 'search' && lastData.preFiltered) {
      lastData = { ...lastData, preFiltered: false }
    }
    renderResults(lastData)
  }
}

searchScopeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    updateKeywordPlaceholder()
    if (lastData && inputMode === 'search') {
      lastData = null
      summaryEl.classList.add('hidden')
      sourceInfoEl.classList.add('hidden')
      resultsSectionEl?.classList.add('hidden')
      saveSection.classList.add('hidden')
      resultsEl.innerHTML = ''
    }
  })
})
updateKeywordPlaceholder()

analyzeBtn.addEventListener('click', analyze)
onlyWithSheets.addEventListener('change', onFilterChange)
filterMaxTotal.addEventListener('change', onFilterChange)
filterMaxPiano.addEventListener('change', onFilterChange)
excludeNotUploadableSongs?.addEventListener('change', onFilterChange)
maxTotalInput.addEventListener('input', onFilterChange)
maxPianoInput.addEventListener('input', onFilterChange)
createPlaylistBtn.addEventListener('click', savePlaylistFromFilter)
refreshPlaylistsBtn.addEventListener('click', loadUserPlaylists)
playlistModeInputs.forEach((input) => {
  input.addEventListener('change', syncPlaylistModeUI)
})
existingPlaylistSelect.addEventListener('change', () => {
  if (lastData) updateCreatePlaylistBar(applyFilters(lastData.results))
})
modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => switchInputMode(btn.dataset.mode))
})
keywordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') analyze()
})
loginBtn.addEventListener('click', openCookieModal)
logoutBtn.addEventListener('click', () => {
  clearCookie()
  refreshLoginUI()
  if (activeTab === 'ugc') {
    if (ugcProfile) {
      ugcProfile.innerHTML = emptyState('请先 Cookie 登录', '—')
      ugcProfile.classList.remove('hidden')
    }
    ugcDailyReward?.classList.add('hidden')
    ugcAuditTasks && (ugcAuditTasks.innerHTML = '')
    ugcOfficialTasks && (ugcOfficialTasks.innerHTML = '')
    ugcHonorRoll && (ugcHonorRoll.innerHTML = '')
    closeUgcExamPanel()
    ugcList.innerHTML = ''
  }
  if (activeTab === 'sheet') {
    initSheetPanel()
  }
})
confirmCookieBtn.addEventListener('click', submitCookieLogin)
closeCookieBtn.addEventListener('click', closeCookieModal)
cookieModal.addEventListener('click', (e) => {
  if (e.target === cookieModal) closeCookieModal()
})
closePreviewBtn.addEventListener('click', closePreviewModal)
closeWikiBtn.addEventListener('click', closeWikiModalFn)
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) closePreviewModal()
})
wikiModal.addEventListener('click', (e) => {
  if (e.target === wikiModal) closeWikiModalFn()
})
loadUgcBtn.addEventListener('click', () => loadContributionList(1))
ugcType.addEventListener('change', () => {
  syncUgcFilterUI()
  hideUgcLoadMore()
  ugcList.innerHTML = ''
  ugcListPage = 1
  sheetUploadPage = 1
  ugcList.classList.toggle('sheet-upload-list', isSheetUploadListMode())
})
ugcSignBtn.addEventListener('click', signUgcToday)
loadIntegrationBtn.addEventListener('click', () => loadIntegrationRecords(1))
ugcClaimVipBtn?.addEventListener('click', claimUgcVipReward)
ugcRefreshLotteryBtn?.addEventListener('click', () => {
  openUgcCollapse('ugcLotteryCollapse')
  loadUgcLottery()
})
ugcOpenMallModalBtn?.addEventListener('click', async () => {
  openUgcCollapse('ugcMallCollapse')
  if (!ugcDashboard?.mall && getCookie()) {
    await loadUgcMall()
  }
  openMallModal('list')
})
ugcRefreshMallBtn?.addEventListener('click', () => {
  openUgcCollapse('ugcMallCollapse')
  loadUgcMall()
})
ugcRefreshAllBtn?.addEventListener('click', async () => {
  ugcRefreshAllBtn.disabled = true
  try {
    await loadUgcDevote()
    showToast('云小编数据已刷新', 'success')
  } catch (err) {
    showToast(err.message || '刷新失败', 'error')
  } finally {
    ugcRefreshAllBtn.disabled = false
  }
})
document.getElementById('ugcRecordsCollapse')?.addEventListener('toggle', (e) => {
  if (!e.target.open || ugcList.querySelector('.ugc-item')) return
  loadContributionList(1)
})
ugcMall?.addEventListener('click', handleMallInteraction)
mallModalBody?.addEventListener('click', handleMallInteraction)
mallModalFooter?.addEventListener('click', handleMallInteraction)
closeMallModalBtn?.addEventListener('click', closeMallModal)
mallModalBackBtn?.addEventListener('click', () => {
  mallModalView = 'list'
  renderMallModalContent()
})
mallModal?.addEventListener('click', (e) => {
  if (e.target === mallModal) closeMallModal()
})
ugcProfile?.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action="open-mall"]')
  if (!target) return
  openUgcCollapse('ugcMallCollapse')
  if (ugcDashboard?.mall) {
    openMallModal('list')
  } else {
    loadUgcMall().then(() => openMallModal('list'))
  }
})
ugcProfile?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const target = e.target.closest('[data-action="open-mall"]')
  if (!target) return
  e.preventDefault()
  target.click()
})
ugcLottery?.addEventListener('click', (e) => {
  const btn = e.target.closest('.ugc-draw-btn')
  if (!btn || btn.disabled) return
  drawUgcLottery(btn.dataset.entryType)
})
ugcExamCloseBtn?.addEventListener('click', closeUgcExamPanel)
ugcAuditTasks?.addEventListener('click', (e) => {
  const btn = e.target.closest('.ugc-start-exam-btn')
  if (!btn || btn.disabled) return
  const auditType = Number(btn.dataset.auditType)
  const card = btn.closest('.ugc-task-card')
  const auditTypeName = card?.querySelector('strong')?.textContent?.trim()
  startUgcAudit(auditType, auditTypeName)
})
ugcRefreshAuditHistoryBtn?.addEventListener('click', () => {
  ugcAuditHistoryLoaded = false
  loadUgcAuditHistory()
})
ugcAuditHistoryCollapse?.addEventListener('toggle', (e) => {
  if (!e.target.open || ugcAuditHistoryLoaded) return
  loadUgcAuditHistory()
})
document.querySelectorAll('.ugc-honor-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    openUgcCollapse('ugcHonorCollapse')
    loadUgcHonorRoll(btn.dataset.honorType)
  })
})
checkSheetPermBtn.addEventListener('click', checkSheetUploadPermission)
sheetType?.addEventListener('change', syncManualSheetName)
batchScanBtn?.addEventListener('click', scanBatchFolder)
batchResolveBtn?.addEventListener('click', resolveBatchSongIds)
batchStartBtn?.addEventListener('click', startBatchUpload)
batchStopBtn?.addEventListener('click', stopBatchUpload)
batchFolderInput?.addEventListener('change', () => {
  batchJobs = []
  batchFileMap = new Map()
  batchResolveBtn.disabled = true
  batchStartBtn.disabled = true
  renderBatchList()
  setBatchStatus('')
})
sheetSongId?.addEventListener('input', resetSheetUploadSelects)
sheetPdfFile?.addEventListener('change', () => {
  applyManualUploadFromPdfFile(sheetPdfFile.files?.[0] || null)
})
sheetUploadForm.addEventListener('submit', submitSheetUploadForm)
ugcList.addEventListener('click', (e) => {
  const previewBtn = e.target.closest('.sheet-preview-btn')
  if (previewBtn?.dataset.sheetId) {
    const card = previewBtn.closest('[data-song-id]')
    openSheetPreview(
      previewBtn.dataset.sheetId,
      '乐谱预览',
      null,
      card?.dataset?.songId,
    )
    return
  }

  const hideBtn = e.target.closest('.sheet-hide-btn')
  if (hideBtn?.dataset.sheetId) {
    hideSheetFromList(hideBtn.dataset.sheetId)
    hideBtn.closest('.sheet-upload-card')?.remove()
    setSheetUploadStatus('已从本地列表隐藏，刷新后仍生效', 'success')
    return
  }

  const deleteBtn = e.target.closest('.sheet-delete-btn')
  if (deleteBtn?.dataset.sheetId) {
    deleteUploadedSheet(deleteBtn.dataset.sheetId, {
      songId: deleteBtn.dataset.songId,
      musicSheetId: deleteBtn.dataset.musicSheetId,
      uploadRecordId: deleteBtn.dataset.uploadRecordId,
      typeCode: deleteBtn.dataset.typeCode,
      kindCode: deleteBtn.dataset.kindCode,
    })
  }
})

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab))
})

resultsEl.addEventListener('click', (e) => {
  const sheetItem = e.target.closest('.sheet-item[data-sheet-id]')
  if (sheetItem) {
    openSheetPreview(
      sheetItem.dataset.sheetId,
      sheetItem.querySelector('.title')?.textContent,
      sheetItem,
    )
    return
  }

  const wikiBtn = e.target.closest('.wiki-btn')
  if (wikiBtn) {
    const card = wikiBtn.closest('.song-card')
    if (card?.dataset.songId) {
      openSongWiki(card.dataset.songId, card.querySelector('.name')?.textContent)
    }
  }
})

resultsEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const sheetItem = e.target.closest('.sheet-item[data-sheet-id]')
  if (!sheetItem) return
  e.preventDefault()
  openSheetPreview(
    sheetItem.dataset.sheetId,
    sheetItem.querySelector('.title')?.textContent,
    sheetItem,
  )
})

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze()
})

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  if (!previewModal.classList.contains('hidden')) closePreviewModal()
  else if (!wikiModal.classList.contains('hidden')) closeWikiModalFn()
  else if (!cookieModal.classList.contains('hidden')) closeCookieModal()
})

window.addEventListener('ne-extension-cookie', (e) => {
  const cookie = e.detail?.cookie
  if (!cookie) return
  // 已处于 APP Cookie 模式时，拒绝网页 Cookie 自动覆盖（网页退出登录后尤易踩坑）
  if (isAppCookieString(getCookie())) {
    console.warn('[NE] 已锁定 APP Cookie，忽略网页自动填入。如需切换请先清空本地 Cookie。')
    showSuccess('当前为 APP Cookie 模式，已忽略网页 Cookie 自动填入')
    return
  }
  cookieInput.value = cookie
  submitCookieLogin()
})

async function initApp() {
  syncFilterInputs()
  updateAnalyzeButtonLabel()
  syncFilterSectionVisibility()
  syncAnalyzeOptionsVisibility()
  syncUgcFilterUI()
  initUgcSectionNav()
  initBackToTop()
  loadBatchLimits()
  renderBatchList()

  await Promise.allSettled([loadToplists(), refreshLoginUI()])

  try {
    const savedTab = sessionStorage.getItem(TAB_STORAGE_KEY)
    if (savedTab && ['analyze', 'sheet', 'ugc'].includes(savedTab) && savedTab !== activeTab) {
      switchTab(savedTab)
    }
  } catch {
    // ignore storage errors
  }
}

initApp()

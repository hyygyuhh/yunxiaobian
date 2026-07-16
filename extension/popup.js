const statusEl = document.getElementById('status')
const openAppBtn = document.getElementById('openAppBtn')
const copyBtn = document.getElementById('copyBtn')
const refreshBtn = document.getElementById('refreshBtn')
const autoCopyEl = document.getElementById('autoCopy')
const qrLoginBtn = document.getElementById('qrLoginBtn')

// 二维码登录相关元素
const qrModal = document.getElementById('qrModal')
const qrCloseBtn = document.getElementById('qrCloseBtn')
const qrCodeImg = document.getElementById('qrCodeImg')
const qrCodeWrap = document.getElementById('qrCodeWrap')
const qrOverlay = document.getElementById('qrOverlay')
const qrOverlayText = document.getElementById('qrOverlayText')
const qrRefreshBtn = document.getElementById('qrRefreshBtn')
const qrStatusEl = document.getElementById('qrStatus')
const qrSuccess = document.getElementById('qrSuccess')
const qrNickname = document.getElementById('qrNickname')

let qrPollTimer = null
let currentQrKey = ''

function setStatus(text, type = '') {
  statusEl.textContent = text
  statusEl.className = `status ${type}`
}

function setQrStatus(text) {
  qrStatusEl.textContent = text
}

async function getActiveTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab?.url || ''
}

async function refreshStatus() {
  setStatus('检测中…')
  const tabUrl = await getActiveTabUrl()
  const res = await chrome.runtime.sendMessage({ type: 'GET_COOKIE', tabUrl })

  if (!res?.ok) {
    const extra = res?.names?.length
      ? `\n已检测到：${res.names.join(', ')}`
      : ''
    const csrfHint = res?.hasCsrf === false
      ? '\n未检测到 __csrf（登录后服务端会自动尝试补全）'
      : ''
    setStatus(
      (res?.error || '未登录：请先在 music.163.com 网页版登录') + extra + csrfHint,
      'error',
    )
    copyBtn.disabled = true
    return
  }

  const csrfHint = res.hasCsrf ? '' : '（__csrf 将由服务端补全）'
  setStatus(`已登录，共 ${res.count} 项 Cookie${csrfHint}`, 'ok')
  copyBtn.disabled = false
}

// ── 二维码登录 ──

function stopQrPoll() {
  if (qrPollTimer) {
    clearInterval(qrPollTimer)
    qrPollTimer = null
  }
}

async function startQrLogin() {
  // 显示弹窗
  qrModal.style.display = 'flex'
  qrSuccess.style.display = 'none'
  qrOverlay.style.display = 'none'
  qrCodeImg.style.display = 'block'
  setQrStatus('正在获取二维码…')
  qrLoginBtn.disabled = true

  try {
    // 获取 unikey
    const keyRes = await chrome.runtime.sendMessage({ type: 'QR_GET_KEY' })
    if (!keyRes?.key) {
      setQrStatus(keyRes?.error || '获取二维码失败，请重试')
      return
    }
    currentQrKey = keyRes.key

    // 获取二维码图片
    const imgRes = await chrome.runtime.sendMessage({ type: 'QR_GET_IMAGE', key: currentQrKey })
    if (imgRes?.ok && imgRes.result) {
      qrCodeImg.src = imgRes.result.img
      setQrStatus('请使用网易云音乐 APP 扫描二维码')
    } else {
      setQrStatus('生成二维码图片失败')
      return
    }

    // 开始轮询
    stopQrPoll()
    qrPollTimer = setInterval(() => pollQrStatus(), 3000)
  } catch (err) {
    setQrStatus('获取二维码失败：' + (err?.message || err))
  } finally {
    qrLoginBtn.disabled = false
  }
}

async function pollQrStatus() {
  if (!currentQrKey) return

  try {
    const res = await chrome.runtime.sendMessage({ type: 'QR_CHECK_STATUS', key: currentQrKey })

    if (!res) return

    if (res.loggedIn) {
      // 登录成功
      stopQrPoll()
      qrCodeImg.style.display = 'none'
      qrOverlay.style.display = 'none'
      qrSuccess.style.display = 'flex'
      qrNickname.textContent = res.nickname ? `欢迎，${res.nickname}` : '登录成功'
      setQrStatus('登录成功，Cookie 已写入')
      // 刷新主界面状态
      setTimeout(refreshStatus, 500)
      return
    }

    switch (res.code) {
      case 800:
        // 二维码过期
        stopQrPoll()
        qrOverlay.style.display = 'flex'
        qrOverlayText.textContent = '二维码已过期'
        setQrStatus('二维码已过期，请点击刷新')
        break
      case 802:
        // 已扫码，待确认
        setQrStatus('已扫码，请在手机上确认登录')
        break
      case 801:
        // 等待扫码
        break
      default:
        if (res.message) setQrStatus(res.message)
    }
  } catch (err) {
    // 网络错误不中断轮询
  }
}

function closeQrModal() {
  stopQrPoll()
  qrModal.style.display = 'none'
  currentQrKey = ''
  qrCodeImg.src = ''
}

// 事件绑定
openAppBtn?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'OPEN_APP' })
  window.close()
})

copyBtn.addEventListener('click', async () => {
  copyBtn.disabled = true
  setStatus('正在复制…')
  const tabUrl = await getActiveTabUrl()
  const res = await chrome.runtime.sendMessage({ type: 'COPY_COOKIE', tabUrl })
  if (res.ok) {
    setStatus('已复制到剪贴板', 'ok')
  } else {
    setStatus(res.error || '复制失败', 'error')
  }
  copyBtn.disabled = !res.ok
})

refreshBtn.addEventListener('click', refreshStatus)

autoCopyEl.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: 'SET_AUTO_COPY',
    autoCopy: autoCopyEl.checked,
  })
})

chrome.storage.sync.get({ autoCopy: true }, ({ autoCopy }) => {
  autoCopyEl.checked = autoCopy
})

// 二维码登录事件
qrLoginBtn?.addEventListener('click', startQrLogin)
qrCloseBtn?.addEventListener('click', closeQrModal)
qrRefreshBtn?.addEventListener('click', startQrLogin)

refreshStatus()

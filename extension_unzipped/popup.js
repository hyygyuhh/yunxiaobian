const statusEl = document.getElementById('status')
const openAppBtn = document.getElementById('openAppBtn')
const copyBtn = document.getElementById('copyBtn')
const refreshBtn = document.getElementById('refreshBtn')
const autoCopyEl = document.getElementById('autoCopy')

function setStatus(text, type = '') {
  statusEl.textContent = text
  statusEl.className = `status ${type}`
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

refreshStatus()

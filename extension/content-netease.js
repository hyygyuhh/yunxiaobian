function injectFloatingButton() {
  if (document.getElementById('ne-cookie-helper-btn')) return

  const btn = document.createElement('button')
  btn.id = 'ne-cookie-helper-btn'
  btn.textContent = '复制 Cookie'
  btn.title = '复制网易云登录 Cookie 到剪贴板'
  Object.assign(btn.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: '99999',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #ec4141, #d73737)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    cursor: 'pointer',
  })

  btn.addEventListener('click', async () => {
    btn.disabled = true
    btn.textContent = '复制中…'
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'COPY_COOKIE',
        tabUrl: location.href,
      })
      btn.textContent = res.ok ? '已复制' : '未登录'
      setTimeout(() => {
        btn.textContent = '复制 Cookie'
      }, 1500)
    } finally {
      btn.disabled = false
    }
  })

  document.body.appendChild(btn)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingButton)
} else {
  injectFloatingButton()
}

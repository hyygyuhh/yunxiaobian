function fillCookieToPage(cookieString) {
  const input = document.getElementById('cookieInput')
  if (input) {
    input.value = cookieString
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

function injectButton() {
  const loginBtn = document.getElementById('loginBtn')
  if (!loginBtn || document.getElementById('extFillBtn')) return

  const btn = document.createElement('button')
  btn.id = 'extFillBtn'
  btn.type = 'button'
  btn.className = 'btn-secondary'
  btn.textContent = '插件填入 Cookie'
  btn.title = '从浏览器插件自动获取网易云 Cookie'
  btn.addEventListener('click', async () => {
    btn.disabled = true
    btn.textContent = '获取中…'
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GET_COOKIE',
        tabUrl: location.href,
      })
      if (!res.ok) {
        alert(
          (res.error || '未获取到 Cookie') +
            '\n\n请确认：\n1. 已在浏览器打开 music.163.com 并登录\n2. 不是客户端 App 登录\n3. 登录后刷新网页再试',
        )
        return
      }
      fillCookieToPage(res.cookieString)
      loginBtn.click()
      window.dispatchEvent(
        new CustomEvent('ne-extension-cookie', {
          detail: { cookie: res.cookieString },
        }),
      )
    } finally {
      btn.disabled = false
      btn.textContent = '插件填入 Cookie'
    }
  })

  loginBtn.insertAdjacentElement('afterend', btn)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectButton)
} else {
  injectButton()
}

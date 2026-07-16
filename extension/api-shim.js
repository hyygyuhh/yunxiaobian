(function () {
  if (typeof globalThis.__NE_FETCH_SHIM__ === 'function') return
  if (typeof chrome === 'undefined' || !chrome.runtime?.id) return

  const nativeFetch = window.fetch.bind(window)

  async function callExtensionApi(request) {
    const res = await chrome.runtime.sendMessage({ type: 'API', request })
    if (!res) throw new Error('扩展 API 无响应，请重新加载插件')
    if (!res.ok) throw new Error(res.error || '扩展 API 失败')
    return res.result
  }

  globalThis.__NE_FETCH_SHIM__ = async function neFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input.url
    let pathname = url
    let query = {}

    try {
      const parsed = new URL(url, window.location.href)
      pathname = parsed.pathname
      query = Object.fromEntries(parsed.searchParams.entries())
    } catch {
      const qIndex = url.indexOf('?')
      if (qIndex >= 0) {
        pathname = url.slice(0, qIndex)
        const params = new URLSearchParams(url.slice(qIndex + 1))
        query = Object.fromEntries(params.entries())
      }
    }

    if (!pathname.startsWith('/api/')) {
      return nativeFetch(input, init)
    }

    const method = (init.method || 'GET').toUpperCase()
    let body = init.body

    if (body && typeof body === 'string' && init.headers) {
      const h = new Headers(init.headers)
      if (h.get('content-type')?.includes('application/json')) {
        try {
          body = JSON.parse(body)
        } catch {
          // keep string
        }
      }
    }

    const result = await callExtensionApi({ path: pathname, method, body, query, headers: {} })

    if (result?.binary && Array.isArray(result.body)) {
      const blob = new Blob([new Uint8Array(result.body)], {
        type: result.headers?.['content-type'] || 'application/octet-stream',
      })
      return new Response(blob, { status: result.status || 200, headers: result.headers || {} })
    }

    return new Response(JSON.stringify(result?.body ?? {}), {
      status: result?.status || 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  window.fetch = globalThis.__NE_FETCH_SHIM__
})()

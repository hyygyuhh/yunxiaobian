function basename(p = '') {
  const parts = String(p).replace(/\\/g, '/').split('/')
  return parts[parts.length - 1] || ''
}

function extname(p = '') {
  const base = basename(p)
  const dot = base.lastIndexOf('.')
  return dot >= 0 ? base.slice(dot) : ''
}

function join(...parts) {
  return parts
    .flat()
    .map((part) => String(part).replace(/\\/g, '/'))
    .join('/')
    .replace(/\/+/g, '/')
}

function resolve(...parts) {
  return join(...parts)
}

export { basename, extname, join, resolve }
export default { basename, extname, join, resolve }

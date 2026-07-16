(function (global) {
  function parseMusicKey(raw) {
    let s = String(raw || '').trim().replace(/调+$/u, '')
    if (!s) return null

    let m = s.match(/^降\s*([A-Ga-g])$/u)
    if (m) return { note: m[1].toUpperCase(), accidental: 'flat' }

    m = s.match(/^升\s*([A-Ga-g])$/u)
    if (m) return { note: m[1].toUpperCase(), accidental: 'sharp' }

    m = s.match(/^([A-Ga-g])B$/u)
    if (m) return { note: m[1].toUpperCase(), accidental: 'flat' }

    m = s.match(/^([A-Ga-g])\s*(?:flat|−|-)$/iu)
    if (m) return { note: m[1].toUpperCase(), accidental: 'flat' }

    m = s.match(/^([A-Ga-g])\s*(?:sharp|#|♯)$/iu)
    if (m) return { note: m[1].toUpperCase(), accidental: 'sharp' }

    m = s.match(/^([A-Ga-g])([#♯b♭])$/iu)
    if (m) {
      const note = m[1].toUpperCase()
      const acc = m[2]
      if (/[#♯]/u.test(acc)) return { note, accidental: 'sharp' }
      if (/[b♭]/u.test(acc)) return { note, accidental: 'flat' }
    }

    if (/^[A-Ga-g]$/u.test(s)) return { note: s.toUpperCase(), accidental: 'natural' }

    return null
  }

  function toCanonicalForm(parsed) {
    if (!parsed) return ''
    if (parsed.accidental === 'flat') return `${parsed.note}b`
    if (parsed.accidental === 'sharp') return `${parsed.note}#`
    return parsed.note
  }

  function normalizeMusicKeyForUpload(raw) {
    const parsed = parseMusicKey(raw)
    if (!parsed) {
      return String(raw || '')
        .trim()
        .replace(/调+$/u, '')
    }
    if (parsed.accidental === 'flat') return `降${parsed.note}`
    if (parsed.accidental === 'sharp') return `升${parsed.note}`
    return parsed.note
  }

  function parseMusicKeyFromSuffix(suffix) {
    const parsed = parseMusicKey(suffix)
    if (!parsed) return ''
    return toCanonicalForm(parsed)
  }

  function formatMusicKeyLabel(key) {
    const upload = normalizeMusicKeyForUpload(key)
    if (!upload) return ''
    return /调$/u.test(upload) ? upload : `${upload}调`
  }

  global.MusicKey = {
    parseMusicKey,
    toCanonicalForm,
    normalizeMusicKeyForUpload,
    parseMusicKeyFromSuffix,
    formatMusicKeyLabel,
  }
})(typeof window !== 'undefined' ? window : globalThis)

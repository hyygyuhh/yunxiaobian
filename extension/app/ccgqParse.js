(function (global) {
  const CCGQ_KIND = { jianpu: 1, wuxian: 5 }
  const SONG_ID_PREFIX_RE = /^(\d{5,})_(.+)$/

  function sanitizeFileName(name) {
    return String(name || '曲谱')
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function isSkippableTempFile(filename) {
    const base = String(filename || '').split(/[/\\]/).pop() || ''
    return /^_tmp_/i.test(base)
  }

  function parseMusicKeyFromSuffix(suffix) {
    return global.MusicKey?.parseMusicKeyFromSuffix(suffix) || ''
  }

  function extractSongIdPrefix(stem) {
    const match = String(stem || '').match(SONG_ID_PREFIX_RE)
    if (!match) return { songId: null, rest: stem }
    return { songId: match[1], rest: match[2] }
  }

  function parseNameAndKey(stem) {
    const lastUnderscore = stem.lastIndexOf('_')
    if (lastUnderscore <= 0) return null
    const songName = sanitizeFileName(stem.slice(0, lastUnderscore))
    const suffix = stem.slice(lastUnderscore + 1)
    const musicKey = parseMusicKeyFromSuffix(suffix)
    if (!songName || !musicKey) return null
    if (!/调$/.test(musicKey) && !/^[A-G]/i.test(suffix)) return null
    return { songName, musicKey }
  }

  function parseCcgqPdfFilename(filename) {
    const baseName = String(filename || '').split(/[/\\]/).pop() || ''
    if (!baseName.toLowerCase().endsWith('.pdf')) return null
    if (isSkippableTempFile(baseName)) return null

    const rawStem = baseName.replace(/\.pdf$/i, '')
    const { songId, rest: stem } = extractSongIdPrefix(rawStem)

    if (/_简谱$/.test(stem)) {
      const body = stem.replace(/_简谱$/, '')
      const parsed = parseNameAndKey(body)
      if (parsed) {
        return {
          filename: baseName,
          songId,
          songName: parsed.songName,
          musicKey: parsed.musicKey,
          format: 'jianpu',
          sheetName: parsed.songName,
          defaultKind: CCGQ_KIND.jianpu,
        }
      }
    }

    const wuxian = parseNameAndKey(stem)
    if (wuxian) {
      return {
        filename: baseName,
        songId,
        songName: wuxian.songName,
        musicKey: wuxian.musicKey,
        format: 'wuxian',
        sheetName: `${wuxian.songName} 五线谱`,
        defaultKind: CCGQ_KIND.wuxian,
      }
    }

    const songName = sanitizeFileName(stem)
    if (!songName) return null

    return {
      filename: baseName,
      songId,
      songName,
      musicKey: 'C',
      format: 'jianpu',
      sheetName: songName,
      defaultKind: CCGQ_KIND.jianpu,
    }
  }

  function parseManifestEntry(entry) {
    if (!entry || typeof entry !== 'object') return null
    const file = entry.file || entry.filename || entry.name
    if (!file) return null
    return {
      file: String(file).split(/[/\\]/).pop(),
      songId: entry.songId != null ? String(entry.songId) : null,
      songName: entry.songName ? String(entry.songName) : null,
      artists: entry.artists ? String(entry.artists) : '',
    }
  }

  function applyManifestOverrides(jobs, manifestEntries) {
    const map = new Map()
    for (const entry of manifestEntries || []) {
      const parsed = parseManifestEntry(entry)
      if (parsed?.file && parsed.songId) map.set(parsed.file.toLowerCase(), parsed)
    }
    return jobs.map((job) => {
      const override = map.get(job.filename.toLowerCase())
      const merged = override
        ? {
            ...job,
            songId: override.songId || job.songId,
            songName: override.songName || job.songName,
            artists: override.artists || job.artists || '',
            manifest: true,
          }
        : job
      return merged.songId ? { ...merged, status: 'ready' } : merged
    })
  }

  function buildJobsFromFilenames(filenames, options) {
    const jobs = []
    const seen = new Set()
    for (const name of filenames || []) {
      const parsed = parseCcgqPdfFilename(name)
      if (!parsed) continue
      const key = `${parsed.filename}::${parsed.format}`
      if (seen.has(key)) continue
      seen.add(key)
      jobs.push({
        id: jobs.length + 1,
        ...parsed,
        artists: '',
        status: parsed.songId ? 'ready' : 'pending',
      })
    }
    return applyManifestOverrides(jobs, options?.manifest || [])
  }

  global.CcgqParse = {
    CCGQ_KIND,
    parseCcgqPdfFilename,
    buildJobsFromFilenames,
    applyManifestOverrides,
    isSkippableTempFile,
  }
})(typeof window !== 'undefined' ? window : globalThis)

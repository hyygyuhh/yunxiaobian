import CryptoJS from 'crypto-js'

function toBufferLike(bytes) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return {
    length: arr.length,
    subarray(start, end) {
      return arr.subarray(start, end)
    },
    toString(encoding = 'utf8') {
      if (encoding === 'hex') {
        return Array.from(arr)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      }
      return new TextDecoder().decode(arr)
    },
  }
}

export function randomBytes(size) {
  const arr = new Uint8Array(size)
  globalThis.crypto.getRandomValues(arr)
  const buf = toBufferLike(arr)
  return {
    ...buf,
    toString(encoding) {
      return buf.toString(encoding)
    },
  }
}

export function createHash(algorithm) {
  const chunks = []
  return {
    update(data) {
      if (data == null) return this
      if (typeof data === 'string') {
        chunks.push(CryptoJS.enc.Utf8.parse(data))
      } else if (data instanceof Uint8Array) {
        chunks.push(CryptoJS.lib.WordArray.create(data))
      } else if (Array.isArray(data)) {
        chunks.push(CryptoJS.lib.WordArray.create(new Uint8Array(data)))
      } else if (data.buffer) {
        chunks.push(CryptoJS.lib.WordArray.create(new Uint8Array(data.buffer)))
      }
      return this
    },
    digest(encoding) {
      if (algorithm !== 'md5') {
        throw new Error(`Unsupported hash algorithm: ${algorithm}`)
      }
      let merged = CryptoJS.lib.WordArray.create()
      for (const chunk of chunks) {
        merged = merged.concat(chunk)
      }
      const hash = CryptoJS.MD5(merged)
      return encoding === 'hex' ? hash.toString(CryptoJS.enc.Hex) : hash
    },
  }
}

export default { randomBytes, createHash }

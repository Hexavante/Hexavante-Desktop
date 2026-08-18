import { safeStorage } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { app } from 'electron'

const TOKENS_DIR = 'tokens'
const REFRESH_FILE = 'refresh.enc'

function getTokensDir(): string {
  const dir = path.join(app.getPath('userData'), TOKENS_DIR)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  }
  return dir
}

function getRefreshPath(): string {
  return path.join(getTokensDir(), REFRESH_FILE)
}

export async function saveRefreshToken(token: string): Promise<void> {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption not available on this system')
  }
  const encrypted = safeStorage.encryptString(token)
  fs.writeFileSync(getRefreshPath(), encrypted, { mode: 0o600 })
}

export async function getRefreshToken(): Promise<string | null> {
  if (!safeStorage.isEncryptionAvailable()) {
    return null
  }
  const filePath = getRefreshPath()
  if (!fs.existsSync(filePath)) {
    return null
  }
  try {
    const encrypted = fs.readFileSync(filePath)
    return safeStorage.decryptString(encrypted)
  } catch {
    return null
  }
}

export async function clearRefreshToken(): Promise<void> {
  const filePath = getRefreshPath()
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

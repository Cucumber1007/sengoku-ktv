import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const certDir = path.resolve(__dirname, '../.cert')

function getLanIps() {
  const ips = ['localhost', '127.0.0.1']
  try {
    for (const interfaces of Object.values(os.networkInterfaces())) {
      for (const net of interfaces ?? []) {
        if (net.family === 'IPv4' && !net.internal) {
          ips.push(net.address)
        }
      }
    }
  } catch {
    // ignore
  }
  return [...new Set(ips)]
}

function hasMkcert() {
  try {
    execSync('mkcert -help', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

if (!hasMkcert()) {
  console.error('找不到 mkcert，請先安裝：')
  console.error('  brew install mkcert')
  console.error('  mkcert -install')
  process.exit(1)
}

try {
  execSync('mkcert -install', { stdio: 'inherit' })
} catch {
  // root may already be installed
}

fs.mkdirSync(certDir, { recursive: true })
const hosts = getLanIps()
const hostArgs = hosts.join(' ')

execSync(`mkcert -key-file "${path.join(certDir, 'key.pem')}" -cert-file "${path.join(certDir, 'cert.pem')}" ${hostArgs}`, {
  stdio: 'inherit',
  cwd: certDir,
})

console.log('')
console.log('憑證已建立：.cert/cert.pem')
console.log('')
console.log('iPhone 一次性設定（讓離線 PWA 可用）：')
console.log('  1. Mac 執行：open "$(mkcert -CAROOT)"')
console.log('  2. 把 rootCA.pem AirDrop 到 iPhone')
console.log('  3. iPhone：設定 → 一般 → VPN 與裝置管理 → 安裝描述檔')
console.log('  4. 設定 → 一般 → 關於本機 → 憑證信任設定 → 啟用 mkcert')
console.log('  5. 刪除舊的主畫面捷徑，重新用 https 網址加入主畫面')
console.log('')

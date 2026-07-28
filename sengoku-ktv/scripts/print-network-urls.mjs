import os from 'node:os'

const port = process.argv[2] ?? '4173'
const protocol = process.argv[3] === 'https' ? 'https' : 'http'
const urls = []

try {
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        urls.push(`${protocol}://${net.address}:${port}`)
      }
    }
  }
} catch {
  // networkInterfaces may fail in restricted environments
}

console.log('')
console.log('本機預覽：')
console.log(`  ${protocol}://localhost:${port}`)
console.log('')
console.log('手機測試（同一 Wi-Fi）：')

if (urls.length === 0) {
  console.log('  找不到區網 IP，請確認 Wi-Fi 已連線')
} else {
  for (const url of urls) console.log(`  ${url}`)
}

console.log('')
if (protocol === 'https') {
  console.log('iPhone 安裝步驟：')
  console.log('  1. Safari 開啟上方 https 網址')
  console.log('  2. 若出現憑證警告，點「顯示詳細資料」→「瀏覽此網站」')
  console.log('  3. 分享 → 加入主畫面')
  console.log('  4. 從主畫面開啟，測試轉盤與離線功能')
} else {
  console.log('提示：iPhone 若要測試 PWA 離線，建議改用 npm run mobile:test:https')
}

console.log('')

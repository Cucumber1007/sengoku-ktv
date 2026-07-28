import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/icons')

fs.mkdirSync(outDir, { recursive: true })

async function makeIcon(size) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0f0f14"/>
    <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="none" stroke="#d4af37" stroke-width="${Math.max(2, size / 48)}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="#b91c1c" stroke-width="${Math.max(3, size / 32)}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" fill="#b91c1c"/>
    <text x="${size / 2}" y="${size * 0.58}" text-anchor="middle" fill="#d4af37" font-size="${size * 0.22}" font-family="serif" font-weight="bold">戰</text>
  </svg>`

  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `icon-${size}.png`))
}

await makeIcon(180)
await makeIcon(192)
await makeIcon(512)
await sharp(path.join(outDir, 'icon-180.png')).toFile(path.join(outDir, 'apple-touch-icon.png'))

console.log('icons generated in public/icons')

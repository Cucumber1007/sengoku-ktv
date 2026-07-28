import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const certDir = path.resolve(__dirname, '.cert')
const certKey = path.join(certDir, 'key.pem')
const certFile = path.join(certDir, 'cert.pem')
const hasTrustedCerts = fs.existsSync(certKey) && fs.existsSync(certFile)
const useHttps = process.env.PREVIEW_HTTPS === 'true' || hasTrustedCerts

const httpsOptions = hasTrustedCerts
  ? {
      key: fs.readFileSync(certKey),
      cert: fs.readFileSync(certFile),
    }
  : undefined

const base = process.env.GITHUB_PAGES === 'true' ? '/sengoku-ktv/' : '/'

export default defineConfig({
  base,
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true,
    ...(useHttps && httpsOptions ? { https: httpsOptions } : {}),
  },
  plugins: [
    react(),
    ...(useHttps && !hasTrustedCerts ? [basicSsl()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'icons/apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],
      manifest: {
        name: '戰國時代',
        short_name: '戰國時代',
        description: 'KTV 合戰轉盤小遊戲',
        start_url: base,
        scope: base,
        id: 'sengoku-ktv',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-TW',
        background_color: '#0f0f14',
        theme_color: '#b91c1c',
        icons: [
          {
            src: `${base}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${base}icons/apple-touch-icon.png`,
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})

# 戰國時代 — KTV 合戰轉盤 PWA

配合 KTV 唱歌使用的離線 PWA 小遊戲。每首歌結束後，被投票選中的玩家點擊轉盤抽取效果。

## 開發

```bash
npm install
npm run dev
```

區網開發預覽：

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## 線上版本（GitHub Pages）

部署完成後網址：

**https://cucumber1007.github.io/sengoku-ktv/**

推送至 `cursor/sengoku-ktv-pwa` 或 `main` 分支會自動部署。

## 手機安裝測試（正式 build）

### 離線可用（必須）

iPhone 主畫面捷徑要離線可用，**一定要用 HTTPS**，且 iPhone 需信任 mkcert 憑證：

```bash
npm run mobile:offline
```

### iPhone 重新安裝步驟（若捷徑異常或離線失效）

1. **刪除舊的主畫面捷徑**
2. Mac 執行 `open "$(mkcert -CAROOT)"`，將 `rootCA.pem` AirDrop 到 iPhone
3. iPhone：設定 → 一般 → VPN 與裝置管理 → 安裝描述檔
4. iPhone：設定 → 一般 → 關於本機 → **憑證信任設定** → 啟用 mkcert
5. Safari 開啟 `https://192.168.x.x:4173/`（**不要用 http**）
6. **等頁面完整載入**（約 3–5 秒，讓 Service Worker 註冊）
7. 分享 → **加入主畫面**
8. 從主畫面開啟，確認可正常使用
9. 開飛航模式，再從主畫面開啟，驗證離線

### 僅連線測試（不能離線）

```bash
npm run mobile:test
```

## 一般建置

```bash
npm run build
npm run preview:lan
```

## 功能

- 轉盤加權抽選（30 種效果）
- 四種模式開關：酒精、食物、殘酷、互動
- 歷史紀錄（最近 10 筆，localStorage）
- PWA 離線支援，可加入 iPhone 主畫面

## 技術棧

Vite + React + TypeScript + vite-plugin-pwa

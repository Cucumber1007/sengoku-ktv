# 戰國時代 KTV 轉盤遊戲 — PWA 需求文件

## 1. 專案目標

本專案是一個配合 KTV 唱歌使用的離線 PWA 小遊戲，名稱為 **「戰國時代」**。

遊戲場景是幾個朋友在 KTV 唱歌時，每首歌結束後，大家自由心證投票選出一位玩家。被選中的玩家需要使用網頁轉盤抽取一個結果。轉盤結果可能是福利、懲罰、控場權、酒水、食物或投票相關效果。

本專案第一版不需要後端、不需要登入、不需要多人同步，也不需要資料庫。  
目標是做成一個可以加入 iPhone 主畫面，且第一次載入後可以離線使用的 PWA。

---

## 2. 核心遊戲規則

### 2.1 基本流程

1. 大家在 KTV 唱完一首歌。
2. 所有人自由心證投票選出一位玩家。
3. 被選中的玩家點擊網頁上的轉盤。
4. 轉盤抽出一個效果。
5. 大家依照效果執行。
6. 繼續下一首歌。

### 2.2 唱歌基本規則

- 每首歌都是所有人一句一句輪流唱。
- 基本玩法不會有「跳過」這種狀況。
- 遊戲效果可以改變**下一首預排歌曲**的唱歌安排，或觸發**插播**，但必須簡單明確。
- 歌單已預點，**不能指定「下一首要唱哪首」**；控場改以**插播**取代選歌。
- 可用單位只有：
  - 一句
  - 第一句
  - 最後一句
  - 第一個副歌
  - 副歌第一句
  - 整首歌
  - 插播（加點一首）
  - 投票階段
  - 轉盤效果本身

### 2.3 插播規則

- **插播**指：在下一首預排歌曲之前，加點一首自己想唱的歌。
- 插播後，原本預排隊列仍照順序進行。
- 與插播相關的效果（如限定類型、限定歌手）僅在執行插播時生效。

### 2.4 不適合出現的規則

避免以下類型的效果：

- 需要大家整首歌持續監督的規則
- 「下一首歌你不能降 Key，除非全場同意」這類影響整首歌設定但又不是單人可控的規則
- 需要判斷「最高音」、「最難的地方」、「某一段」的規則
- 太多額外表演，例如偶像自我介紹、新聞主播評論、過度中二宣言等
- 跳過、逃避、免唱類規則（**例外**：明確限定的單人福利，如「旁觀不亂」僅負責切歌）
- 效果轉移給他人（被投者已轉盤，不可再轉給投票者）
- 太曖昧的互動效果

### 2.5 適合出現的規則

可以出現以下類型：

- 插播一首自己想唱的歌（可限定類型或歌手）
- 下一首歌由某人指定誰唱第一句
- 下一首歌由某人指定唱歌順序
- 下一首歌由某人獨自 solo
- 下一首歌第一個副歌由某人 solo
- 某人多唱一句或少唱（福利）
- 某人重唱剛剛最慘的一句
- 某人取得下輪投票特權
- 某人喝一小口酒或飲料
- 全員補水
- 全員吃一口拼盤
- 指定拼盤食物一起吃

---

## 3. 技術方向

### 3.1 第一版技術選擇

建議使用：

- Vite
- React
- TypeScript
- CSS Modules 或一般 CSS
- localStorage
- Service Worker
- Web App Manifest

第一版不需要：

- 後端 API
- 資料庫
- 使用者登入
- 房間系統
- 多人同步
- 雲端儲存
- App Store 上架

### 3.2 PWA 需求

此專案需要可以作為 PWA 使用：

- 支援 iPhone Safari 加入主畫面
- 加入主畫面後顯示 App icon
- 顯示名稱為「戰國時代」
- 第一次載入後，主要功能可離線使用
- 離線時仍可：
  - 開啟頁面
  - 使用轉盤
  - 切換模式
  - 查看歷史紀錄
  - 抽取結果

---

## 4. 使用者體驗目標

### 4.1 使用情境

使用者多半會在 KTV 包廂內使用 iPhone 操作，因此 UI 需要：

- 手機優先設計
- 按鈕要大
- 文字要清楚
- 不要需要太多輸入
- 單手也能操作
- 暗色系或霓虹風格較適合 KTV 環境
- 抽中結果要有儀式感

### 4.2 視覺風格

整體風格可以結合：

- 戰國時代
- KTV
- 酒局
- 兄弟局
- 霓虹
- 黑金
- 紅黑
- 日式家紋 / 戰旗元素

但第一版不需要過度複雜，先以可玩性為主。

---

## 5. 第一版頁面結構

### 5.1 Header

顯示：

- 遊戲名稱：戰國時代
- 副標語，例如：KTV 合戰轉盤
- 目前啟用的模式標籤

### 5.2 模式設定區

提供以下開關：

1. 酒精模式
2. 食物模式
3. 殘酷模式
4. 互動模式

第一版可以先保留互動模式，但預設關閉。

### 5.3 轉盤區

包含：

- 一個轉盤視覺元素
- 「開戰」按鈕
- 抽選動畫
- 抽選中狀態
- 抽選完成狀態

### 5.4 結果卡片

抽中後顯示：

- 效果標題
- 效果內容
- 分類
- 標籤
- 是否為殘酷模式 / 酒精模式 / 食物模式限定

### 5.5 歷史紀錄

顯示最近 5 到 10 次抽中的結果。

歷史紀錄需要儲存在 localStorage。

---

## 6. 模式說明

### 6.1 酒精模式

開啟後，轉盤可以抽到酒水相關效果。

關閉後，不應抽到明確要求喝酒的效果。  
若需要保留酒水類效果，文案應改成「酒或飲料」。

### 6.2 食物模式

開啟後，轉盤可以抽到拼盤相關效果。

關閉後，不應抽到需要吃拼盤的效果。

### 6.3 殘酷模式

開啟後，轉盤可以抽到較重的唱歌懲罰，例如：

- 下一首歌 solo
- 副歌 solo
- 多唱一句
- 重唱剛剛最慘的一句

關閉後，轉盤應偏向輕量效果。

### 6.4 互動模式

開啟後，才可以出現需要指定另一位玩家一起執行的效果。

互動模式預設關閉。  
第一版可以先做資料欄位與開關，不一定要放太多互動效果。

---

## 7. 轉盤資料結構

請將所有轉盤效果集中管理，例如放在：

```text
src/data/wheelItems.ts
```

建議資料格式如下：

```ts
export type WheelCategory =
  | "control"
  | "singing_reward"
  | "singing_penalty"
  | "vote"
  | "drink"
  | "food"
  | "neutral";

export interface WheelItem {
  id: string;
  title: string;
  description: string;
  category: WheelCategory;
  tags: string[];
  modes: {
    alcohol: boolean;
    food: boolean;
    brutal: boolean;
    interaction: boolean;
  };
  weight: number;
}
```

範例：

```ts
export const wheelItems: WheelItem[] = [
  {
    id: "tenka-fubu",
    title: "天下布武",
    description: "下一首歌由你指定",
    category: "control",
    tags: ["福利", "選歌"],
    modes: {
      alcohol: false,
      food: false,
      brutal: false,
      interaction: false
    },
    weight: 1
  },
  {
    id: "kojo-shishu",
    title: "孤城死守",
    description: "下一首歌由你獨自 solo",
    category: "singing_penalty",
    tags: ["懲罰", "唱歌"],
    modes: {
      alcohol: false,
      food: false,
      brutal: true,
      interaction: false
    },
    weight: 0.5
  }
];
```

---

## 8. 轉盤項目（50 個）

完整資料維護於 [`sengoku-ktv/src/data/wheelItems.ts`](sengoku-ktv/src/data/wheelItems.ts)。

### 8.1 分類統計

| 分類 | 數量 | 說明 |
|------|------|------|
| control | 15 | 插播、指定唱歌順序/段落、句位限制 |
| singing_reward | 9 | 特權向福利（含投票特權與下一首安排） |
| singing_penalty | 11 | 唱歌懲罰 |
| vote | 4 | 投票相關（盡量少影響後續投票，免死金牌除外） |
| drink | 5 | 酒水、補水 |
| food | 5 | 時序／社交食物梗（不假設進食受限制） |
| neutral | 1 | 休息 |
| **合計** | **50** | |

### 8.2 修訂摘要

**改為插播（4 個）：** 天下布武、戰場選擇權、歌單封鎖、宿敵指定

**已移除／替換：**
- 本能寺之變（效果轉移，不符合流程）
- 天下大赦（與全軍補水令重複）
- 公開表決（投票本就公開，無效）
- 暗中結盟（「指定不能投你」無實質約束）
- 補給特權等「可吃／優先選」空洞食物福利
- singing_reward 中「多唱」與控場重複項（連勝三句、犒賞時刻、副歌點將）
- 影之否決／再投軍令改為控場（句位封鎖、逆序軍令），避免無謂影響後續投票

**福利／投票重點：**
- singing_reward：獨裁轉盤、免戰牌、改判特權、評定裁決（免輪）、緩兵之計、旁觀不亂、換將特權等
- 投票保留：免死金牌、德川忍耐、復仇之刃、護駕令
- 食物：邊戰補給、齊咬號令、投餵之儀、禁食合戰、傳糧一巡

### 8.3 資料格式

```ts
export interface WheelItem {
  id: string
  title: string
  description: string
  category: WheelCategory
  tags: string[]
  modes: { alcohol, food, brutal, interaction }
  weight: number
}
```

---

## 9. 抽選邏輯

### 9.1 模式過濾

抽選前需根據目前模式設定過濾項目。

邏輯：

- 若酒精模式關閉，排除 `modes.alcohol === true`
- 若食物模式關閉，排除 `modes.food === true`
- 若殘酷模式關閉，排除 `modes.brutal === true`
- 若互動模式關閉，排除 `modes.interaction === true`

### 9.2 權重抽選

每個項目有 `weight` 欄位。  
權重越高，被抽中的機率越高。

需要實作 weighted random picker。

### 9.3 防連續重複

避免連續兩次抽到同一個 `id`。

若候選項目大於 1，則排除上一個抽中的項目。

---

## 10. localStorage 需求

需要儲存：

```ts
interface AppSettings {
  alcohol: boolean;
  food: boolean;
  brutal: boolean;
  interaction: boolean;
}

interface HistoryRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}
```

localStorage keys：

```text
sengoku-settings
sengoku-history
sengoku-last-result
```

歷史紀錄最多保留 10 筆。

---

## 11. 建議專案結構

```text
sengoku-ktv/
├─ public/
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  ├─ manifest.json
│  └─ sw.js
│
├─ src/
│  ├─ data/
│  │  └─ wheelItems.ts
│  │
│  ├─ components/
│  │  ├─ Header.tsx
│  │  ├─ ModePanel.tsx
│  │  ├─ Wheel.tsx
│  │  ├─ ResultCard.tsx
│  │  └─ HistoryList.tsx
│  │
│  ├─ hooks/
│  │  ├─ useLocalStorage.ts
│  │  └─ useWheel.ts
│  │
│  ├─ utils/
│  │  ├─ filterItems.ts
│  │  ├─ pickWeightedItem.ts
│  │  └─ storage.ts
│  │
│  ├─ types/
│  │  └─ wheel.ts
│  │
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
│
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

---

## 12. UI 元件需求

### 12.1 Header

顯示：

- 戰國時代
- KTV 合戰轉盤
- 目前模式狀態

### 12.2 ModePanel

四個 toggle：

- 酒精模式
- 食物模式
- 殘酷模式
- 互動模式

切換後立即影響轉盤候選項目。  
設定需保存到 localStorage。

### 12.3 Wheel

功能：

- 顯示轉盤
- 點擊「開戰」後旋轉
- 旋轉期間禁用按鈕
- 結束後回傳抽中項目
- 動畫時間約 2 到 4 秒

第一版可以先不做真實分區轉盤，可以使用旋轉圓盤搭配結果卡片。  
但視覺上需要讓使用者感覺有抽選儀式感。

### 12.4 ResultCard

顯示：

- 標題
- 描述
- 分類
- 標籤
- 是否為模式限定

### 12.5 HistoryList

顯示最近 10 筆紀錄。

每筆包含：

- 標題
- 描述
- 時間

---

## 13. PWA 設定

### 13.1 manifest.json

需要包含：

```json
{
  "name": "戰國時代",
  "short_name": "戰國時代",
  "description": "KTV 合戰轉盤小遊戲",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0f0f14",
  "theme_color": "#b91c1c",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 13.2 iPhone 支援

`index.html` 需要加入：

```html
<meta name="theme-color" content="#b91c1c" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="戰國時代" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### 13.3 Service Worker

需要快取：

- index.html
- JS bundle
- CSS
- manifest.json
- icons
- wheelItems 資料

離線時應可正常載入 App shell。

---

## 14. 第一版開發階段

### Phase 1 — 可玩 MVP

完成：

- Vite + React + TypeScript 專案
- 基本 UI
- 轉盤資料
- 模式開關
- 權重抽選
- 結果卡片
- 歷史紀錄
- localStorage

### Phase 2 — PWA 化

完成：

- manifest.json
- icon
- Service Worker
- 離線測試
- iPhone 加入主畫面測試

### Phase 3 — 體驗優化

完成：

- 轉盤動畫
- 結果動畫
- 手機版 UI 優化
- 防止連點
- 防連續重複
- 暗色 / 霓虹視覺調整

---

## 15. 驗收條件

第一版完成時，應滿足：

- 可以在手機瀏覽器正常使用
- 可以抽轉盤
- 可以依模式過濾項目
- 可以顯示抽中結果
- 可以記錄最近 10 次結果
- 重新整理後設定與紀錄不消失
- 可以加入 iPhone 主畫面
- 加入主畫面後可以像 App 一樣開啟
- 離線時仍可使用主要功能
- 不需要後端即可運作

---

## 16. 非目標

第一版不做：

- 多人投票
- 房間代碼
- 帳號系統
- 雲端同步
- 後台管理
- App Store 上架
- 原生 iOS App
- 複雜動畫引擎
- 付費功能

---

## 17. 開發原則

- 先求可玩，再求漂亮。
- 所有規則都要符合 KTV 現場能立刻執行。
- 不要設計需要長時間解釋的效果。
- 不要把遊戲變成真心話大冒險。
- 不要過度增加額外表演。
- 轉盤結果要短、清楚、有梗。
- 酒精相關效果都應保持輕量，避免過量飲酒。
- 所有資料先放前端，避免過早導入後端。

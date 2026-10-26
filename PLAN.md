# 國小二年級國語自主學習遊戲 - 開發計畫書 (PLAN.md)

本專案依據教育部 108 課綱康軒版國小二年級上學期教材架構，打造全前端、零後端依賴的互動式教育冒險網頁遊戲，支援桌機、平板觸控螢幕及教室智慧大屏，一鍵部署於 **GitHub Pages**。

---

## 一、 技術架構與選型

| 模組 | 選用技術 | 設計考量 | 對應強制調用 Skill |
| :--- | :--- | :--- | :--- |
| **建置工具 & 語言** | Vite + React 18 + TypeScript | 快速啟動、模組化狀態管理、嚴格型別防止低級錯誤。 | - |
| **樣式與版面** | Tailwind CSS + CSS Modules | 輕量、彈性響應式、構建大尺寸觸控 UI（符合低年級人機介面）。 | `game-ui-ux` |
| **互動手感與特效** | CSS Keyframes + Canvas-Confetti | 答對 Squash & Stretch 彈跳、三次錯誤高亮引導、零挫折溫和晃動。 | `game-feel` |
| **輸入系統** | Pointer Events 雙模機制 | 支援「拖曳吸附 (Snap Radius ≥ 30px)」與「點選放置」，防誤觸防滾動。 | `input-systems` |
| **注音顯示機制** | 原生 HTML5 `<ruby><rb>字</rb><rt>ㄗˋ</rt></ruby>` | 免載入數十 MB 的注音字型檔，瀏覽器原生支援，縮放不失真且無版權問題。 | `game-ui-ux` |
| **音效系統** | Web Audio API（自研微型合成器） | 程式動態生成彈跳音、答對提示音、星級音效，零外載音訊體積。 | `audio-design` |
| **語音導讀 (TTS)** | 瀏覽器原生 `window.speechSynthesis` (`zh-TW`) | 支援語音朗讀題幹、生字與提示，降低低年級閱讀門檻。 | `audio-design` |
| **向量素材視覺** | 內聯 SVG 圖元 + 柔和繪本色盤 | 低彩度不傷眼繪本風，完全 0 外部圖片請求。 | `create-game-assets` |
| **存檔系統** | 瀏覽器 `localStorage` | 紀錄關卡星級、生字存摺、錯題本，支援 JSON 匯出/匯入。 | `save-systems` |
| **部署流程** | GitHub Actions (`gh-pages`) | push 到 main 分支自動建置產出靜態網站至 GitHub Pages。 | - |

---

## 二、 核心遊戲化架構與關卡規劃

遊戲以「**語文冒險島**」為世界觀，學童扮演「文字小精靈」，依序解鎖 5 大主題王國：

```
[語文冒險島地圖]
  ├── [島嶼 0] 字典神木森林  ── 部首辨識、筆畫雷達、部首查字三步驟
  ├── [島嶼 1] 朝氣晨光鎮    ── 部首偏旁分類(艸/水/木)、疊字短語列車
  ├── [島嶼 2] 歡樂慶典城    ── 標點彈珠台(、，！)、時間順序傳送帶(先/接著/最後)
  ├── [島嶼 3] 故事智慧館    ── 多音字魔鏡(長/得/重)、曹沖天平推理、四要素拼圖
  ├── [島嶼 4] 冬日候鳥郵局  ── 書信格式工廠(稱謂/問候/正文/祝詞/署名/日期)、因果積木
  └── [試煉之塔] 語文大挑戰  ── 閱讀階梯長文挑戰與綜合閱測
```

### 各單元關卡機制對照表

| 關卡代號 | 單元主題 | 核心語文能力 | 遊戲機制設計 |
| :--- | :--- | :--- | :--- |
| **Level 0** | **查字典真簡單** | 部首表義、外筆畫計算、檢字法 | **【部首尋寶雷達】**：拆解漢字部件，拖曳部首至檢字盤，計算剩餘筆畫開寶箱。 |
| **Level 1** | **第一單元：生活新鮮事**<br>（第1-3課） | 1. 艸/水/木部首分類<br>2. 疊字副詞（慢慢的走、靜靜的看）<br>3. 「一邊……一邊……」複句 | **【疊字點心列車】**：拖曳「疊字語詞積木」搭配動作完成早餐訂單；部首輸送帶生字分類。 |
| **Level 2** | **第二單元：歡樂的時刻**<br>（第4-6課） | 1. 標點符號（頓號、逗號、感嘆號）<br>2. 順敘法時間銜接（先…接著…最後…）<br>3. 形近字比對（坐/座、屋/室） | **【慶典標點大砲】**：將缺漏的標點發射入句；排順序製作柿餅（曬柿工序時序卡拖曳）。 |
| **Level 3** | **第三單元：故事萬花筒**<br>（第7-9課） | 1. 多音字辨析（長、得、重）<br>2. 故事四要素（人物、時間、地點、事件）<br>3. 因果邏輯（因為……所以……） | **【曹沖天平稱象】**：配對多音字語境獲取等重石頭；分類故事四要素卡片推動劇情。 |
| **Level 4** | **第四單元：冬天的悄悄話**<br>（第10-12課） | 1. 應用文格式（稱謂、問候、正文、署名、日期）<br>2. 比喻修辭（像……一樣……）<br>3. 錯別字校正 | **【黑琵信差裝箱】**：將賀年卡各部件依規範放入信封；辨識並點擊錯別字予以消除。 |
| **Final** | **閱讀階梯** | 長文閱讀理解、訊息擷取與因果推論 | **【繪本解謎劇場】**：滾動式圖文短文閱讀，互動問答解鎖通關徽章。 |

---

## 三、 專案目錄結構規劃

```
text-adventure-game/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 自動建置部署
├── public/
│   ├── favicon.ico
│   └── audio/                      # 備用音效素材 (若合成器不足時)
├── src/
│   ├── core/                       # 遊戲核心引擎
│   │   ├── AudioManager.ts         # Web Audio 合成音效引擎 (無外載音檔)
│   │   ├── SpeechManager.ts        # Web Speech API 語音朗讀器
│   │   ├── StorageManager.ts       # 本機 LocalStorage 進度與存檔
│   │   └── Types.ts                # 全局 TypeScript 定義
│   ├── data/                       # 課程與題庫資料庫
│   │   ├── level0-dictionary.json  # 字典篇題庫
│   │   ├── level1-life.json        # 第一單元題庫
│   │   ├── level2-joy.json         # 第二單元題庫
│   │   ├── level3-stories.json     # 第三單元題庫
│   │   ├── level4-winter.json      # 第四單元題庫
│   │   └── reading-ladder.json     # 閱讀階梯題庫
│   ├── components/                 # 可複用 UI 與遊戲模組
│   │   ├── common/
│   │   │   ├── RubyText.tsx        # 支援注音排版的文字組件
│   │   │   ├── BigButton.tsx       # 低年級防誤觸大按鈕
│   │   │   ├── ProgressBar.tsx     # 關卡進度與星級顯示條
│   │   │   └── DialogBox.tsx       # 角色導讀對話框
│   │   └── gameplay/
│   │       ├── DragDropSlot.tsx    # 磁吸式拖曳卡槽 (支援滑鼠與觸控)
│   │       ├── WordBuilder.tsx     # 部件拼字器
│   │       ├── PunctuationCanon.tsx# 標點符號發射器
│   │       └── SequenceSorter.tsx  # 句子順序重組器
│   ├── views/                      # 畫面視圖
│   │   ├── MapView.tsx             # 世界地圖主選單
│   │   ├── StageView.tsx           # 關卡遊玩畫面
│   │   ├── ResultModal.tsx         # 通關結算 (星等、鼓掌動畫)
│   │   └── NotebookView.tsx        # 生字小筆記與錯題複習本
│   ├── App.tsx                     # 主應用入口與簡易路由
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 四、 開發里程碑與時程規劃 (Milestones)

### Milestone 1：地基建置與核心組件庫 (關聯 Skills: `game-ui-ux`, `audio-design`, `save-systems`)
- [ ] 初始化 Vite + React + TypeScript + TailwindCSS 專案。
- [ ] 撰寫 `RubyText` 組件，支援標準國字與注音排版（鎖定防裁切）。
- [ ] 依據 `audio-design` 完成 `AudioManager`（Web Audio 正弦波雙音合成、防爆音 Gain Envelope）。
- [ ] 完成 `SpeechManager` 封裝，實現點擊朗讀功能 (`zh-TW`)。
- [ ] 依據 `save-systems` 建立 `StorageManager`，管理玩家等級、星數、已解鎖關卡與 JSON 匯出匯入。

### Milestone 2：關卡 0 與關卡 1-2 原型 (關聯 Skills: `input-systems`, `game-feel`, `create-game-assets`)
- [ ] 導入 `level0-dictionary.json` 與 `level1-life.json`。
- [ ] 開發關卡 0「部首與查字典檢索三步驟」操作互動。
- [ ] 依據 `input-systems` 開發關卡 1「疊字副詞＋的＋動作」拖曳吸附列車與「部首分類傳送帶」（支援 Tap-to-Place 與 Drag-and-Drop 雙模）。
- [ ] 開發關卡 2「標點符號小法官」與「時間軸順敘法排序」。
- [ ] 實裝平板與觸控螢幕防誤觸檢測（`touch-action: none`、大點擊熱區 ≥ 64px）。

### Milestone 3：關卡 3-4 與終章故事館 (關聯 Skills: `game-feel`, `create-game-assets`)
- [ ] 導入 `level3-stories.json`、`level4-winter.json` 與 `reading-ladder.json`。
- [ ] 開發關卡 3「多音字辨析」與「曹沖秤象天平」推理系統。
- [ ] 開發關卡 4「書信卡片格式組裝」與「因果關聯句型積木」。
- [ ] 開發閱讀階梯長文閱讀測驗模式（分段提示與因果提取）。

### Milestone 4：UI 精緻化、手感拋光與 GitHub Pages 發布 (關聯 Skills: `game-feel`, `game-ui-ux`)
- [ ] 依據 `game-feel` 加入答對卡片彈跳（Squash & Stretch）、通關彩帶動畫（`canvas-confetti`）、星級結算彈窗。
- [ ] 實作三次答錯高亮引導模式（零挫折無痛教學）。
- [ ] 建置「個人生字存摺」與「錯題救援本」檢視功能。
- [ ] 配置 `.github/workflows/deploy.yml`，測試自動化構建與發布至 GitHub Pages。
- [ ] 跨裝置實機驗證（Windows Chrome、iPad Safari、大螢幕觸控板）。

---

## 五、 GitHub 倉庫與自動化部署設定

- **專案倉庫**：`https://github.com/lucifer0427/grade2-chinese-review-game`
- **GitHub Pages 預設網址**：`https://lucifer0427.github.io/grade2-chinese-review-game/`

### 1. `vite.config.ts` 設定
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保使用相對路徑，相容 GitHub Pages 二級路徑資產加載
});
```

### 2. GitHub Actions 現代化原生發布工作流 (`.github/workflows/deploy.yml`)
採用 GitHub 官方最新推薦的 `actions/upload-pages-artifact@v3` 與 `actions/deploy-pages@v4`，免維護 `gh-pages` 分支：

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: |
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

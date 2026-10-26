# 國小二年級國語自主學習遊戲 - 開發計畫書 (PLAN.md)

本專案依據教育部 108 課綱康軒版國小二年級上學期教材架構，打造全前端、零後端依賴的互動式教育冒險網頁遊戲，支援桌機、平板觸控螢幕及教室智慧大屏（ViewSonic/BenQ），一鍵部署於 **GitHub Pages**。

---

## 一、 技術架構與選型

| 模組 | 選用技術 | 設計考量與關鍵強化 | 對應強制調用 Skill |
| :--- | :--- | :--- | :--- |
| **建置工具 & 語言** | Vite + React 18 + TypeScript | 快速啟動、模組化狀態管理、可辨識聯合型別 (Discriminated Unions) 嚴格校驗題庫。 | - |
| **樣式與版面** | Tailwind CSS + CSS Variables | 適配 16:9（教室大屏）與 4:3（iPad）安全邊界，觸控熱區強制 `≥ 64px`。 | `game-ui-ux` |
| **台灣直式注音引擎** | 自研 `RubyText.tsx` 直排解析器 | **廢棄瀏覽器預設水平置頂 `<rt>`**；自動拆解「聲母/介音/韻母/調號（含輕聲置頂）」渲染於國字右側，100% 對齊教育部課本標準且零字型載入體積。 | `game-ui-ux` |
| **互動手感與特效** | CSS Keyframes + Canvas-Confetti | 答對 Squash & Stretch 彈跳、三次錯誤自動啟動高亮引導（零挫折模式）、溫和搖晃反饋。 | `game-feel` |
| **雙模輸入系統** | Pointer Events 雙模互動器 | 全面支援「**點選放置 (Tap-to-Place)**」與「**拖曳吸附 (Snap Radius ≥ 30px)**」雙模，鎖定 `touch-action: none` 防誤觸滾動。 | `input-systems` |
| **音效合成系統** | Web Audio API (`AudioManager.ts`) | 純程式即時合成 6 種正向音效，內建 Gain Envelope 防爆音與 `onended` 節點自動回收防記憶體洩漏。 | `audio-design` |
| **語音導讀 (TTS)** | `window.speechSynthesis` (`zh-TW`) | 預設語速 `rate: 0.85` 慢速清晰導讀；內建**破音字/多音字同音替代詞表 (`ttsOverride`)**，解決「長/得/重」單字誤讀。 | `audio-design` |
| **繪本視覺資產** | 內聯 SVG + 輕量 WebP (`< 30KB`) | 低彩度護眼繪本色盤，**畫面 100% 嚴禁 AI 生成任何文字或注音**，總圖檔體積 `< 500KB`。 | `chinese-storybook-illustrator` |
| **存檔與錯題系統** | 瀏覽器 `localStorage` | 支援 `schemaVersion` 自動遷移、關卡星等、生字存摺、錯題重練，以及課堂教學進度 JSON 匯出/匯入。 | `save-systems` |
| **部署流程** | GitHub Actions (`deploy-pages@v4`) | Push 到 `main` 分支自動執行型別檢查、建置與發布至 GitHub Pages。 | - |

---

## 二、 核心遊戲化架構與關卡規劃

遊戲以「**語文冒險島**」為世界觀，學童扮演「文字小精靈」，依序解鎖 6 大主題島嶼：

```
[語文冒險島地圖]
  ├── [島嶼 0] 字典神木林 (查字典真簡單)   ── 部首辨識、外筆畫計算、查字典三步驟排序
  ├── [島嶼 1] 晨光小廚房 (單元一：第1~3課) ── 艸/水/木部首歸類、疊字副詞列車、並列複句
  ├── [島嶼 2] 秋日柿餅節 (單元二：第4~6課) ── 標點符號大砲(、，！)、曬柿順敘時間軸(先/接著/最後)、形近字
  ├── [島嶼 3] 智慧天平館 (單元三：第7~9課) ── 多音字語境天平(長/得/重)、故事四要素拼圖、因果複句
  ├── [島嶼 4] 冬日候鳥郵局 (單元四：第10~12課)── 賀卡書信格式組裝、比喻修辭、錯別字啄木鳥
  └── [終章島] 冒險畢業典禮 (閱讀階梯)     ── 長文分段閱讀理解、訊息擷取與推論挑戰
```

### 各單元關卡與四大核心互動引擎對照表

為避免硬編碼各關邏輯，將全冊 6 大島嶼收斂為 **4 種標準化核心互動引擎 (`mechanicType`)**：

| 關卡代號 | 單元主題 | 核心語文能力 (108 課綱對齊) | 調用互動引擎 (`mechanicType`) | 遊戲化情境包裝 |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 0** | **查字典真簡單** | 部首表義、部首外筆畫計算、檢字三步驟 (`4-I-3`) | `choice` + `sequence` | **【字典神木尋寶】**：拆解部首與計算外筆畫開鎖，排列查字典三步驟口訣。 |
| **Stage 1** | **第一單元：生活新鮮事**<br>（第1~3課 + 統整一） | 1. 艸/水/木部首表義歸類 (`Ab-I-4`)<br>2. 疊字副詞短語（慢慢的走）<br>3. 「一邊…一邊…」並列複句 | `drag-slot` + `choice` | **【晨光早餐列車】**：將疊字詞與動作卡放入餐盤卡槽；部首輸送帶分類。 |
| **Stage 2** | **第二單元：歡樂的時刻**<br>（第4~6課 + 統整二） | 1. 標點符號（頓號、逗號、感嘆號）<br>2. 順敘法時間軸（先…接著…最後…）<br>3. 形近字辨析（坐/座、屋/室） | `drag-slot` + `sequence` | **【慶典標點大砲 & 曬柿工坊】**：發射標點填入句中空格；按時間順序排列曬柿餅工序。 |
| **Stage 3** | **第三單元：故事萬花筒**<br>（第7~9課 + 統整三） | 1. 多音字語境辨析（長、得、重）<br>2. 故事四要素（時間、地點、人物、事件）<br>3. 因果複句（因為…所以…） | `scale-balance` + `drag-slot` | **【曹沖秤象智慧天平】**：為多音字選出正確讀音石塊使大象船身平衡；拼裝四要素故事卡。 |
| **Stage 4** | **第四單元：冬天的悄悄話**<br>（第10~12課 + 統整四） | 1. 書信賀卡六大格式 (`Be-I-2`)<br>2. 比喻修辭（像…一樣…）<br>3. 常見錯別字辨正 | `sequence` + `choice` | **【黑琵信差郵局】**：將稱謂、問候、正文、祝詞、署名、日期依序裝入賀卡框架；抓出錯別字。 |
| **Stage 5** | **閱讀階梯：我最喜歡上學了** | PIRLS 四層次閱讀理解（提取、推論、詮釋、省思）(`5-I-4`, `5-I-7`) | `reading-comprehension` | **【繪本解謎劇場】**：附帶注音與語音導讀的繪本短文面板，搭配分段闖關問答。 |

---

## 三、 統一題庫資料結構與專案目錄規劃

### 1. 專案目錄結構（與 `AGENTS.md` 100% 同步）

```
grade2-chinese-review-game/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Pages 自動建置部署
├── public/
│   ├── favicon.svg                     # 純向量繪本風圖示
│   └── assets/
│       ├── stages/                     # 關卡封面 (16:9 WebP, <30KB, 零文字)
│       └── badges/                     # 成就勳章 (1:1 WebP, 透明背景)
├── src/
│   ├── core/                           # 遊戲核心引擎
│   │   ├── Types.ts                    # 全局題庫、存檔與狀態型別定義
│   │   ├── ZhuyinParser.ts             # 台灣標準直式注音拆解引擎 (聲/介/韻/調)
│   │   ├── AudioManager.ts             # Web Audio 合成音效引擎 (含節點回收)
│   │   ├── SpeechManager.ts            # Web Speech API 朗讀器 (含破音字校正)
│   │   └── StorageManager.ts           # LocalStorage 進度、生字存摺、錯題本與匯出入
│   ├── data/
│   │   └── stages/                     # 統一題庫目錄 (嚴格遵循 CurriculumQuestion)
│   │       ├── stage0-dictionary.json  # 序章：查字典真簡單
│   │       ├── stage1-life.json        # 第一單元：生活新鮮事
│   │       ├── stage2-joy.json         # 第二單元：歡樂的時刻
│   │       ├── stage3-stories.json     # 第三單元：故事萬花筒
│   │       ├── stage4-winter.json      # 第四單元：冬天的悄悄話
│   │       ├── stage5-reading.json     # 終章：閱讀階梯
│   │       └── index.ts                # 題庫匯總與關卡元資料 (StageMeta)
│   ├── components/
│   │   ├── common/
│   │   │   ├── RubyText.tsx            # 台灣教育部標準右側直式注音文字組件
│   │   │   ├── BigButton.tsx           # 低年級防誤觸大熱區按鈕 (≥64px)
│   │   │   ├── TopNavBar.tsx           # 頂部狀態列 (音訊開關、注音開關、返回地圖)
│   │   │   └── HintBubble.tsx          # 零挫折引導提示對話框 + TTS 語音播放鈕
│   │   └── gameplay/
│   │       ├── ChoiceBoard.tsx         # 單選/形近字/錯別字/多音字天平互動面板
│   │       ├── DragSlotBoard.tsx       # 雙模(點選+拖曳吸附)填空與句型積木面板
│   │       ├── SequenceBoard.tsx       # 順敘時間軸、查字典步驟、書信格式排序面板
│   │       └── ReadingStoryPanel.tsx   # 閱讀階梯長文附注音捲動閱讀器
│   ├── views/
│   │   ├── MapView.tsx                 # 語文冒險島世界地圖主選單
│   │   ├── StageView.tsx               # 關卡主控台 (進度條、連擊、三次錯誤引導、過關結算)
│   │   ├── NotebookView.tsx            # 生字存摺 (部首/筆畫查詢) 與錯題重練本
│   │   └── SettingsModal.tsx           # 教師/家長工具箱 (進度 JSON 匯出匯入、重置)
│   ├── App.tsx                         # 主應用狀態路由
│   ├── main.tsx                        # React 掛載入口
│   └── index.css                       # Tailwind 與 Squash & Stretch 關鍵影格動畫
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

### 2. 擴充版題庫 Schema (`src/core/Types.ts`)

向下相容 `AGENTS.md` 基礎定義，並擴充支援填空卡槽、順序排列與長文閱讀：

```typescript
export type FocusType =
  | 'radical'      // 部首與筆畫
  | 'components'   // 部件與形近字
  | 'homophone'    // 多音字與同音字
  | 'punctuation'  // 標點符號
  | 'syntax'       // 疊字短語、複句、順敘法
  | 'idiom'        // 成語與修辭
  | 'letter'       // 書信賀卡應用文格式
  | 'reading';     // 閱讀理解

export type MechanicType =
  | 'choice'       // 經典點選 / 曹沖天平對比選擇
  | 'drag-slot'    // 雙模拖曳/點選填入卡槽 (標點填空、疊字造句)
  | 'sequence';    // 順序排列 (查字典步驟、先/接著/最後、書信格式)

export interface CurriculumQuestion {
  id: string;                      // 例: "u1-l2-char-01"
  unitId: number;                  // 0 ~ 5 (0: 查字典, 1~4: 單元一至四, 5: 閱讀階梯)
  lessonId: number;                // 課次 (0 ~ 13)
  focusType: FocusType;
  mechanicType: MechanicType;      // 決定調用哪個互動組件
  prompt: string;                  // 題目說明 (純文字，支援由 RubyText 自動標音或詞庫匹配)
  promptZhuyin?: string;           // 題目重點詞注音輔助
  passage?: string;                // 閱讀階梯或情境短文段落
  sentenceTemplate?: string;       // 用於 drag-slot，例: "媽媽一邊[___]，一邊聽音樂。"
  targetWord?: {
    char: string;                  // 目標生字 (通關後自動收錄進「生字存摺」)
    zhuyin: string;                // 標準注音，例: "ㄔㄤˊ"
    radical: string;               // 部首，例: "長"
    strokeCount: number;           // 部首外筆畫
    totalStrokes?: number;         // 總筆畫
    meaning?: string;              // 字義或造詞範例
  };
  options: Array<{
    id: string;
    text: string;
    zhuyin?: string;               // 選項專屬注音 (特別用於多音字與生字卡)
    isCorrect: boolean;            // choice/drag-slot 中標記正確項
    orderIndex?: number;           // sequence 排序題中的正確順序 (0, 1, 2...)
    hint: string;                  // 錯答時的溫和反饋引導
    ttsOverride?: string;          // 防止 Web Speech API 破音字讀錯的替代發音字串
  }>;
  audioPromptText?: string;        // 點擊語音鈕時的 TTS 朗讀文本 (含破音字校正)
}
```

---

## 四、 開發里程碑與執行順序 (Milestones)

### Milestone 1：前端基建、台灣直式注音引擎與核心管理器
* **關聯 Skills**：`game-ui-ux`, `audio-design`, `save-systems`
- [ ] 建立 `package.json`、`vite.config.ts` (`base: './'`)、`tsconfig.json`、`tailwind.config.js`，完成專案初始化。
- [ ] 實作 `ZhuyinParser.ts` 與 `RubyText.tsx`：將注音字串（如 `ㄔㄨㄤˊ`、`˙ㄉㄜ`）精準拆解為台灣教育部標準**右側直排注音 + 調號欄（輕聲置頂）**。
- [ ] 升級 `AudioManager.ts`：補齊 `OscillatorNode.onended` 自動 `disconnect()` 節點清理，消除高頻點擊記憶體累積與 WebKit 爆音。
- [ ] 實作 `SpeechManager.ts`：綁定 `zh-TW` 語音、`rate: 0.85` 慢速朗讀，並支援 `ttsOverride` 破音字保護。
- [ ] 實作 `StorageManager.ts`：包含 `schemaVersion: 1` 驗證遷移、關卡星等紀錄、自動解鎖「生字存摺」、錯題收集器，以及 JSON 備份匯出/匯入。

### Milestone 2：全冊結構化題庫建置 (Stage 0 ~ Stage 5)
* **關聯 Skills**：`save-systems`
- [ ] 依據 `raws/康軒二上國語教材評析.md` 建立 `src/data/stages/` 下全部 6 大關卡題庫（每關 6~8 題精選核心素養題，總計約 40+ 道互動題目與 30+ 個核心生字存摺詞條）：
  - `stage0-dictionary.json`（部首表義、算外筆畫、查字典三步驟排序）
  - `stage1-life.json`（艸/水/木歸類、疊字副詞「慢慢的走」、「一邊…一邊…」）
  - `stage2-joy.json`（頓號/逗號/感嘆號大砲、「先…接著…最後…」曬柿餅排序、坐/座與屋/室形近字）
  - `stage3-stories.json`（長/得/重多音字天平、故事四要素提取、「因為…所以…」因果句）
  - `stage4-winter.json`（賀年卡六大格式排序、「像…一樣…」比喻修辭、常見錯別字訂正）
  - `stage5-reading.json`（《我最喜歡上學了》分段短文與 PIRLS 四層次閱讀問答）

### Milestone 3：雙模互動玩法引擎與零挫折反饋系統
* **關聯 Skills**：`input-systems`, `game-feel`, `game-ui-ux`
- [ ] 實作 `ChoiceBoard.tsx`（含一般選項卡與曹沖秤象天平視覺動效）。
- [ ] 實作 `DragSlotBoard.tsx`（同時支援「點擊選項自動飛入卡槽」與「Pointer Events 拖曳磁吸 ≥ 30px」雙模操作）。
- [ ] 實作 `SequenceBoard.tsx`（支援點選排入與拖曳換位，用於查字典步驟、順敘法時間軸與賀卡格式組裝）。
- [ ] 實作 `StageView.tsx` 零挫折狀態機：
  - 答錯第 1~2 次：卡片輕微水平搖晃 + 溫和三角波提示音 + 彈出 `option.hint` 語音引導。
  - 答錯第 3 次：自動觸發**「引導高亮模式 (Guided Highlight)」**，正答區塊發出柔和呼吸金光。
  - 答對：卡片 Squash & Stretch 彈跳 + 陽光三和弦琶音 + 自動收錄生字至存摺。

### Milestone 4：冒險島主視覺、生字存摺與建置驗證
* **關聯 Skills**：`chinese-storybook-illustrator`, `game-feel`
- [ ] 實作 `MapView.tsx`（6 大主題島嶼路線圖、總星數統計、繪本風 SVG/WebP 插畫卡片）。
- [ ] 實作 `NotebookView.tsx`（「我的生字存摺」可點擊發音、查看部首與筆畫；「錯題救援本」可一鍵進入錯題重練模式）。
- [ ] 依 `chinese-storybook-illustrator` 規範配置純圖像視覺資產（零 AI 文字）。
- [ ] 執行 `npm run build` 完整通過 TypeScript 嚴格編譯與 Vite 生產環境打包測試。

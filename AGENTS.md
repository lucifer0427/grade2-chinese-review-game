# AGENTS.md - 國小二年級國語教育遊戲協作指引

本專案旨在將 108 課綱康軒版國小二年級上學期國語課程，轉換為運行於 **GitHub Pages** 的純前端靜態教育遊戲。為確保多 Agent 協作流暢與產出品質，所有參與開發的 Agent 必須嚴格遵守以下準則與權責劃分。

---

## 1. 核心專案架構與環境約束

- **部署環境**：GitHub Pages（純靜態 HTML/CSS/JS 或 Vite SPA 打包，不依賴任何外部後端伺服器）。
- **目標用戶**：台灣國小二年級學童（7~8 歲）、家長與第一線教師。
- **目標硬體**：教室觸控大螢幕（ViewSonic/BenQ）、iPad/平板瀏覽器、一般桌機 Chrome/Edge。
- **儲存方案**：完全採用瀏覽器 `localStorage` 儲存遊戲通關進度、星等與錯題記錄，支援匯出/匯入進度 JSON。
- **輔助技術**：
  - 國字並列注音：全面支援語意化 `<ruby>` 標籤或注音字型（如開源源泉圓體/注音字型）。
  - 語音回饋：原生瀏覽器 `window.speechSynthesis`（繁體中文 `zh-TW`）搭配輕量 Web Audio API 效果音。

---

## 2. Agent 角色權責矩陣

| Agent 角色 | 核心職責 | 關鍵交付物 | 強制調用 Skill (依賴準則) |
| :--- | :--- | :--- | :--- |
| **@Curriculum-Architect (教材專家)** | 解析 `raws/康軒二上國語教材評析.md`，將部首、字詞、句型、標點轉化為結構化關卡題庫。 | `src/data/curriculum/` 題庫 JSON 與知識圖譜 Schema。 | `save-systems`（題庫 Schema 與版本相容規範） |
| **@Game-Designer (遊戲企劃)** | 設計適合 7~8 歲學童之核心機制（操作直覺、正向回饋、微步進階、防呆防挫折）。 | 關卡規則書、回饋機制、關卡星級與成就系統規範。 | `game-feel`（正向獎勵、微步進階、挫折緩衝） |
| **@Engine-Developer (前端工程師)** | 建立 Vite + TypeScript + TailwindCSS / Canvas 輕量遊戲引擎核心、狀態機與路由。 | `src/core/` 遊戲循環、狀態機、LocalStorage 管理器。 | `input-systems`（觸控點選雙模）、`save-systems`（安全存檔機制） |
| **@UI-UX-Designer (互動美工師)** | 規劃高對比、大觸控熱區、注音排版相容介面與音效合成控制器。 | `src/components/`、動畫 CSS、Web Audio 合成音效腳本。 | `game-ui-ux`（觸控螢幕安全區）、`audio-design`（Web Audio 防爆音）、`chinese-storybook-illustrator`（繪本插畫資產規範） |
| **@QA-Accessibility (品管與無障礙)** | 驗證低年級觸控誤觸防護、跨平台解析度適配（16:9 / 4:3）、離線可用性與程式無錯。 | 測試用例、自動化驗證腳本、效能檢核報告。 | `game-ui-ux`、`input-systems` |

---

## 2.1 專案核心 Skills 依賴清單

任何負責該領域的 Agent 在撰寫對應代碼前，**必須先參閱對應 Skill 指引**：

1. **`game-feel`** (`.agents/skills/game-feel/SKILL.md`)：
   - 答對時文字卡片 Squash & Stretch 彈跳動態、粒子特效。
   - 答錯時溫和左右輕震，禁止恐嚇性紅叉或刺耳音效。
2. **`game-ui-ux`** (`.agents/skills/game-ui-ux/SKILL.md`)：
   - 適配班級 ViewSonic 大觸控螢幕與 iPad（4:3 / 16:9 彈性安全邊界）。
   - 觸控目標 ≥ 64px，`<ruby>` 注音與生字排版鎖定防裁切。
3. **`audio-design`** (`.agents/skills/audio-design/SKILL.md`)：
   - Web Audio API 程式合成音效（無外載 MP3），統一 Gain Node 封包防爆音。
4. **`input-systems`** (`.agents/skills/input-systems/SKILL.md`)：
   - 支援「拖曳吸附（Snap Radius ≥ 30px）」與「點選放置（Tap-to-Place）」雙模。
   - 抑制行動裝置橡皮筋回彈與雙擊放大（`touch-action: none`）。
5. **`save-systems`** (`.agents/skills/save-systems/SKILL.md`)：
   - LocalStorage 存取容錯、資料庫結構升級遷移、支援 JSON 匯出匯入以利課堂教學還原。
6. **`chinese-storybook-illustrator`** (`.agents/skills/chinese-storybook-illustrator/SKILL.md`)：
   - 專門規範低年級兒童繪本文風（柿餅、曹沖象、黑面琵鷺）。
   - **第一鐵律：純圖像語言，畫面 100% 嚴禁生成任何 AI 亂碼文字/注音**。
   - 單張 WebP 限制 $< 30\text{ KB}$。

---

## 3. 低年級教育遊戲化鐵律（Non-Negotiable Rules）

1. **零挫折正向循環**：
   - 答錯不扣分、不出現恐怖音效或刺眼紅叉，提供「提示（拆解部件/朗讀音義）」並允許再次嘗試。
   - 三次錯誤後自動啟動「引導模式」（動態高亮正確答案區塊）。
2. **文字排版必須標注注音**：
   - 針對所有重要題目、指示、生字，必須提供注音標籤或注音輔助切換功能。
3. **大熱區與拖曳防呆**：
   - 觸控目標不得小於 `48px x 48px`（建議 `64px+`）。
   - 拖曳拼字/拼句機制必須具備吸附容錯半徑（Snap Tolerance ≥ 30px），支援「點選式放置」雙模操作（適配平板滑動不便的情境）。
4. **即時多感官反饋**：
   - 點擊即有輕柔音效與視覺動態（彈跳、發光）。
   - 過關即時給予動畫星級評分（1~3 星）與掌聲，強化學習成就感。

---

## 4. 題庫資料格式標準（JSON Schema）

所有題庫檔案統一存放在 `src/data/stages/`，嚴格遵守 TypeScript 型別：

```typescript
export interface CurriculumQuestion {
  id: string;                      // 例: "u1-l2-char-01"
  unitId: number;                  // 0 ~ 4 (0: 查字典, 1~4: 單元一至四)
  lessonId: number;                // 課次
  focusType: 'radical' | 'components' | 'homophone' | 'punctuation' | 'syntax' | 'idiom';
  prompt: string;                  // 題目說明 (可含 HTML 或純文字)
  targetWord?: {
    char: string;                  // 國字
    zhuyin: string;                // 注音
    radical: string;               // 部首
    strokeCount: number;           // 部首外筆畫
  };
  options: Array<{
    id: string;
    text: string;
    zhuyin?: string;
    isCorrect: boolean;
    hint: string;                  // 錯答時的反饋引導
  }>;
  audioPromptText?: string;        // TTS 朗讀文本
}
```

---

## 5. 協作作業工作流

1. **題庫優先**：任何新關卡開發，必須先由 `@Curriculum-Architect` 建立完整且合規的 JSON 題庫，禁止在程式中寫入死代碼題目。
2. **組件模組化**：遊戲核心機制（如「部件合成機」、「語句積木軌道」、「標點彈珠台」）封裝為獨立的純組件，可跨單元重複調用。
3. **無伺服器相容**：禁止使用任何需伺服器環境之 API（例如 Node.js 原生模組、後端資料庫），所有圖片/音效資源內聯為 SVG/DataURL 或純程式生成音效，確保 GitHub Pages 即開即玩。

---
name: chinese-storybook-illustrator
description: "為國小二年級國語教育遊戲生成風格統一、輕量化的 2D 兒童繪本風視覺資產（關卡封面、生字故事插畫、成就勳章），嚴禁任何 AI 畫面文字，鎖定 16:9 與 1:1 WebP 格式 (<30KB)。"
---

# 國小二年級國語教育遊戲繪本插畫資產規範 (`chinese-storybook-illustrator`)

本 Skill 專門指引 Antigravity 之 `image-generator` 或生圖工具，為 108 課綱康軒版國小二年級上學期國語冒險遊戲，生成符合 7~8 歲低年級學童認知、溫暖明亮且體積極致輕量化的 2D 向量繪本視覺資產。

---

## 1. 核心視覺風格規範（Visual Style Guide）

所有透過本 Skill 生成的圖像資產，必須恪遵以下美術約束，嚴禁風格漂移：

| 維度 | 強制標準 | 禁忌項 (Negative) |
| :--- | :--- | :--- |
| **插畫風格** | **清新溫暖的兒童繪本文風（Warm Storybook Vector Art）**、圓角大輪廓、色塊分明、微手繪紋理感 | 嚴禁擬真照片、嚴禁 3D 黏土/寫實渲染、嚴禁日系動漫複雜線條、嚴禁賽博龐克暗黑風 |
| **色彩基調** | 採用低彩度、高辨識度、保護視力的繪本色盤：**暖陽米黃 (`#FEF3C7`)、柿子暖橘 (`#FB923C`)、森林嫩綠 (`#86EFAC`)、晴空粉藍 (`#93C5FD`)、溫柔粉紅 (`#F472B6`)** | 避免過度灰暗、冷酷或高飽和度刺眼螢光色 |
| **文字約束 (第一鐵律)** | **純圖像語言，畫面內 100% 嚴禁生成任何漢字、注音、英文字母、數字或亂碼浮水印！**（所有國字與注音必須由前端 HTML `<ruby>` 渲染） | 嚴禁 AI 幻覺文字、偽漢字或招牌亂碼 |
| **視覺年齡** | 適合國小低年級（7~8 歲），呈現「童趣、家庭親情、校園生活、自然觀察」氛圍 | 避免過度幼兒向（奶嘴搖鈴類）或成人嚴肅插圖 |

---

## 2. 三大資產類別與標準提示詞範本 (Prompt Templates)

### 類別 A：應用圖示與 PWA Icon (`public/icon-512.png`, `public/favicon.ico`)
- **規格**：正方形 512×512，中央對齊，預留 20% 安全留白（Safe Area），純色或柔和圓形背景。
- **提示詞核心範本**：
  ```text
  App icon for elementary school Chinese learning game, cute smiling cartoon magical wooden pen character wearing a tiny explorer hat, sitting beside a big warm open picture book with soft golden sparkles, clean pastel sky-blue circular badge background, minimalist flat vector children storybook art, thick rounded outlines, bright cheerful colors, zero text, zero letters, zero characters, high contrast, clean vector --ar 1:1
  ```

### 類別 B：關卡與單元封面卡片 (`public/assets/stages/stage-*.webp`)
- **規格**：橫向 16:9（640×360 或 512×288），畫面構圖簡潔，視覺焦點居中。
- **六大關卡主題提示詞矩陣**：

1. **序章・字典神木林 (查字典真簡單)**：
   ```text
   Children storybook vector illustration, a friendly cartoon owl librarian with round glasses sitting under a giant ancient hollow tree filled with tidy colorful scrolls, warm sunlight filtering through green leaves, soft pastel colors, clean rounded outlines, whimsical educational picture book style, zero text, zero letters --ar 16:9
   ```

2. **第一單元・晨光小廚房 (一起做早餐 / 走過小巷)**：
   ```text
   Children storybook illustration, cozy bright family kitchen in the morning, a cute little boy and cheerful mother happily making delicious toast and pouring milk together, warm morning sunshine through window, cozy wooden table, soft pastel tones, clean flat vector style, zero text, zero characters --ar 16:9
   ```

3. **第二單元・秋日柿餅節 (小鎮的柿餅節 / 運動會)**：
   ```text
   Children storybook illustration, a sunny countryside courtyard in autumn, cute Taiwanese grandma and little children arranging golden persimmons on round woven bamboo trays under bright blue sky, drying persimmon festival, warm orange and yellow palette, cozy picture book art, zero text, zero letters --ar 16:9
   ```

4. **第三單元・智慧天平劇場 (曹沖秤象 / 故事萬花筒)**：
   ```text
   Children storybook illustration, ancient Chinese harbor scene, a cute friendly giant elephant standing calmly on a wooden boat with clear waterlines, a smart smiling little boy holding a stone by the riverbank, warm lively daylight, whimsical children fable art, zero text, zero characters --ar 16:9
   ```

5. **第四單元・冬日候鳥郵局 (遠方來的黑皮 / 新年快樂)**：
   ```text
   Children storybook illustration, winter coastal wetland under pink sunset sky, a cute stylized black-faced spoonbill bird wearing a little red postman scarf carrying a festive letter, flying above shimmering water with reeds, warm holiday greeting vibe, clean flat vector, zero text, zero letters --ar 16:9
   ```

6. **終章・冒險畢業典禮 (閱讀階梯：我最喜歡上學了)**：
   ```text
   Children storybook illustration, cheerful elementary school entrance with colorful celebration balloons and rainbow flags, cute diverse happy 8-year-old schoolchildren wearing backpacks waving excitedly, bright sunny morning, graduation celebration, clean vector storybook style, zero text, zero letters --ar 16:9
   ```

### 類別 C：生字解鎖徽章與成就勳章 (`public/assets/badges/badge-*.webp`)
- **規格**：正方形 256×256，純透明背景（Transparent Alpha）。
- **勳章主題清單**：
  1. `badge-dictionary-master`：【字典小神探】放大鏡與金色小卷軸。
  2. `badge-word-builder`：【字詞魔法師】三顆彩色童話積木拼裝在一起。
  3. `badge-punctuation-guard`：【標點小守衛】可愛的盾牌上嵌有逗號與感嘆號徽記。
  4. `badge-elephant-weight`：【智慧稱象王】精緻的黃銅小天平與金石頭。
  5. `badge-spoonbill-postman`：【冬日小信差】黑面琵鷺的黑色羽毛與信封封印。

---

## 3. 檔案保存與極速載入規範

1. **存檔路徑**：
   - 關卡封面：`public/assets/stages/`
   - 成就徽章：`public/assets/badges/`
   - 圖示素材：`public/`
2. **品質與體積要求**：
   - 生成後統一轉為無損或高壓縮比 `.webp`。
   - 單張封面體積必須控制在 **$< 30\text{ KB}$**，全遊戲所有圖片資產合計 **$< 500\text{ KB}$**，確保 GitHub Pages 在平板上秒開。

/**
 * 國小二年級國語教育遊戲 - 全局核心型別定義
 */

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
  | 'choice'       // 點選單選 / 部首辨識 / 曹沖秤象天平選擇
  | 'drag-slot'    // 雙模(點選+拖曳吸附)卡槽填空 (標點發射、疊字造句積木)
  | 'sequence';    // 順序排列 (查字典步驟、曬柿工序、書信格式)

export interface QuestionOption {
  id: string;
  text: string;
  zhuyin?: string;
  isCorrect: boolean;
  orderIndex?: number;           // sequence 排序題中的正確順序 (0, 1, 2...)
  hint: string;                  // 錯答時的反饋引導
  ttsOverride?: string;          // 破音字語音替換字串
}

export interface TargetWordInfo {
  char: string;                  // 目標生字
  zhuyin: string;                // 標準注音 (如 "ㄔㄤˊ")
  radical: string;               // 部首 (如 "長")
  strokeCount: number;           // 部首外筆畫
  totalStrokes?: number;         // 總筆畫
  meaning?: string;              // 字義或造詞範例
}

export interface CurriculumQuestion {
  id: string;                    // 例: "u1-l2-char-01"
  unitId: number;                // 0 ~ 5 (0: 查字典, 1~4: 單元一至四, 5: 閱讀階梯)
  lessonId: number;              // 課次 (0 ~ 13)
  focusType: FocusType;
  mechanicType: MechanicType;    // 調用的互動面板
  prompt: string;                // 題目說明 (可由 RubyText 渲染)
  promptZhuyin?: string;         // 重點詞注音輔助
  passage?: string;              // 閱讀階梯長文段落
  sentenceTemplate?: string;     // 用於 drag-slot，例: "媽媽一邊[___]，一邊聽音樂。"
  targetWord?: TargetWordInfo;
  options: QuestionOption[];
  audioPromptText?: string;      // 點擊朗讀鈕時的語音文本
}

export interface StageMeta {
  id: number;                    // 0 ~ 5
  slug: string;                  // "stage0-dictionary"
  title: string;                 // "字典神木林"
  subtitle: string;              // "首冊工具篇：查字典真簡單"
  description: string;           // 關卡故事背景
  lessons: string[];             // 涵蓋課次
  icon: string;                  // 勳章或圖示代碼
  color: string;                 // 主題色
  questions: CurriculumQuestion[];
}

export interface UserProgress {
  schemaVersion: number;
  totalStars: number;
  stagesUnlocked: number[];      // [0, 1, ...]
  stageStars: Record<number, number>; // stageId -> stars (1~3)
  collectedWords: Record<string, TargetWordInfo>; // char -> info
  mistakes: Record<string, {
    question: CurriculumQuestion;
    wrongCount: number;
    lastAttemptTime: number;
    resolved: boolean;
  }>;
  audioMuted: boolean;
  zhuyinEnabled: boolean;
}

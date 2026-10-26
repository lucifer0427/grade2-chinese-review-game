/**
 * 國小二年級國語教育遊戲 - 本地存檔管理器 (StorageManager)
 * 遵循 save-systems 準則：
 * 1. 結構版本升級容錯機制 (schemaVersion)
 * 2. 存取異常捕獲 (防私密瀏覽限制)
 * 3. 支援課堂進度匯出/匯入 JSON
 */

import { CurriculumQuestion, TargetWordInfo, UserProgress } from './Types';

const STORAGE_KEY = 'grade2_chinese_adventure_save_v1';
const CURRENT_SCHEMA_VERSION = 1;

const DEFAULT_PROGRESS: UserProgress = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  totalStars: 0,
  stagesUnlocked: [0], // 預設解鎖關卡 0
  stageStars: {},
  collectedWords: {},
  mistakes: {},
  audioMuted: false,
  zhuyinEnabled: true,
};

export class StorageManager {
  /**
   * 讀取存檔（具備版本升級與容錯）
   */
  public static getProgress(): UserProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PROGRESS };

      const parsed = JSON.parse(raw) as Partial<UserProgress>;
      if (!parsed.schemaVersion || parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
        // 未來結構遷移保留點
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          schemaVersion: CURRENT_SCHEMA_VERSION,
        };
      }

      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        stagesUnlocked: parsed.stagesUnlocked || [0],
        stageStars: parsed.stageStars || {},
        collectedWords: parsed.collectedWords || {},
        mistakes: parsed.mistakes || {},
      };
    } catch (e) {
      console.warn('StorageManager 讀取存檔失敗，使用預設值', e);
      return { ...DEFAULT_PROGRESS };
    }
  }

  /**
   * 寫入存檔
   */
  public static saveProgress(progress: UserProgress): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (e) {
      console.error('StorageManager 寫入存檔失敗', e);
      return false;
    }
  }

  /**
   * 關卡破關結算
   */
  public static completeStage(
    stageId: number,
    stars: number,
    targetWords: TargetWordInfo[] = []
  ): UserProgress {
    const progress = this.getProgress();

    // 更新星等（取歷史最高）
    const prevStars = progress.stageStars[stageId] || 0;
    if (stars > prevStars) {
      progress.stageStars[stageId] = stars;
    }

    // 重新統計總星星
    progress.totalStars = Object.values(progress.stageStars).reduce((acc, cur) => acc + cur, 0);

    // 解鎖下一關
    const nextStageId = stageId + 1;
    if (nextStageId <= 5 && !progress.stagesUnlocked.includes(nextStageId)) {
      progress.stagesUnlocked.push(nextStageId);
    }

    // 收錄生字進存摺
    targetWords.forEach((word) => {
      if (word && word.char) {
        progress.collectedWords[word.char] = word;
      }
    });

    this.saveProgress(progress);
    return progress;
  }

  /**
   * 記錄錯題
   */
  public static recordMistake(question: CurriculumQuestion): void {
    const progress = this.getProgress();
    const existing = progress.mistakes[question.id];

    progress.mistakes[question.id] = {
      question,
      wrongCount: (existing?.wrongCount || 0) + 1,
      lastAttemptTime: Date.now(),
      resolved: false,
    };

    this.saveProgress(progress);
  }

  /**
   * 解除錯題（重練成功）
   */
  public static resolveMistake(questionId: string): void {
    const progress = this.getProgress();
    if (progress.mistakes[questionId]) {
      progress.mistakes[questionId].resolved = true;
      this.saveProgress(progress);
    }
  }

  /**
   * 匯出存檔 JSON 字串
   */
  public static exportJSON(): string {
    const progress = this.getProgress();
    return JSON.stringify(progress, null, 2);
  }

  /**
   * 匯入存檔 JSON 字串
   */
  public static importJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr) as UserProgress;
      if (typeof parsed !== 'object' || parsed === null) return false;
      parsed.schemaVersion = CURRENT_SCHEMA_VERSION;
      return this.saveProgress(parsed);
    } catch {
      return false;
    }
  }

  /**
   * 重置進度
   */
  public static resetProgress(): UserProgress {
    this.saveProgress(DEFAULT_PROGRESS);
    return { ...DEFAULT_PROGRESS };
  }
}

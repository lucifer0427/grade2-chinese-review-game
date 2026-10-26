/**
 * 國小二年級國語教育遊戲 - Web Speech API 語音導讀引擎
 * 專為 7~8 歲學童優化：
 * 1. 預設 0.85x 慢速清晰朗讀
 * 2. 嚴格鎖定 zh-TW 繁體中文語音包
 * 3. 題目特殊符號自然口語化（如 [___] 轉化為「空格」）
 * 4. 支援多音字/破音字 override 避免 iOS / Android 引擎讀錯
 */

export class SpeechManager {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static voiceZhTW: SpeechSynthesisVoice | null = null;
  private static isInitialized: boolean = false;

  public static init(): void {
    if (this.isInitialized || !this.synth) return;

    const findVoice = () => {
      if (!this.synth) return;
      const voices = this.synth.getVoices();
      // 優先尋找台灣繁體 (zh-TW)，其次任何繁體中文或中文
      this.voiceZhTW =
        voices.find((v) => v.lang === 'zh-TW' || v.lang === 'zh_TW') ||
        voices.find((v) => v.lang.startsWith('zh')) ||
        null;
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
    this.isInitialized = true;
  }

  /**
   * 停止目前正在播放的語音
   */
  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * 朗讀文本
   * @param text 要朗讀的文字
   * @param override 針對多音字等特製的替代朗讀字串
   */
  public static speak(text: string, override?: string): void {
    if (!this.synth) return;
    this.init();
    this.stop();

    let textToSpeak = override || text;

    // 將填空槽口語化
    textToSpeak = textToSpeak.replace(/\[___\]/g, '空格');
    // 去除特殊符號
    textToSpeak = textToSpeak.replace(/[【】]/g, '');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.85; // 專為低年級放慢語速
    utterance.pitch = 1.05; // 略微明亮親切的語調

    if (this.voiceZhTW) {
      utterance.voice = this.voiceZhTW;
    }

    try {
      this.synth.speak(utterance);
    } catch {
      // 靜默處理語音失敗
    }
  }
}

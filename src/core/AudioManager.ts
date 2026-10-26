/**
 * 國小二年級國語教育遊戲 - Web Audio API 純程式合成音效引擎
 * 依據 audio-design 與低年級正向教育體驗打造
 * 特性：
 * 1. 零外部音訊檔案依賴、零網路延遲
 * 2. 低年級正向柔和音色 (正弦波與三角波為主，無尖銳蜂鳴)
 * 3. 內建防爆音 Gain Envelope
 * 4. 節點自動回收機制 (onended 自動 disconnect)，防高頻觸控記憶體洩漏
 */

export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static isMuted: boolean = false;

  /**
   * 初始化或喚醒 AudioContext（瀏覽器要求使用者手勢觸發）
   */
  public static init(): void {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * 切換靜音狀態
   */
  public static toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public static setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, this.ctx.currentTime);
    }
  }

  public static getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 1. 輕快按鈕點擊音 (Click)
   * 880Hz 短促正弦波
   */
  public static playClick(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * 2. 磁吸拖曳吸附泡泡音 (Snap)
   * 快速滑音 (260Hz -> 650Hz)，增強觸控反饋手感
   */
  public static playSnap(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * 3. 答對時的陽光三和弦琶音 (Correct - C5, E5, G5)
   * 快樂正向激勵，低年級專用
   */
  public static playCorrect(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const baseTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = baseTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /**
   * 4. 答錯時的溫和提示音 (Wrong - 零挫折感)
   * 柔和雙正弦波微降調 (280Hz -> 220Hz)，絕無恐怖蜂鳴或尖銳警報
   */
  public static playWrong(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // 三角波柔和且溫暖
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.linearRampToValueAtTime(220, t + 0.18);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.18);
  }

  /**
   * 5. 星等獲得清脆鈴鐺音 (Star Bell)
   * 雙高頻閃爍音 (1046Hz, 1318Hz)
   */
  public static playStar(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, t); // C6
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, t); // E6

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      gain.disconnect();
    };

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  /**
   * 6. 通關慶祝大號角 (Level Complete Fanfare)
   * C5 -> G5 -> C6 雄壯上升
   */
  public static playLevelComplete(): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.38 }, // C6
    ];

    let currentT = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, currentT);

      gain.gain.setValueAtTime(0.18, currentT);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentT + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      osc.start(currentT);
      osc.stop(currentT + note.d);
      currentT += note.d * 0.9;
    });
  }
}

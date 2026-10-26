/**
 * 國小二年級國語教育遊戲 - 台灣標準直式注音拆解解析器
 * 將輸入的注音字串精確拆解為：本體符號（聲母/介音/韻母直排）與聲調標記（輕聲置頂、二三四聲置於右側韻母旁）
 */

export interface ParsedZhuyinSyllable {
  raw: string;
  symbols: string[];      // 垂直排列的注音符號，如 ['ㄔ', 'ㄤ']
  tone: string;           // 聲調符號：'ˊ' | 'ˇ' | 'ˋ' | '˙' | ''
  toneType: 'none' | 'second' | 'third' | 'fourth' | 'neutral';
}

export interface CharZhuyinPair {
  char: string;
  zhuyin?: ParsedZhuyinSyllable;
}

const TONE_MARKS: Record<string, 'second' | 'third' | 'fourth' | 'neutral'> = {
  'ˊ': 'second',
  'ˇ': 'third',
  'ˋ': 'fourth',
  '˙': 'neutral',
  'ˆ': 'second',
  '`': 'fourth',
};

/**
 * 解析單個注音音節（如 "ㄔㄤˊ"、"˙ㄉㄜ"、"ㄍㄨㄛˇ"、"ㄕ"）
 */
export function parseZhuyinSyllable(input: string): ParsedZhuyinSyllable {
  if (!input) {
    return { raw: '', symbols: [], tone: '', toneType: 'none' };
  }

  const trimmed = input.trim();
  let tone = '';
  let toneType: 'none' | 'second' | 'third' | 'fourth' | 'neutral' = 'none';
  const symbols: string[] = [];

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (TONE_MARKS[char]) {
      tone = char;
      toneType = TONE_MARKS[char];
    } else if (char === '·' || char === '•' || char === '˙') {
      tone = '˙';
      toneType = 'neutral';
    } else {
      symbols.push(char);
    }
  }

  return {
    raw: trimmed,
    symbols,
    tone,
    toneType,
  };
}

/**
 * 將多字詞彙與對應的多音節注音拆解配對
 * 例如：text = "慢慢的走", zhuyin = "ㄇㄢˋ ㄇㄢˋ ˙ㄉㄜ ㄗㄡˇ"
 */
export function pairTextWithZhuyin(text: string, zhuyinStr?: string): CharZhuyinPair[] {
  const chars = Array.from(text);
  if (!zhuyinStr) {
    return chars.map((c) => ({ char: c }));
  }

  // 支援空白、逗點或斜線分隔
  const syllables = zhuyinStr
    .trim()
    .split(/[\s,，/]+/)
    .filter(Boolean);

  let sylIdx = 0;
  return chars.map((char) => {
    // 標點符號不配對注音
    if (/[\s，。！？、：；「」『』—…（）]/.test(char)) {
      return { char };
    }

    if (sylIdx < syllables.length) {
      const parsed = parseZhuyinSyllable(syllables[sylIdx]);
      sylIdx++;
      return { char, zhuyin: parsed };
    }

    return { char };
  });
}

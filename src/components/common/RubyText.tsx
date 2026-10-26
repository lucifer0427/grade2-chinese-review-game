import React from 'react';
import { pairTextWithZhuyin, ParsedZhuyinSyllable } from '../../core/ZhuyinParser';

interface RubyTextProps {
  text: string;
  zhuyin?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'huge';
  className?: string;
  showZhuyin?: boolean;
}

const SIZE_MAP = {
  sm: {
    char: 'text-base',
    zhuyin: 'text-[9px] leading-[10px]',
    tone: 'text-[8px]',
    gap: 'gap-0.5',
    zhuyinColWidth: 'w-[14px]',
  },
  md: {
    char: 'text-xl font-medium',
    zhuyin: 'text-[11px] leading-[12px]',
    tone: 'text-[10px]',
    gap: 'gap-1',
    zhuyinColWidth: 'w-[16px]',
  },
  lg: {
    char: 'text-2xl font-semibold',
    zhuyin: 'text-[13px] leading-[14px]',
    tone: 'text-[11px]',
    gap: 'gap-1',
    zhuyinColWidth: 'w-[18px]',
  },
  xl: {
    char: 'text-3xl font-bold',
    zhuyin: 'text-[15px] leading-[16px]',
    tone: 'text-[13px]',
    gap: 'gap-1.5',
    zhuyinColWidth: 'w-[20px]',
  },
  '2xl': {
    char: 'text-4xl font-bold',
    zhuyin: 'text-[17px] leading-[18px]',
    tone: 'text-[15px]',
    gap: 'gap-1.5',
    zhuyinColWidth: 'w-[24px]',
  },
  huge: {
    char: 'text-6xl font-bold',
    zhuyin: 'text-[22px] leading-[23px]',
    tone: 'text-[20px]',
    gap: 'gap-2',
    zhuyinColWidth: 'w-[32px]',
  },
};

/**
 * 單一漢字 + 右側標準台灣直排注音渲染單元
 */
const SingleRubyChar: React.FC<{
  char: string;
  zhuyin?: ParsedZhuyinSyllable;
  sizeKey: keyof typeof SIZE_MAP;
  showZhuyin: boolean;
}> = ({ char, zhuyin, sizeKey, showZhuyin }) => {
  const cfg = SIZE_MAP[sizeKey];

  if (!zhuyin || !showZhuyin || zhuyin.symbols.length === 0) {
    return <span className={`inline-block select-none ${cfg.char}`}>{char}</span>;
  }

  const isNeutral = zhuyin.toneType === 'neutral';
  const hasSideTone = ['second', 'third', 'fourth'].includes(zhuyin.toneType);

  return (
    <span className={`inline-flex items-center justify-center ${cfg.gap} select-none mx-0.5 align-middle`}>
      {/* 漢字本體 */}
      <span className={`${cfg.char} leading-none tracking-normal font-medium text-storybook-wood`}>
        {char}
      </span>

      {/* 右側直排注音欄 */}
      <span
        className={`inline-flex flex-col items-center justify-center ${cfg.zhuyinColWidth} text-storybook-brown/90 font-mono`}
        style={{ height: '1.2em' }}
      >
        {/* 輕聲置頂：在最上方顯示圓點 */}
        {isNeutral && (
          <span className="text-[0.65em] font-extrabold leading-none -mb-0.5 text-storybook-orange">
            ˙
          </span>
        )}

        {/* 聲母、介音、韻母與右側調號 */}
        <span className="relative flex flex-col items-center leading-none">
          {zhuyin.symbols.map((sym, idx) => (
            <span key={idx} className={`${cfg.zhuyin} font-semibold leading-none`}>
              {sym}
            </span>
          ))}

          {/* 二三四聲調號（懸掛於韻母右側） */}
          {hasSideTone && (
            <span
              className={`absolute -right-2 top-1/2 -translate-y-1/2 font-bold text-storybook-orange ${cfg.tone} leading-none`}
            >
              {zhuyin.tone}
            </span>
          )}
        </span>
      </span>
    </span>
  );
};

export const RubyText: React.FC<RubyTextProps> = ({
  text,
  zhuyin,
  size = 'md',
  className = '',
  showZhuyin = true,
}) => {
  const pairs = pairTextWithZhuyin(text, zhuyin);

  return (
    <span className={`inline-flex flex-wrap items-center leading-relaxed ${className}`}>
      {pairs.map((pair, index) => (
        <SingleRubyChar
          key={`${pair.char}-${index}`}
          char={pair.char}
          zhuyin={pair.zhuyin}
          sizeKey={size}
          showZhuyin={showZhuyin}
        />
      ))}
    </span>
  );
};

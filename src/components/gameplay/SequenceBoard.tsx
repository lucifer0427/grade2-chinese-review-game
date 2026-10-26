import React, { useState, useEffect } from 'react';
import { Volume2, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { CurriculumQuestion, QuestionOption } from '../../core/Types';
import { RubyText } from '../common/RubyText';
import { SpeechManager } from '../../core/SpeechManager';
import { AudioManager } from '../../core/AudioManager';
import { BigButton } from '../common/BigButton';

interface SequenceBoardProps {
  question: CurriculumQuestion;
  onSubmitSequence: (isAllCorrect: boolean, errorHint?: string) => void;
  isCorrect: boolean | null;
  highlightCorrectId: string | null;
  showZhuyin: boolean;
  disabled: boolean;
}

export const SequenceBoard: React.FC<SequenceBoardProps> = ({
  question,
  onSubmitSequence,
  isCorrect,
  showZhuyin,
  disabled,
}) => {
  // 初始亂序打散選項
  const [items, setItems] = useState<QuestionOption[]>([]);

  useEffect(() => {
    // 預設將原本順序稍微打亂，確保需要學童排列
    const shuffled = [...question.options].sort(() => 0.5 - Math.random());
    setItems(shuffled);
  }, [question]);

  const handlePlayPrompt = () => {
    AudioManager.playClick();
    SpeechManager.speak(question.audioPromptText || question.prompt);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    AudioManager.playSnap();
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleVerify = () => {
    if (disabled) return;
    // 檢查每一個項目是否都在正確的 orderIndex 上
    let allCorrect = true;
    let firstErrorHint = '';

    for (let i = 0; i < items.length; i++) {
      if (items[i].orderIndex !== i) {
        allCorrect = false;
        firstErrorHint = items[i].hint || '順序好像不太對喔，再仔細讀一讀時間先後！';
        break;
      }
    }

    onSubmitSequence(allCorrect, firstErrorHint);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
      {/* 題幹提示 */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-card flex flex-col items-center text-center relative">
        <button
          onClick={handlePlayPrompt}
          className="absolute right-4 top-4 p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all active:scale-95 shadow-sm"
          title="朗讀題目"
        >
          <Volume2 className="w-6 h-6" />
        </button>

        <div className="text-xl sm:text-2xl font-bold text-storybook-wood leading-relaxed my-2 max-w-2xl">
          <RubyText
            text={question.prompt}
            zhuyin={question.promptZhuyin}
            size="md"
            showZhuyin={showZhuyin}
          />
        </div>
        <p className="text-sm font-semibold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mt-2">
          💡 點擊右側的「▲ 上移」或「▼ 下移」按鈕來調整順序喔！
        </p>
      </div>

      {/* 排序卡片清單 */}
      <div className="w-full flex flex-col gap-3">
        {items.map((item, index) => {
          const isSlotRight = isCorrect === true && item.orderIndex === index;

          return (
            <div
              key={item.id}
              className={`
                w-full min-h-[68px] p-4 sm:p-5 rounded-3xl font-bold
                flex items-center justify-between gap-3 select-none
                transition-all duration-200 shadow-sm
                ${
                  isSlotRight
                    ? 'bg-emerald-100 border-3 border-emerald-500 text-emerald-950 animate-squash'
                    : isCorrect === false
                    ? 'bg-amber-50 border-3 border-amber-400 text-amber-950'
                    : 'bg-white border-3 border-amber-200 hover:border-amber-400 text-storybook-wood'
                }
              `}
            >
              {/* 序號標記 */}
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black text-lg shrink-0">
                {index + 1}
              </div>

              {/* 步驟文字 */}
              <div className="flex-1 text-lg">
                <RubyText
                  text={item.text}
                  zhuyin={item.zhuyin}
                  size="md"
                  showZhuyin={showZhuyin}
                />
              </div>

              {/* 操作動作：朗讀 + 上移/下移按鈕 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    AudioManager.playClick();
                    SpeechManager.speak(item.text, item.ttsOverride);
                  }}
                  className="p-2 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors"
                  title="朗讀"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  disabled={index === 0 || disabled}
                  onClick={() => moveItem(index, 'up')}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                  title="往上移"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  disabled={index === items.length - 1 || disabled}
                  onClick={() => moveItem(index, 'down')}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
                  title="往下移"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 排序送出確認鈕 */}
      <BigButton
        variant="primary"
        size="lg"
        onClick={handleVerify}
        disabled={disabled}
        className="w-full sm:w-auto px-12"
      >
        <Check className="w-6 h-6 stroke-[3]" />
        <span>排好了，送出檢查！</span>
      </BigButton>
    </div>
  );
};

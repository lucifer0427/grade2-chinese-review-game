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
    // 使用 Fisher-Yates 洗牌，並確保不會剛好洗成已排好的正確順序
    const arr = [...question.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length > 1 && arr.every((item, idx) => item.orderIndex === idx)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    setItems(arr);
  }, [question.id]);

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
      {/* 先發打序排列題幹提示 */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-600 shadow-card flex flex-col items-center text-center relative">
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm">
          <span>📋 先發打序排列</span>
        </div>

        <button
          onClick={handlePlayPrompt}
          className="absolute right-4 top-4 p-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-all active:scale-95 shadow-sm"
          title="朗讀題目"
        >
          <Volume2 className="w-6 h-6" />
        </button>

        <div className="text-xl sm:text-2xl font-bold text-storybook-wood leading-relaxed my-2 max-w-2xl pt-4">
          <RubyText
            text={question.prompt}
            zhuyin={question.promptZhuyin}
            size="md"
            showZhuyin={showZhuyin}
          />
        </div>
        <p className="text-sm font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full mt-2">
          ⚾ 點擊右側的「▲ 上移」或「▼ 下移」按鈕，排好第 1 棒到最後一棒的順序！
        </p>
      </div>

      {/* 棒次排序卡片清單 */}
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
                    : 'bg-white border-3 border-emerald-200 hover:border-amber-400 text-storybook-wood'
                }
              `}
            >
              {/* 棒次序號標記 */}
              <div className="px-3 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                第 {index + 1} 棒
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

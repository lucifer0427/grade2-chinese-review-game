import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { CurriculumQuestion, QuestionOption } from '../../core/Types';
import { RubyText } from '../common/RubyText';
import { SpeechManager } from '../../core/SpeechManager';
import { AudioManager } from '../../core/AudioManager';

interface DragSlotBoardProps {
  question: CurriculumQuestion;
  onSubmitAnswer: (option: QuestionOption) => void;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  highlightCorrectId: string | null;
  showZhuyin: boolean;
  disabled: boolean;
}

export const DragSlotBoard: React.FC<DragSlotBoardProps> = ({
  question,
  onSubmitAnswer,
  selectedOptionId,
  isCorrect,
  highlightCorrectId,
  showZhuyin,
  disabled,
}) => {
  const [placedOption, setPlacedOption] = useState<QuestionOption | null>(null);

  // 切換題目時重設手套卡槽狀態，避免連續兩題 drag-slot 時殘留上一題選項
  useEffect(() => {
    setPlacedOption(null);
  }, [question.id]);

  // 分割 sentenceTemplate 成前後兩段（依 [___] 切分）
  const template = question.sentenceTemplate || '請將答案放入[___]中。';
  const parts = template.split('[___]');
  const prefix = parts[0] || '';
  const suffix = parts[1] || '';

  const handlePlayPrompt = () => {
    AudioManager.playClick();
    SpeechManager.speak(question.audioPromptText || question.prompt);
  };

  const handlePlaceOption = (option: QuestionOption) => {
    if (disabled) return;
    AudioManager.playSnap();
    setPlacedOption(option);
    onSubmitAnswer(option);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
      {/* 捕手接球好球帶題幹提示 */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-600 shadow-card flex flex-col items-center text-center relative">
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-amber-500 text-amber-950 px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm">
          <span>🧤 捕手接球填空</span>
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

        {/* 句子填空捕手手套卡槽舞台 */}
        <div className="mt-4 p-5 sm:p-6 bg-emerald-50/90 rounded-2xl border-2 border-emerald-300 w-full flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-storybook-wood leading-relaxed">
          {prefix && (
            <RubyText text={prefix} size="lg" showZhuyin={showZhuyin} />
          )}

          {/* 捕手手套磁吸卡槽本體 */}
          <div
            className={`
              min-w-[150px] min-h-[64px] px-4 py-2 rounded-2xl border-3 border-dashed
              flex items-center justify-center transition-all duration-200
              ${
                placedOption
                  ? isCorrect === true
                    ? 'bg-emerald-100 border-emerald-500 shadow-md animate-squash'
                    : isCorrect === false
                    ? 'bg-amber-100 border-amber-500 animate-wobble'
                    : 'bg-white border-amber-400 shadow-inner'
                  : 'bg-amber-100/70 border-amber-500 animate-pulse'
              }
            `}
          >
            {placedOption ? (
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚾</span>
                <RubyText
                  text={placedOption.text}
                  zhuyin={placedOption.zhuyin}
                  size="lg"
                  showZhuyin={showZhuyin}
                />
              </div>
            ) : (
              <span className="text-sm font-black text-amber-800 tracking-wider">
                🧤【點選棒球接入】
              </span>
            )}
          </div>

          {suffix && (
            <RubyText text={suffix} size="lg" showZhuyin={showZhuyin} />
          )}
        </div>
      </div>

      {/* 語詞積木選取庫 (支援點選放置 Tap-to-Place 與拖曳吸附雙模) */}
      <div className="w-full flex flex-wrap items-center justify-center gap-4">
        {question.options.map((option) => {
          const isSelected = (placedOption?.id || selectedOptionId) === option.id;
          const isWrong = isSelected && isCorrect === false;
          const isRight = isSelected && isCorrect === true;
          const isGuided = highlightCorrectId === option.id;

          let cardStyle =
            'bg-white hover:bg-amber-100/80 text-storybook-wood border-3 border-amber-300 hover:border-amber-500 shadow-md';

          if (isRight) {
            cardStyle =
              'bg-emerald-100 text-emerald-950 border-3 border-emerald-500 ring-2 ring-emerald-300';
          } else if (isWrong) {
            cardStyle =
              'bg-amber-100 text-amber-900 border-3 border-amber-500';
          } else if (isGuided) {
            cardStyle =
              'bg-amber-50 text-amber-950 border-3 border-amber-500 ring-4 ring-amber-300 shadow-xl animate-pulse';
          }

          return (
            <div
              key={option.id}
              onClick={() => handlePlaceOption(option)}
              className={`
                relative min-h-[64px] px-6 py-3.5 rounded-3xl font-bold cursor-pointer
                flex items-center gap-2 select-none touch-manipulation transition-all duration-150
                active:scale-95 ${cardStyle}
                ${disabled && !isSelected && !isGuided ? 'opacity-50 pointer-events-none' : ''}
              `}
              title="點擊放入空格中"
            >
              <RubyText
                text={option.text}
                zhuyin={option.zhuyin}
                size="md"
                showZhuyin={showZhuyin}
              />

              {/* 朗讀語音按鈕 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  AudioManager.playClick();
                  SpeechManager.speak(option.text, option.ttsOverride);
                }}
                className="p-1 rounded-full text-amber-700/60 hover:text-amber-900 transition-colors ml-1"
                title="朗讀"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {isSelected && isRight && (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              )}

              {isGuided && (
                <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-900 p-1.5 rounded-full shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

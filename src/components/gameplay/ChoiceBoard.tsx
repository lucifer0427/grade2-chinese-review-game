import React from 'react';
import { Volume2, Sparkles, Scale } from 'lucide-react';
import { CurriculumQuestion, QuestionOption } from '../../core/Types';
import { RubyText } from '../common/RubyText';
import { SpeechManager } from '../../core/SpeechManager';
import { AudioManager } from '../../core/AudioManager';

interface ChoiceBoardProps {
  question: CurriculumQuestion;
  onSelectOption: (option: QuestionOption) => void;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  highlightCorrectId: string | null;
  showZhuyin: boolean;
  disabled: boolean;
}

export const ChoiceBoard: React.FC<ChoiceBoardProps> = ({
  question,
  onSelectOption,
  selectedOptionId,
  isCorrect,
  highlightCorrectId,
  showZhuyin,
  disabled,
}) => {
  const handlePlayPrompt = () => {
    AudioManager.playClick();
    SpeechManager.speak(question.audioPromptText || question.prompt);
  };

  const isScaleTheme = question.unitId === 3 || question.id.includes('scale');

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
      {/* 題幹展示牌 */}
      <div className="w-full bg-white/95 rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-card flex flex-col items-center text-center relative">
        <button
          onClick={handlePlayPrompt}
          className="absolute right-4 top-4 p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all active:scale-95 shadow-sm"
          title="朗讀題目"
        >
          <Volume2 className="w-6 h-6" />
        </button>

        {/* 生字特別標籤 (若有) */}
        {question.targetWord && (
          <div className="mb-4 inline-flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
            <span className="text-sm font-bold text-amber-800">生字卡</span>
            <div className="flex items-baseline gap-1">
              <RubyText
                text={question.targetWord.char}
                zhuyin={question.targetWord.zhuyin}
                size="xl"
                showZhuyin={showZhuyin}
              />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-md">
              部首：{question.targetWord.radical}部（外筆畫 {question.targetWord.strokeCount} 畫）
            </span>
          </div>
        )}

        {/* 題目說明文字 */}
        <div className="text-2xl sm:text-3xl font-bold text-storybook-wood leading-relaxed my-2 max-w-2xl">
          <RubyText
            text={question.prompt}
            zhuyin={question.promptZhuyin}
            size="lg"
            showZhuyin={showZhuyin}
          />
        </div>

        {/* 曹沖天平視覺彩蛋 (單元三專用) */}
        {isScaleTheme && (
          <div className="mt-3 flex items-center justify-center gap-2 text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl">
            <Scale className="w-5 h-5 text-indigo-600 animate-bounce" />
            <span className="text-sm font-bold">曹沖秤象天平：請選擇等重讀音石塊！</span>
          </div>
        )}
      </div>

      {/* 選項卡片網格 (大觸控熱區 ≥ 64px) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isWrong = isSelected && isCorrect === false;
          const isRight = isSelected && isCorrect === true;
          const isGuided = highlightCorrectId === option.id;

          let cardStyle =
            'bg-white hover:bg-amber-50/80 text-storybook-wood border-3 border-amber-200 hover:border-amber-400';

          if (isRight) {
            cardStyle =
              'bg-emerald-100 text-emerald-950 border-3 border-emerald-500 shadow-lg scale-102 animate-squash';
          } else if (isWrong) {
            cardStyle =
              'bg-amber-100 text-amber-900 border-3 border-amber-500 animate-wobble';
          } else if (isGuided) {
            cardStyle =
              'bg-amber-50 text-amber-950 border-3 border-amber-500 ring-4 ring-amber-300 shadow-xl animate-pulse';
          }

          return (
            <button
              key={option.id}
              disabled={disabled}
              onClick={() => {
                AudioManager.playClick();
                onSelectOption(option);
              }}
              className={`
                relative w-full min-h-[72px] sm:min-h-[84px] p-5 rounded-3xl font-bold text-left
                flex items-center justify-between gap-3 select-none touch-manipulation
                transition-all duration-150 active:scale-[0.98] shadow-sm
                ${cardStyle}
                ${disabled && !isSelected && !isGuided ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex-1 flex items-center">
                <RubyText
                  text={option.text}
                  zhuyin={option.zhuyin}
                  size="md"
                  showZhuyin={showZhuyin}
                />
              </div>

              {/* 右側小語音鈕 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  AudioManager.playClick();
                  SpeechManager.speak(option.text, option.ttsOverride);
                }}
                className="p-2 rounded-xl text-amber-700/60 hover:text-amber-900 hover:bg-amber-200/50 transition-colors shrink-0"
                title="朗讀選項"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* 三次答錯引導金星 */}
              {isGuided && (
                <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-900 p-1.5 rounded-full shadow-md animate-bounce">
                  <Sparkles className="w-5 h-5 fill-amber-300" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

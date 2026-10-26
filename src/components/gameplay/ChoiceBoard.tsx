import React from 'react';
import { Volume2, Sparkles, Scale } from 'lucide-react';
import { CurriculumQuestion, QuestionOption } from '../../core/Types';
import { RubyText } from '../common/RubyText';
import { SpeechManager } from '../../core/SpeechManager';
import { AudioManager } from '../../core/AudioManager';
import { PITCH_TYPE_MAP } from './BaseballDiamondHUD';

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
  const pitch = PITCH_TYPE_MAP[question.focusType] || PITCH_TYPE_MAP.radical;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
      {/* 投手投球好球帶展示牌 */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-600 shadow-card flex flex-col items-center text-center relative">
        <div
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm border ${pitch.badgeColor}`}
        >
          <span>{pitch.name}</span>
          <span className="font-mono opacity-90">({pitch.speed})</span>
        </div>

        <button
          onClick={handlePlayPrompt}
          className="absolute right-4 top-4 p-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-all active:scale-95 shadow-sm"
          title="朗讀球路題目"
        >
          <Volume2 className="w-6 h-6" />
        </button>

        {/* 球員生字特別標籤 (若有) */}
        {question.targetWord && (
          <div className="mt-6 mb-3 inline-flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-sm">
            <span className="text-sm font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-lg">
              ⚾ 王牌生字球
            </span>
            <div className="flex items-baseline gap-1">
              <RubyText
                text={question.targetWord.char}
                zhuyin={question.targetWord.zhuyin}
                size="xl"
                showZhuyin={showZhuyin}
              />
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
              部首：{question.targetWord.radical}部（外筆畫 {question.targetWord.strokeCount} 畫）
            </span>
          </div>
        )}

        {/* 題目說明文字 */}
        <div className="text-2xl sm:text-3xl font-bold text-storybook-wood leading-relaxed my-3 max-w-2xl pt-3">
          <RubyText
            text={question.prompt}
            zhuyin={question.promptZhuyin}
            size="lg"
            showZhuyin={showZhuyin}
          />
        </div>

        {/* 曹沖明星賽天平視覺彩蛋 (單元三專用) */}
        {isScaleTheme && (
          <div className="mt-3 flex items-center justify-center gap-2 text-indigo-800 bg-indigo-50 border-2 border-indigo-200 px-4 py-2 rounded-2xl">
            <Scale className="w-5 h-5 text-indigo-600 animate-bounce" />
            <span className="text-sm font-bold">曹沖明星投手對決：看準同音好球揮棒！</span>
          </div>
        )}
      </div>

      {/* 揮棒打擊選項卡片網格 (大觸控熱區 ≥ 64px) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isWrong = isSelected && isCorrect === false;
          const isRight = isSelected && isCorrect === true;
          const isGuided = highlightCorrectId === option.id;

          let cardStyle =
            'bg-white hover:bg-amber-50 text-storybook-wood border-3 border-emerald-300 hover:border-amber-500';

          if (isRight) {
            cardStyle =
              'bg-emerald-100 text-emerald-950 border-4 border-emerald-500 shadow-lg scale-102 animate-squash';
          } else if (isWrong) {
            cardStyle =
              'bg-amber-100 text-amber-900 border-3 border-amber-500 animate-wobble';
          } else if (isGuided) {
            cardStyle =
              'bg-amber-50 text-amber-950 border-4 border-rose-500 ring-4 ring-amber-300 shadow-xl animate-pulse';
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
              <div className="flex-1 flex items-center gap-2.5">
                <span className="text-xl shrink-0" aria-hidden="true">
                  {isRight ? '⚾' : '🏏'}
                </span>
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
                className="p-2 rounded-xl text-emerald-800/70 hover:text-emerald-950 hover:bg-emerald-100 transition-colors shrink-0"
                title="朗讀選項"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* 三次界外球後：紅中好球鎖定提示 */}
              {isGuided && (
                <div className="absolute -top-3 -right-2 bg-rose-600 text-white px-2.5 py-1 rounded-full shadow-md animate-bounce flex items-center gap-1 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>紅中好球！揮這顆</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

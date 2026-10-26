import React from 'react';
import { Star, Lock, BookOpen, Sun, Sparkles, Scale, Mail, Award, BookMarked, AlertCircle, Compass } from 'lucide-react';
import { ALL_STAGES } from '../data/stages';
import { UserProgress } from '../core/Types';
import { RubyText } from '../components/common/RubyText';
import { BigButton } from '../components/common/BigButton';

interface MapViewProps {
  progress: UserProgress;
  onSelectStage: (stageId: number) => void;
  onOpenNotebook: (tab?: 'words' | 'mistakes') => void;
  showZhuyin: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'book-open': <BookOpen className="w-8 h-8 text-emerald-600" />,
  sun: <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />,
  sparkles: <Sparkles className="w-8 h-8 text-orange-500" />,
  scale: <Scale className="w-8 h-8 text-indigo-500" />,
  mail: <Mail className="w-8 h-8 text-pink-500" />,
  award: <Award className="w-8 h-8 text-purple-600 animate-bounce" />,
};

export const MapView: React.FC<MapViewProps> = ({
  progress,
  onSelectStage,
  onOpenNotebook,
  showZhuyin,
}) => {
  const collectedCount = Object.keys(progress.collectedWords).length;
  const unresolvedMistakes = Object.values(progress.mistakes).filter((m) => !m.resolved).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
      {/* 冒險島大旗幟 */}
      <div className="w-full text-center bg-gradient-to-b from-amber-100 to-amber-200/80 p-8 rounded-3xl border-3 border-amber-300 shadow-card relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full font-black text-sm tracking-wider uppercase shadow-sm mb-3">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>108 課綱康軒版國小二年級上學期</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-amber-950 tracking-tight my-2">
          <RubyText text="語文冒險島" zhuyin="ㄩˇ ㄨㄣˊ ㄇㄠˋ ㄒㄧㄢˇ ㄉㄠˇ" size="2xl" showZhuyin={showZhuyin} />
        </h1>
        <p className="text-lg sm:text-xl font-bold text-amber-800/90 mt-2 max-w-2xl mx-auto">
          歡迎來到文字小精靈的王國！挑戰六大主題島嶼，收集滿天金星與生字寶藏吧！
        </p>

        {/* 存摺與錯題本快捷卡 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenNotebook('words')}
            className="flex items-center gap-2 bg-white hover:bg-emerald-50 px-5 py-3 rounded-2xl border-2 border-emerald-400 shadow-sm font-bold text-emerald-800 active:scale-95 transition-all text-base min-h-[52px]"
          >
            <BookMarked className="w-5 h-5 text-emerald-600" />
            <span>我的生字存摺</span>
            <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-xs font-black">
              {collectedCount} 字
            </span>
          </button>

          <button
            onClick={() => onOpenNotebook('mistakes')}
            className="flex items-center gap-2 bg-white hover:bg-rose-50 px-5 py-3 rounded-2xl border-2 border-rose-400 shadow-sm font-bold text-rose-800 active:scale-95 transition-all text-base min-h-[52px]"
          >
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>錯題救援本</span>
            {unresolvedMistakes > 0 ? (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-black animate-pulse">
                {unresolvedMistakes} 題待複習
              </span>
            ) : (
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-black">
                太棒了！無錯題
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 關卡島嶼卡片網格 (2 列排版) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALL_STAGES.map((stage) => {
          const isUnlocked = progress.stagesUnlocked.includes(stage.id);
          const starsEarned = progress.stageStars[stage.id] || 0;

          return (
            <div
              key={stage.id}
              className={`
                relative rounded-3xl p-6 sm:p-7 border-3 transition-all duration-200 shadow-card flex flex-col justify-between gap-4
                ${
                  isUnlocked
                    ? 'bg-white hover:border-amber-400 border-amber-200 active:scale-[0.99]'
                    : 'bg-amber-100/50 border-gray-300 opacity-75'
                }
              `}
            >
              {/* 卡片頭部：圖示、標題與星等 */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-amber-100/80 border border-amber-200 shadow-sm shrink-0">
                    {isUnlocked ? (
                      ICON_MAP[stage.icon] || <Sparkles className="w-8 h-8 text-amber-500" />
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* 星等顯示條 (1~3 星) */}
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-5 h-5 ${
                          starIdx <= starsEarned
                            ? 'fill-amber-400 text-amber-500 animate-bounce-once'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold text-amber-700 tracking-wider">
                  {stage.subtitle}
                </div>
                <h2 className="text-2xl font-black text-amber-950 mt-1">
                  <RubyText text={stage.title} size="lg" showZhuyin={showZhuyin} />
                </h2>
                <p className="text-sm font-medium text-amber-800/80 mt-2 line-clamp-2 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* 涵蓋課次標籤與進入按鈕 */}
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-amber-600 truncate max-w-[180px]">
                  {stage.lessons[0]}
                </div>

                {isUnlocked ? (
                  <BigButton
                    variant={starsEarned > 0 ? 'wood' : 'primary'}
                    size="md"
                    onClick={() => onSelectStage(stage.id)}
                    className="min-h-[48px] px-6 text-base"
                  >
                    <span>{starsEarned > 0 ? '再玩一次' : '出發冒險！'}</span>
                  </BigButton>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400 px-4 py-2 bg-gray-100 rounded-2xl">
                    <Lock className="w-4 h-4" />
                    <span>尚未解鎖</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Star, Lock, BookOpen, Sun, Sparkles, Scale, Mail, Award, BookMarked, AlertCircle } from 'lucide-react';
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
      {/* 語文少棒大聯盟巨蛋看板 */}
      <div className="w-full text-center bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 text-white p-8 rounded-3xl border-4 border-amber-400 shadow-xl relative overflow-hidden">
        {/* 裝飾紅縫線光暈 */}
        <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-1.5 rounded-full font-black text-sm tracking-wider uppercase shadow-sm mb-3 border border-rose-300">
          <span>⚾ 108 課綱康軒版國小二年級上學期</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight my-2 drop-shadow">
          <RubyText text="語文少棒大聯盟" zhuyin="ㄩˇ ㄨㄣˊ ㄕㄠˋ ㄅㄤˋ ㄉㄚˋ ㄌㄧㄢˊ ㄇㄥˊ" size="2xl" showZhuyin={showZhuyin} />
        </h1>
        <p className="text-lg sm:text-xl font-bold text-emerald-100 mt-2 max-w-2xl mx-auto">
          歡迎站上打擊區！挑戰六大巡迴球場、揮出全壘打，收集滿天 MVP 金星與球員生字卡吧！
        </p>

        {/* 球員卡冊與牛棚特訓營快捷卡 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenNotebook('words')}
            className="flex items-center gap-2 bg-white hover:bg-amber-50 px-5 py-3 rounded-2xl border-3 border-amber-400 shadow-md font-black text-emerald-950 active:scale-95 transition-all text-base min-h-[54px]"
          >
            <BookMarked className="w-5 h-5 text-emerald-700" />
            <span>球員生字圖鑑</span>
            <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black">
              {collectedCount} 張卡
            </span>
          </button>

          <button
            onClick={() => onOpenNotebook('mistakes')}
            className="flex items-center gap-2 bg-white hover:bg-rose-50 px-5 py-3 rounded-2xl border-3 border-rose-400 shadow-md font-black text-rose-900 active:scale-95 transition-all text-base min-h-[54px]"
          >
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>牛棚特訓營 (錯題救援)</span>
            {unresolvedMistakes > 0 ? (
              <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black animate-pulse">
                {unresolvedMistakes} 球待特訓
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black">
                完美守備！無失誤
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 巡迴賽六大球場卡片網格 (2 列排版) */}
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
                    ? 'bg-white hover:border-emerald-500 border-emerald-300 active:scale-[0.99]'
                    : 'bg-gray-100/80 border-gray-300 opacity-75'
                }
              `}
            >
              {/* 卡片頭部：球場徽章、標題與 MVP 星等 */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-sm shrink-0">
                    {isUnlocked ? (
                      ICON_MAP[stage.icon] || <Sparkles className="w-8 h-8 text-amber-500" />
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* MVP 星等顯示條 (1~3 星) */}
                  <div className="flex items-center gap-1 bg-emerald-950 px-3 py-1.5 rounded-2xl border-2 border-amber-400">
                    <span className="text-[11px] font-black text-amber-300 mr-1">MVP</span>
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-5 h-5 ${
                          starIdx <= starsEarned
                            ? 'fill-amber-400 text-amber-400 animate-bounce-once'
                            : 'text-emerald-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 tracking-wider">
                  <span>⚾ 第 {stage.id + 1} 站</span>
                  <span>｜</span>
                  <span>{stage.subtitle}</span>
                </div>
                <h2 className="text-2xl font-black text-emerald-950 mt-1.5">
                  <RubyText text={stage.title} size="lg" showZhuyin={showZhuyin} />
                </h2>
                <p className="text-sm font-medium text-emerald-900/80 mt-2 line-clamp-2 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* 涵蓋課次標籤與上場打擊按鈕 */}
              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-emerald-700 truncate max-w-[180px]">
                  📋 {stage.lessons[0]}
                </div>

                {isUnlocked ? (
                  <BigButton
                    variant={starsEarned > 0 ? 'wood' : 'primary'}
                    size="md"
                    onClick={() => onSelectStage(stage.id)}
                    className="min-h-[48px] px-6 text-base"
                  >
                    <span>{starsEarned > 0 ? '⚾ 再次出賽' : '🏏 上場打擊！'}</span>
                  </BigButton>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400 px-4 py-2 bg-gray-100 rounded-2xl">
                    <Lock className="w-4 h-4" />
                    <span>尚未開賽</span>
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

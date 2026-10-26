import React from 'react';
import { Volume2, VolumeX, ArrowLeft, Star, Settings, Languages, BookMarked } from 'lucide-react';
import { AudioManager } from '../../core/AudioManager';

interface TopNavBarProps {
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  zhuyinEnabled: boolean;
  onToggleZhuyin: () => void;
  onBackToMap?: () => void;
  onOpenNotebook?: () => void;
  onOpenSettings?: () => void;
  title?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  totalStars,
  isMuted,
  onToggleMute,
  zhuyinEnabled,
  onToggleZhuyin,
  onBackToMap,
  onOpenNotebook,
  onOpenSettings,
  title,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-amber-50/90 backdrop-blur-md border-b-2 border-amber-200/80 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* 左側：返回或標題 */}
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={() => {
                AudioManager.playClick();
                onBackToMap();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-amber-100 text-storybook-wood font-bold border-2 border-amber-300 shadow-sm active:scale-95 transition-all text-base min-h-[44px]"
              title="返回語文冒險地圖"
            >
              <ArrowLeft className="w-5 h-5 text-amber-700" />
              <span className="hidden sm:inline">地圖</span>
            </button>
          )}

          {title && (
            <h1 className="text-xl sm:text-2xl font-black text-amber-900 tracking-wide truncate ml-1">
              {title}
            </h1>
          )}
        </div>

        {/* 右側：星星統計與功能切換鈕 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 星星計數牌 */}
          <div className="flex items-center gap-1.5 bg-amber-100/90 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-inner min-h-[44px]">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
            <span className="font-black text-amber-900 text-lg sm:text-xl font-mono">
              {totalStars}
            </span>
          </div>

          {/* 生字存摺捷徑 */}
          {onOpenNotebook && (
            <button
              onClick={() => {
                AudioManager.playClick();
                onOpenNotebook();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold border-2 border-emerald-300 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 min-h-[44px]"
              title="查看生字存摺與錯題本"
            >
              <BookMarked className="w-5 h-5 text-emerald-600" />
              <span className="hidden md:inline text-sm">存摺</span>
            </button>
          )}

          {/* 注音開關 */}
          <button
            onClick={() => {
              AudioManager.playClick();
              onToggleZhuyin();
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-bold border-2 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 min-h-[44px] ${
              zhuyinEnabled
                ? 'bg-amber-400 border-amber-600 text-amber-950'
                : 'bg-white border-gray-300 text-gray-500'
            }`}
            title={zhuyinEnabled ? '關閉注音輔助' : '開啟直式注音輔助'}
          >
            <Languages className="w-5 h-5" />
            <span className="hidden md:inline text-sm">
              {zhuyinEnabled ? '注音開' : '注音關'}
            </span>
          </button>

          {/* 靜音切換 */}
          <button
            onClick={() => {
              AudioManager.playClick();
              onToggleMute();
            }}
            className={`p-2.5 rounded-2xl border-2 shadow-sm active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
              !isMuted
                ? 'bg-white hover:bg-sky-50 border-sky-300 text-sky-600'
                : 'bg-rose-50 border-rose-300 text-rose-500'
            }`}
            title={isMuted ? '解除靜音' : '靜音'}
          >
            {!isMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* 設定與家長/教師工具箱 */}
          {onOpenSettings && (
            <button
              onClick={() => {
                AudioManager.playClick();
                onOpenSettings();
              }}
              className="p-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="存檔管理與設定"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

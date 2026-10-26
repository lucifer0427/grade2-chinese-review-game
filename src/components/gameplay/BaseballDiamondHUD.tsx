import React from 'react';
import { Flame, Trophy, Users, Zap } from 'lucide-react';
import { FocusType } from '../../core/Types';

export type BatEvent = 'idle' | 'hit' | 'homerun' | 'foul';

export interface PitchInfo {
  name: string;
  speed: string;
  badgeColor: string;
}

export const PITCH_TYPE_MAP: Record<FocusType, PitchInfo> = {
  radical: {
    name: '🔥 部首四縫線直球',
    speed: '145 km/h',
    badgeColor: 'bg-rose-600 text-white border-rose-300',
  },
  components: {
    name: '⚡ 部件二縫線速球',
    speed: '142 km/h',
    badgeColor: 'bg-amber-500 text-amber-950 border-amber-200',
  },
  homophone: {
    name: '🌀 同音字高速滑球',
    speed: '134 km/h',
    badgeColor: 'bg-sky-500 text-white border-sky-200',
  },
  punctuation: {
    name: '🎯 標點符號指叉球',
    speed: '130 km/h',
    badgeColor: 'bg-orange-500 text-white border-orange-200',
  },
  syntax: {
    name: '🌈 句型大曲球',
    speed: '122 km/h',
    badgeColor: 'bg-indigo-500 text-white border-indigo-200',
  },
  idiom: {
    name: '✨ 語詞修辭變速球',
    speed: '126 km/h',
    badgeColor: 'bg-purple-600 text-white border-purple-300',
  },
  letter: {
    name: '📨 書信格式伸卡球',
    speed: '136 km/h',
    badgeColor: 'bg-pink-600 text-white border-pink-300',
  },
  reading: {
    name: '👑 閱讀理解終極魔球',
    speed: '150 km/h',
    badgeColor: 'bg-amber-400 text-amber-950 border-white',
  },
};

interface BaseballDiamondHUDProps {
  stageId: number;
  stageTitle: string;
  currentBatter: number;
  totalBatters: number;
  focusType: FocusType;
  runs: number;
  hits: number;
  combo: number;
  strikes: number; // 0, 1, 2 (零挫折：最多 2 好球，之後皆為界外球)
  bases: [boolean, boolean, boolean]; // [一壘, 二壘, 三壘]
  batEvent: BatEvent;
  // 班級紅白對抗賽模式支援
  isVsMode: boolean;
  onToggleVsMode: () => void;
  activeTeam: 'red' | 'white';
  redScore: number;
  whiteScore: number;
}

export const BaseballDiamondHUD: React.FC<BaseballDiamondHUDProps> = ({
  stageId,
  stageTitle,
  currentBatter,
  totalBatters,
  focusType,
  runs,
  hits,
  combo,
  strikes,
  bases,
  batEvent,
  isVsMode,
  onToggleVsMode,
  activeTeam,
  redScore,
  whiteScore,
}) => {
  const pitch = PITCH_TYPE_MAP[focusType] || PITCH_TYPE_MAP.radical;

  return (
    <div className="w-full bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 border-4 border-amber-400/90 shadow-xl relative overflow-hidden">
      {/* 球場探照燈背景光暈 */}
      <div className="pointer-events-none absolute -top-12 left-1/4 w-48 h-48 bg-amber-300/10 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -top-12 right-1/4 w-48 h-48 bg-sky-300/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* 頂部：賽事名稱 + 球種測速槍 + 班級紅白對抗賽切換鈕 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/80 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full tracking-wider uppercase shadow-sm flex items-center gap-1">
              <span>⚾ 第 {stageId + 1} 巡迴賽</span>
            </span>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-wide">
              {stageTitle}
            </h2>

            {/* 測速槍球種顯示 */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-sm ${pitch.badgeColor}`}
            >
              <span>{pitch.name}</span>
              <span className="font-mono bg-black/25 px-1.5 py-0.5 rounded text-[11px]">
                {pitch.speed}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 班級紅白對抗賽切換按鈕 */}
            <button
              type="button"
              onClick={onToggleVsMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all active:scale-95 cursor-pointer ${
                isVsMode
                  ? 'bg-gradient-to-r from-rose-600 to-sky-600 text-white border-amber-300 shadow-md'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-600'
              }`}
              title="切換單人闖關 / 班級紅白分組對抗賽"
            >
              <Users className="w-4 h-4" />
              <span>{isVsMode ? '🏆 紅白對抗賽中' : '切換：班級紅白賽'}</span>
            </button>

            <div className="flex items-center gap-1.5 bg-emerald-950/90 px-3 py-1 rounded-xl border border-emerald-600/60">
              <span className="text-xs font-bold text-emerald-300">打席</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {currentBatter}/{totalBatters}
              </span>
            </div>
          </div>
        </div>

        {/* 若開啟「班級紅白對抗賽」，顯示紅白兩隊即時比分與輪替提示 */}
        {isVsMode && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-emerald-950/95 p-2.5 rounded-2xl border-2 border-amber-400/70 shadow-inner">
            {/* 猛虎紅隊 */}
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all ${
                activeTeam === 'red'
                  ? 'bg-rose-700/90 border-amber-300 shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-[1.01]'
                  : 'bg-rose-950/50 border-rose-800/60 opacity-75'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔴</span>
                <div>
                  <div className="text-xs font-black text-rose-200">先攻隊伍</div>
                  <div className="text-sm font-black text-white">猛虎紅隊</div>
                </div>
              </div>
              <span className="text-3xl font-black text-amber-300 font-mono">{redScore}</span>
            </div>

            {/* 中央對決狀態 */}
            <div className="flex flex-col items-center justify-center text-center px-2 py-1">
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>目前上場打擊</span>
              </span>
              <div
                className={`mt-1 px-3 py-1 rounded-full text-sm font-black ${
                  activeTeam === 'red'
                    ? 'bg-rose-600 text-white'
                    : 'bg-sky-500 text-white'
                }`}
              >
                {activeTeam === 'red'
                  ? '🔴 請【猛虎紅隊】派選手揮棒！'
                  : '⚪ 請【閃電白隊】派選手揮棒！'}
              </div>
            </div>

            {/* 閃電白隊 */}
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-xl border-2 transition-all ${
                activeTeam === 'white'
                  ? 'bg-sky-700/90 border-amber-300 shadow-[0_0_12px_rgba(56,189,248,0.6)] scale-[1.01]'
                  : 'bg-sky-950/50 border-sky-800/60 opacity-75'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⚪</span>
                <div>
                  <div className="text-xs font-black text-sky-200">後攻隊伍</div>
                  <div className="text-sm font-black text-white">閃電白隊</div>
                </div>
              </div>
              <span className="text-3xl font-black text-amber-300 font-mono">{whiteScore}</span>
            </div>
          </div>
        )}

        {/* 主計分區與右側鑽石壘包圖 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex flex-col gap-3">
            {/* 記分板數據列：得分(R)、安打(H)、好球燈(S)、連擊(Combo) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {/* 得分 RUNS */}
              <div className="bg-emerald-950/90 border-2 border-amber-400/50 rounded-2xl px-3 py-2 flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-amber-300 tracking-widest uppercase">
                  {isVsMode ? '目前隊伍得分' : '總得分 RUNS'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono leading-none">
                    {runs}
                  </span>
                </div>
              </div>

              {/* 安打 HITS */}
              <div className="bg-emerald-950/90 border border-emerald-600/60 rounded-2xl px-3 py-2 flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-emerald-300 tracking-widest uppercase">
                  安打 HITS
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none mt-0.5">
                  {hits}
                </span>
              </div>

              {/* 球數燈號 STRIKES (零挫折：兩好球後無限界外球) */}
              <div className="bg-emerald-950/90 border border-emerald-600/60 rounded-2xl px-3 py-2 flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-amber-200 tracking-widest uppercase">
                  好球燈 S
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  {[1, 2].map((idx) => (
                    <span
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        strikes >= idx
                          ? 'bg-amber-400 border-amber-200 shadow-[0_0_10px_#fbbf24] scale-110'
                          : 'bg-emerald-900 border-emerald-700'
                      }`}
                      title="好球燈（零挫折保護：兩好球後擦棒界外不會三振出局！）"
                    />
                  ))}
                  <span className="text-xs font-bold text-emerald-300 ml-0.5">
                    (不出局)
                  </span>
                </div>
              </div>

              {/* 連續安打 COMBO */}
              <div className="hidden sm:flex bg-emerald-950/90 border border-emerald-600/60 rounded-2xl px-3 py-2 flex-col items-center justify-center">
                <span className="text-[11px] font-black text-orange-300 tracking-widest uppercase">
                  連擊 COMBO
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Flame
                    className={`w-5 h-5 ${
                      combo >= 2
                        ? 'text-orange-400 fill-orange-400 animate-bounce'
                        : 'text-emerald-600'
                    }`}
                  />
                  <span className="text-2xl font-black text-orange-400 font-mono leading-none">
                    {combo}
                  </span>
                </div>
              </div>
            </div>

            {/* 打席推進進度條 */}
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${(currentBatter / Math.max(totalBatters, 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-200 shrink-0">
                距離完賽還剩 {Math.max(totalBatters - currentBatter, 0)} 棒
              </span>
            </div>
          </div>

          {/* 右側：迷你棒球場鑽石壘包視覺圖 (SVG) */}
          <div className="relative w-36 h-32 sm:w-40 sm:h-36 shrink-0 flex items-center justify-center bg-emerald-800/80 rounded-2xl border-2 border-emerald-600/80 shadow-inner p-2">
            <svg viewBox="0 0 120 110" className="w-full h-full overflow-visible">
              {/* 外野草皮弧線 */}
              <path
                d="M 10 55 A 55 55 0 0 1 110 55 L 60 102 Z"
                fill="#15803D"
                stroke="#86EFAC"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />

              {/* 內野紅土鑽石 */}
              <polygon
                points="60,22 95,57 60,92 25,57"
                fill="#B45309"
                stroke="#FDE68A"
                strokeWidth="2"
              />

              {/* 內野中央草皮與投手丘 */}
              <polygon
                points="60,30 87,57 60,84 33,57"
                fill="#16A34A"
              />
              <circle cx="60" cy="57" r="6" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />

              {/* 二壘壘包 (Top: 60, 22) */}
              <g transform="translate(60, 22) rotate(45)">
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="2"
                  fill={bases[1] ? '#FBBF24' : '#FFFFFF'}
                  stroke={bases[1] ? '#FEF08A' : '#CBD5E1'}
                  strokeWidth="2"
                />
              </g>
              {bases[1] && (
                <text x="60" y="12" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FDE047">
                  🏃二壘
                </text>
              )}

              {/* 三壘壘包 (Left: 25, 57) */}
              <g transform="translate(25, 57) rotate(45)">
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="2"
                  fill={bases[2] ? '#FBBF24' : '#FFFFFF'}
                  stroke={bases[2] ? '#FEF08A' : '#CBD5E1'}
                  strokeWidth="2"
                />
              </g>
              {bases[2] && (
                <text x="14" y="45" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FDE047">
                  🏃三壘
                </text>
              )}

              {/* 一壘壘包 (Right: 95, 57) */}
              <g transform="translate(95, 57) rotate(45)">
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="2"
                  fill={bases[0] ? '#FBBF24' : '#FFFFFF'}
                  stroke={bases[0] ? '#FEF08A' : '#CBD5E1'}
                  strokeWidth="2"
                />
              </g>
              {bases[0] && (
                <text x="106" y="45" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FDE047">
                  🏃一壘
                </text>
              )}

              {/* 本壘板 (Home Plate: 60, 92) */}
              <polygon
                points="53,88 67,88 67,95 60,101 53,95"
                fill={batEvent === 'homerun' ? '#FBBF24' : '#FFFFFF'}
                stroke="#E11D48"
                strokeWidth="1.5"
              />
            </svg>

            {/* 擊球瞬間飛球與播報字卡特效 */}
            {batEvent === 'hit' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/75 rounded-2xl animate-scale-up">
                <span className="text-2xl animate-bounce">⚾</span>
                <span className="text-base font-black text-amber-300 tracking-wider drop-shadow">
                  安打上壘！
                </span>
              </div>
            )}

            {batEvent === 'homerun' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950/85 rounded-2xl animate-scale-up border-2 border-amber-300">
                <span className="text-2xl animate-bounce">🎆⚾</span>
                <span className="text-sm font-black text-amber-300 tracking-wider drop-shadow">
                  全壘打 HOME RUN!
                </span>
              </div>
            )}

            {batEvent === 'foul' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-950/80 rounded-2xl animate-wobble">
                <span className="text-xl">🏏💨</span>
                <span className="text-xs font-black text-amber-200 tracking-wider text-center px-1">
                  界外球！再看準球路揮棒！
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

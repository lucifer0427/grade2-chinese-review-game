import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { getStageById } from '../data/stages';
import { CurriculumQuestion, QuestionOption, TargetWordInfo } from '../core/Types';
import { AudioManager } from '../core/AudioManager';
import { StorageManager } from '../core/StorageManager';
import { ChoiceBoard } from '../components/gameplay/ChoiceBoard';
import { DragSlotBoard } from '../components/gameplay/DragSlotBoard';
import { SequenceBoard } from '../components/gameplay/SequenceBoard';
import { ReadingStoryPanel } from '../components/gameplay/ReadingStoryPanel';
import { BaseballDiamondHUD, BatEvent } from '../components/gameplay/BaseballDiamondHUD';
import { HintBubble } from '../components/common/HintBubble';
import { BigButton } from '../components/common/BigButton';
import { RubyText } from '../components/common/RubyText';

interface StageViewProps {
  stageId: number;
  onFinishStage: (stars: number, words: TargetWordInfo[]) => void;
  onBackToMap: () => void;
  showZhuyin: boolean;
}

export const StageView: React.FC<StageViewProps> = ({
  stageId,
  onFinishStage,
  onBackToMap,
  showZhuyin,
}) => {
  const stage = getStageById(stageId);
  const questions: CurriculumQuestion[] = stage?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalStageWrongs, setTotalStageWrongs] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [highlightCorrectId, setHighlightCorrectId] = useState<string | null>(null);
  const [collectedWords, setCollectedWords] = useState<TargetWordInfo[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(3);

  // 棒球場賽況狀態 (得分、安打、連擊、好球數、一二三壘跑者、擊球事件)
  const [runs, setRuns] = useState(0);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [bases, setBases] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [batEvent, setBatEvent] = useState<BatEvent>('idle');
  const [bannerText, setBannerText] = useState<string | null>(null);

  // 班級紅白對抗賽狀態 (奇數題：猛虎紅隊、偶數題：閃電白隊)
  const [isVsMode, setIsVsMode] = useState(false);
  const [redScore, setRedScore] = useState(0);
  const [whiteScore, setWhiteScore] = useState(0);
  const activeTeam: 'red' | 'white' = currentIndex % 2 === 0 ? 'red' : 'white';
  const timerRef = useRef<number | null>(null);

  const currentQ = questions[currentIndex];

  // 清除未完成的計時器，防止組件卸載後更新狀態
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 重設每打席狀態
  useEffect(() => {
    setSelectedOptionId(null);
    setIsCorrect(null);
    setWrongCount(0);
    setActiveHint(null);
    setHighlightCorrectId(null);
    setStrikes(0);
    setBatEvent('idle');
    setBannerText(null);
  }, [currentIndex]);

  if (!stage || !currentQ) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-2xl font-bold text-amber-900">找不到該球場賽事題目</h2>
        <BigButton onClick={onBackToMap} className="mt-4">
          返回巡迴賽地圖
        </BigButton>
      </div>
    );
  }

  const addTeamPoints = (points: number) => {
    if (points <= 0) return;
    if (activeTeam === 'red') {
      setRedScore((prev) => prev + points);
    } else {
      setWhiteScore((prev) => prev + points);
    }
  };

  // 推進壘包與計分邏輯
  const triggerBaseballHit = () => {
    const nextCombo = combo + 1;
    const isLastBatter = currentIndex === questions.length - 1;
    const isHomeRun = wrongCount === 0 && (nextCombo >= 3 || isLastBatter);
    const teamPrefix = isVsMode
      ? activeTeam === 'red'
        ? '🔴【猛虎紅隊】'
        : '⚪【閃電白隊】'
      : '';

    setHits((prev) => prev + 1);
    setCombo(nextCombo);
    setStrikes(0);

    if (isHomeRun) {
      // 全壘打：壘上所有跑者 + 打者本人全部回本壘得分！
      const runnersOnBase = (bases[0] ? 1 : 0) + (bases[1] ? 1 : 0) + (bases[2] ? 1 : 0);
      const rbi = runnersOnBase + 1;
      setRuns((prev) => prev + rbi);
      addTeamPoints(rbi);
      setBases([false, false, false]);
      setBatEvent('homerun');
      setBannerText(
        rbi === 4
          ? `🎆 ${teamPrefix}滿貫全壘打 GRAND SLAM！一口氣灌進 4 分！`
          : `⚾ ${teamPrefix}紅不讓全壘打 HOME RUN！得 ${rbi} 分！`
      );
      AudioManager.playHomeRun();
    } else {
      // 安打推進壘包：班級紅白對抗賽時，每支安打至少為該隊拿下 1 分 + 壘上打點，讓分組競賽更刺激！
      const runnerScored = bases[2] ? 1 : 0;
      const vsBonus = isVsMode ? 1 : 0;
      const totalScored = runnerScored + vsBonus;
      const nextBases: [boolean, boolean, boolean] = [true, bases[0], bases[1]];

      if (totalScored > 0) {
        setRuns((prev) => prev + totalScored);
        addTeamPoints(totalScored);
      }
      setBases(nextBases);
      setBatEvent('hit');
      setBannerText(
        runnerScored > 0
          ? `⚾ ${teamPrefix}適時安打！送回三壘跑者得分！`
          : `⚾ ${teamPrefix}清脆安打上壘！跑者推進！`
      );
      AudioManager.playCorrect();
    }
  };

  // 處理答題判定
  const handleAnswerSubmit = (option: QuestionOption) => {
    if (isCorrect !== null) return;
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setIsCorrect(true);
      setActiveHint(null);
      triggerBaseballHit();

      let nextWords = collectedWords;
      if (
        currentQ.targetWord &&
        !collectedWords.some((w) => w.char === currentQ.targetWord!.char)
      ) {
        nextWords = [...collectedWords, currentQ.targetWord];
        setCollectedWords(nextWords);
      }

      timerRef.current = window.setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishLevel(nextWords);
        }
      }, 1150);
    } else {
      // 答錯邏輯 (零挫折界外球模式：兩好球後無限界外球，絕不出局！)
      setIsCorrect(false);
      AudioManager.playWrong();
      StorageManager.recordMistake(currentQ);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setTotalStageWrongs((prev) => prev + 1);
      setCombo(0);
      setStrikes((prev) => Math.min(2, prev + 1));
      setBatEvent('foul');
      setBannerText('🏏 擦棒界外球 FOUL BALL！不算三振，看教練暗號再揮一棒！');
      setActiveHint(option.hint);

      // 三次界外球後自動啟動「紅中失投球鎖定」(引導模式)
      if (newWrong >= 3) {
        const correctOpt = currentQ.options.find((o) => o.isCorrect);
        if (correctOpt) {
          setHighlightCorrectId(correctOpt.id);
        }
      }

      timerRef.current = window.setTimeout(() => {
        setIsCorrect(null);
        setBatEvent('idle');
      }, 800);
    }
  };

  // 處理排序題（棒次排列）驗證
  const handleSequenceSubmit = (allCorrect: boolean, errorHint?: string) => {
    if (isCorrect !== null) return;

    if (allCorrect) {
      setIsCorrect(true);
      setActiveHint(null);
      triggerBaseballHit();

      let nextWords = collectedWords;
      if (
        currentQ.targetWord &&
        !collectedWords.some((w) => w.char === currentQ.targetWord!.char)
      ) {
        nextWords = [...collectedWords, currentQ.targetWord];
        setCollectedWords(nextWords);
      }

      timerRef.current = window.setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishLevel(nextWords);
        }
      }, 1150);
    } else {
      setIsCorrect(false);
      AudioManager.playWrong();
      StorageManager.recordMistake(currentQ);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setTotalStageWrongs((prev) => prev + 1);
      setCombo(0);
      setStrikes((prev) => Math.min(2, prev + 1));
      setBatEvent('foul');
      setBannerText('🏏 打序還差一點點！看清楚教練提示調整棒次！');
      setActiveHint(errorHint || '棒次順序還差一點點，再仔細看一看先後步驟喔！');

      timerRef.current = window.setTimeout(() => {
        setIsCorrect(null);
        setBatEvent('idle');
      }, 800);
    }
  };

  // 比賽完賽結算
  const finishLevel = (finalWords: TargetWordInfo[]) => {
    let stars = 3;
    if (totalStageWrongs >= 4) {
      stars = 1;
    } else if (totalStageWrongs >= 2) {
      stars = 2;
    }
    setStarsAwarded(stars);
    setIsFinished(true);
    AudioManager.playLevelComplete();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#22C55E', '#EF4444', '#38BDF8', '#FFFFFF'],
      });
    } catch {
      // 靜默
    }

    onFinishStage(stars, finalWords);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 flex flex-col items-center gap-5">
      {/* 棒球場電子記分板與鑽石壘包 HUD */}
      <BaseballDiamondHUD
        stageId={stageId}
        stageTitle={stage.title}
        currentBatter={currentIndex + 1}
        totalBatters={questions.length}
        focusType={currentQ.focusType}
        runs={isVsMode ? (activeTeam === 'red' ? redScore : whiteScore) : runs}
        hits={hits}
        combo={combo}
        strikes={strikes}
        bases={bases}
        batEvent={batEvent}
        isVsMode={isVsMode}
        onToggleVsMode={() => {
          AudioManager.playClick();
          setIsVsMode((prev) => !prev);
        }}
        activeTeam={activeTeam}
        redScore={redScore}
        whiteScore={whiteScore}
      />

      {/* 即時賽況熱血播報橫幅 */}
      {bannerText && (
        <div
          className={`w-full px-5 py-2.5 rounded-2xl font-black text-center text-base sm:text-lg shadow-md border-2 transition-all animate-scale-up ${
            batEvent === 'homerun'
              ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 text-white border-amber-200'
              : batEvent === 'hit'
              ? 'bg-emerald-600 text-white border-emerald-300'
              : 'bg-amber-100 text-amber-950 border-amber-400'
          }`}
        >
          {bannerText}
        </div>
      )}

      {/* 閱讀短文面板 (Stage 5 或帶 passage 的題目) */}
      {currentQ.passage && (
        <ReadingStoryPanel
          passage={currentQ.passage}
          showZhuyin={showZhuyin}
        />
      )}

      {/* 互動打擊面板分流 */}
      {currentQ.mechanicType === 'choice' && (
        <ChoiceBoard
          question={currentQ}
          onSelectOption={handleAnswerSubmit}
          selectedOptionId={selectedOptionId}
          isCorrect={isCorrect}
          highlightCorrectId={highlightCorrectId}
          showZhuyin={showZhuyin}
          disabled={isCorrect !== null}
        />
      )}

      {currentQ.mechanicType === 'drag-slot' && (
        <DragSlotBoard
          question={currentQ}
          onSubmitAnswer={handleAnswerSubmit}
          selectedOptionId={selectedOptionId}
          isCorrect={isCorrect}
          highlightCorrectId={highlightCorrectId}
          showZhuyin={showZhuyin}
          disabled={isCorrect !== null}
        />
      )}

      {currentQ.mechanicType === 'sequence' && (
        <SequenceBoard
          question={currentQ}
          onSubmitSequence={handleSequenceSubmit}
          isCorrect={isCorrect}
          highlightCorrectId={highlightCorrectId}
          showZhuyin={showZhuyin}
          disabled={isCorrect !== null}
        />
      )}

      {/* 總教練戰術暗號 (錯答時溫和彈出) */}
      {activeHint && (
        <HintBubble
          hint={activeHint}
          showZhuyin={showZhuyin}
          onDismiss={() => setActiveHint(null)}
        />
      )}

      {/* 完賽勝利結算彈窗 (Game Set Modal) */}
      {isFinished && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-emerald-50 to-amber-50 w-full max-w-md rounded-3xl p-8 border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center animate-scale-up">
            <div className="w-20 h-20 bg-amber-400 rounded-3xl border-4 border-white flex items-center justify-center shadow-lg -mt-16 mb-3">
              <Trophy className="w-10 h-10 text-amber-950" />
            </div>

            <span className="px-3 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase mb-1">
              GAME SET! 比賽勝利
            </span>
            <h2 className="text-3xl font-black text-emerald-950 mb-1">
              {isVsMode
                ? redScore > whiteScore
                  ? '🔴 猛虎紅隊獲勝！'
                  : whiteScore > redScore
                  ? '⚪ 閃電白隊獲勝！'
                  : '🤝 紅白兩隊平手雙贏！'
                : '完賽大勝利！'}
            </h2>
            <p className="text-base font-bold text-emerald-800">
              恭喜在【{stage.title}】打出精彩好球！
            </p>

            {/* 本場棒球戰報統計 */}
            {isVsMode ? (
              <div className="w-full grid grid-cols-2 gap-3 my-4 bg-emerald-950 text-white p-3.5 rounded-2xl border-2 border-amber-400">
                <div className="bg-rose-900/80 rounded-xl p-2 border border-rose-400">
                  <div className="text-xs font-bold text-rose-200">🔴 猛虎紅隊</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">{redScore} 分</div>
                </div>
                <div className="bg-sky-900/80 rounded-xl p-2 border border-sky-400">
                  <div className="text-xs font-bold text-sky-200">⚪ 閃電白隊</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">{whiteScore} 分</div>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-3 my-4 bg-emerald-900 text-white p-3.5 rounded-2xl border-2 border-emerald-700">
                <div>
                  <div className="text-xs font-bold text-emerald-300">總得分 RUNS</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">{runs} 分</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">總安打 HITS</div>
                  <div className="text-2xl font-black text-white font-mono">{hits} 支</div>
                </div>
              </div>
            )}

            {/* MVP 星等評分 */}
            <div className="flex items-center gap-2 my-3">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-12 h-12 transition-all duration-300 ${
                    starIdx <= starsAwarded
                      ? 'fill-amber-400 text-amber-500 scale-110 animate-bounce'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* 收錄新球員生字卡展示 */}
            {collectedWords.length > 0 && (
              <div className="w-full bg-white/95 p-4 rounded-2xl border-2 border-emerald-200 mb-6">
                <div className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>新簽約球員生字卡</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {collectedWords.map((w, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-amber-100 text-amber-950 rounded-xl font-bold border-2 border-amber-300"
                    >
                      <RubyText text={w.char} zhuyin={w.zhuyin} size="sm" showZhuyin={showZhuyin} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="w-full flex flex-col gap-3">
              <BigButton
                variant="primary"
                size="lg"
                onClick={onBackToMap}
                className="w-full"
              >
                <ArrowRight className="w-6 h-6" />
                <span>返回巡迴賽地圖</span>
              </BigButton>

              <BigButton
                variant="ghost"
                size="md"
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                  setTotalStageWrongs(0);
                  setRuns(0);
                  setHits(0);
                  setCombo(0);
                  setRedScore(0);
                  setWhiteScore(0);
                  setBases([false, false, false]);
                }}
                className="w-full"
              >
                <RotateCcw className="w-5 h-5" />
                <span>再打一場比賽</span>
              </BigButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

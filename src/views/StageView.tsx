import React, { useState, useEffect } from 'react';
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

  const currentQ = questions[currentIndex];

  // 重設每題狀態
  useEffect(() => {
    setSelectedOptionId(null);
    setIsCorrect(null);
    setWrongCount(0);
    setActiveHint(null);
    setHighlightCorrectId(null);
  }, [currentIndex]);

  if (!stage || !currentQ) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-2xl font-bold text-amber-900">找不到該關卡題目</h2>
        <BigButton onClick={onBackToMap} className="mt-4">
          返回地圖
        </BigButton>
      </div>
    );
  }

  // 處理答題判定
  const handleAnswerSubmit = (option: QuestionOption) => {
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      // 答對邏輯
      setIsCorrect(true);
      AudioManager.playCorrect();
      setActiveHint(null);

      // 若有目標生字，收錄起來
      if (currentQ.targetWord) {
        setCollectedWords((prev) => [...prev, currentQ.targetWord!]);
      }

      // 稍微停留後前進下一題
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // 通關結算
          finishLevel();
        }
      }, 1000);
    } else {
      // 答錯邏輯 (零挫折模式)
      setIsCorrect(false);
      AudioManager.playWrong();
      StorageManager.recordMistake(currentQ);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setTotalStageWrongs((prev) => prev + 1);
      setActiveHint(option.hint);

      // 三次錯誤後自動啟動引導模式
      if (newWrong >= 3) {
        const correctOpt = currentQ.options.find((o) => o.isCorrect);
        if (correctOpt) {
          setHighlightCorrectId(correctOpt.id);
        }
      }

      // 震動完後解鎖選項允許重試
      setTimeout(() => {
        setIsCorrect(null);
      }, 700);
    }
  };

  // 處理排序題驗證
  const handleSequenceSubmit = (allCorrect: boolean, errorHint?: string) => {
    if (allCorrect) {
      setIsCorrect(true);
      AudioManager.playCorrect();
      setActiveHint(null);

      if (currentQ.targetWord) {
        setCollectedWords((prev) => [...prev, currentQ.targetWord!]);
      }

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          finishLevel();
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      AudioManager.playWrong();
      StorageManager.recordMistake(currentQ);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setTotalStageWrongs((prev) => prev + 1);
      setActiveHint(errorHint || '順序排列還差一點點，再仔細看一看步驟喔！');

      setTimeout(() => {
        setIsCorrect(null);
      }, 700);
    }
  };

  // 關卡結算
  const finishLevel = () => {
    let stars = 3;
    if (totalStageWrongs >= 4) {
      stars = 1;
    } else if (totalStageWrongs >= 2) {
      stars = 2;
    }
    setStarsAwarded(stars);
    setIsFinished(true);
    AudioManager.playLevelComplete();

    // 播放彩帶動畫
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB923C', '#86EFAC', '#93C5FD', '#F472B6', '#FBBF24'],
      });
    } catch {
      // 靜默
    }

    onFinishStage(stars, collectedWords);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* 關卡頂部進度條與題號 */}
      <div className="w-full flex items-center justify-between gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-amber-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
            第 {stageId} 關
          </span>
          <span className="text-lg font-black text-amber-950">
            {stage.title}
          </span>
        </div>

        {/* 題目進度與進度條 */}
        <div className="flex items-center gap-3">
          <div className="w-24 sm:w-40 h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm font-black text-amber-800 font-mono">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* 閱讀短文面板 (Stage 5 或帶 passage 的題目) */}
      {currentQ.passage && (
        <ReadingStoryPanel
          passage={currentQ.passage}
          showZhuyin={showZhuyin}
        />
      )}

      {/* 互動題目面板分流 */}
      {currentQ.mechanicType === 'choice' && (
        <ChoiceBoard
          question={currentQ}
          onSelectOption={handleAnswerSubmit}
          selectedOptionId={selectedOptionId}
          isCorrect={isCorrect}
          highlightCorrectId={highlightCorrectId}
          showZhuyin={showZhuyin}
          disabled={isCorrect === true}
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
          disabled={isCorrect === true}
        />
      )}

      {currentQ.mechanicType === 'sequence' && (
        <SequenceBoard
          question={currentQ}
          onSubmitSequence={handleSequenceSubmit}
          isCorrect={isCorrect}
          highlightCorrectId={highlightCorrectId}
          showZhuyin={showZhuyin}
          disabled={isCorrect === true}
        />
      )}

      {/* 提示小錦囊 (錯答時溫和彈出) */}
      {activeHint && (
        <HintBubble
          hint={activeHint}
          showZhuyin={showZhuyin}
          onDismiss={() => setActiveHint(null)}
        />
      )}

      {/* 通關結算彈窗 (Result Modal) */}
      {isFinished && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 w-full max-w-md rounded-3xl p-8 border-4 border-amber-300 shadow-2xl flex flex-col items-center text-center animate-scale-up">
            <div className="w-20 h-20 bg-amber-400 rounded-3xl border-4 border-amber-500 flex items-center justify-center shadow-lg -mt-16 mb-4">
              <Trophy className="w-10 h-10 text-amber-950" />
            </div>

            <h2 className="text-3xl font-black text-amber-950 mb-1">
              挑戰成功！
            </h2>
            <p className="text-base font-bold text-amber-800">
              恭喜你順利通過【{stage.title}】！
            </p>

            {/* 星等評分 */}
            <div className="flex items-center gap-2 my-6">
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

            {/* 收錄新詞展示 */}
            {collectedWords.length > 0 && (
              <div className="w-full bg-white/90 p-4 rounded-2xl border border-amber-200 mb-6">
                <div className="text-xs font-black uppercase text-amber-700 tracking-wider mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>新收錄生字存摺</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {collectedWords.map((w, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-amber-100 text-amber-950 rounded-xl font-bold border border-amber-300"
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
                <span>返回冒險地圖</span>
              </BigButton>

              <BigButton
                variant="ghost"
                size="md"
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                  setTotalStageWrongs(0);
                }}
                className="w-full"
              >
                <RotateCcw className="w-5 h-5" />
                <span>再玩一次</span>
              </BigButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

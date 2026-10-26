import React, { useState } from 'react';
import { BookMarked, AlertCircle, Volume2, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProgress, TargetWordInfo, CurriculumQuestion } from '../core/Types';
import { RubyText } from '../components/common/RubyText';
import { SpeechManager } from '../core/SpeechManager';
import { AudioManager } from '../core/AudioManager';
import { StorageManager } from '../core/StorageManager';
import { BigButton } from '../components/common/BigButton';

interface NotebookViewProps {
  progress: UserProgress;
  initialTab?: 'words' | 'mistakes';
  onBackToMap: () => void;
  showZhuyin: boolean;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  progress,
  initialTab = 'words',
  onBackToMap,
  showZhuyin,
}) => {
  const [tab, setTab] = useState<'words' | 'mistakes'>(initialTab);
  const [activePracticeQ, setActivePracticeQ] = useState<CurriculumQuestion | null>(null);
  const [practiceAnswered, setPracticeAnswered] = useState<boolean | null>(null);

  const wordList: TargetWordInfo[] = Object.values(progress.collectedWords);
  const mistakeList = Object.values(progress.mistakes);

  const handleSpeakWord = (word: TargetWordInfo) => {
    AudioManager.playClick();
    SpeechManager.speak(`${word.char}。${word.meaning || ''}`);
  };

  const handlePracticeOption = (question: CurriculumQuestion, isRight: boolean) => {
    if (isRight) {
      AudioManager.playCorrect();
      setPracticeAnswered(true);
      StorageManager.resolveMistake(question.id);
      setTimeout(() => {
        setActivePracticeQ(null);
        setPracticeAnswered(null);
      }, 1200);
    } else {
      AudioManager.playWrong();
      setPracticeAnswered(false);
      setTimeout(() => {
        setPracticeAnswered(null);
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
      {/* 頂部標題列 */}
      <div className="w-full flex items-center justify-between gap-4">
        <button
          onClick={() => {
            AudioManager.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-100 font-bold border-2 border-amber-300 shadow-sm active:scale-95 transition-all text-amber-900"
        >
          <ArrowLeft className="w-5 h-5 text-amber-700" />
          <span>回地圖</span>
        </button>

        {/* 標籤頁切換鈕 */}
        <div className="flex items-center bg-amber-100 p-1.5 rounded-2xl border border-amber-300">
          <button
            onClick={() => {
              AudioManager.playClick();
              setTab('words');
              setActivePracticeQ(null);
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-base transition-all ${
              tab === 'words'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-amber-800 hover:bg-amber-200/60'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            <span>生字存摺 ({wordList.length})</span>
          </button>

          <button
            onClick={() => {
              AudioManager.playClick();
              setTab('mistakes');
              setActivePracticeQ(null);
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-base transition-all ${
              tab === 'mistakes'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-amber-800 hover:bg-amber-200/60'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>錯題救援本 ({mistakeList.length})</span>
          </button>
        </div>
      </div>

      {/* 生字存摺列表 */}
      {tab === 'words' && (
        <div className="w-full">
          {wordList.length === 0 ? (
            <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-amber-200 p-8 shadow-sm">
              <BookMarked className="w-16 h-16 text-amber-300 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-amber-950 mb-1">
                存摺裡還沒有收錄生字喔！
              </h3>
              <p className="text-amber-800 font-medium mb-6">
                快去探索關卡，完成答題就能把新字收進你的智慧存摺！
              </p>
              <BigButton onClick={onBackToMap}>前往闖關</BigButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wordList.map((word) => (
                <div
                  key={word.char}
                  className="bg-white p-5 rounded-3xl border-2 border-amber-200 hover:border-amber-400 shadow-sm flex flex-col justify-between gap-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <RubyText
                        text={word.char}
                        zhuyin={word.zhuyin}
                        size="2xl"
                        showZhuyin={showZhuyin}
                      />
                    </div>
                    <button
                      onClick={() => handleSpeakWord(word)}
                      className="p-2 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors"
                      title="發音與字義"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm font-bold text-amber-900/80 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                    <div>
                      部首：<span className="text-amber-700">{word.radical}部</span>
                    </div>
                    <div>
                      部首外筆畫：<span className="text-amber-700">{word.strokeCount} 畫</span>
                      {word.totalStrokes && (
                        <span className="text-xs text-amber-600 ml-1">
                          （共 {word.totalStrokes} 畫）
                        </span>
                      )}
                    </div>
                    {word.meaning && (
                      <div className="mt-1 text-xs text-amber-800 font-medium border-t border-amber-200/60 pt-1">
                        釋義：{word.meaning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 錯題救援本列表 */}
      {tab === 'mistakes' && (
        <div className="w-full">
          {/* 若正在重練特定題目 */}
          {activePracticeQ ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-amber-300 shadow-card flex flex-col items-center gap-6">
              <div className="w-full flex items-center justify-between border-b border-amber-100 pb-3">
                <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  錯題救援挑戰
                </span>
                <button
                  onClick={() => setActivePracticeQ(null)}
                  className="text-sm font-bold text-gray-500 hover:text-gray-800"
                >
                  取消挑戰
                </button>
              </div>

              <div className="text-2xl font-bold text-storybook-wood text-center my-2">
                <RubyText
                  text={activePracticeQ.prompt}
                  zhuyin={activePracticeQ.promptZhuyin}
                  size="lg"
                  showZhuyin={showZhuyin}
                />
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePracticeQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handlePracticeOption(activePracticeQ, opt.isCorrect)}
                    className="p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-white font-bold text-left shadow-sm active:scale-95 transition-all min-h-[64px]"
                  >
                    <RubyText text={opt.text} zhuyin={opt.zhuyin} size="md" showZhuyin={showZhuyin} />
                  </button>
                ))}
              </div>

              {practiceAnswered === true && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl font-black text-center animate-bounce">
                  太厲害了！成功克服錯題，已加入過關名單！
                </div>
              )}
              {practiceAnswered === false && (
                <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl font-black text-center animate-wobble">
                  還差一點點，再想一想喔！
                </div>
              )}
            </div>
          ) : mistakeList.length === 0 ? (
            <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-amber-200 p-8 shadow-sm">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-amber-950 mb-1">
                太棒了！目前沒有任何待救援的錯題！
              </h3>
              <p className="text-amber-800 font-medium">
                你的語文基礎超級穩固，繼續保持！
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {mistakeList.map(({ question, wrongCount, resolved }) => (
                <div
                  key={question.id}
                  className={`
                    p-5 rounded-3xl border-2 shadow-sm flex items-center justify-between gap-4 transition-all
                    ${
                      resolved
                        ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                        : 'bg-white border-rose-200 hover:border-rose-300'
                    }
                  `}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      {resolved ? (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已救援克服
                        </span>
                      ) : (
                        <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          曾答錯 {wrongCount} 次
                        </span>
                      )}
                      <span className="text-xs text-amber-700 font-semibold">
                        第 {question.unitId} 關題目
                      </span>
                    </div>
                    <div className="text-lg font-bold text-storybook-wood">
                      <RubyText text={question.prompt} size="md" showZhuyin={showZhuyin} />
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePracticeQ(question)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 shadow-sm active:scale-95 transition-all text-sm shrink-0 min-h-[48px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{resolved ? '再複習' : '重新挑戰'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

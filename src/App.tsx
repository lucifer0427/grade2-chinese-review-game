import React, { useState, useEffect } from 'react';
import { StorageManager } from './core/StorageManager';
import { AudioManager } from './core/AudioManager';
import { SpeechManager } from './core/SpeechManager';
import { UserProgress, TargetWordInfo } from './core/Types';
import { TopNavBar } from './components/common/TopNavBar';
import { MapView } from './views/MapView';
import { StageView } from './views/StageView';
import { NotebookView } from './views/NotebookView';
import { SettingsModal } from './views/SettingsModal';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => StorageManager.getProgress());
  const [view, setView] = useState<'map' | 'stage' | 'notebook'>('map');
  const [currentStageId, setCurrentStageId] = useState<number>(0);
  const [notebookTab, setNotebookTab] = useState<'words' | 'mistakes'>('words');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(progress.audioMuted);
  const [zhuyinEnabled, setZhuyinEnabled] = useState(progress.zhuyinEnabled);

  useEffect(() => {
    AudioManager.setMuted(isMuted);
    SpeechManager.init();
  }, [isMuted]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    AudioManager.setMuted(nextMuted);
    const updated = { ...progress, audioMuted: nextMuted };
    setProgress(updated);
    StorageManager.saveProgress(updated);
  };

  const handleToggleZhuyin = () => {
    const nextZhuyin = !zhuyinEnabled;
    setZhuyinEnabled(nextZhuyin);
    const updated = { ...progress, zhuyinEnabled: nextZhuyin };
    setProgress(updated);
    StorageManager.saveProgress(updated);
  };

  const handleSelectStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setView('stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishStage = (stars: number, words: TargetWordInfo[]) => {
    const updated = StorageManager.completeStage(currentStageId, stars, words);
    setProgress(updated);
  };

  const handleOpenNotebook = (tab: 'words' | 'mistakes' = 'words') => {
    setNotebookTab(tab);
    setView('notebook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMap = () => {
    SpeechManager.stop();
    setView('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-storybook-cream flex flex-col justify-between selection:bg-amber-300">
      {/* 頂部全域功能導航列 */}
      <TopNavBar
        totalStars={progress.totalStars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        zhuyinEnabled={zhuyinEnabled}
        onToggleZhuyin={handleToggleZhuyin}
        onBackToMap={view !== 'map' ? handleBackToMap : undefined}
        onOpenNotebook={() => handleOpenNotebook('words')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        title={view === 'stage' ? undefined : '語文冒險島'}
      />

      {/* 主視圖路由分流 */}
      <main className="flex-1 w-full pb-16">
        {view === 'map' && (
          <MapView
            progress={progress}
            onSelectStage={handleSelectStage}
            onOpenNotebook={handleOpenNotebook}
            showZhuyin={zhuyinEnabled}
          />
        )}

        {view === 'stage' && (
          <StageView
            stageId={currentStageId}
            onFinishStage={handleFinishStage}
            onBackToMap={handleBackToMap}
            showZhuyin={zhuyinEnabled}
          />
        )}

        {view === 'notebook' && (
          <NotebookView
            progress={progress}
            initialTab={notebookTab}
            onBackToMap={handleBackToMap}
            showZhuyin={zhuyinEnabled}
          />
        )}
      </main>

      {/* 底部微型版權宣告 (純前端無伺服器靜態部署) */}
      <footer className="w-full text-center py-4 text-xs font-semibold text-amber-800/60 border-t border-amber-200/60">
        教育部 108 課綱康軒版國小二年級上學期國語自主學習遊戲 ｜ 運行於 GitHub Pages
      </footer>

      {/* 設定與教師家長工具彈窗 */}
      {isSettingsOpen && (
        <SettingsModal
          onUpdateProgress={(newP) => setProgress(newP)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

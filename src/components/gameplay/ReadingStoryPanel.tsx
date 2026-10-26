import React from 'react';
import { BookOpen, Volume2 } from 'lucide-react';
import { RubyText } from '../common/RubyText';
import { SpeechManager } from '../../core/SpeechManager';
import { AudioManager } from '../../core/AudioManager';

interface ReadingStoryPanelProps {
  passage: string;
  showZhuyin: boolean;
}

export const ReadingStoryPanel: React.FC<ReadingStoryPanelProps> = ({
  passage,
  showZhuyin,
}) => {
  const handleReadPassage = () => {
    AudioManager.playClick();
    SpeechManager.speak(passage);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 p-6 sm:p-8 bg-amber-50/90 border-3 border-amber-300 rounded-3xl shadow-card relative">
      <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
        <div className="flex items-center gap-2 text-amber-900 font-black text-xl">
          <BookOpen className="w-6 h-6 text-amber-700" />
          <span>閱讀小劇場：《我最喜歡上學了》</span>
        </div>
        <button
          onClick={handleReadPassage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold transition-all active:scale-95 text-sm"
          title="朗讀整段故事"
        >
          <Volume2 className="w-4 h-4" />
          <span>聽故事</span>
        </button>
      </div>

      <div className="text-xl sm:text-2xl font-medium text-storybook-wood leading-loose tracking-wide">
        <RubyText text={passage} size="md" showZhuyin={showZhuyin} />
      </div>
    </div>
  );
};

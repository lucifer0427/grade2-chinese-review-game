import React from 'react';
import { Volume2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { SpeechManager } from '../../core/SpeechManager';
import { RubyText } from './RubyText';

interface HintBubbleProps {
  hint: string;
  ttsOverride?: string;
  onDismiss?: () => void;
  showZhuyin?: boolean;
}

export const HintBubble: React.FC<HintBubbleProps> = ({
  hint,
  ttsOverride,
  onDismiss,
  showZhuyin = true,
}) => {
  const handleSpeak = () => {
    SpeechManager.speak(hint, ttsOverride);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-3 p-4 bg-amber-100/95 border-2 border-amber-300 rounded-3xl shadow-md flex items-start gap-3 animate-bounce-gentle">
      <div className="p-2.5 rounded-2xl bg-amber-400 text-amber-950 shrink-0 shadow-sm">
        <Lightbulb className="w-6 h-6 animate-pulse" />
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-white bg-emerald-700 px-2.5 py-0.5 rounded-md">
            🧢 總教練戰術暗號
          </span>
          <button
            onClick={handleSpeak}
            className="p-1 rounded-full text-amber-700 hover:text-amber-900 hover:bg-amber-200 transition-colors"
            title="朗讀教練提示"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-storybook-wood font-medium text-lg leading-relaxed">
          <RubyText text={hint} size="md" showZhuyin={showZhuyin} />
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-200 rounded-full transition-colors"
          title="我知道了"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

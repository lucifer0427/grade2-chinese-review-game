import React, { useState } from 'react';
import { Download, Upload, Trash2, X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StorageManager } from '../core/StorageManager';
import { UserProgress } from '../core/Types';
import { BigButton } from '../components/common/BigButton';
import { AudioManager } from '../core/AudioManager';

interface SettingsModalProps {
  onUpdateProgress: (newProgress: UserProgress) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onUpdateProgress,
  onClose,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    AudioManager.playClick();
    const jsonStr = StorageManager.exportJSON();
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    // 觸發 JSON 檔案下載
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `語文冒險島_學習進度_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    AudioManager.playClick();
    if (!importText.trim()) return;

    const ok = StorageManager.importJSON(importText.trim());
    if (ok) {
      const refreshed = StorageManager.getProgress();
      onUpdateProgress(refreshed);
      setImportStatus('success');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1200);
    } else {
      setImportStatus('error');
    }
  };

  const handleReset = () => {
    if (window.confirm('確定要清除所有關卡進度、星星與生字存摺嗎？此動作無法復原喔！')) {
      AudioManager.playClick();
      const reset = StorageManager.resetProgress();
      onUpdateProgress(reset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-2xl flex flex-col gap-6 relative animate-scale-up">
        {/* 關閉按鈕 */}
        <button
          onClick={() => {
            AudioManager.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-amber-600" />
          <h2 className="text-2xl font-black text-amber-950">
            教師與家長工具箱
          </h2>
        </div>

        {/* 存摺匯出 */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col gap-2">
          <div className="font-bold text-amber-950 flex items-center justify-between">
            <span>備份與匯出學習進度</span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 text-sm shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{copied ? '已複製！' : '匯出 JSON'}</span>
            </button>
          </div>
          <p className="text-xs text-amber-800">
            可將目前的星等與生字存摺下載保存，或移轉至其他平板裝置使用。
          </p>
        </div>

        {/* 存摺匯入 */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col gap-2">
          <span className="font-bold text-amber-950">匯入學習進度 JSON</span>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="貼上進度 JSON 字串..."
            className="w-full h-20 p-2.5 text-xs font-mono bg-white rounded-xl border border-amber-300 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {importStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> 匯入成功！
              </span>
            )}
            {importStatus === 'error' && (
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> JSON 格式錯誤
              </span>
            )}
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 font-bold text-white text-sm shadow-sm ml-auto active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>確認匯入</span>
            </button>
          </div>
        </div>

        {/* 重置進度 */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>清除所有進度重來</span>
          </button>

          <BigButton
            variant="ghost"
            size="md"
            onClick={onClose}
            className="min-h-[44px] px-5 text-sm"
          >
            關閉視窗
          </BigButton>
        </div>
      </div>
    </div>
  );
};

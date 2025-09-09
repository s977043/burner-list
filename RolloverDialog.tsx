'use client';

import { useBurnerStore } from './useBurnerStore';
import { useState } from 'react';

interface RolloverDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RolloverDialog({ isOpen, onClose }: RolloverDialogProps) {
  const { current, startNewSession, settings } = useBurnerStore();
  const [periodType, setPeriodType] = useState<'day' | 'week'>(settings.defaultPeriod);
  const [autoDowngrade, setAutoDowngrade] = useState(settings.autoDowngradeIncomplete);

  const handleStartNewSession = () => {
    startNewSession(periodType, autoDowngrade);
    onClose();
  };

  const incompleteFrontItems = current.front.items.filter(item => item.status !== 'done');
  const incompleteBackItems = current.back.items.filter(item => item.status !== 'done');
  const totalIncomplete = incompleteFrontItems.length + incompleteBackItems.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">🔄 セッションロールオーバー</h2>
        
        <p className="text-gray-600 mb-4">
          新しい{periodType === 'day' ? 'デイリー' : 'ウィークリー'}セッションを開始する時間です！
        </p>

        {totalIncomplete > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              フロントバーナーとバックバーナーに{totalIncomplete}個の未完了項目があります。
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              セッションタイプ
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="day"
                  checked={periodType === 'day'}
                  onChange={(e) => setPeriodType(e.target.value as 'day')}
                  className="mr-2"
                />
                デイリー
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="week"
                  checked={periodType === 'week'}
                  onChange={(e) => setPeriodType(e.target.value as 'week')}
                  className="mr-2"
                />
                ウィークリー
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoDowngrade}
                onChange={(e) => setAutoDowngrade(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                未完了の項目をキッチンシンクに自動降格
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              チェックを外すと、未完了の項目は現在のバーナーに留まります
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleStartNewSession}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            新しいセッションを開始
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            後で
          </button>
        </div>
      </div>
    </div>
  );
}


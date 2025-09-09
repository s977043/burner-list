'use client';

import { useBurnerStore } from './useBurnerStore';
import { useState } from 'react';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const { settings, updateSettings, history } = useBurnerStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">⚙️ 設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">セッション設定</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  デフォルト期間タイプ
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="day"
                      checked={localSettings.defaultPeriod === 'day'}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        defaultPeriod: e.target.value as 'day'
                      })}
                      className="mr-2"
                    />
                    デイリー
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="week"
                      checked={localSettings.defaultPeriod === 'week'}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        defaultPeriod: e.target.value as 'week'
                      })}
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
                    checked={localSettings.autoDowngradeIncomplete}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      autoDowngradeIncomplete: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    ロールオーバー時に未完了の項目を自動降格
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  新しいセッションを開始する際、未完了のフロント/バック項目はキッチンシンクに移動されます
                </p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.pushEnabled}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      pushEnabled: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    プッシュ通知を有効にする（将来の機能）
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  セッションロールオーバーとタスク期限のリマインダーを受け取る
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">セッション履歴</h3>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-600 mb-2">
                完了したセッション総数: {history.length}
              </p>
              {history.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {history.slice(-5).reverse().map((session) => (
                    <div key={session.id} className="text-xs text-gray-500">
                      {new Date(session.meta.startedAt).toLocaleDateString()} - {session.meta.periodType}
                    </div>
                  ))}
                  {history.length > 5 && (
                    <div className="text-xs text-gray-400">
                      ... その他 {history.length - 5} 件
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">完了したセッションはまだありません</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">キーボードショートカット</h3>
            <div className="bg-gray-50 rounded p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">クイック追加フォーカス:</span>
                <code className="bg-gray-200 px-1 rounded">/</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">フロントバーナーフォーカス:</span>
                <code className="bg-gray-200 px-1 rounded">f</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">バックバーナーフォーカス:</span>
                <code className="bg-gray-200 px-1 rounded">b</code>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            変更を保存
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}


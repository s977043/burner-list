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
                    Daily
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
                    Weekly
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
                    Auto-downgrade incomplete items during rollover
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  When starting a new session, incomplete Front/Back items will be moved to Kitchen Sink
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
                    Enable push notifications (Future feature)
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Get reminders for session rollovers and task deadlines
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Session History</h3>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-600 mb-2">
                Total completed sessions: {history.length}
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
                      ... and {history.length - 5} more
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No completed sessions yet</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h3>
            <div className="bg-gray-50 rounded p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quick add focus:</span>
                <code className="bg-gray-200 px-1 rounded">/</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Focus Front Burner:</span>
                <code className="bg-gray-200 px-1 rounded">f</code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Focus Back Burner:</span>
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
            Save Changes
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useBurnerStore } from '@/store/useBurnerStore';
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
        <h2 className="text-xl font-bold mb-4">🔄 Session Rollover</h2>
        
        <p className="text-gray-600 mb-4">
          It&apos;s time to start a new {periodType === 'day' ? 'daily' : 'weekly'} session!
        </p>

        {totalIncomplete > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              You have {totalIncomplete} incomplete item(s) in your Front and Back burners.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
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
                Daily
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="week"
                  checked={periodType === 'week'}
                  onChange={(e) => setPeriodType(e.target.value as 'week')}
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
                checked={autoDowngrade}
                onChange={(e) => setAutoDowngrade(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Auto-downgrade incomplete items to Kitchen Sink
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, incomplete items will remain in their current burners
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleStartNewSession}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Start New Session
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}


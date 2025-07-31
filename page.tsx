'use client';

import { useBurnerStore } from '@/store/useBurnerStore';
import { checkAndHandleRollover } from '@/lib/rollover';
import FrontCard from '@/components/FrontCard';
import BackCard from '@/components/BackCard';
import SinkList from '@/components/SinkList';
import QuickAdd from '@/components/QuickAdd';
import RolloverDialog from '@/components/RolloverDialog';
import SettingsSheet from '@/components/SettingsSheet';
import { useEffect, useState } from 'react';

export default function Home() {
  const { current } = useBurnerStore();
  const [showRolloverDialog, setShowRolloverDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check for rollover on page load
    checkAndHandleRollover();
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA';
      
      if (!isInputFocused) {
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            // Focus front burner (could implement focus management)
            break;
          case 'b':
            e.preventDefault();
            // Focus back burner (could implement focus management)
            break;
          case 's':
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              setShowSettings(true);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const frontItem = current.front.items[0];
  const backItem = current.back.items[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔥 Burner List</h1>
              <p className="text-sm text-gray-500">
                {current.meta.periodType === 'day' ? 'Daily' : 'Weekly'} Session - 
                Started {new Date(current.meta.startedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowRolloverDialog(true)}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                🔄 New Session
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row - Front and Back Burners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FrontCard item={frontItem} />
          <BackCard item={backItem} />
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <QuickAdd />
        </div>

        {/* Kitchen Sink */}
        <SinkList items={current.sink.items} />
      </main>

      {/* Dialogs */}
      <RolloverDialog 
        isOpen={showRolloverDialog} 
        onClose={() => setShowRolloverDialog(false)} 
      />
      <SettingsSheet 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}


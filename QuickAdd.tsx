'use client';

import { useBurnerStore } from './useBurnerStore';
import { useState, useRef, useEffect } from 'react';

interface QuickAddProps {
  onFocus?: () => void;
}

export default function QuickAdd({ onFocus }: QuickAddProps) {
  const { addItem } = useBurnerStore();
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addItem('sink', content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setContent('');
      inputRef.current?.blur();
    }
  };

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only trigger if not in an input/textarea
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
          onFocus?.();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onFocus]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="キッチンシンクに素早く追加... ('/' でフォーカス)"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          追加
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Enterで追加、Escapeでクリア、'/'で任意の場所からフォーカス
      </p>
    </form>
  );
}


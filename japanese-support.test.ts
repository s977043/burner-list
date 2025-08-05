import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBurnerStore } from './useBurnerStore';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

describe('Japanese Language Support', () => {
  // Helper to reset the burner store using public methods
  function resetBurnerStoreForTest() {
    const state = useBurnerStore.getState();
    // Remove all items from each section
    if (state.clearItems) {
      state.clearItems('front');
      state.clearItems('back');
      state.clearItems('sink');
    } else {
      // Fallback: remove items manually if clearItems is not available
      if (state.removeItem) {
        while (state.current.front.items.length > 0) {
          state.removeItem('front', 0);
        }
        while (state.current.back.items.length > 0) {
          state.removeItem('back', 0);
        }
        while (state.current.sink.items.length > 0) {
          state.removeItem('sink', 0);
        }
      }
    }
    // Reset settings if public setter exists
    if (state.setSettings) {
      state.setSettings({
        defaultPeriod: 'day',
        autoDowngradeIncomplete: true,
        pushEnabled: false,
      });
    }
    // Reset history if public method exists
    if (state.clearHistory) {
      state.clearHistory();
    } else if (state.history && Array.isArray(state.history)) {
      state.history.length = 0;
    }
    // Reset meta if public setter exists
    if (state.setMeta) {
      state.setMeta({
        startedAt: new Date().toISOString(),
        periodType: 'day',
      });
    } else if (state.current && state.current.meta) {
      state.current.meta.startedAt = new Date().toISOString();
      state.current.meta.periodType = 'day';
    }
    // Reset session id if public setter exists
    if (state.setSessionId) {
      state.setSessionId('test-session');
    } else if (state.current && state.current.id) {
      state.current.id = 'test-session';
    }
  }

  beforeEach(() => {
    // Reset the store state before each test using public methods
    resetBurnerStoreForTest();
  });

  it('should handle Japanese text input in tasks', () => {
    const { addItem, current } = useBurnerStore.getState();
    
    const japaneseText = 'プログラミングのタスクを完了する';
    addItem('front', japaneseText);
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.front.items).toHaveLength(1);
    expect(updatedState.current.front.items[0].content).toBe(japaneseText);
  });

  it('should handle mixed Japanese and English text', () => {
    const { addItem } = useBurnerStore.getState();
    
    const mixedText = 'React コンポーネントの実装 - implement component';
    addItem('back', mixedText);
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.back.items[0].content).toBe(mixedText);
  });

  it('should handle Japanese text in subtasks', () => {
    const { addItem, addSubtask } = useBurnerStore.getState();
    
    // Add a task first
    addItem('front', 'メインタスク');
    const state = useBurnerStore.getState();
    const taskId = state.current.front.items[0].id;
    
    // Add Japanese subtask
    const subtaskText = 'サブタスク1：設計書を作成';
    addSubtask(taskId, subtaskText);
    
    const updatedState = useBurnerStore.getState();
    const subtasks = updatedState.current.front.items[0].subtasks;
    expect(subtasks).toBeDefined();
    expect(subtasks![0].content).toBe(subtaskText);
  });

  it('should preserve Japanese text when updating items', () => {
    const { addItem, updateItem } = useBurnerStore.getState();
    
    // Add item with Japanese text
    addItem('sink', '古いタスク');
    const state = useBurnerStore.getState();
    const itemId = state.current.sink.items[0].id;
    
    // Update with new Japanese text
    const newText = '新しいタスクの説明';
    updateItem('sink', itemId, { content: newText });
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.sink.items[0].content).toBe(newText);
  });

  it('should handle hiragana, katakana, and kanji characters', () => {
    const { addItem } = useBurnerStore.getState();
    
    // Test different Japanese writing systems
    const hiraganaText = 'ひらがなのテキスト';
    const katakanaText = 'カタカナノテキスト';
    const kanjiText = '漢字の文章を書く';
    
    addItem('sink', hiraganaText);
    addItem('sink', katakanaText);
    addItem('sink', kanjiText);
    
    const state = useBurnerStore.getState();
    expect(state.current.sink.items[0].content).toBe(hiraganaText);
    expect(state.current.sink.items[1].content).toBe(katakanaText);
    expect(state.current.sink.items[2].content).toBe(kanjiText);
  });

  it('should handle emoji with Japanese text', () => {
    const { addItem } = useBurnerStore.getState();
    
    const textWithEmoji = '🔥 重要なタスク 📝';
    addItem('front', textWithEmoji);
    
    const state = useBurnerStore.getState();
    expect(state.current.front.items[0].content).toBe(textWithEmoji);
  });
});
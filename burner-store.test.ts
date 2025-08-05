import { describe, it, expect, beforeEach } from 'vitest';
import { useBurnerStore } from './useBurnerStore';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

describe('BurnerStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useBurnerStore.getState()._setAppState({
      current: {
        id: 'test-session',
        meta: {
          startedAt: new Date().toISOString(),
          periodType: 'day',
        },
        front: { type: 'front', items: [] },
        back: { type: 'back', items: [] },
        sink: { type: 'sink', items: [] },
      },
      history: [],
      settings: {
        defaultPeriod: 'day',
        autoDowngradeIncomplete: true,
        pushEnabled: false,
      },
    });
  });

  it('should add item to sink', () => {
    const { addItem, current } = useBurnerStore.getState();
    
    addItem('sink', 'Test task');
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.sink.items).toHaveLength(1);
    expect(updatedState.current.sink.items[0].content).toBe('Test task');
    expect(updatedState.current.sink.items[0].status).toBe('open');
  });

  it('should promote item from sink to back', () => {
    const { addItem, promoteItem } = useBurnerStore.getState();
    
    // Add item to sink
    addItem('sink', 'Test task');
    const itemId = useBurnerStore.getState().current.sink.items[0].id;
    
    // Promote to back
    promoteItem(itemId);
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.sink.items).toHaveLength(0);
    expect(updatedState.current.back.items).toHaveLength(1);
    expect(updatedState.current.back.items[0].content).toBe('Test task');
  });

  it('should promote item from back to front and demote existing front', () => {
    const { addItem, promoteItem } = useBurnerStore.getState();
    
    // Add items to back and front
    addItem('front', 'Front task');
    addItem('back', 'Back task');
    
    const frontItemId = useBurnerStore.getState().current.front.items[0].id;
    const backItemId = useBurnerStore.getState().current.back.items[0].id;
    
    // Promote back item to front
    promoteItem(backItemId);
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.front.items).toHaveLength(1);
    expect(updatedState.current.front.items[0].content).toBe('Back task');
    expect(updatedState.current.back.items).toHaveLength(1);
    expect(updatedState.current.back.items[0].content).toBe('Front task');
    expect(updatedState.current.back.items[0].status).toBe('dropped');
  });

  it('should update item status', () => {
    const { addItem, updateItem } = useBurnerStore.getState();
    
    addItem('sink', 'Test task');
    const itemId = useBurnerStore.getState().current.sink.items[0].id;
    
    updateItem('sink', itemId, { status: 'done' });
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.sink.items[0].status).toBe('done');
  });

  it('should delete item', () => {
    const { addItem, deleteItem } = useBurnerStore.getState();
    
    addItem('sink', 'Test task');
    const itemId = useBurnerStore.getState().current.sink.items[0].id;
    
    deleteItem('sink', itemId);
    
    const updatedState = useBurnerStore.getState();
    expect(updatedState.current.sink.items).toHaveLength(0);
  });

  it('should start new session with auto-downgrade', () => {
    const { addItem, startNewSession } = useBurnerStore.getState();
    
    // Add items to front and back
    addItem('front', 'Front task');
    addItem('back', 'Back task');
    addItem('sink', 'Sink task');
    
    const currentSessionId = useBurnerStore.getState().current.id;
    
    // Start new session with auto-downgrade
    startNewSession('week', true);
    
    const updatedState = useBurnerStore.getState();
    
    // Check that old session is in history
    expect(updatedState.history).toHaveLength(1);
    expect(updatedState.history[0].id).toBe(currentSessionId);
    
    // Check that new session has empty front and back
    expect(updatedState.current.front.items).toHaveLength(0);
    expect(updatedState.current.back.items).toHaveLength(0);
    
    // Check that all items are in sink with dropped status
    expect(updatedState.current.sink.items).toHaveLength(3);
    expect(updatedState.current.sink.items.every(item => item.status === 'dropped')).toBe(true);
    
    // Check session meta
    expect(updatedState.current.meta.periodType).toBe('week');
  });
});


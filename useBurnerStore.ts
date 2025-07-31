import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, BurnerSession, BurnerItem, BurnerSlotType, Subtask } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialBurnerSession: BurnerSession = {
  id: uuidv4(),
  meta: {
    startedAt: new Date().toISOString(),
    periodType: 'day',
  },
  front: { type: 'front', items: [] },
  back: { type: 'back', items: [] },
  sink: { type: 'sink', items: [] },
};

const initialAppState: AppState = {
  current: initialBurnerSession,
  history: [],
  settings: {
    defaultPeriod: 'day',
    autoDowngradeIncomplete: true,
    pushEnabled: false,
  },
};

interface BurnerStore extends AppState {
  // Actions
  addItem: (slotType: BurnerSlotType, content: string, subtasks?: string[]) => void;
  updateItem: (slotType: BurnerSlotType, itemId: string, updates: Partial<BurnerItem>) => void;
  deleteItem: (slotType: BurnerSlotType, itemId: string) => void;
  moveItem: (fromSlot: BurnerSlotType, toSlot: BurnerSlotType, itemId: string) => void;
  promoteItem: (itemId: string) => void; // Sink -> Back -> Front
  demoteItem: (itemId: string) => void; // Front -> Back -> Sink
  toggleSubtaskStatus: (itemId: string, subtaskId: string) => void;
  addSubtask: (itemId: string, content: string) => void;
  startNewSession: (periodType: 'day' | 'week', autoDowngrade: boolean) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  // Helper for rollover
  _setAppState: (newState: AppState) => void;
}

export const useBurnerStore = create<BurnerStore>()(
  persist(
    (set, get) => ({
      ...initialAppState,

      addItem: (slotType, content, subtasks) => {
        const newItem: BurnerItem = {
          id: uuidv4(),
          content,
          status: 'open',
          subtasks: subtasks?.map(sub => ({ id: uuidv4(), content: sub, status: 'open' })) || [],
        };
        set((state) => ({
          current: {
            ...state.current,
            [slotType]: {
              ...state.current[slotType],
              items: [...state.current[slotType].items, newItem],
            },
          },
        }));
      },

      updateItem: (slotType, itemId, updates) => {
        set((state) => ({
          current: {
            ...state.current,
            [slotType]: {
              ...state.current[slotType],
              items: state.current[slotType].items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            },
          },
        }));
      },

      deleteItem: (slotType, itemId) => {
        set((state) => ({
          current: {
            ...state.current,
            [slotType]: {
              ...state.current[slotType],
              items: state.current[slotType].items.filter((item) => item.id !== itemId),
            },
          },
        }));
      },

      moveItem: (fromSlot, toSlot, itemId) => {
        set((state) => {
          const itemToMove = state.current[fromSlot].items.find((item) => item.id === itemId);
          if (!itemToMove) return state;

          const newFromItems = state.current[fromSlot].items.filter((item) => item.id !== itemId);
          const newToItems = [...state.current[toSlot].items, itemToMove];

          return {
            current: {
              ...state.current,
              [fromSlot]: { ...state.current[fromSlot], items: newFromItems },
              [toSlot]: { ...state.current[toSlot], items: newToItems },
            },
          };
        });
      },

      promoteItem: (itemId) => {
        set((state) => {
          let currentSlot: BurnerSlotType | undefined;
          let itemToPromote: BurnerItem | undefined;

          if (state.current.sink.items.some(item => item.id === itemId)) {
            currentSlot = 'sink';
            itemToPromote = state.current.sink.items.find(item => item.id === itemId);
          } else if (state.current.back.items.some(item => item.id === itemId)) {
            currentSlot = 'back';
            itemToPromote = state.current.back.items.find(item => item.id === itemId);
          } else if (state.current.front.items.some(item => item.id === itemId)) {
            currentSlot = 'front';
            itemToPromote = state.current.front.items.find(item => item.id === itemId);
          }

          if (!itemToPromote || !currentSlot) return state;

          let newFrontItems = [...state.current.front.items];
          let newBackItems = [...state.current.back.items];
          let newSinkItems = [...state.current.sink.items];

          if (currentSlot === 'sink') {
            newSinkItems = newSinkItems.filter(item => item.id !== itemId);
            newBackItems = [...newBackItems, itemToPromote];
          } else if (currentSlot === 'back') {
            newBackItems = newBackItems.filter(item => item.id !== itemId);
            newFrontItems = [...newFrontItems, itemToPromote];
            // If promoting to front and front already has an item, demote existing front to back
            if (newFrontItems.length > 1) {
              const existingFront = newFrontItems.find(item => item.id !== itemId);
              if (existingFront) {
                newFrontItems = newFrontItems.filter(item => item.id !== existingFront.id);
                newBackItems = [...newBackItems, { ...existingFront, status: 'dropped' }]; // Mark as dropped
              }
            }
          } else if (currentSlot === 'front') {
            // Already in front, no promotion possible
            return state;
          }

          return {
            current: {
              ...state.current,
              front: { ...state.current.front, items: newFrontItems },
              back: { ...state.current.back, items: newBackItems },
              sink: { ...state.current.sink, items: newSinkItems },
            },
          };
        });
      },

      demoteItem: (itemId) => {
        set((state) => {
          let currentSlot: BurnerSlotType | undefined;
          let itemToDemote: BurnerItem | undefined;

          if (state.current.front.items.some(item => item.id === itemId)) {
            currentSlot = 'front';
            itemToDemote = state.current.front.items.find(item => item.id === itemId);
          } else if (state.current.back.items.some(item => item.id === itemId)) {
            currentSlot = 'back';
            itemToDemote = state.current.back.items.find(item => item.id === itemId);
          } else if (state.current.sink.items.some(item => item.id === itemId)) {
            currentSlot = 'sink';
            itemToDemote = state.current.sink.items.find(item => item.id === itemId);
          }

          if (!itemToDemote || !currentSlot) return state;

          let newFrontItems = [...state.current.front.items];
          let newBackItems = [...state.current.back.items];
          let newSinkItems = [...state.current.sink.items];

          if (currentSlot === 'front') {
            newFrontItems = newFrontItems.filter(item => item.id !== itemId);
            newBackItems = [...newBackItems, { ...itemToDemote, status: 'dropped' }]; // Mark as dropped
          } else if (currentSlot === 'back') {
            newBackItems = newBackItems.filter(item => item.id !== itemId);
            newSinkItems = [...newSinkItems, { ...itemToDemote, status: 'dropped' }]; // Mark as dropped
          } else if (currentSlot === 'sink') {
            // Already in sink, no demotion possible
            return state;
          }

          return {
            current: {
              ...state.current,
              front: { ...state.current.front, items: newFrontItems },
              back: { ...state.current.back, items: newBackItems },
              sink: { ...state.current.sink, items: newSinkItems },
            },
          };
        });
      },

      toggleSubtaskStatus: (itemId, subtaskId) => {
        set((state) => ({
          current: {
            ...state.current,
            front: {
              ...state.current.front,
              items: state.current.front.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      subtasks: item.subtasks?.map((subtask) =>
                        subtask.id === subtaskId
                          ? { ...subtask, status: subtask.status === 'open' ? 'done' : 'open' }
                          : subtask
                      ),
                    }
                  : item
              ),
            },
            back: {
              ...state.current.back,
              items: state.current.back.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      subtasks: item.subtasks?.map((subtask) =>
                        subtask.id === subtaskId
                          ? { ...subtask, status: subtask.status === 'open' ? 'done' : 'open' }
                          : subtask
                      ),
                    }
                  : item
              ),
            },
          },
        }));
      },

      addSubtask: (itemId, content) => {
        set((state) => {
          const newSubtask: Subtask = { id: uuidv4(), content, status: 'open' };
          const updateSlot = (slot: BurnerSlotType) =>
            state.current[slot].items.map((item) =>
              item.id === itemId
                ? { ...item, subtasks: [...(item.subtasks || []), newSubtask] }
                : item
            );

          return {
            current: {
              ...state.current,
              front: { ...state.current.front, items: updateSlot('front') },
              back: { ...state.current.back, items: updateSlot('back') },
            },
          };
        });
      },

      startNewSession: (periodType, autoDowngrade) => {
        const currentSession = get().current;
        const history = get().history;
        const settings = get().settings;

        // Move current session to history
        const updatedHistory = [...history, currentSession];

        // Create new session based on settings and autoDowngrade
        const newFrontItems = autoDowngrade ? [] : currentSession.front.items;
        const newBackItems = autoDowngrade ? [] : currentSession.back.items;
        const newSinkItems = autoDowngrade
          ? [...currentSession.front.items, ...currentSession.back.items, ...currentSession.sink.items].map(item => ({...item, status: 'dropped' as const}))
          : currentSession.sink.items;

        const newSession: BurnerSession = {
          id: uuidv4(),
          meta: {
            startedAt: new Date().toISOString(),
            periodType: periodType,
          },
          front: { type: 'front', items: newFrontItems },
          back: { type: 'back', items: newBackItems },
          sink: { type: 'sink', items: newSinkItems },
        };

        set({
          current: newSession,
          history: updatedHistory,
          settings: { ...settings, defaultPeriod: periodType, autoDowngradeIncomplete: autoDowngrade },
        });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      _setAppState: (newState) => set(newState),
    }),
    {
      name: 'burner-list-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);


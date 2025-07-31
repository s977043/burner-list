export type BurnerSlotType = "front" | "back" | "sink";

export interface Subtask {
  id: string;
  content: string;
  status: "open" | "done";
}

export interface BurnerItem {
  id: string;
  content: string;
  status: "open" | "done" | "snoozed" | "dropped";
  dueAt?: string;
  subtasks?: Subtask[];
}

export interface BurnerSlot {
  type: BurnerSlotType;
  title?: string;
  notes?: string;
  items: BurnerItem[];
}

export interface SessionMeta {
  startedAt: string;
  periodType: "day" | "week";
  label?: string;
  reflection?: string;
}

export interface BurnerSession {
  id: string;
  meta: SessionMeta;
  front: BurnerSlot;
  back: BurnerSlot;
  sink: BurnerSlot;
}

export interface AppState {
  current: BurnerSession;
  history: BurnerSession[];
  settings: {
    defaultPeriod: "day" | "week";
    autoDowngradeIncomplete: boolean;
    pushEnabled: boolean;
  };
}


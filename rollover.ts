import { useBurnerStore } from "@/store/useBurnerStore";

export const checkAndHandleRollover = () => {
  const { current, startNewSession, settings } = useBurnerStore.getState();
  const lastStartedAt = new Date(current.meta.startedAt);
  const now = new Date();

  let shouldRollover = false;

  if (settings.defaultPeriod === "day") {
    if (now.getDate() !== lastStartedAt.getDate() ||
        now.getMonth() !== lastStartedAt.getMonth() ||
        now.getFullYear() !== lastStartedAt.getFullYear()) {
      shouldRollover = true;
    }
  } else if (settings.defaultPeriod === "week") {
    const getWeek = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      // Sunday in current week decides the year. 
      d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
      // January 4 is always in week 1. 
      const week1 = new Date(d.getFullYear(), 0, 4);
      // Adjust to Sunday in week 1 and count number of weeks from date to week1. 
      return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 -
                             3 + (week1.getDay() + 6) % 7) / 7);
    };
    if (getWeek(now) !== getWeek(lastStartedAt) ||
        now.getFullYear() !== lastStartedAt.getFullYear()) {
      shouldRollover = true;
    }
  }

  if (shouldRollover) {
    // In a real app, you might show a modal here to confirm rollover options
    // For PoC, we'll just trigger it with default settings
    console.log("Performing automatic rollover...");
    startNewSession(settings.defaultPeriod, settings.autoDowngradeIncomplete);
  }
};



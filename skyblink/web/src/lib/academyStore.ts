import { emptyProgress, type Progress } from "./academy";

const KEY = "skyblink.academy.v1";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Progress;
    return {
      xp: parsed.xp ?? 0,
      completed: parsed.completed ?? [],
      streak: parsed.streak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      cases: parsed.cases ?? [],
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress) {
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}

"use client";

import { useEffect, useState } from "react";
import { emptyProgress, type Progress } from "./academy";
import { loadProgress, saveProgress } from "./academyStore";

export function useAcademy() {
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  const update = (next: Progress) => {
    setProgress(next);
    saveProgress(next);
  };

  return { progress, ready, update };
}

"use client";

import { useEffect, useRef } from "react";
import { buildFrames, type Scenario } from "@/lib/proceduralSky";

export default function SkyThumb({ fieldId, candidateId, scenario }: { fieldId: string; candidateId: string; scenario: Scenario }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const frames = buildFrames(fieldId, candidateId, scenario);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(frames.epochA, 0, 0, canvas.width, canvas.height);
  }, [fieldId, candidateId, scenario]);

  return <canvas ref={ref} width={320} height={180} className="h-36 w-full rounded-xl bg-black object-cover" aria-hidden />;
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, Maximize } from "lucide-react";
import { buildFrames, type Scenario } from "@/lib/proceduralSky";

interface InteractiveCanvasProps {
  fieldId: string;
  candidateId?: string | null;
  mode: "blink" | "swipe" | "difference";
  scenario?: Scenario;
  frameClassName?: string;
}

type Frame = CanvasImageSource | null;

function tileIsUnusable(img: HTMLImageElement) {
  const sample = document.createElement("canvas");
  sample.width = img.width;
  sample.height = img.height;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  if (!ctx || img.width < 8) return true;
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data;
  let brightCols = 0;
  let blackCols = 0;
  let sampled = 0;
  for (let x = 0; x < sample.width; x += 2) {
    let sum = 0;
    let count = 0;
    for (let y = 0; y < sample.height; y += 4) {
      sum += pixels[(y * sample.width + x) * 4];
      count += 1;
    }
    const mean = sum / count;
    sampled += 1;
    if (mean > 80) brightCols += 1;
    if (mean < 8) blackCols += 1;
  }
  const blackShare = blackCols / sampled;
  const brightShare = brightCols / sampled;
  return blackShare > 0.85 || (brightShare > 0.08 && blackShare > 0.25);
}

export default function InteractiveCanvas({ fieldId, candidateId, mode, scenario = "mover", frameClassName = "h-[560px] rounded-3xl" }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [swipeRatio, setSwipeRatio] = useState(0.5);
  const [blinkOn, setBlinkOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [blinkSpeed, setBlinkSpeed] = useState(500);
  const [imgA, setImgA] = useState<Frame>(null);
  const [imgB, setImgB] = useState<Frame>(null);
  const [imgDiff, setImgDiff] = useState<Frame>(null);
  const [source, setSource] = useState<"illustrative" | "pipeline">("illustrative");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setIsPlaying(false);
  }, []);

  useEffect(() => {
    const built = buildFrames(fieldId, candidateId || fieldId, scenario);
    setImgA(built.epochA);
    setImgB(built.epochB);
    setImgDiff(built.diff);
    setSource("illustrative");

    if (!candidateId) return;
    let alive = true;
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(src));
        img.src = src;
      });

    Promise.all([
      load(`/data/tiles/${fieldId}/${candidateId}/epoch_a.png`),
      load(`/data/tiles/${fieldId}/${candidateId}/epoch_b.png`),
      load(`/data/tiles/${fieldId}/${candidateId}/diff.png`),
    ])
      .then(([epochA, epochB, diff]) => {
        if (!alive) return;
        if ([epochA, epochB, diff].some(tileIsUnusable)) return;
        setImgA(epochA);
        setImgB(epochB);
        setImgDiff(diff);
        setSource("pipeline");
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, [fieldId, candidateId, scenario]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setBlinkOn((prev) => !prev), blinkSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, blinkSpeed]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const renderImg = (img: Frame, clipRatio?: number) => {
      if (!img) return;
      if (clipRatio !== undefined) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width * clipRatio, canvas.height);
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    if (mode === "blink") {
      renderImg(blinkOn ? imgA : imgB);
    } else if (mode === "swipe") {
      renderImg(imgB);
      if (imgA) {
        renderImg(imgA, swipeRatio);
        ctx.fillStyle = "#f0b429";
        ctx.fillRect(canvas.width * swipeRatio - 2 / zoom, 0, 4 / zoom, canvas.height);
      }
    } else {
      renderImg(imgDiff);
    }

    ctx.restore();
  };

  useEffect(() => {
    let req = 0;
    const loop = () => {
      draw();
      req = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(req);
  });

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const newZoom = Math.min(Math.max(0.4, zoom * factor), 8);
    setOffset({
      x: mouseX - (mouseX - offset.x) * (newZoom / zoom),
      y: mouseY - (mouseY - offset.y) * (newZoom / zoom),
    });
    setZoom(newZoom);
  };

  return (
    <div className={`relative w-full overflow-hidden bg-black ring-1 ring-white/10 select-none ${frameClassName}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={560}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={(event) => {
          setIsDragging(true);
          setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
        }}
        onMouseMove={(event) => {
          if (isDragging) setOffset({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      />

      <div className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs text-[#f4f0e6] backdrop-blur">
        {mode === "blink" ? (blinkOn ? "Night 1" : "Night 2") : mode === "difference" ? "Orange left · blue arrived" : "Swipe between nights"}
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-2 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="rounded-full px-3 py-1.5 text-xs text-[#f4f0e6] hover:bg-white/10"
          aria-label="Reset view"
        >
          <Maximize size={14} />
        </button>
        {mode === "blink" && (
          <>
            <button type="button" onClick={() => setIsPlaying((value) => !value)} className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-4 py-1.5 text-xs font-semibold text-[#1a1408]" aria-label={isPlaying ? "Pause blink" : "Play blink"}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <input
              aria-label="Blink speed"
              type="range"
              min={100}
              max={1000}
              value={1100 - blinkSpeed}
              onChange={(event) => setBlinkSpeed(1100 - parseInt(event.target.value, 10))}
              className="w-20 accent-amber-300"
            />
          </>
        )}
        {mode === "swipe" && (
          <input
            aria-label="Swipe position"
            type="range"
            min={0}
            max={100}
            value={swipeRatio * 100}
            onChange={(event) => setSwipeRatio(parseInt(event.target.value, 10) / 100)}
            className="w-28 accent-amber-300"
          />
        )}
        <span className="pr-2 text-[11px] text-[#c9c2b0]">{source === "pipeline" ? "Pipeline tile" : "Simulated"}</span>
      </div>
    </div>
  );
}

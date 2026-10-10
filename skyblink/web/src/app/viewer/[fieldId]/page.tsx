"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InteractiveCanvas from "@/components/InteractiveCanvas";
import SpectrumView from "@/components/SpectrumView";
import { awardCase } from "@/lib/academy";
import { loadProgress, saveProgress } from "@/lib/academyStore";
import { scenarioFor, STORIES, storyById } from "@/lib/catalog";

type Candidate = {
  id: string;
  snr: number;
  p_local: number;
  p_trials_adjusted?: number;
  band_um: number;
  sharpness: number;
  type_label: string;
  dipole_separation_arcsec?: number;
  crossmatch?: { id: string | null; catalog?: string | null };
};

const FIELDS = [
  { id: "F_MOVER", name: "Mover" },
  { id: "F_COMET", name: "Comet" },
  { id: "F_VAR", name: "Variable" },
  { id: "F_DENSE", name: "Crowded" },
  { id: "F_ONE", name: "One pass" },
];

function verdict(candidate: Candidate) {
  if (candidate.sharpness > 0.95) {
    return "Shape test failed. Treat this as a particle hit until another pass shows the same source.";
  }
  if (candidate.crossmatch?.id) {
    return `Catalog match ${candidate.crossmatch.id}. A known object is a recovery, not a new planet.`;
  }
  const separation = candidate.dipole_separation_arcsec;
  if (separation && separation > 5) {
    return `Unnamed pair at ${candidate.band_um} µm. Separation ${separation.toFixed(0)} arcsec, so blink it as motion. It is not identified.`;
  }
  return "Candidate passed the first filters and still has no catalog name.";
}

export default function Viewer({ params }: { params: Promise<{ fieldId: string }> }) {
  const { fieldId } = React.use(params);
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"blink" | "swipe" | "difference">((searchParams.get("mode") as "blink") || "blink");
  const [viewMode, setViewMode] = useState<"explorer" | "detective">((searchParams.get("viewMode") as "explorer") || "explorer");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(searchParams.get("candidate"));
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteNote, setVoteNote] = useState("");

  const story = storyById(searchParams.get("story"));
  const scenario = scenarioFor(fieldId, story?.id);

  useEffect(() => {
    fetch(`/data/candidates/${fieldId}.json`)
      .then((response) => response.json())
      .then((data: Candidate[]) => setCandidates(data))
      .catch(() => setCandidates([]));
  }, [fieldId]);

  useEffect(() => {
    if (selectedCandidate || candidates.length === 0 || fieldId === "F_ONE") return;
    const top = [...candidates].sort((a, b) => b.snr - a.snr)[0];
    setSelectedCandidate(top.id);
  }, [candidates, selectedCandidate, fieldId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    url.searchParams.set("viewMode", viewMode);
    if (selectedCandidate) url.searchParams.set("candidate", selectedCandidate);
    else url.searchParams.delete("candidate");
    window.history.replaceState({}, "", url.toString());
  }, [mode, viewMode, selectedCandidate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "j" || event.key === "k") {
        if (candidates.length === 0) return;
        const index = candidates.findIndex((candidate) => candidate.id === selectedCandidate);
        const next = event.key === "j" ? (Math.max(index, 0) + 1) % candidates.length : (index - 1 + candidates.length) % candidates.length;
        setSelectedCandidate(candidates[next].id);
        setViewMode("detective");
      } else if (event.key === "a") {
        setMode("blink");
      } else if (event.key === "d") {
        setMode("difference");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [candidates, selectedCandidate]);

  const ranked = useMemo(() => [...candidates].sort((a, b) => b.snr - a.snr), [candidates]);
  const active = ranked.find((candidate) => candidate.id === selectedCandidate);
  const isOnePass = fieldId === "F_ONE";

  const castVote = async (vote: "real" | "fake") => {
    if (!selectedCandidate) return;
    const before = loadProgress();
    const next = awardCase(before, selectedCandidate);
    saveProgress(next);
    const gained = next.xp - before.xp;
    setVoteNote(gained ? `Marked ${vote}. Case filed in the Academy (+${gained} XP).` : `Marked ${vote}. This case was already filed.`);
    try {
      const response = await fetch("http://localhost:8000/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: selectedCandidate, vote }),
        signal: AbortSignal.timeout(800),
      });
      if (response.ok) {
        setVoteNote(gained ? `Marked ${vote}. API stored it. Academy +${gained} XP.` : `Marked ${vote}. API stored it. Case was already filed.`);
      }
    } catch {
      // The academy already has the case. The API is optional in the demo.
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 text-white">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#9c9586]">Viewer: {fieldId}</p>
          <h1 className="mt-1 text-5xl text-white">{story ? story.title : "This patch of sky"}</h1>
          <p className="mt-2 text-sm text-[#b7b09e]">
            {active ? `${active.band_um} µm, two nights` : "Waiting for a candidate"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-full bg-white/10 p-1">
            <button type="button" onClick={() => setViewMode("explorer")} className={`rounded-full px-3 py-1.5 text-sm ${viewMode === "explorer" ? "bg-amber-300 text-[#1a1408]" : ""}`}>Explorer</button>
            <button type="button" onClick={() => setViewMode("detective")} className={`rounded-full px-3 py-1.5 text-sm ${viewMode === "detective" ? "bg-white text-[#1a1408]" : ""}`}>Detective</button>
          </div>
          <div className="flex rounded-full bg-white/10 p-1">
            {(["blink", "swipe", "difference"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full px-3 py-1.5 text-sm ${mode === item ? "bg-[#f4f0e6] text-[#1a1408]" : ""}`}>
                {item === "difference" ? "Difference" : item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {FIELDS.map((field) => (
          <Link key={field.id} href={`/viewer/${field.id}?mode=blink&viewMode=explorer`} className={`rounded-full px-3 py-1 ${field.id === fieldId ? "bg-[#f4f0e6] text-[#1a1408]" : "text-[#d4cdb8] ring-1 ring-white/15"}`}>
            {field.name}
          </Link>
        ))}
      </div>

      <div className={`grid gap-4 ${viewMode === "detective" ? "lg:grid-cols-[1fr_22rem]" : ""}`}>
        <div>
          {isOnePass ? (
            <div className="flex h-[560px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-2xl font-bold text-slate-200">Not enough epochs yet</h2>
              <p className="mt-2 text-slate-500">This field has only been scanned once. A blink needs a second pass.</p>
            </div>
          ) : (
            <InteractiveCanvas fieldId={fieldId} candidateId={selectedCandidate} mode={mode} scenario={scenario} />
          )}
          {viewMode === "explorer" && !isOnePass && (
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {story?.lesson ?? "Press play to flip the two passes. Switch to Difference to see light that left in amber and light that arrived in cyan."}
            </p>
          )}
        </div>

        {viewMode === "detective" && (
          <aside className="flex max-h-[760px] flex-col rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 p-4">
              <h2 className="text-xl font-bold text-violet-300">Detective Mode</h2>
              <p className="text-sm text-slate-400">Highest signal-to-noise first. Measurements are pipeline JSON.</p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {ranked.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedCandidate(candidate.id)}
                  className={`w-full rounded-lg border p-3 text-left ${selectedCandidate === candidate.id ? "border-violet-400 bg-violet-500/10" : "border-white/10"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{candidate.id}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{candidate.snr.toFixed(1)} SNR</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">p_local: {candidate.p_local.toExponential(2)}</p>
                </button>
              ))}
            </div>
            {active && (
              <div className="border-t border-white/10 p-4">
                <h3 className="font-bold">Details: {active.id}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{verdict(active)}</p>
                <div className="mt-2 space-y-1 text-sm text-slate-400">
                  <p><strong className="text-slate-200">Type label:</strong> {active.type_label}</p>
                  <p>
                    <strong className="text-slate-200">Particle hit check:</strong>{" "}
                    <span className={active.sharpness > 0.95 ? "text-red-300" : "text-emerald-300"}>
                      {active.sharpness > 0.95 ? "FAILED (Cosmic Ray)" : "PASSED (Not a cosmic ray)"}
                    </span>
                  </p>
                  <p><strong className="text-slate-200">Cross-Match:</strong> {active.crossmatch?.id || "None (Unknown object)"}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => castVote("real")} className="flex-1 rounded bg-emerald-700 py-2 text-sm font-bold">Mark Real</button>
                  <button type="button" onClick={() => castVote("fake")} className="flex-1 rounded bg-red-800 py-2 text-sm font-bold">Mark Fake</button>
                </div>
                {voteNote && <p className="mt-2 text-xs text-amber-200">{voteNote}</p>}
                <SpectrumView candidateId={active.id} />
              </div>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}

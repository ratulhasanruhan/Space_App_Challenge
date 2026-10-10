"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Validation = {
  simulated?: boolean;
  injection_recovery?: {
    curve?: { flux: number; fraction: number }[];
    bright_recovered?: number;
    bright_total?: number;
  };
  false_positive_audit?: { trials?: number; avg_fp_found?: number; avg_fp_expected?: number };
  known_object_recovery?: { total?: number; recovered?: number };
};

export default function Limits() {
  const [data, setData] = useState<Validation | null>(null);

  useEffect(() => {
    fetch("/data/validation.json")
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const curve = (data?.injection_recovery?.curve ?? []).map((point) => ({
    flux: point.flux,
    percent: Math.round(point.fraction * 100),
  }));
  const bright = data?.injection_recovery;
  const fp = data?.false_positive_audit;
  const known = data?.known_object_recovery;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Simulated validation</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Proof and limits</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Plant sources, count how many come back, and count false alarms in pure noise. These figures describe the synthetic pipeline, not a search of the real sky.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Bright injections recovered" value={bright ? `${bright.bright_recovered}/${bright.bright_total}` : "…"} />
        <Stat label="False positives per noise field" value={fp ? `${fp.avg_fp_found} found · ${fp.avg_fp_expected} expected` : "…"} />
        <Stat label="Known objects recovered" value={known ? `${known.recovered} of ${known.total}` : "…"} />
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Injection recovery</h2>
        <p className="mt-1 text-sm text-slate-400">Fraction recovered against planted flux. Faint sources fall off the curve. That is the depth limit.</p>
        <div className="mt-4 h-72">
          {curve.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="flux" stroke="#94a3b8" label={{ value: "Flux", position: "insideBottom", offset: -2, fill: "#94a3b8" }} />
                <YAxis stroke="#94a3b8" domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#fff" }} />
                <Line type="monotone" dataKey="percent" stroke="#f0b429" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500">Recovery curve not loaded.</p>
          )}
        </div>
      </section>

      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-400">
        <li>A distant Planet X is much too faint for one SPHEREx exposure. The physics lab is the calculator for that sentence.</li>
        <li>Band matching throws away frames whose wavelength misses the tolerance. Fewer frames is the price of an honest blink.</li>
        <li>Known-object recovery is partial on this synthetic set. Partial is a number we show, not a number we round up.</li>
      </ul>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}

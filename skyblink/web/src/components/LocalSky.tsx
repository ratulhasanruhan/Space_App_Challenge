"use client";

import { useState } from "react";

export default function LocalSky() {
  const [latitude, setLatitude] = useState(23.8);
  const [note, setNote] = useState("Set a latitude, or use this device.");

  const ask = () => {
    if (!navigator.geolocation) {
      setNote("This browser has no location API. Move the slider.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setNote("Latitude from this device. Declination of the zenith tracks that number.");
      },
      () => setNote("Location stayed off. The slider still works."),
      { enableHighAccuracy: false, timeout: 4000 },
    );
  };

  const band = latitude > 50 ? "a northern sky, circumpolar stars included" : latitude < -50 ? "a deep southern sky" : "a sky where the equator and the ecliptic both pass overhead at some hour";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-cyan-300">Local zenith</p>
      <h2 className="mt-1 text-xl font-semibold">What passes overhead</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Zenith declination is about your latitude. These demo fields are fixed simulated pointings, not a live planetarium.
      </p>
      <p className="mt-4 font-mono text-3xl text-white">{latitude.toFixed(1)}°</p>
      <p className="text-sm text-slate-300">Objects near declination {latitude.toFixed(0)}° cross the zenith. Tonight that is {band}.</p>
      <input
        aria-label="Latitude"
        className="mt-4 w-full accent-cyan-300"
        type="range"
        min={-80}
        max={80}
        step={0.1}
        value={latitude}
        onChange={(event) => {
          setLatitude(Number(event.target.value));
          setNote("Latitude set by hand.");
        }}
      />
      <button type="button" onClick={ask} className="mt-3 rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">
        Use my latitude
      </button>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </section>
  );
}

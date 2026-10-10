"use client";

import { useMemo, useState } from "react";
import { dimming, diatomicVibration, parallax, wienPeak } from "@/lib/physics";

const CO_K = 1857;
const OXYGEN = 15.9949;

export function IsotopePanel() {
  const [carbon, setCarbon] = useState(12);
  const wavelength = useMemo(() => {
    const wavenumber = diatomicVibration(CO_K, carbon, OXYGEN);
    return 10000 / wavenumber;
  }, [carbon]);
  const common = 4.664;
  const shift = wavelength - common;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-violet-300">P3 · quantum spectroscopy</p>
      <h2 className="mt-1 text-xl font-semibold">Isotope shift in CO</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Heavier carbon vibrates more slowly, so the band moves to a longer wavelength. Spring constant {CO_K} N/m, oxygen fixed at {OXYGEN} u.
      </p>
      <label className="mt-4 block text-sm text-slate-300">
        Carbon mass {carbon.toFixed(2)} u
        <input
          className="mt-2 w-full accent-violet-400"
          type="range"
          min={12}
          max={13.003}
          step={0.01}
          value={carbon}
          onChange={(event) => setCarbon(Number(event.target.value))}
        />
      </label>
      <p className="mt-4 font-mono text-3xl text-white">{wavelength.toFixed(3)} µm</p>
      <p className="text-sm text-slate-400">
        Shift from 12C16O: {shift >= 0 ? "+" : ""}
        {(shift * 1000).toFixed(1)} nm
      </p>
    </section>
  );
}

export function NuclearPanel() {
  const [mass, setMass] = useState(20);
  const zone =
    mass < 13 ? "Planet. No sustained fusion." : mass < 65 ? "Brown dwarf. Deuterium can burn." : mass < 80 ? "Brown dwarf. Lithium can burn." : "Star. Hydrogen fusion is sustained.";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-amber-300">P4 · nuclear mass threshold</p>
      <h2 className="mt-1 text-xl font-semibold">What is allowed to burn</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        The boundaries used here are 13, 65, and 80 Jupiter masses. A name follows the physics, not the other way around.
      </p>
      <label className="mt-4 block text-sm text-slate-300">
        Mass {mass.toFixed(0)} M<sub>Jup</sub>
        <input
          className="mt-2 w-full accent-amber-400"
          type="range"
          min={1}
          max={100}
          step={1}
          value={mass}
          onChange={(event) => setMass(Number(event.target.value))}
        />
      </label>
      <p className="mt-4 text-lg text-white">{zone}</p>
    </section>
  );
}

export function PlanetXPanel() {
  const [distance, setDistance] = useState(500);
  const factor = dimming(30, distance);
  const shift = parallax(distance);
  const unlikely = factor > 1000;

  return (
    <section className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
      <p className="text-xs uppercase tracking-widest text-amber-200">Planet X detectability</p>
      <h2 className="mt-1 text-xl font-semibold">Reflected light falls as 1/r⁴</h2>
      <p className="mt-2 text-sm leading-6 text-amber-50/80">
        Compared with a body at 30 AU. Sensitivities here are teaching values, not a flight-performance quote.
      </p>
      <label className="mt-4 block text-sm">
        Distance {distance.toFixed(0)} AU
        <input
          className="mt-2 w-full accent-amber-300"
          type="range"
          min={30}
          max={1000}
          step={10}
          value={distance}
          onChange={(event) => setDistance(Number(event.target.value))}
        />
      </label>
      <p className="mt-4 font-mono text-3xl">{factor.toLocaleString(undefined, { maximumFractionDigits: 0 })}× fainter</p>
      <p className="text-sm text-amber-50/80">Parallax scale at this distance: {shift.toFixed(0)} arcsec.</p>
      <p className={`mt-4 rounded-xl px-3 py-2 text-sm font-semibold ${unlikely ? "bg-slate-950 text-amber-200" : "bg-white/10"}`}>
        {unlikely
          ? "Not a detection. A single SPHEREx exposure is the wrong net for a body this faint."
          : "Closer in, reflected light is less hopeless. It is still not a discovery."}
      </p>
    </section>
  );
}

export function WienPanel() {
  const [temperature, setTemperature] = useState(40);
  const peak = wienPeak(temperature);
  const inBand = peak >= 0.75 && peak <= 5;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-widest text-cyan-300">Wien’s law</p>
      <h2 className="mt-1 text-xl font-semibold">Where a cold body actually glows</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Peak wavelength is 2898 / T(K). SPHEREx’s near-infrared window is about 0.75–5 µm. A 40 K body peaks near 72 µm.
      </p>
      <label className="mt-4 block text-sm text-slate-300">
        Temperature {temperature.toFixed(0)} K
        <input
          className="mt-2 w-full accent-cyan-300"
          type="range"
          min={20}
          max={2000}
          step={10}
          value={temperature}
          onChange={(event) => setTemperature(Number(event.target.value))}
        />
      </label>
      <p className="mt-4 font-mono text-3xl text-white">{peak.toFixed(2)} µm</p>
      <p className="text-sm text-slate-400">
        {inBand ? "This peak sits inside a near-infrared survey." : "This peak sits outside SPHEREx’s near-infrared window."}
      </p>
    </section>
  );
}

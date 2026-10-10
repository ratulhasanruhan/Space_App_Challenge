import { IsotopePanel, NuclearPanel, PlanetXPanel, WienPanel } from "@/components/PhysicsLab";

export default function Physics() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Computed, not decorated</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Physics lab</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        These sliders call the same functions the tests check against golden values: CO vibration, Wien’s law, reflected-light dimming, and parallax.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <IsotopePanel />
        <NuclearPanel />
        <PlanetXPanel />
        <WienPanel />
      </div>
    </main>
  );
}

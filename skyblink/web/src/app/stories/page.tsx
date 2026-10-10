import Link from "next/link";
import SkyThumb from "@/components/SkyThumb";
import { STORIES, viewerHref } from "@/lib/catalog";

export default function StoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Four scenes</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Stories</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Each card opens the viewer on a simulated field. The cutout is drawn to teach the scenario. The numbers in Detective mode come from the pipeline.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {STORIES.map((story) => (
          <article key={story.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <SkyThumb fieldId={story.fieldId} candidateId={story.candidateId} scenario={story.scenario} />
            <div className="p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">{story.kicker}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{story.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{story.summary}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{story.lesson}</p>
              <div className="mt-4 flex gap-3 text-sm font-semibold">
                <Link href={viewerHref(story, "explorer", "blink")} className="rounded-full bg-amber-400 px-4 py-2 text-slate-950">
                  Blink
                </Link>
                <Link href={viewerHref(story, "detective", "difference")} className="rounded-full border border-white/15 px-4 py-2 text-white">
                  Detective
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export type Scenario = "mover" | "comet" | "variable" | "noise";

export type Story = {
  id: string;
  fieldId: string;
  candidateId: string;
  kicker: string;
  title: string;
  summary: string;
  lesson: string;
  scenario: Scenario;
};

export const STORIES: Story[] = [
  {
    id: "mover",
    fieldId: "F_MOVER",
    candidateId: "F_MOVER_1.25_0",
    kicker: "Story 01 · start the video here",
    title: "The rock that changed place",
    summary:
      "Two passes, one near-infrared band. A source is gone from where it was, and present where it was not.",
    lesson:
      "A mover leaves a dipole: missing light where it left, extra light where it arrived. Stars that stay put subtract away.",
    scenario: "mover",
  },
  {
    id: "comet",
    fieldId: "F_COMET",
    candidateId: "F_COMET_3.3_0",
    kicker: "Story 02 · extended source",
    title: "Follow the ice",
    summary:
      "A fuzzy source shifts by a smaller amount. Comets are not pinpoints, and their ices have infrared names.",
    lesson:
      "Water ice sits near 3.0 µm and CO2 ice near 4.27 µm. A feature at those wavelengths is a clue, not a discovery by itself.",
    scenario: "comet",
  },
  {
    id: "variable",
    fieldId: "F_VAR",
    candidateId: "F_VAR_1.25_0",
    kicker: "Story 03 · read the number",
    title: "Do not trust the field name",
    summary:
      "This scene was built as a variable star. The pipeline still reports a pair with a large separation.",
    lesson:
      "A pulse stays on the same pixel and only changes brightness. If the source jumps, call it motion until the pixels say otherwise.",
    scenario: "mover",
  },
  {
    id: "crowd",
    fieldId: "F_DENSE",
    candidateId: "F_DENSE_4.27_0",
    kicker: "Story 04 · too many pixels",
    title: "A crowded field is a statistics problem",
    summary:
      "More stars means more chances for a lucky spike. Bright is not the same as rare.",
    lesson:
      "Search a million pixels and some of them will look special by accident. The trials-adjusted probability is the number that knows that.",
    scenario: "mover",
  },
];

export function storyById(id: string | null): Story | undefined {
  if (!id) return undefined;
  return STORIES.find((story) => story.id === id);
}

export function scenarioFor(fieldId: string, storyId?: string | null): Scenario {
  const story = storyById(storyId ?? null);
  if (story && story.fieldId === fieldId) return story.scenario;
  if (fieldId.includes("COMET")) return "comet";
  if (fieldId.includes("EMPTY")) return "noise";
  return "mover";
}

export type DemoBeat = {
  id: string;
  label: string;
  hint: string;
  href: string;
};

export const DEMO_BEATS: DemoBeat[] = [
  { id: "hook", label: "Hook", hint: "Say the problem", href: "/" },
  {
    id: "blink",
    label: "Blink",
    hint: "Show the move",
    href: "/viewer/F_MOVER?mode=blink&viewMode=explorer&candidate=F_MOVER_1.25_0&story=mover",
  },
  {
    id: "detective",
    label: "Detective",
    hint: "Read the candidate",
    href: "/viewer/F_MOVER?mode=difference&viewMode=detective&candidate=F_MOVER_1.25_0&story=mover",
  },
  { id: "physics", label: "Physics", hint: "Planet X limit", href: "/physics" },
  { id: "academy", label: "Academy", hint: "Classroom game", href: "/learn" },
  { id: "proof", label: "Proof", hint: "Recovery curve", href: "/limits" },
];

export function viewerHref(story: Story, viewMode: "explorer" | "detective", mode: "blink" | "swipe" | "difference" = "blink") {
  const params = new URLSearchParams({
    mode,
    viewMode,
    candidate: story.candidateId,
    story: story.id,
  });
  return `/viewer/${story.fieldId}?${params.toString()}`;
}

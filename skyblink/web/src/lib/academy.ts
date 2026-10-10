export type Mission = {
  id: string;
  title: string;
  minutes: number;
  xp: number;
  badge: string;
  lesson: string[];
  question: string;
  choices: { id: string; label: string; correct: boolean; why: string }[];
};

export const MISSIONS: Mission[] = [
  {
    id: "bands",
    title: "Same color, or it is not a change",
    minutes: 2,
    xp: 80,
    badge: "Band Matcher",
    lesson: [
      "SPHEREx looks at the sky through linear variable filters. The wavelength is not one setting for the whole picture. It changes across the detector.",
      "Blink two raw frames and you may compare a star to itself in a different color. That fake flicker is the LVF problem.",
      "SkyBlink only pairs exposures when the same place on the sky is seen at the same wavelength, within a tight tolerance, on different nights.",
    ],
    question: "Why does SkyBlink refuse to blink two frames from different places on the filter?",
    choices: [
      {
        id: "color",
        label: "They are different wavelengths, so a brightness change may be color, not time.",
        correct: true,
        why: "Same place, same wavelength, different epoch. That is the whole match.",
      },
      {
        id: "size",
        label: "Because the image files are too large to blink.",
        correct: false,
        why: "File size is not the reason. Color is.",
      },
      {
        id: "infrared",
        label: "Because infrared light cannot be compared at all.",
        correct: false,
        why: "Infrared frames compare just fine when the wavelength matches.",
      },
    ],
  },
  {
    id: "dipole",
    title: "The dipole",
    minutes: 2,
    xp: 80,
    badge: "Blink Eye",
    lesson: [
      "Watch the blink. Stars that stay put barely change. A moving source leaves one place and shows up in another.",
      "Subtract the two passes and that motion becomes a dipole: a negative peak where the source left, a positive peak where it arrived.",
      "A cosmic-ray strike is the opposite pattern. One razor-sharp spike, one frame, nothing in the other pass.",
    ],
    question: "Which signature is a mover at one matched wavelength?",
    choices: [
      {
        id: "dipole",
        label: "Negative where it left, positive where it arrived.",
        correct: true,
        why: "That pair of peaks is the difference-image signature of motion.",
      },
      {
        id: "spike",
        label: "A single sharp spike in one frame only.",
        correct: false,
        why: "That is the particle-hit pattern. It never had a second position.",
      },
      {
        id: "all",
        label: "Every star in the field getting brighter together.",
        correct: false,
        why: "A shared brightening is calibration or background, not one moving body.",
      },
    ],
  },
  {
    id: "ray",
    title: "Cosmic rays are not asteroids",
    minutes: 2,
    xp: 80,
    badge: "Particle Filter",
    lesson: [
      "Detectors get hit by charged particles. The hit is tiny, sharp, and gone in the next exposure.",
      "A real star is blurred by the telescope's point-spread function. SkyBlink compares the detection's sharpness to that shape.",
      "Passing the shape test is not a name. It only means 'this is not an obvious particle hit.'",
    ],
    question: "A detection is extremely sharp, appears in one exposure, and is absent at that pixel in the next pass. What is the careful call?",
    choices: [
      {
        id: "hit",
        label: "Likely a particle hit. Do not call it a moving object yet.",
        correct: true,
        why: "Shape, then persistence. A mover has a second position, not a single spike.",
      },
      {
        id: "planet",
        label: "Planet X, because it is bright.",
        correct: false,
        why: "Brightness without a shape test is how artifacts become headlines.",
      },
      {
        id: "comet",
        label: "A comet, because comets look sharp.",
        correct: false,
        why: "Comets are extended. A one-pixel spike is the wrong shape.",
      },
    ],
  },
  {
    id: "trials",
    title: "A million pixels get a vote",
    minutes: 3,
    xp: 100,
    badge: "Trials Keeper",
    lesson: [
      "Pick one pixel at random from a huge image and it can look rare. Search every pixel and 'rare' happens on schedule.",
      "A local p-value ignores how many places you looked. The trials-adjusted value charges you for the search.",
      "Then plant fake sources of known brightness and ask what fraction you recover. That curve is the honesty check.",
    ],
    question: "One pixel has a tiny p-value, but the search covered a million pixels. What do you trust?",
    choices: [
      {
        id: "adjusted",
        label: "The trials-adjusted probability, then an injection-recovery test.",
        correct: true,
        why: "The first number corrects the search. The second measures whether you can actually catch a real source.",
      },
      {
        id: "raw",
        label: "The raw p-value. Smaller always means real.",
        correct: false,
        why: "A tiny p-value on one pixel is cheap when you bought a million tries.",
      },
      {
        id: "bright",
        label: "Whichever pixel is brightest, with no test.",
        correct: false,
        why: "Bright artifacts exist. Cosmic rays are bright.",
      },
    ],
  },
  {
    id: "line",
    title: "A wavelength with a name",
    minutes: 2,
    xp: 100,
    badge: "Line Reader",
    lesson: [
      "Molecules vibrate at specific infrared wavelengths. In this lab, water ice is marked near 3.0 µm and CO2 ice near 4.27 µm.",
      "A spectrum is flux against wavelength. A dip or peak sitting on a known mark is a reason to look harder.",
      "It is not a chemical ID by itself. Noise can imitate a line, which is why the feature has to survive the earlier filters.",
    ],
    question: "A flux feature sits at 4.27 µm. Which molecule do you check first?",
    choices: [
      {
        id: "co2",
        label: "CO2 ice.",
        correct: true,
        why: "4.27 µm is the CO2 ice mark used in this lab. Confirm it, do not stop at the coincidence.",
      },
      {
        id: "none",
        label: "Nothing. Wavelengths are arbitrary labels.",
        correct: false,
        why: "The wavelength is the measurement. The name is the hypothesis.",
      },
      {
        id: "fusion",
        label: "Hydrogen fusion.",
        correct: false,
        why: "Fusion is a mass threshold, not a 4.27 µm ice feature.",
      },
    ],
  },
  {
    id: "honest",
    title: "The Planet X limit",
    minutes: 3,
    xp: 140,
    badge: "Honest Orbit",
    lesson: [
      "Reflected sunlight dims very fast with distance. The lab uses (distance / 30 AU) to the fourth power.",
      "From 30 AU to 500 AU that factor is about 77,000. A cold body also glows at a wavelength Wien's law puts far outside a near-infrared survey.",
      "SkyBlink did not find Planet X. The calculator exists so a classroom can see why a single exposure is the wrong net, and how to judge any candidate that does show up.",
    ],
    question: "What should this app claim about Planet X?",
    choices: [
      {
        id: "limit",
        label: "We did not find it. A single exposure is unlikely to, and the calculator shows why.",
        correct: true,
        why: "A limit is a result. An invented detection is not.",
      },
      {
        id: "dipole",
        label: "Any dipole in the demo is Planet X.",
        correct: false,
        why: "A dipole can be an asteroid, a comet, or an artifact. Distance and flux have to work too.",
      },
      {
        id: "hide",
        label: "Hide the limit so the story is more exciting.",
        correct: false,
        why: "The exciting part is that the public can see the limit themselves.",
      },
    ],
  },
];

export const CASE_XP = 40;
export const CASE_BADGE = "Case Filed";

export type Progress = {
  xp: number;
  completed: string[];
  streak: number;
  bestStreak: number;
  cases: string[];
};

export const RANKS = [
  { id: "cadet", name: "Cadet", min: 0, blurb: "Learning why a blink can lie." },
  { id: "observer", name: "Observer", min: 160, blurb: "You can match a wavelength and spot a mover." },
  { id: "detective", name: "Detective", min: 340, blurb: "You can reject artifacts and read a line." },
  { id: "pi", name: "Principal Investigator", min: 500, blurb: "You can state a limit as clearly as a detection." },
] as const;

export function emptyProgress(): Progress {
  return { xp: 0, completed: [], streak: 0, bestStreak: 0, cases: [] };
}

export function rankFor(xp: number) {
  let current: (typeof RANKS)[number] = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.min) current = rank;
  }
  return current;
}

export function nextRank(xp: number) {
  return RANKS.find((rank) => rank.min > xp) ?? null;
}

export function awardMission(progress: Progress, missionId: string, xp: number, correct: boolean): Progress {
  if (!correct) {
    return { ...progress, streak: 0 };
  }
  if (progress.completed.includes(missionId)) {
    return progress;
  }
  const streak = progress.streak + 1;
  return {
    ...progress,
    xp: progress.xp + xp,
    completed: [...progress.completed, missionId],
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
  };
}

export function awardCase(progress: Progress, candidateId: string): Progress {
  if (progress.cases.includes(candidateId)) return progress;
  const streak = progress.streak + 1;
  return {
    ...progress,
    xp: progress.xp + CASE_XP,
    cases: [...progress.cases, candidateId],
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
  };
}

export function missionById(id: string) {
  return MISSIONS.find((mission) => mission.id === id);
}

export type Scenario = "mover" | "comet" | "variable" | "noise";

export type SkyFrames = {
  epochA: HTMLCanvasElement;
  epochB: HTMLCanvasElement;
  diff: HTMLCanvasElement;
};

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function spot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  core: string,
  mid: string,
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${core}, ${alpha})`);
  gradient.addColorStop(0.35, `rgba(${mid}, ${alpha * 0.55})`);
  gradient.addColorStop(1, `rgba(${mid}, 0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function buildFrames(fieldId: string, candidateId: string, scenario: Scenario): SkyFrames {
  const width = 800;
  const height = 560;
  const random = mulberry32(hashString(`${fieldId}:${candidateId}:${scenario}`));

  const stars = Array.from({ length: 70 }, () => ({
    x: 36 + random() * (width - 72),
    y: 36 + random() * (height - 72),
    radius: 2 + random() * 5.5,
    alpha: 0.28 + random() * 0.62,
  }));

  const originX = 150 + random() * 70;
  const originY = 170 + random() * 180;
  const destinationX = scenario === "variable" ? originX : 500 + random() * 90;
  const destinationY = scenario === "variable" ? originY : 160 + random() * 180;
  const showTransient = scenario !== "noise";

  const paintEpoch = (pass: "a" | "b") => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.fillStyle = "#070b12";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 280; i++) {
      const grain = random();
      ctx.fillStyle = `rgba(180, 200, 230, ${0.015 + grain * 0.05})`;
      ctx.fillRect(random() * width, random() * height, 1.2, 1.2);
    }

    for (const star of stars) {
      spot(ctx, star.x, star.y, star.radius, star.alpha, "255, 236, 214", "255, 186, 110");
    }

    if (showTransient) {
      const here = pass === "a";
      const x = here ? originX : destinationX;
      const y = here ? originY : destinationY;
      const alpha = scenario === "variable" ? (here ? 0.38 : 1) : 1;
      const radius = scenario === "comet" ? 46 : 28;
      spot(ctx, x, y, radius, alpha, "255, 252, 245", "255, 210, 140");
      spot(ctx, x, y, radius * 0.28, alpha, "255, 255, 255", "255, 244, 214");
      if (scenario === "comet") {
        const tailX = here ? 1 : -1;
        for (let i = 1; i <= 5; i++) {
          spot(ctx, x + tailX * i * 16, y + i * 7, 22 - i * 3, 0.28 - i * 0.04, "186, 230, 253", "125, 211, 252");
        }
      }
    }

    return canvas;
  };

  const epochA = paintEpoch("a");
  const epochB = paintEpoch("b");
  const diff = document.createElement("canvas");
  diff.width = width;
  diff.height = height;
  const diffCtx = diff.getContext("2d");
  if (diffCtx) {
    diffCtx.fillStyle = "#070b12";
    diffCtx.fillRect(0, 0, width, height);
    if (showTransient && scenario !== "variable") {
      spot(diffCtx, originX, originY, scenario === "comet" ? 30 : 18, 0.95, "251, 146, 60", "239, 68, 68");
      spot(diffCtx, destinationX, destinationY, scenario === "comet" ? 30 : 18, 0.95, "165, 243, 252", "34, 211, 238");
    } else if (scenario === "variable") {
      spot(diffCtx, originX, originY, 20, 0.9, "165, 243, 252", "34, 211, 238");
    } else {
      for (let i = 0; i < 40; i++) {
        diffCtx.fillStyle = "rgba(148, 163, 184, 0.25)";
        diffCtx.fillRect(random() * width, random() * height, 2, 2);
      }
    }
  }

  return { epochA, epochB, diff };
}

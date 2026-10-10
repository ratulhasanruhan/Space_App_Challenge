import { expect, test } from "vitest";
import { awardCase, awardMission, emptyProgress, rankFor } from "../src/lib/academy";

test("a correct mission pays XP once and builds a streak", () => {
  const first = awardMission(emptyProgress(), "bands", 80, true);
  expect(first.xp).toBe(80);
  expect(first.streak).toBe(1);
  const again = awardMission(first, "bands", 80, false);
  expect(again.xp).toBe(80);
  expect(again.streak).toBe(0);
  const repeat = awardMission(first, "bands", 80, true);
  expect(repeat.xp).toBe(80);
});

test("ranks follow the XP thresholds", () => {
  expect(rankFor(0).name).toBe("Cadet");
  expect(rankFor(160).name).toBe("Observer");
  expect(rankFor(340).name).toBe("Detective");
  expect(rankFor(500).name).toBe("Principal Investigator");
});

test("filing a case pays once per candidate", () => {
  const filed = awardCase(emptyProgress(), "F_MOVER_1.25_0");
  expect(filed.xp).toBe(40);
  expect(awardCase(filed, "F_MOVER_1.25_0").xp).toBe(40);
});

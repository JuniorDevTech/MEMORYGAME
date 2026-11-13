import {
  createGameSession,
  pauseGameSession,
  startSelectionPhase,
} from "../gameSession";

import { advanceGameTime } from "../gameTimer";

describe("NEBULA PATH - Game Timer", () => {
  it("diminue le temps de mémorisation", () => {
    const session = createGameSession(1);

    const updated = advanceGameTime(session, 2);

    expect(updated.remainingMemorizationTime).toBe(4);
    expect(updated.phase).toBe("memorization");
  });

  it("passe à la sélection lorsque la mémorisation expire", () => {
    const session = createGameSession(1);

    const updated = advanceGameTime(session, 6);

    expect(updated.phase).toBe("selection");
    expect(updated.remainingMemorizationTime).toBe(0);
    expect(updated.remainingSelectionTime).toBe(18);
  });

  it("transfère le temps excédentaire à la sélection", () => {
    const session = createGameSession(1);

    const updated = advanceGameTime(session, 8);

    expect(updated.phase).toBe("selection");
    expect(updated.remainingMemorizationTime).toBe(0);
    expect(updated.remainingSelectionTime).toBe(16);
  });

  it("déclenche une défaite lorsque le temps de sélection expire", () => {
    const session = startSelectionPhase(createGameSession(1));

    const updated = advanceGameTime(session, 18);

    expect(updated.phase).toBe("defeat");
    expect(updated.remainingSelectionTime).toBe(0);
  });

  it("ne diminue pas le temps pendant une pause", () => {
    const session = pauseGameSession(createGameSession(1));

    const updated = advanceGameTime(session, 3);

    expect(updated.phase).toBe("paused");
    expect(updated.remainingMemorizationTime).toBe(6);
  });

  it("refuse une durée négative", () => {
    const session = createGameSession(1);

    expect(() => advanceGameTime(session, -2)).toThrow();
  });

  it("refuse une durée non numérique", () => {
    const session = createGameSession(1);

    expect(() => advanceGameTime(session, Number.NaN)).toThrow();
  });

  it("ne modifie pas une session déjà gagnée", () => {
    const session = {
      ...startSelectionPhase(createGameSession(1)),
      phase: "victory" as const,
    };

    const updated = advanceGameTime(session, 5);

    expect(updated.phase).toBe("victory");
    expect(updated.remainingSelectionTime).toBe(18);
  });
});

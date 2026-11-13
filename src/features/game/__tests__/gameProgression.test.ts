import {
  advanceProgression,
  createProgression,
  resetProgressionAfterDefeat,
} from "../gameProgression";

describe("NEBULA PATH - Game Progression", () => {
  it("commence au niveau 1", () => {
    const progression = createProgression();

    expect(progression.currentLevel).toBe(1);
  });

  it("passe au niveau suivant après une victoire", () => {
    const progression = { currentLevel: 1 };

    const updated = advanceProgression(progression);

    expect(updated.currentLevel).toBe(2);
  });

  it("revient au niveau 1 après une défaite avant le premier checkpoint", () => {
    const progression = { currentLevel: 4 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(1);
  });

  it("revient au niveau 1 après une défaite au niveau 5", () => {
    const progression = { currentLevel: 5 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(1);
  });

  it("revient au niveau 5 après une défaite au niveau 10", () => {
    const progression = { currentLevel: 10 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(5);
  });

  it("revient au niveau 10 après une défaite au niveau 11", () => {
    const progression = { currentLevel: 11 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(10);
  });

  it("revient au niveau 15 après une défaite au niveau 16", () => {
    const progression = { currentLevel: 16 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(15);
  });

  it("revient au niveau 25 après une défaite au niveau 30", () => {
    const progression = { currentLevel: 30 };

    const updated = resetProgressionAfterDefeat(progression);

    expect(updated.currentLevel).toBe(25);
  });

  it("ne modifie pas la progression originale", () => {
    const progression = { currentLevel: 10 };

    resetProgressionAfterDefeat(progression);

    expect(progression.currentLevel).toBe(10);
  });
});

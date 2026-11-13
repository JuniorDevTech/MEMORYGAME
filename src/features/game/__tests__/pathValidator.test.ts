import type { GamePath } from "../../game/types/types";
import { validateSelection } from "../pathValidator";

describe("NEBULA PATH - Path Validator", () => {
  const path: GamePath = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 1, column: 1 },
  ];

  it("accepte une sélection correcte", () => {
    const result = validateSelection(path, [], { row: 0, column: 0 });

    expect(result).toBe("correct");
  });

  it("déclare la victoire lorsque le chemin est terminé", () => {
    const result = validateSelection(
      path,
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
      ],
      { row: 1, column: 1 },
    );

    expect(result).toBe("victory");
  });

  it("déclenche une défaite si le joueur choisit une mauvaise case", () => {
    const result = validateSelection(path, [], { row: 1, column: 0 });

    expect(result).toBe("defeat");
  });

  it("déclenche une défaite si le joueur ne respecte pas l’ordre", () => {
    const result = validateSelection(path, [{ row: 0, column: 0 }], {
      row: 1,
      column: 1,
    });

    expect(result).toBe("defeat");
  });

  it("déclenche une défaite si le joueur sélectionne une case déjà utilisée", () => {
    const result = validateSelection(path, [{ row: 0, column: 0 }], {
      row: 0,
      column: 0,
    });

    expect(result).toBe("defeat");
  });

  it("déclenche une défaite si le chemin est vide", () => {
    const result = validateSelection([], [], { row: 0, column: 0 });

    expect(result).toBe("defeat");
  });
});

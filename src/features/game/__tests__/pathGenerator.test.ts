import { generatePath } from "../pathGenerator";
import type { GridSize } from "../types/types";

describe("NEBULA PATH - Path Generator", () => {
  const grid: GridSize = {
    rows: 3,
    columns: 3,
  };

  it("génère un chemin contenant le nombre exact de cases", () => {
    const path = generatePath(grid, 5);

    expect(path).toHaveLength(5);
  });

  it("ne répète aucune cellule", () => {
    const path = generatePath(grid, 5);

    const uniqueCells = new Set(
      path.map((cell) => `${cell.row}-${cell.column}`),
    );

    expect(uniqueCells.size).toBe(path.length);
  });

  it("ne sort jamais des limites de la grille", () => {
    const path = generatePath(grid, 5);

    path.forEach((cell) => {
      expect(cell.row).toBeGreaterThanOrEqual(0);
      expect(cell.row).toBeLessThan(grid.rows);
      expect(cell.column).toBeGreaterThanOrEqual(0);
      expect(cell.column).toBeLessThan(grid.columns);
    });
  });

  it("utilise uniquement des déplacements horizontaux ou verticaux", () => {
    const path = generatePath(grid, 5);

    for (let index = 1; index < path.length; index++) {
      const previous = path[index - 1];
      const current = path[index];

      const distance =
        Math.abs(previous.row - current.row) +
        Math.abs(previous.column - current.column);

      expect(distance).toBe(1);
    }
  });

  it("génère un chemin complet de 36 cases sur une grille 6x6", () => {
    const fullGrid = {
      rows: 6,
      columns: 6,
    };

    const path = generatePath(fullGrid, 36);

    expect(path).toHaveLength(36);

    const uniqueCells = new Set(
      path.map((cell) => `${cell.row}-${cell.column}`),
    );

    expect(uniqueCells.size).toBe(36);
  });

  it("respecte les déplacements autorisés sur le chemin complet", () => {
    const fullGrid = {
      rows: 6,
      columns: 6,
    };

    const path = generatePath(fullGrid, 36);

    for (let index = 1; index < path.length; index++) {
      const previous = path[index - 1];
      const current = path[index];

      const distance =
        Math.abs(previous.row - current.row) +
        Math.abs(previous.column - current.column);

      expect(distance).toBe(1);
    }
  });
});

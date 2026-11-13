import type { GamePath, GridSize } from "../../game/types/types";
import { buildBoard } from "../boardBuilder";

describe("NEBULA PATH - Board Builder", () => {
  const grid: GridSize = {
    rows: 2,
    columns: 2,
  };

  const path: GamePath = [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 1, column: 1 },
  ];

  it("construit toutes les cellules de la grille", () => {
    const board = buildBoard(grid, path);

    expect(board).toHaveLength(4);
  });

  it("contient exactement le nombre de cases bleues du chemin", () => {
    const board = buildBoard(grid, path);

    const blueCells = board.filter((cell) => cell.type === "blue");

    expect(blueCells).toHaveLength(3);
  });

  it("remplit les autres cellules en rouge", () => {
    const board = buildBoard(grid, path);

    const redCells = board.filter((cell) => cell.type === "red");

    expect(redCells).toHaveLength(1);
  });

  it("ne crée aucune cellule en double", () => {
    const board = buildBoard(grid, path);

    const uniqueCells = new Set(
      board.map((cell) => `${cell.position.row}-${cell.position.column}`),
    );

    expect(uniqueCells.size).toBe(4);
  });

  it("initialise toutes les cellules sans sélection", () => {
    const board = buildBoard(grid, path);

    board.forEach((cell) => {
      expect(cell.isSelected).toBe(false);
      expect(cell.selectionOrder).toBeNull();
    });
  });

  it("refuse un chemin contenant des cellules répétées", () => {
    const invalidPath: GamePath = [
      { row: 0, column: 0 },
      { row: 0, column: 0 },
    ];

    expect(() => buildBoard(grid, invalidPath)).toThrow(
      "Le chemin contient des cases répétées.",
    );
  });

  it("refuse une position située hors de la grille", () => {
    const invalidPath: GamePath = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
    ];

    expect(() => buildBoard(grid, invalidPath)).toThrow(
      "Le chemin contient une position invalide.",
    );
  });
});

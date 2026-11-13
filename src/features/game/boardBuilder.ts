import type {
  CellPosition,
  CellState,
  GamePath,
  GridSize,
} from "../game/types/types";

/**
 * Mélange un tableau sans modifier le tableau original.
 */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

/**
 * Construit le plateau à partir du chemin généré.
 *
 * Les cases du chemin sont bleues.
 * Toutes les autres cases sont rouges.
 */
export function buildBoard(grid: GridSize, path: GamePath): CellState[] {
  const totalCells = grid.rows * grid.columns;

  if (
    !Number.isInteger(grid.rows) ||
    !Number.isInteger(grid.columns) ||
    grid.rows < 1 ||
    grid.columns < 1 ||
    path.length < 1 ||
    path.length > totalCells
  ) {
    throw new Error("Impossible de construire ce plateau.");
  }

  const pathKeys = new Set(path.map((cell) => `${cell.row}-${cell.column}`));

  if (pathKeys.size !== path.length) {
    throw new Error("Le chemin contient des cases répétées.");
  }

  for (const cell of path) {
    if (
      cell.row < 0 ||
      cell.row >= grid.rows ||
      cell.column < 0 ||
      cell.column >= grid.columns
    ) {
      throw new Error("Le chemin contient une position invalide.");
    }
  }

  const cells: CellState[] = [];

  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      const position: CellPosition = { row, column };
      const key = `${row}-${column}`;

      cells.push({
        position,
        type: pathKeys.has(key) ? "blue" : "red",
        isSelected: false,
        selectionOrder: null,
      });
    }
  }

  return shuffle(cells);
}

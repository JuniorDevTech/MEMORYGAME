import type { CellPosition, GamePath, GridSize } from "../game/types/types";

/**
 * Vérifie si deux cellules sont voisines
 * horizontalement ou verticalement.
 */
function areAdjacent(first: CellPosition, second: CellPosition): boolean {
  const rowDistance = Math.abs(first.row - second.row);
  const columnDistance = Math.abs(first.column - second.column);

  return rowDistance + columnDistance === 1;
}

/**
 * Génère un chemin de secours valide en parcourant
 * la grille en serpentin.
 */
function generateFallbackPath(grid: GridSize): GamePath {
  const path: GamePath = [];

  for (let row = 0; row < grid.rows; row++) {
    const columns = Array.from({ length: grid.columns }, (_, index) => index);

    if (row % 2 !== 0) {
      columns.reverse();
    }

    for (const column of columns) {
      path.push({ row, column });
    }
  }

  return path;
}

/**
 * Mélange les voisins pour varier les chemins.
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
 * Génère un chemin aléatoire sans répétition.
 *
 * Si la recherche ne trouve pas de chemin dans
 * le budget autorisé, utilise un chemin de secours.
 */
export function generatePath(grid: GridSize, pathLength: number): GamePath {
  const totalCells = grid.rows * grid.columns;

  if (
    !Number.isInteger(grid.rows) ||
    !Number.isInteger(grid.columns) ||
    !Number.isInteger(pathLength) ||
    grid.rows < 1 ||
    grid.columns < 1 ||
    pathLength < 1 ||
    pathLength > totalCells
  ) {
    throw new Error("Configuration de chemin invalide.");
  }

  const visited = new Set<string>();
  const path: GamePath = [];

  let exploredNodes = 0;
  const maxExploredNodes = 50000;

  function cellKey(cell: CellPosition): string {
    return `${cell.row}-${cell.column}`;
  }

  function search(current: CellPosition): boolean {
    if (path.length === pathLength) {
      return true;
    }

    if (exploredNodes >= maxExploredNodes) {
      return false;
    }

    exploredNodes++;

    const neighbors: CellPosition[] = [
      { row: current.row - 1, column: current.column },
      { row: current.row + 1, column: current.column },
      { row: current.row, column: current.column - 1 },
      { row: current.row, column: current.column + 1 },
    ].filter(
      (cell) =>
        cell.row >= 0 &&
        cell.row < grid.rows &&
        cell.column >= 0 &&
        cell.column < grid.columns &&
        !visited.has(cellKey(cell)) &&
        areAdjacent(current, cell),
    );

    for (const next of shuffle(neighbors)) {
      const key = cellKey(next);

      visited.add(key);
      path.push(next);

      if (search(next)) {
        return true;
      }

      path.pop();
      visited.delete(key);
    }

    return false;
  }

  // Plusieurs points de départ sont essayés.
  const startingCells = shuffle(
    Array.from({ length: totalCells }, (_, index) => ({
      row: Math.floor(index / grid.columns),
      column: index % grid.columns,
    })),
  );

  for (const start of startingCells) {
    visited.clear();
    path.length = 0;

    visited.add(cellKey(start));
    path.push(start);

    if (search(start)) {
      return path;
    }

    if (exploredNodes >= maxExploredNodes) {
      break;
    }
  }

  // Le chemin de secours est toujours valide.
  return generateFallbackPath(grid).slice(0, pathLength);
}

/**
 * Types fondamentaux du moteur NEBULA PATH.
 * MEMORYGAME — Version 1.0
 */

/** Coordonnées d'une cellule dans la grille. */
export type CellPosition = {
  row: number;
  column: number;
};

/** Dimensions de la grille. */
export type GridSize = {
  rows: number;
  columns: number;
};

/** Chemin que le joueur doit mémoriser puis reproduire. */
export type GamePath = CellPosition[];

/** Types de cellules présents sur le plateau. */
export type CellType = "blue" | "red";

/** État visuel d'une cellule pendant la partie. */
export type CellState = {
  position: CellPosition;
  type: CellType;
  isSelected: boolean;
  selectionOrder: number | null;
};

/** Configuration d'un niveau. */
export type LevelConfig = {
  level: number;
  grid: GridSize;
  blueCellsCount: number;
  redCellsCount: number;
  memorizationTime: number;
  selectionTime: number;
};

/** Phases possibles d'une partie. */
export type GamePhase =
  | "memorization"
  | "selection"
  | "victory"
  | "defeat"
  | "paused";

/** État global d'une partie. */
export type GameState = {
  level: number;
  phase: GamePhase;
  path: GamePath;
  selectedCells: CellPosition[];
  remainingMemorizationTime: number;
  remainingSelectionTime: number;
};

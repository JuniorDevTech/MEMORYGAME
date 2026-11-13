import type { LevelConfig } from "../game/types/types";

const LEVELS_1_TO_5: Record<number, LevelConfig> = {
  1: {
    level: 1,
    grid: { rows: 2, columns: 2 },
    blueCellsCount: 3,
    redCellsCount: 1,
    memorizationTime: 6,
    selectionTime: 18,
  },
  2: {
    level: 2,
    grid: { rows: 3, columns: 3 },
    blueCellsCount: 5,
    redCellsCount: 4,
    memorizationTime: 5,
    selectionTime: 16,
  },
  3: {
    level: 3,
    grid: { rows: 4, columns: 4 },
    blueCellsCount: 7,
    redCellsCount: 9,
    memorizationTime: 4,
    selectionTime: 14,
  },
  4: {
    level: 4,
    grid: { rows: 5, columns: 5 },
    blueCellsCount: 9,
    redCellsCount: 16,
    memorizationTime: 3,
    selectionTime: 12,
  },
  5: {
    level: 5,
    grid: { rows: 6, columns: 6 },
    blueCellsCount: 11,
    redCellsCount: 25,
    memorizationTime: 2,
    selectionTime: 10,
  },
};

const GRID_SIZE = 6;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const MAX_LEVEL = 30;

const MIN_MEMORIZATION_TIME = 1.5;
const MIN_SELECTION_TIME = 5;

const MEMORIZATION_DECREASE = (2 - MIN_MEMORIZATION_TIME) / (MAX_LEVEL - 5);

const SELECTION_DECREASE = (10 - MIN_SELECTION_TIME) / (MAX_LEVEL - 5);

function roundTime(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Génère automatiquement la configuration
 * des niveaux 6 et suivants.
 */
function createInfiniteLevelConfig(level: number): LevelConfig {
  const blueCellsCount = Math.min(level + 6, TOTAL_CELLS);

  const redCellsCount = TOTAL_CELLS - blueCellsCount;

  const memorizationTime = Math.max(
    MIN_MEMORIZATION_TIME,
    2 - (level - 5) * MEMORIZATION_DECREASE,
  );

  const selectionTime = Math.max(
    MIN_SELECTION_TIME,
    10 - (level - 5) * SELECTION_DECREASE,
  );

  return {
    level,
    grid: {
      rows: GRID_SIZE,
      columns: GRID_SIZE,
    },
    blueCellsCount,
    redCellsCount,
    memorizationTime: roundTime(memorizationTime),
    selectionTime: roundTime(selectionTime),
  };
}

/**
 * Retourne la configuration de n'importe quel niveau.
 */
export function getLevelConfig(level: number): LevelConfig {
  if (!Number.isSafeInteger(level) || level < 1) {
    throw new Error("Le numéro du niveau doit être un entier positif.");
  }

  if (level <= 5) {
    return LEVELS_1_TO_5[level];
  }

  return createInfiniteLevelConfig(level);
}

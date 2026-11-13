import type {
  CellPosition,
  CellState,
  GamePath,
  GamePhase,
  LevelConfig,
} from "../game/types/types";

import { buildBoard } from "./boardBuilder";
import { getLevelConfig } from "./levelConfig";
import { generatePath } from "./pathGenerator";
import { validateSelection } from "./pathValidator";

type ActivePhase = "memorization" | "selection";

export type GameSession = {
  level: number;
  config: LevelConfig;
  phase: GamePhase;
  pausedFrom: ActivePhase | null;
  path: GamePath;
  board: CellState[];
  selectedCells: CellPosition[];
  remainingMemorizationTime: number;
  remainingSelectionTime: number;
};

/**
 * Crée une nouvelle session de jeu.
 */
export function createGameSession(level: number): GameSession {
  const config = getLevelConfig(level);

  const path = generatePath(config.grid, config.blueCellsCount);

  const board = buildBoard(config.grid, path);

  return {
    level,
    config,
    phase: "memorization",
    pausedFrom: null,
    path,
    board,
    selectedCells: [],
    remainingMemorizationTime: config.memorizationTime,
    remainingSelectionTime: config.selectionTime,
  };
}

/**
 * Termine la mémorisation et autorise la sélection.
 */
export function startSelectionPhase(session: GameSession): GameSession {
  if (session.phase !== "memorization") {
    return session;
  }

  return {
    ...session,
    phase: "selection",
  };
}

/**
 * Enregistre une sélection et détermine son résultat.
 */
export function selectGameCell(
  session: GameSession,
  position: CellPosition,
): GameSession {
  if (session.phase !== "selection") {
    return session;
  }

  const result = validateSelection(
    session.path,
    session.selectedCells,
    position,
  );

  if (result === "defeat") {
    return {
      ...session,
      phase: "defeat",
    };
  }

  const selectionOrder = session.selectedCells.length + 1;

  const selectedCells = [...session.selectedCells, position];

  const board = session.board.map((cell) => {
    const isSelected =
      cell.position.row === position.row &&
      cell.position.column === position.column;

    if (!isSelected) {
      return cell;
    }

    return {
      ...cell,
      isSelected: true,
      selectionOrder,
    };
  });

  return {
    ...session,
    board,
    selectedCells,
    phase: result === "victory" ? "victory" : "selection",
  };
}

/**
 * Met en pause une partie en cours.
 */
export function pauseGameSession(session: GameSession): GameSession {
  if (session.phase !== "memorization" && session.phase !== "selection") {
    return session;
  }

  return {
    ...session,
    pausedFrom: session.phase,
    phase: "paused",
  };
}

/**
 * Reprend une partie mise en pause.
 */
export function resumeGameSession(session: GameSession): GameSession {
  if (session.phase !== "paused" || !session.pausedFrom) {
    return session;
  }

  return {
    ...session,
    phase: session.pausedFrom,
    pausedFrom: null,
  };
}

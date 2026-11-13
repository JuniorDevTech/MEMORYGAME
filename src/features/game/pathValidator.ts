import type { CellPosition, GamePath } from "../game/types/types";

export type SelectionResult = "correct" | "victory" | "defeat";

/**
 * Compare deux positions de la grille.
 */
function isSameCell(first: CellPosition, second: CellPosition): boolean {
  return first.row === second.row && first.column === second.column;
}

/**
 * Vérifie une sélection du joueur.
 *
 * Le joueur doit reproduire exactement le chemin,
 * case par case et dans le bon ordre.
 */
export function validateSelection(
  path: GamePath,
  selectedCells: CellPosition[],
  selectedCell: CellPosition,
): SelectionResult {
  if (path.length === 0) {
    return "defeat";
  }

  // Une case déjà sélectionnée entraîne une défaite.
  const alreadySelected = selectedCells.some((cell) =>
    isSameCell(cell, selectedCell),
  );

  if (alreadySelected) {
    return "defeat";
  }

  // Détermine la prochaine case attendue.
  const expectedCell = path[selectedCells.length];

  // Plus aucune case n'est attendue.
  if (!expectedCell) {
    return "defeat";
  }

  // La case choisie doit être exactement la bonne.
  if (!isSameCell(expectedCell, selectedCell)) {
    return "defeat";
  }

  // Toutes les cases ont été correctement reproduites.
  if (selectedCells.length + 1 === path.length) {
    return "victory";
  }

  return "correct";
}

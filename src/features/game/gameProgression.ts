export type GameProgression = {
  currentLevel: number;
};

/**
 * Crée une nouvelle progression.
 */
export function createProgression(): GameProgression {
  return {
    currentLevel: 1,
  };
}

/**
 * Applique une victoire et débloque le niveau suivant.
 */
export function advanceProgression(
  progression: GameProgression,
): GameProgression {
  return {
    currentLevel: progression.currentLevel + 1,
  };
}

/**
 * Après une défaite, revient au dernier checkpoint
 * atteint tous les 5 niveaux.
 *
 * Exemples :
 * Niveau 5  → retour au niveau 1
 * Niveau 6  → retour au niveau 5
 * Niveau 10 → retour au niveau 5
 * Niveau 11 → retour au niveau 10
 * Niveau 16 → retour au niveau 15
 */
export function resetProgressionAfterDefeat(
  progression: GameProgression,
): GameProgression {
  const checkpoint = Math.floor((progression.currentLevel - 1) / 5) * 5;

  return {
    currentLevel: Math.max(1, checkpoint),
  };
}

import type { GameProgression } from "./gameProgression";
import type { GameSession } from "./gameSession";

import {
  advanceProgression,
  resetProgressionAfterDefeat,
} from "./gameProgression";

import { saveProgression } from "./gameStorage";

/**
 * Traite la fin d'une partie et sauvegarde la progression.
 *
 * Une session en cours ou en pause ne peut pas modifier
 * la progression.
 */
export async function handleGameResult(
  session: GameSession,
  progression: GameProgression,
): Promise<GameProgression> {
  let updatedProgression: GameProgression;

  if (session.phase === "victory") {
    updatedProgression = advanceProgression(progression);
  } else if (session.phase === "defeat") {
    updatedProgression = resetProgressionAfterDefeat(progression);
  } else {
    throw new Error("Impossible de traiter une partie qui n’est pas terminée.");
  }

  await saveProgression(updatedProgression);

  return updatedProgression;
}

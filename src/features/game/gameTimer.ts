import type { GameSession } from "./gameSession";

/**
 * Fait avancer les chronomètres d'une session.
 *
 * elapsedSeconds représente le temps réellement écoulé.
 * La fonction ne modifie jamais la session originale.
 */
export function advanceGameTime(
  session: GameSession,
  elapsedSeconds: number,
): GameSession {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new Error("La durée écoulée doit être positive.");
  }

  if (
    elapsedSeconds === 0 ||
    session.phase === "paused" ||
    session.phase === "victory" ||
    session.phase === "defeat"
  ) {
    return session;
  }

  let remainingTime = elapsedSeconds;
  let updatedSession = { ...session };

  if (updatedSession.phase === "memorization") {
    if (remainingTime < updatedSession.remainingMemorizationTime) {
      return {
        ...updatedSession,
        remainingMemorizationTime:
          updatedSession.remainingMemorizationTime - remainingTime,
      };
    }

    remainingTime -= updatedSession.remainingMemorizationTime;

    updatedSession = {
      ...updatedSession,
      phase: "selection",
      remainingMemorizationTime: 0,
    };
  }

  if (updatedSession.phase === "selection") {
    if (remainingTime >= updatedSession.remainingSelectionTime) {
      return {
        ...updatedSession,
        remainingSelectionTime: 0,
        phase: "defeat",
      };
    }

    updatedSession = {
      ...updatedSession,
      remainingSelectionTime:
        updatedSession.remainingSelectionTime - remainingTime,
    };
  }

  return updatedSession;
}

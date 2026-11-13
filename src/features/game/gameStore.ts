import { create } from "zustand";

import type { CellPosition } from "../game/types/types";
import type { GameProgression } from "./gameProgression";
import type { GameSession } from "./gameSession";

import {
  createGameSession,
  pauseGameSession,
  resumeGameSession,
  selectGameCell,
  startSelectionPhase,
} from "./gameSession";

import { advanceGameTime } from "./gameTimer";

import { createProgression } from "./gameProgression";

import { loadProgression as loadSavedProgression } from "./gameStorage";

import { handleGameResult } from "./gameResultHandler";

type GameStore = {
  session: GameSession | null;
  progression: GameProgression;

  isProgressionLoaded: boolean;
  isLoading: boolean;
  isSavingResult: boolean;
  resultProcessed: boolean;
  error: string | null;

  loadProgression: () => Promise<void>;
  startGame: () => void;
  beginSelection: () => void;
  selectCell: (position: CellPosition) => Promise<void>;
  advanceTime: (seconds: number) => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  clearError: () => void;
};

/**
 * Store central de MEMORYGAME.
 */
export const useGameStore = create<GameStore>((set, get) => {
  /**
   * Sauvegarde le résultat d'une session terminée.
   */
  const processResult = async (session: GameSession) => {
    const state = get();

    if (
      state.resultProcessed ||
      state.isSavingResult ||
      (session.phase !== "victory" && session.phase !== "defeat")
    ) {
      return;
    }

    set({
      isSavingResult: true,
      error: null,
    });

    try {
      const updatedProgression = await handleGameResult(
        session,
        get().progression,
      );

      set({
        progression: updatedProgression,
        isSavingResult: false,
        resultProcessed: true,
      });
    } catch (error) {
      set({
        isSavingResult: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de sauvegarder le résultat.",
      });
    }
  };

  return {
    session: null,
    progression: createProgression(),

    isProgressionLoaded: false,
    isLoading: false,
    isSavingResult: false,
    resultProcessed: false,
    error: null,

    /**
     * Charge la progression sauvegardée.
     */
    loadProgression: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const progression = await loadSavedProgression();

        set({
          progression,
          isProgressionLoaded: true,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger la progression.",
        });
      }
    },

    /**
     * Démarre une partie au niveau actuel.
     */
    startGame: () => {
      const state = get();

      if (!state.isProgressionLoaded || state.isSavingResult) {
        return;
      }

      set({
        session: createGameSession(state.progression.currentLevel),
        resultProcessed: false,
        error: null,
      });
    },

    /**
     * Passe à la phase de sélection.
     */
    beginSelection: () => {
      const session = get().session;

      if (!session) return;

      set({
        session: startSelectionPhase(session),
      });
    },

    /**
     * Enregistre une case sélectionnée.
     */
    selectCell: async (position) => {
      const session = get().session;

      if (!session) return;

      const updatedSession = selectGameCell(session, position);

      set({ session: updatedSession });

      await processResult(updatedSession);
    },

    /**
     * Fait avancer le chronomètre.
     */
    advanceTime: async (seconds) => {
      const session = get().session;

      if (!session) return;

      const updatedSession = advanceGameTime(session, seconds);

      set({ session: updatedSession });

      await processResult(updatedSession);
    },

    /**
     * Met la partie en pause.
     */
    pauseGame: () => {
      const session = get().session;

      if (!session) return;

      set({
        session: pauseGameSession(session),
      });
    },

    /**
     * Reprend la partie.
     */
    resumeGame: () => {
      const session = get().session;

      if (!session) return;

      set({
        session: resumeGameSession(session),
      });
    },

    /**
     * Efface le message d'erreur.
     */
    clearError: () => {
      set({ error: null });
    },
  };
});

import {
  createGameSession,
  selectGameCell,
  startSelectionPhase,
} from "../gameSession";

import { handleGameResult } from "../gameResultHandler";

import { saveProgression } from "../gameStorage";

jest.mock("../gameStorage", () => ({
  saveProgression: jest.fn().mockResolvedValue(undefined),
}));

const mockedSaveProgression = jest.mocked(saveProgression);

describe("NEBULA PATH - Game Result Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSaveProgression.mockResolvedValue(undefined);
  });

  function createVictorySession() {
    let session = startSelectionPhase(createGameSession(1));

    for (const cell of session.path) {
      session = selectGameCell(session, cell);
    }

    return session;
  }

  function createDefeatSession() {
    const session = startSelectionPhase(createGameSession(1));

    const redCell = session.board.find((cell) => cell.type === "red");

    if (!redCell) {
      throw new Error("Aucune case rouge disponible.");
    }

    return selectGameCell(session, redCell.position);
  }

  it("avance la progression après une victoire", async () => {
    const session = createVictorySession();

    const result = await handleGameResult(session, {
      currentLevel: 1,
    });

    expect(result.currentLevel).toBe(2);
  });

  it("sauvegarde la progression après une victoire", async () => {
    const session = createVictorySession();

    await handleGameResult(session, { currentLevel: 1 });

    expect(mockedSaveProgression).toHaveBeenCalledWith({
      currentLevel: 2,
    });
  });

  it("revient au niveau 1 après une défaite au niveau 3", async () => {
    const session = createDefeatSession();

    const result = await handleGameResult(session, {
      currentLevel: 3,
    });

    expect(result.currentLevel).toBe(1);
  });

  it("revient au niveau 1 après une défaite au niveau 5", async () => {
    const session = createDefeatSession();

    const result = await handleGameResult(session, {
      currentLevel: 5,
    });

    expect(result.currentLevel).toBe(1);
  });

  it("revient au niveau 5 après une défaite au niveau 10", async () => {
    const session = createDefeatSession();

    const result = await handleGameResult(session, {
      currentLevel: 10,
    });

    expect(result.currentLevel).toBe(5);
  });

  it("revient au niveau 10 après une défaite au niveau 11", async () => {
    const session = createDefeatSession();

    const result = await handleGameResult(session, {
      currentLevel: 11,
    });

    expect(result.currentLevel).toBe(10);
  });

  it("sauvegarde le checkpoint après une défaite", async () => {
    const session = createDefeatSession();

    await handleGameResult(session, { currentLevel: 11 });

    expect(mockedSaveProgression).toHaveBeenCalledWith({
      currentLevel: 10,
    });
  });

  it("refuse de traiter une partie encore en cours", async () => {
    const session = createGameSession(1);

    await expect(
      handleGameResult(session, { currentLevel: 1 }),
    ).rejects.toThrow(
      "Impossible de traiter une partie qui n’est pas terminée.",
    );

    expect(mockedSaveProgression).not.toHaveBeenCalled();
  });

  it("propage une erreur de sauvegarde", async () => {
    mockedSaveProgression.mockRejectedValue(new Error("Erreur de stockage"));

    const session = createVictorySession();

    await expect(
      handleGameResult(session, { currentLevel: 1 }),
    ).rejects.toThrow("Erreur de stockage");
  });
});

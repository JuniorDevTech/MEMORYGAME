import {
  createGameSession,
  pauseGameSession,
  resumeGameSession,
  selectGameCell,
  startSelectionPhase,
} from "../gameSession";

describe("NEBULA PATH - Game Session", () => {
  it("crée une session au niveau demandé", () => {
    const session = createGameSession(1);

    expect(session.level).toBe(1);
    expect(session.phase).toBe("memorization");
    expect(session.path).toHaveLength(3);
    expect(session.selectedCells).toHaveLength(0);
  });

  it("commence la phase de sélection après la mémorisation", () => {
    const session = createGameSession(1);
    const updatedSession = startSelectionPhase(session);

    expect(updatedSession.phase).toBe("selection");
  });

  it("empêche une sélection pendant la mémorisation", () => {
    const session = createGameSession(1);
    const firstCell = session.path[0];

    const updatedSession = selectGameCell(session, firstCell);

    expect(updatedSession.phase).toBe("memorization");
    expect(updatedSession.selectedCells).toHaveLength(0);
  });

  it("enregistre une sélection correcte", () => {
    const session = startSelectionPhase(createGameSession(1));

    const updatedSession = selectGameCell(session, session.path[0]);

    expect(updatedSession.phase).toBe("selection");
    expect(updatedSession.selectedCells).toHaveLength(1);
  });

  it("déclenche une défaite en cas de mauvaise sélection", () => {
    const session = startSelectionPhase(createGameSession(1));

    const redCell = session.board.find((cell) => cell.type === "red");

    if (!redCell) {
      throw new Error("Aucune case rouge disponible.");
    }

    const updatedSession = selectGameCell(session, redCell.position);

    expect(updatedSession.phase).toBe("defeat");
  });

  it("déclare la victoire lorsque le chemin est entièrement reproduit", () => {
    let session = startSelectionPhase(createGameSession(1));

    for (const cell of session.path) {
      session = selectGameCell(session, cell);
    }

    expect(session.phase).toBe("victory");
    expect(session.selectedCells).toHaveLength(3);
  });

  it("met en pause et reprend correctement une partie", () => {
    const session = startSelectionPhase(createGameSession(1));

    const pausedSession = pauseGameSession(session);

    expect(pausedSession.phase).toBe("paused");

    const resumedSession = resumeGameSession(pausedSession);

    expect(resumedSession.phase).toBe("selection");
    expect(resumedSession.pausedFrom).toBeNull();
  });
});

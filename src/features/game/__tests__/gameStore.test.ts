import { loadProgression, saveProgression } from "../gameStorage";
import { useGameStore } from "../gameStore";

jest.mock("../gameStorage", () => ({
  loadProgression: jest.fn(),
  saveProgression: jest.fn(),
}));

const mockedLoad = jest.mocked(loadProgression);
const mockedSave = jest.mocked(saveProgression);

describe("MEMORYGAME - Zustand Game Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedLoad.mockResolvedValue({ currentLevel: 1 });
    mockedSave.mockResolvedValue(undefined);

    useGameStore.setState({
      session: null,
      progression: { currentLevel: 1 },
      isProgressionLoaded: false,
      isLoading: false,
      isSavingResult: false,
      resultProcessed: false,
      error: null,
    });
  });

  it("charge la progression sauvegardée", async () => {
    mockedLoad.mockResolvedValue({ currentLevel: 4 });

    await useGameStore.getState().loadProgression();

    expect(useGameStore.getState().progression.currentLevel).toBe(4);
    expect(useGameStore.getState().isProgressionLoaded).toBe(true);
  });

  it("démarre une partie au niveau actuel", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();

    expect(useGameStore.getState().session?.level).toBe(1);
    expect(useGameStore.getState().session?.phase).toBe("memorization");
  });

  it("ne démarre pas de partie avant le chargement de la progression", () => {
    useGameStore.getState().startGame();

    expect(useGameStore.getState().session).toBeNull();
  });

  it("passe de la mémorisation à la sélection", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();
    useGameStore.getState().beginSelection();

    expect(useGameStore.getState().session?.phase).toBe("selection");
  });

  it("enregistre une sélection correcte", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();
    useGameStore.getState().beginSelection();

    const firstCell = useGameStore.getState().session!.path[0];

    await useGameStore.getState().selectCell(firstCell);

    expect(useGameStore.getState().session?.selectedCells).toHaveLength(1);
  });

  it("sauvegarde la progression après une victoire", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();
    useGameStore.getState().beginSelection();

    const path = useGameStore.getState().session!.path;

    for (const cell of path) {
      await useGameStore.getState().selectCell(cell);
    }

    expect(useGameStore.getState().session?.phase).toBe("victory");
    expect(useGameStore.getState().progression.currentLevel).toBe(2);
    expect(mockedSave).toHaveBeenCalledWith({ currentLevel: 2 });
    expect(useGameStore.getState().resultProcessed).toBe(true);
  });

  it("déclenche une défaite et sauvegarde la progression", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();
    useGameStore.getState().beginSelection();

    const redCell = useGameStore
      .getState()
      .session!.board.find((cell) => cell.type === "red");

    if (!redCell) {
      throw new Error("Aucune case rouge disponible.");
    }

    await useGameStore.getState().selectCell(redCell.position);

    expect(useGameStore.getState().session?.phase).toBe("defeat");
    expect(mockedSave).toHaveBeenCalledWith({ currentLevel: 1 });
  });

  it("met en pause et reprend la partie", async () => {
    await useGameStore.getState().loadProgression();
    useGameStore.getState().startGame();

    useGameStore.getState().pauseGame();

    expect(useGameStore.getState().session?.phase).toBe("paused");

    useGameStore.getState().resumeGame();

    expect(useGameStore.getState().session?.phase).toBe("memorization");
  });
});

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  clearProgression,
  loadProgression,
  saveProgression,
} from "../gameStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("NEBULA PATH - Game Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedStorage.getItem.mockResolvedValue(null);
    mockedStorage.setItem.mockResolvedValue(undefined);
    mockedStorage.removeItem.mockResolvedValue(undefined);
  });

  it("sauvegarde correctement la progression", async () => {
    await saveProgression({ currentLevel: 5 });

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@memorygame/progression",
      JSON.stringify({ currentLevel: 5 }),
    );
  });

  it("récupère une progression sauvegardée", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({ currentLevel: 7 }),
    );

    const progression = await loadProgression();

    expect(progression.currentLevel).toBe(7);
  });

  it("retourne le niveau 1 si aucune sauvegarde existe", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    const progression = await loadProgression();

    expect(progression.currentLevel).toBe(1);
  });

  it("retourne le niveau 1 si les données sont illisibles", async () => {
    mockedStorage.getItem.mockResolvedValue("{ données invalides");

    const progression = await loadProgression();

    expect(progression.currentLevel).toBe(1);
  });

  it("refuse une progression invalide", async () => {
    await expect(saveProgression({ currentLevel: 0 })).rejects.toThrow(
      "Progression invalide.",
    );
  });

  it("supprime uniquement la clé de progression", async () => {
    await clearProgression();

    expect(mockedStorage.removeItem).toHaveBeenCalledWith(
      "@memorygame/progression",
    );
  });

  it("propage une erreur de sauvegarde", async () => {
    mockedStorage.setItem.mockRejectedValue(new Error("Erreur de stockage"));

    await expect(saveProgression({ currentLevel: 3 })).rejects.toThrow(
      "Erreur de stockage",
    );
  });
});

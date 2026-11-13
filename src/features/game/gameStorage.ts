import AsyncStorage from "@react-native-async-storage/async-storage";

import { createProgression, type GameProgression } from "./gameProgression";

const PROGRESSION_STORAGE_KEY = "@memorygame/progression";

/**
 * Vérifie que les données récupérées sont valides.
 */
function isValidProgression(value: unknown): value is GameProgression {
  if (
    typeof value !== "object" ||
    value === null ||
    !("currentLevel" in value)
  ) {
    return false;
  }

  return (
    typeof value.currentLevel === "number" &&
    Number.isInteger(value.currentLevel) &&
    value.currentLevel >= 1
  );
}

/**
 * Sauvegarde la progression principale.
 */
export async function saveProgression(
  progression: GameProgression,
): Promise<void> {
  if (!isValidProgression(progression)) {
    throw new Error("Progression invalide.");
  }

  const serializedProgression = JSON.stringify(progression);

  await AsyncStorage.setItem(PROGRESSION_STORAGE_KEY, serializedProgression);
}

/**
 * Récupère la progression sauvegardée.
 *
 * Si aucune sauvegarde n'existe ou si les données
 * sont illisibles, retourne une nouvelle progression.
 */
export async function loadProgression(): Promise<GameProgression> {
  const savedData = await AsyncStorage.getItem(PROGRESSION_STORAGE_KEY);

  if (savedData === null) {
    return createProgression();
  }

  try {
    const parsedData: unknown = JSON.parse(savedData);

    if (!isValidProgression(parsedData)) {
      return createProgression();
    }

    return parsedData;
  } catch {
    return createProgression();
  }
}

/**
 * Supprime uniquement la progression principale.
 *
 * Les statistiques historiques ne sont pas concernées.
 */
export async function clearProgression(): Promise<void> {
  await AsyncStorage.removeItem(PROGRESSION_STORAGE_KEY);
}

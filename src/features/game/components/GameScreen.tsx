import { useEffect, useState } from "react";

import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import GameResultFeedback from "@/components/../features/game/components/GameResultFeedback";
import { useGameStore } from "@/features/game/gameStore";

const victorySound = require("../../../../assets/sounds/victory.mp3");
const defeatSound = require("../../../../assets/sounds/defeat.mp3");

type GameScreenProps = {
  onBackToMenu: () => void;
};

export default function GameScreen({ onBackToMenu }: GameScreenProps) {
  const [boardWidth, setBoardWidth] = useState(0);

  const session = useGameStore((state) => state.session);
  const progression = useGameStore((state) => state.progression);

  const loadProgression = useGameStore((state) => state.loadProgression);

  const selectCell = useGameStore((state) => state.selectCell);
  const advanceTime = useGameStore((state) => state.advanceTime);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const startGame = useGameStore((state) => state.startGame);

  const isProgressionLoaded = useGameStore(
    (state) => state.isProgressionLoaded,
  );

  const isLoading = useGameStore((state) => state.isLoading);
  const error = useGameStore((state) => state.error);

  // Chargement de la progression et démarrage de la partie.
  useEffect(() => {
    let mounted = true;

    const initializeGame = async () => {
      if (!useGameStore.getState().isProgressionLoaded) {
        await loadProgression();
      }

      if (!mounted) return;

      const state = useGameStore.getState();

      if (state.isProgressionLoaded) {
        state.startGame();
      }
    };

    void initializeGame();

    return () => {
      mounted = false;
    };
  }, [loadProgression]);

  // Chronomètre : suspendu automatiquement pendant la pause.
  useEffect(() => {
    if (
      !session ||
      (session.phase !== "memorization" && session.phase !== "selection")
    ) {
      return;
    }

    const timer = setInterval(() => {
      void advanceTime(0.1);
    }, 100);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.phase, advanceTime]);

  // Écran de chargement.
  if (isLoading || !isProgressionLoaded || !session) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.loadingText}>PRÉPARATION DE LA PARTIE...</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  const isPaused = session.phase === "paused";
  const isVictory = session.phase === "victory";
  const isDefeat = session.phase === "defeat";

  // Pendant la pause, on conserve l'affichage de la phase précédente.
  const isMemorizing =
    session.phase === "memorization" ||
    (isPaused && session.pausedFrom === "memorization");

  const isSelecting =
    session.phase === "selection" ||
    (isPaused && session.pausedFrom === "selection");

  // Remet les cellules dans leur ordre visuel.
  const orderedCells = [...session.board].sort(
    (first, second) =>
      first.position.row - second.position.row ||
      first.position.column - second.position.column,
  );

  const handleCellPress = (row: number, column: number) => {
    if (!isSelecting || isPaused) return;

    void selectCell({ row, column });
  };

  // Le store gère la progression après une victoire.
  const handleNextLevel = () => {
    if (!isVictory) return;

    startGame();
  };

  // Le store applique les règles de redémarrage après une défaite.
  const handleRestart = () => {
    if (!isDefeat) return;

    startGame();
  };

  const phaseTitle = isMemorizing
    ? "MÉMORISEZ LE CHEMIN"
    : isSelecting
      ? "À VOUS DE JOUER"
      : isPaused
        ? "PARTIE EN PAUSE"
        : isVictory
          ? "PARCOURS RÉUSSI"
          : "PARCOURS ÉCHOUÉ";

  const instruction = isMemorizing
    ? "Retenez l'ordre des cases bleues."
    : isSelecting
      ? "Reproduisez le chemin dans le bon ordre."
      : isPaused
        ? "Votre partie est suspendue."
        : isVictory
          ? "Félicitations ! Parcours terminé."
          : "Le chemin correct est révélé.";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>MEMORYGAME</Text>

        <View style={styles.headerActions}>
          <View style={styles.levelBadge}>
            <Text style={styles.level}>NIVEAU {progression.currentLevel}</Text>
          </View>

          {(isMemorizing || isSelecting) && (
            <Pressable
              style={styles.pauseIconButton}
              onPress={pauseGame}
              accessibilityRole="button"
              accessibilityLabel="Mettre la partie en pause"
            >
              <Text style={styles.pauseIcon}>Ⅱ</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* INSTRUCTIONS */}
      <View style={styles.instructionContainer}>
        <Text style={styles.phaseLabel}>{phaseTitle}</Text>

        <Text style={styles.instruction}>{instruction}</Text>
      </View>

      {/* PLATEAU DE JEU */}
      <View style={styles.boardContainer}>
        <View
          style={styles.board}
          onLayout={(event) => {
            setBoardWidth(event.nativeEvent.layout.width);
          }}
        >
          {boardWidth > 0 &&
            orderedCells.map((cell) => {
              const { row, column } = cell.position;

              const isSelected = cell.isSelected;
              const isPathCell = cell.type === "blue";

              const showPath = isMemorizing || isDefeat;
              const revealPath = isDefeat && isPathCell;

              const pathIndex = session.path.findIndex(
                (position) =>
                  position.row === row && position.column === column,
              );

              const columns = session.config.grid.columns;
              const cellSize = boardWidth / columns;

              let backgroundColor = "#14233C";

              if (showPath && isPathCell) {
                backgroundColor = "#168BFF";
              } else if (showPath && !isPathCell) {
                backgroundColor = "#A92742";
              } else if (isSelected) {
                backgroundColor = "#168BFF";
              }

              // Numéros pendant la mémorisation.
              const showMemorizationNumber = isMemorizing && isPathCell;

              // Numéros des cases sélectionnées.
              const showSelectionNumber = isSelecting && isSelected;

              // Révélation du parcours après une défaite.
              const showDefeatNumber = revealPath;

              const shouldShowNumber =
                showMemorizationNumber ||
                showSelectionNumber ||
                showDefeatNumber;

              const displayedNumber =
                showMemorizationNumber || showDefeatNumber
                  ? pathIndex + 1
                  : cell.selectionOrder;

              return (
                <Pressable
                  key={`${row}-${column}`}
                  disabled={!isSelecting || isPaused}
                  onPress={() => handleCellPress(row, column)}
                  accessibilityRole="button"
                  accessibilityLabel={`Case ligne ${row + 1}, colonne ${column + 1}`}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor,
                    },
                  ]}
                >
                  {shouldShowNumber ? (
                    <Text style={styles.cellNumber}>{displayedNumber}</Text>
                  ) : null}
                </Pressable>
              );
            })}
        </View>
      </View>

      {/* PROGRESSION */}
      <View style={styles.progressContainer}>
        {isSelecting || isVictory ? (
          <Text style={styles.progressText}>
            {session.selectedCells.length} / {session.path.length} CASES
          </Text>
        ) : isMemorizing ? (
          <Text style={styles.progressText}>PRÉPAREZ-VOUS</Text>
        ) : null}
      </View>

      {/* PANNEAU DE PAUSE */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <View style={styles.pauseCircle}>
              <Text style={styles.pauseCircleIcon}>Ⅱ</Text>
            </View>

            <Text style={styles.pauseEyebrow}>PARTIE EN PAUSE</Text>

            <Text style={styles.pauseTitle}>Reprenez votre souffle</Text>

            <Pressable
              style={({ pressed }) => [
                styles.resumeButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={resumeGame}
            >
              <Text style={styles.resumeText}>Reprendre ›</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.restartButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={startGame}
            >
              <Text style={styles.secondaryButtonText}>↻ Recommencer</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onBackToMenu}
            >
              <Text style={styles.secondaryButtonText}>⌂ Retour au menu</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* RÉSULTAT : VICTOIRE OU DÉFAITE */}
      {(isVictory || isDefeat) && (
        <GameResultFeedback
          result={isVictory ? "victory" : "defeat"}
          onNext={handleNextLevel}
          onReplay={handleRestart}
          victorySoundSource={victorySound}
          defeatSoundSource={defeatSound}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030817",
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#030817",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#168BFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  levelBadge: {
    backgroundColor: "#10213B",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },

  level: {
    color: "#168BFF",
    fontWeight: "800",
    fontSize: 12,
  },

  instructionContainer: {
    alignItems: "center",
    marginBottom: 28,
    gap: 9,
  },

  phaseLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  instruction: {
    color: "#8EA8CA",
    fontSize: 13,
    textAlign: "center",
  },

  boardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  board: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
  },

  cell: {
    flexShrink: 0,
    borderWidth: 2,
    borderColor: "#030817",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  cellNumber: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  progressContainer: {
    minHeight: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  progressText: {
    color: "#8EA8CA",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  /* BOUTON PAUSE */

  pauseIconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#101B2D",
    borderWidth: 1,
    borderColor: "#263A55",
    alignItems: "center",
    justifyContent: "center",
  },

  pauseIcon: {
    color: "#A9C9F3",
    fontSize: 19,
    fontWeight: "800",
  },

  /* OVERLAY DE PAUSE */

  pauseOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(1, 5, 16, 0.88)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingBottom: 12,
    zIndex: 100,
  },

  pauseModal: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#0D192C",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#203957",
    paddingHorizontal: 18,
    paddingTop: 35,
    paddingBottom: 18,
    alignItems: "center",
  },

  pauseCircle: {
    position: "absolute",
    top: -25,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#102C50",
    borderWidth: 2,
    borderColor: "#168BFF",
    alignItems: "center",
    justifyContent: "center",
  },

  pauseCircleIcon: {
    color: "#168BFF",
    fontSize: 23,
    fontWeight: "800",
  },

  pauseEyebrow: {
    color: "#6684AA",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
  },

  pauseTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
  },

  resumeButton: {
    width: "100%",
    height: 49,
    backgroundColor: "#0878E9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  resumeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  restartButton: {
    width: "100%",
    height: 47,
    backgroundColor: "#101E32",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#203957",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  menuButton: {
    width: "100%",
    height: 47,
    backgroundColor: "#101E32",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#203957",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#A9BBD4",
    fontSize: 12,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  errorText: {
    color: "#FF647C",
    textAlign: "center",
    marginTop: 12,
  },
});

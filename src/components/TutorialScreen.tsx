import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  LinearTransition,
} from "react-native-reanimated";

const TUTORIAL_STEPS = [
  {
    number: "01",
    title: "Mémorisez le chemin",
    subtitle: "Observez attentivement",
    description:
      "Les cases bleues représentent le bon parcours. Les cases rouges sont des pièges à éviter.",
    cells: ["blue", "blue", "red", "red", "blue", "red", "red", "blue", "blue"],
    marker: 0,
    legend: true,
    badge: "OBSERVATION",
  },
  {
    number: "02",
    title: "Reproduisez le parcours",
    subtitle: "Suivez le bon ordre",
    description:
      "Retrouvez les cases bleues une par une, dans le même ordre que celui que vous avez mémorisé.",
    cells: ["blue", "blue", "red", "red", "blue", "red", "red", "blue", "blue"],
    marker: -1,
    legend: false,
    badge: "MÉMORISATION",
  },
  {
    number: "03",
    title: "Évitez les erreurs",
    subtitle: "Restez concentré",
    description:
      "Une mauvaise case, un mauvais ordre ou un retour sur une case déjà choisie entraîne la défaite.",
    cells: ["blue", "blue", "red", "red", "blue", "red", "red", "blue", "blue"],
    marker: 2,
    legend: false,
    badge: "ATTENTION",
  },
] as const;

const PATH_NUMBERS: Record<number, string> = {
  0: "1",
  1: "2",
  4: "3",
  7: "4",
  8: "5",
};

export default function TutorialScreen({
  onComplete,
  onBack,
}: {
  onComplete?: () => void;
  onBack?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const { width } = useWindowDimensions();

  const step = TUTORIAL_STEPS[currentStep];

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const boardSize = Math.min(width - 100, 270);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    } else {
      onBack?.();
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((previous) => previous + 1);
      return;
    }

    if (onComplete) {
      onComplete();
    } else {
      Alert.alert(
        "Tutoriel terminé",
        "Vous êtes prêt à commencer votre première partie !",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Revenir à l'étape précédente"
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>GUIDE DU JOUEUR</Text>
            <Text style={styles.headerSubtitle}>APPRENEZ LES RÈGLES</Text>
          </View>

          <View style={styles.stepCounter}>
            <Text style={styles.stepCounterText}>
              {String(currentStep + 1).padStart(2, "0")}
              <Text style={styles.stepCounterSeparator}>{" / "}</Text>
              {String(TUTORIAL_STEPS.length).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {/* PROGRESS BAR */}

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              key={currentStep}
              entering={FadeIn.duration(250)}
              style={[
                styles.progressFill,
                {
                  width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressLabel}>
            {Math.round(((currentStep + 1) / TUTORIAL_STEPS.length) * 100)}%
            TERMINÉ
          </Text>
        </View>

        {/* MAIN CONTENT */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            key={currentStep}
            entering={FadeInDown.duration(400)}
            style={styles.content}
          >
            {/* STEP INFORMATION */}

            <View style={styles.stepBadge}>
              <View style={styles.stepBadgeDot} />

              <Text style={styles.stepBadgeText}>
                ÉTAPE {step.number} · {step.badge}
              </Text>
            </View>

            <Text style={styles.title}>{step.title}</Text>

            <Text style={styles.subtitle}>{step.subtitle}</Text>

            <Text style={styles.description}>{step.description}</Text>

            {/* GAME BOARD */}

            <Animated.View
              entering={FadeInUp.delay(120).duration(450)}
              style={styles.boardSection}
            >
              <View style={styles.boardCard}>
                <View style={styles.boardHeader}>
                  <View>
                    <Text style={styles.boardEyebrow}>APERÇU DU JEU</Text>

                    <Text style={styles.boardTitle}>Votre parcours</Text>
                  </View>

                  <View style={styles.boardLevel}>
                    <Text style={styles.boardLevelText}>NIVEAU 01</Text>
                  </View>
                </View>

                {/* GRID : 3 COLONNES ET 3 LIGNES */}

                <View
                  style={[
                    styles.board,
                    {
                      width: boardSize,
                      height: boardSize,
                    },
                  ]}
                >
                  {[0, 1, 2].map((row) => (
                    <View key={row} style={styles.boardRow}>
                      {[0, 1, 2].map((column) => {
                        const index = row * 3 + column;
                        const cell = step.cells[index];
                        const isBlue = cell === "blue";
                        const isRed = cell === "red";

                        const pathNumber =
                          currentStep === 1 ? PATH_NUMBERS[index] : undefined;

                        return (
                          <Animated.View
                            key={`${currentStep}-${index}`}
                            layout={LinearTransition.duration(250)}
                            style={[
                              styles.cell,
                              isBlue && styles.blueCell,
                              isRed && styles.redCell,
                              currentStep === 2 &&
                                index === step.marker &&
                                styles.dangerCell,
                            ]}
                          >
                            {currentStep === 0 && index === 0 && (
                              <View style={styles.marker} />
                            )}

                            {pathNumber && (
                              <Text style={styles.pathNumber}>
                                {pathNumber}
                              </Text>
                            )}

                            {currentStep === 2 && isRed && (
                              <Text style={styles.warningIcon}>!</Text>
                            )}
                          </Animated.View>
                        );
                      })}
                    </View>
                  ))}
                </View>

                {/* LEGEND */}

                {step.legend ? (
                  <View style={styles.legend}>
                    <View style={styles.legendItem}>
                      <View style={styles.blueDot} />
                      <Text style={styles.legendText}>BONNE CASE</Text>
                    </View>

                    <View style={styles.legendDivider} />

                    <View style={styles.legendItem}>
                      <View style={styles.redDot} />
                      <Text style={styles.legendText}>PIÈGE</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.boardHint}>
                    {currentStep === 1
                      ? "Suivez les numéros dans l'ordre."
                      : "Les cases rouges sont interdites."}
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* TIP CARD */}

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipIconText}>✦</Text>
              </View>

              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>CONSEIL DU JEU</Text>

                <Text style={styles.tipDescription}>
                  {currentStep === 0
                    ? "Prenez le temps d'observer toutes les cases avant de commencer."
                    : currentStep === 1
                      ? "Mémorisez la position et l'ordre des cases bleues."
                      : "La concentration est votre meilleure alliée pour réussir."}
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomContainer}>
          {/* PAGINATION */}

          <View style={styles.pagination}>
            {TUTORIAL_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentStep === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* BUTTONS */}

          <View style={styles.navigation}>
            {currentStep > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.previousButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleBack}
                accessibilityRole="button"
              >
                <Text style={styles.previousButtonText}>Précédent</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                currentStep > 0 && styles.nextButtonFlexible,
                pressed && styles.pressed,
              ]}
              onPress={handleNext}
              accessibilityRole="button"
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? "Commencer à jouer" : "Étape suivante"}
              </Text>

              <Text style={styles.nextArrow}>›</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            MEMORY GAME · APPRENEZ EN JOUANT
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070B18",
  },

  container: {
    flex: 1,
    backgroundColor: "#070B18",
    paddingHorizontal: 22,
  },

  /* HEADER */

  header: {
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#111D32",
    borderWidth: 1,
    borderColor: "#263B59",
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    color: "#D6E8FF",
    fontSize: 30,
    lineHeight: 34,
    marginTop: -3,
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  headerSubtitle: {
    color: "#647A98",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 5,
  },

  stepCounter: {
    minWidth: 47,
    alignItems: "flex-end",
  },

  stepCounterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  stepCounterSeparator: {
    color: "#637B99",
  },

  /* PROGRESS */

  progressContainer: {
    marginTop: 9,
    marginBottom: 22,
  },

  progressTrack: {
    height: 4,
    backgroundColor: "#1A2B42",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#168BFF",
    borderRadius: 10,
  },

  progressLabel: {
    color: "#637C9D",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
    textAlign: "right",
  },

  /* CONTENT */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#102746",
    borderWidth: 1,
    borderColor: "#1C426C",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 16,
    gap: 8,
  },

  stepBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#168BFF",
  },

  stepBadgeText: {
    color: "#83B9F2",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.7,
    textAlign: "center",
  },

  subtitle: {
    color: "#168BFF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },

  description: {
    color: "#8A9DB8",
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 320,
  },

  /* BOARD */

  boardSection: {
    width: "100%",
    marginTop: 24,
  },

  boardCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#0D1729",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#1D304B",
    paddingHorizontal: 15,
    paddingTop: 17,
    paddingBottom: 16,
  },

  boardHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19,
  },

  boardEyebrow: {
    color: "#6886A9",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  boardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 5,
  },

  boardLevel: {
    backgroundColor: "#172E4B",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  boardLevelText: {
    color: "#6BB5FF",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  board: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 8,
    padding: 10,
    backgroundColor: "#071426",
    borderWidth: 1,
    borderColor: "#1C3554",
    borderRadius: 17,
    shadowColor: "#087BFF",
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 4,
  },

  boardRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#0B1728",
    borderWidth: 1,
    borderColor: "#1A2D45",
    alignItems: "center",
    justifyContent: "center",
  },

  blueCell: {
    backgroundColor: "#0878E9",
    borderColor: "#45A8FF",
    shadowColor: "#168BFF",
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },

  redCell: {
    backgroundColor: "#841C39",
    borderColor: "#F04468",
    shadowColor: "#FF315C",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  dangerCell: {
    borderWidth: 2,
    borderColor: "#FF9BAC",
  },

  marker: {
    width: 17,
    height: 17,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 6,
  },

  pathNumber: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  warningIcon: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  /* LEGEND */

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginTop: 18,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#168BFF",
  },

  redDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#FF315C",
  },

  legendDivider: {
    width: 1,
    height: 13,
    backgroundColor: "#2B405B",
  },

  legendText: {
    color: "#8295AE",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  boardHint: {
    color: "#7890AD",
    fontSize: 10,
    marginTop: 17,
  },

  /* TIP */

  tipCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10213A",
    borderWidth: 1,
    borderColor: "#203D60",
    borderRadius: 15,
    padding: 13,
    marginTop: 16,
  },

  tipIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#193B61",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  tipIconText: {
    color: "#60B3FF",
    fontSize: 19,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: "#72B7FF",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  tipDescription: {
    color: "#A5B8D0",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  /* BOTTOM */

  bottomContainer: {
    paddingTop: 10,
    paddingBottom: 9,
  },

  pagination: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 13,
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#2B3D56",
  },

  activeDot: {
    width: 22,
    backgroundColor: "#168BFF",
  },

  /* NAVIGATION */

  navigation: {
    flexDirection: "row",
    gap: 10,
  },

  previousButton: {
    width: "32%",
    height: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#29415E",
    backgroundColor: "#111D30",
    alignItems: "center",
    justifyContent: "center",
  },

  previousButtonText: {
    color: "#B6C8DF",
    fontSize: 11,
    fontWeight: "800",
  },

  nextButton: {
    flex: 1,
    height: 51,
    borderRadius: 14,
    backgroundColor: "#0868E5",
    borderWidth: 1,
    borderColor: "#3998FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#087BFF",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  nextButtonFlexible: {
    flex: 1,
  },

  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  nextArrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 12,
    marginTop: -3,
  },

  footerText: {
    color: "#455A76",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 16,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});

import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOARD = [
  ["blue", "empty", "red"],
  ["blue", "blue", "red"],
  ["empty", "blue", "blue"],
] as const;

export default function HomeScreen({ onNewGame }: { onNewGame: () => void }) {
  const handleContinue = () => {
    Alert.alert("Continuer", "Aucune partie sauvegardée pour le moment.");
  };

  const handleProgress = () => {
    Alert.alert(
      "Votre progression",
      "Vos statistiques seront disponibles prochainement.",
    );
  };

  const handleSettings = () => {
    Alert.alert("Paramètres", "Les paramètres seront bientôt disponibles.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcome}>ESPACE JOUEUR</Text>
              <Text style={styles.headerTitle}>Bon retour !</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.pressed,
              ]}
              onPress={handleSettings}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir les paramètres"
            >
              <Text style={styles.settingsIcon}>⚙</Text>
            </Pressable>
          </View>

          {/* BRAND */}
          <View style={styles.brandSection}>
            <View style={styles.brand}>
              <View style={styles.logoMark}>
                <View style={[styles.diamond, styles.diamondBlue]} />
                <View style={[styles.diamond, styles.diamondRed]} />
                <View style={[styles.diamond, styles.diamondTop]} />
                <View style={[styles.diamond, styles.diamondBottom]} />
              </View>

              <View>
                <Text style={styles.logoMemory}>MEMORY</Text>
                <Text style={styles.logoGame}>GAME</Text>
              </View>
            </View>

            <Text style={styles.tagline}>Mémorisez. Avancez. Gagnez.</Text>

            <View style={styles.versionBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.versionText}>VERSION 1.0</Text>
            </View>
          </View>

          {/* GAME PREVIEW */}
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>PRÊT À JOUER ?</Text>
                <Text style={styles.previewTitle}>
                  Votre prochaine aventure
                </Text>
              </View>

              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LVL 01</Text>
              </View>
            </View>

            <View style={styles.boardContainer}>
              <View style={styles.boardGlow} />

              <View style={styles.board}>
                {BOARD.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.boardRow}>
                    {row.map((cell, cellIndex) => (
                      <View
                        key={`${rowIndex}-${cellIndex}`}
                        style={[
                          styles.boardCell,
                          cell === "blue" && styles.boardBlue,
                          cell === "red" && styles.boardRed,
                        ]}
                      >
                        {rowIndex === 0 && cellIndex === 0 && (
                          <View style={styles.pawn} />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.previewDescription}>
              Testez votre mémoire et relevez de nouveaux défis.
            </Text>
          </View>

          {/* MAIN ACTIONS */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionEyebrow}>CENTRE DE JEU</Text>

            {/* NEW GAME */}
            <Pressable
              style={({ pressed }) => [
                styles.newGameButton,
                pressed && styles.pressed,
              ]}
              onPress={onNewGame}
              accessibilityRole="button"
            >
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>

              <View style={styles.newGameContent}>
                <Text style={styles.newGameText}>Nouvelle partie</Text>
                <Text style={styles.newGameSubtitle}>
                  Commencer une nouvelle aventure
                </Text>
              </View>

              <Text style={styles.buttonArrow}>›</Text>
            </Pressable>

            {/* CONTINUE */}
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.pressed,
              ]}
              onPress={handleContinue}
              accessibilityRole="button"
            >
              <View style={styles.continueIcon}>
                <Text style={styles.continueIconText}>Ⅱ</Text>
              </View>

              <View style={styles.continueContent}>
                <Text style={styles.continueText}>Continuer</Text>
                <Text style={styles.continueSubtitle}>
                  Reprendre votre progression
                </Text>
              </View>

              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>AUCUNE SAUVEGARDE</Text>
              </View>
            </Pressable>
          </View>

          {/* PROGRESSION */}
          <View style={styles.progressSection}>
            <Pressable
              style={({ pressed }) => [
                styles.progressCard,
                pressed && styles.pressed,
              ]}
              onPress={handleProgress}
              accessibilityRole="button"
            >
              <View style={styles.progressIcon}>
                <Text style={styles.progressIconText}>▦</Text>
              </View>

              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>VOTRE PROGRESSION</Text>

                <View style={styles.progressHeading}>
                  <Text style={styles.progressValue}>0% terminé</Text>
                  <Text style={styles.progressPercent}>0 / 100</Text>
                </View>

                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
              </View>

              <Text style={styles.progressArrow}>›</Text>
            </Pressable>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.footerText}>MEMORY GAME</Text>

            <Text style={styles.footerCopyright}>
              Une expérience de réflexion et de mémoire.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070B18",
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  welcome: {
    color: "#71839F",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 5,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#111D32",
    borderWidth: 1,
    borderColor: "#243751",
    alignItems: "center",
    justifyContent: "center",
  },

  settingsIcon: {
    color: "#A9C9F3",
    fontSize: 23,
  },

  /* BRAND */

  brandSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoMark: {
    width: 47,
    height: 47,
    marginRight: 12,
  },

  diamond: {
    position: "absolute",
    width: 16,
    height: 16,
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
  },

  diamondBlue: {
    left: 3,
    top: 15,
    borderColor: "#168BFF",
  },

  diamondRed: {
    right: 3,
    top: 15,
    borderColor: "#FF315C",
  },

  diamondTop: {
    left: 15,
    top: 2,
    borderColor: "#168BFF",
  },

  diamondBottom: {
    left: 15,
    bottom: 1,
    borderColor: "#168BFF",
  },

  logoMemory: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
    lineHeight: 25,
  },

  logoGame: {
    color: "#168BFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
    lineHeight: 25,
  },

  tagline: {
    color: "#8293AE",
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 0.5,
  },

  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#102139",
    borderWidth: 1,
    borderColor: "#1E3A5C",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 15,
    gap: 7,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#22D69B",
  },

  versionText: {
    color: "#91B7E2",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  /* GAME PREVIEW */

  previewSection: {
    backgroundColor: "#0D1729",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1B2D48",
    padding: 18,
    marginBottom: 28,
    overflow: "hidden",
  },

  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionEyebrow: {
    color: "#6383A9",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  previewTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  levelBadge: {
    backgroundColor: "#172D4A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  levelText: {
    color: "#55A8FF",
    fontSize: 10,
    fontWeight: "900",
  },

  boardContainer: {
    height: 155,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  boardGlow: {
    position: "absolute",
    width: 130,
    height: 100,
    borderRadius: 70,
    backgroundColor: "#0878E9",
    opacity: 0.1,
  },

  board: {
    width: 170,
    height: 115,
    padding: 9,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#244B75",
    backgroundColor: "#071426",
    gap: 6,
    transform: [
      { perspective: 500 },
      { rotateX: "12deg" },
      { rotateZ: "-4deg" },
    ],
    shadowColor: "#087BFF",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 7,
  },

  boardRow: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },

  boardCell: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1A2B40",
    backgroundColor: "#0B1728",
    justifyContent: "center",
    alignItems: "center",
  },

  boardBlue: {
    backgroundColor: "#0878E9",
    borderColor: "#40A5FF",
    shadowColor: "#168BFF",
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 4,
  },

  boardRed: {
    backgroundColor: "#8B2040",
    borderColor: "#FF426D",
    shadowColor: "#FF315C",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 3,
  },

  pawn: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 5,
  },

  previewDescription: {
    color: "#8293AE",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
  },

  /* ACTIONS */

  actionsSection: {
    marginBottom: 20,
  },

  newGameButton: {
    minHeight: 76,
    backgroundColor: "#0868E5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#318EFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 8,
    shadowColor: "#087BFF",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },

  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  playIconText: {
    color: "#0868E5",
    fontSize: 15,
    marginLeft: 3,
  },

  newGameContent: {
    flex: 1,
  },

  newGameText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  newGameSubtitle: {
    color: "#D5E8FF",
    fontSize: 10,
    marginTop: 5,
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 27,
    marginLeft: 8,
  },

  /* CONTINUE */

  continueButton: {
    minHeight: 70,
    backgroundColor: "#101B2D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#263A55",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginTop: 11,
  },

  continueIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#1B2C45",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  continueIconText: {
    color: "#8EBBEE",
    fontSize: 18,
    fontWeight: "900",
  },

  continueContent: {
    flex: 1,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  continueSubtitle: {
    color: "#71839F",
    fontSize: 9,
    marginTop: 5,
  },

  saveBadge: {
    backgroundColor: "#1C2638",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 7,
  },

  saveBadgeText: {
    color: "#71839F",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  /* PROGRESS */

  progressSection: {
    marginBottom: 25,
  },

  progressCard: {
    minHeight: 91,
    backgroundColor: "#0D1729",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#1D304B",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  progressIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#142D4B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  progressIconText: {
    color: "#45A3FF",
    fontSize: 22,
  },

  progressInfo: {
    flex: 1,
  },

  progressLabel: {
    color: "#7189A7",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  progressHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  progressValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  progressPercent: {
    color: "#45A3FF",
    fontSize: 10,
    fontWeight: "800",
  },

  progressTrack: {
    height: 5,
    backgroundColor: "#1C2D44",
    borderRadius: 10,
    marginTop: 9,
    overflow: "hidden",
  },

  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: "#168BFF",
    borderRadius: 10,
  },

  progressArrow: {
    color: "#7189A7",
    fontSize: 25,
    marginLeft: 10,
  },

  /* FOOTER */

  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 10,
  },

  footerLine: {
    width: 45,
    height: 3,
    borderRadius: 5,
    backgroundColor: "#1D3D60",
    marginBottom: 13,
  },

  footerText: {
    color: "#7189A7",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2.5,
  },

  footerCopyright: {
    color: "#42536D",
    fontSize: 9,
    marginTop: 6,
  },

  /* INTERACTIONS */

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});

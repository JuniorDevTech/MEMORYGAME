import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const GRID = [
  ["blue", "blue", "red", "empty"],
  ["blue", "blue", "blue", "red"],
  ["empty", "blue", "blue", "blue"],
  ["blue", "empty", "blue", "red"],
] as const;

export default function SplashScreen() {
  const { width, height } = useWindowDimensions();

  const progress = useSharedValue(0);
  const pulse = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const glow = useSharedValue(0);
  const gridAnimation = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(0.92, {
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    glow.value = withRepeat(
      withTiming(1, {
        duration: 2400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    gridAnimation.value = withRepeat(
      withTiming(1, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    logoScale.value = withSequence(
      withTiming(1.06, {
        duration: 700,
        easing: Easing.out(Easing.back(1.3)),
      }),
      withTiming(1, {
        duration: 400,
      }),
    );
  }, [glow, gridAnimation, logoScale, progress, pulse]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.12, 0.35]),
    transform: [
      {
        scale: interpolate(glow.value, [0, 1], [0.9, 1.2]),
      },
    ],
  }));

  const gridAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateX: "48deg" },
      {
        translateY: interpolate(gridAnimation.value, [0, 1], [-8, 8]),
      },
    ],
  }));

  const diamondAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(pulse.value, [0, 1], [0, 45])}deg`,
      },
      {
        scale: interpolate(pulse.value, [0, 1], [1, 1.13]),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      <Animated.View
        pointerEvents="none"
        style={[styles.centerGlow, glowAnimatedStyle]}
      />

      {/* BACKGROUND GRID */}

      <Animated.View
        style={[
          styles.gridContainer,
          { width: width * 1.15 },
          gridAnimatedStyle,
        ]}
      >
        {GRID.map((row, rowIndex) => (
          <View style={styles.gridRow} key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <View
                key={`${rowIndex}-${cellIndex}`}
                style={[
                  styles.gridCell,
                  cell === "blue" && styles.blueCell,
                  cell === "red" && styles.redCell,
                ]}
              />
            ))}
          </View>
        ))}
      </Animated.View>

      {/* LOGO */}

      <Animated.View
        style={[
          styles.logoContainer,
          logoAnimatedStyle,
          { top: height * 0.16 },
        ]}
      >
        <View style={styles.logoMark}>
          <Animated.View
            style={[styles.diamond, styles.diamondBlue, diamondAnimatedStyle]}
          />

          <Animated.View
            style={[styles.diamond, styles.diamondRed, diamondAnimatedStyle]}
          />

          <Animated.View
            style={[styles.diamond, styles.diamondSmall, diamondAnimatedStyle]}
          />
        </View>

        <Text style={styles.logoText}>
          MEMORY
          <Text style={styles.logoAccent}>GAME</Text>
        </Text>

        <View style={styles.taglineContainer}>
          <View style={styles.taglineLine} />

          <Text style={styles.tagline}>RÉVEILLEZ VOTRE MÉMOIRE</Text>

          <View style={styles.taglineLine} />
        </View>
      </Animated.View>

      {/* LOADING */}

      <View
        style={[
          styles.loaderContainer,
          { top: height * 0.57, width: Math.min(width * 0.58, 220) },
        ]}
      >
        <View style={styles.loadingHeader}>
          <Text style={styles.loadingLabel}>INITIALISATION</Text>

          <Text style={styles.loadingDots}>• • •</Text>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />

          <Animated.View style={[styles.progressGlow, progressStyle]} />
        </View>

        <Text style={styles.loadingSubtitle}>
          Préparation de votre expérience...
        </Text>
      </View>

      {/* BOTTOM */}

      <View style={styles.bottomContainer}>
        <View style={styles.bottomLine} />

        <Text style={styles.version}>MEMORY GAME • V1.0</Text>

        <Text style={styles.copyright}>THINK SMART. PLAY BETTER.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B18",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "#073B79",
    opacity: 0.1,
    top: "30%",
    alignSelf: "center",
  },

  centerGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 150,
    backgroundColor: "#087BFF",
    top: "38%",
  },

  /* GRID */

  gridContainer: {
    position: "absolute",
    top: "38%",
    height: "23%",
    opacity: 0.58,
    justifyContent: "center",
  },

  gridRow: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
    marginBottom: 7,
  },

  gridCell: {
    flex: 1,
    backgroundColor: "#0B1729",
    borderWidth: 1,
    borderColor: "#172D49",
    borderRadius: 6,
  },

  blueCell: {
    backgroundColor: "#0A3159",
    borderColor: "#1676C8",
    shadowColor: "#168BFF",
    shadowOpacity: 0.5,
    shadowRadius: 9,
    elevation: 3,
  },

  redCell: {
    backgroundColor: "#351326",
    borderColor: "#A42B50",
    shadowColor: "#FF315C",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  /* LOGO */

  logoContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 5,
  },

  logoMark: {
    width: 65,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  diamond: {
    position: "absolute",
    width: 22,
    height: 22,
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
  },

  diamondBlue: {
    borderColor: "#168BFF",
    left: 7,
    shadowColor: "#168BFF",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },

  diamondRed: {
    borderColor: "#FF315C",
    right: 7,
    shadowColor: "#FF315C",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },

  diamondSmall: {
    width: 15,
    height: 15,
    borderColor: "#7BC3FF",
    top: 0,
    backgroundColor: "#0B1B31",
    shadowColor: "#168BFF",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: 3,
  },

  logoAccent: {
    color: "#168BFF",
  },

  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 9,
  },

  taglineLine: {
    width: 19,
    height: 1,
    backgroundColor: "#27517C",
  },

  tagline: {
    color: "#8FB7E5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
  },

  /* LOADING */

  loaderContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 5,
  },

  loadingHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  loadingLabel: {
    color: "#A4B8D1",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },

  loadingDots: {
    color: "#168BFF",
    fontSize: 10,
  },

  progressTrack: {
    width: "100%",
    height: 5,
    backgroundColor: "#1B2B42",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#168BFF",
    borderRadius: 10,
    shadowColor: "#168BFF",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },

  progressGlow: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#FFFFFF",
    opacity: 0.3,
    borderRadius: 10,
  },

  loadingSubtitle: {
    color: "#637995",
    fontSize: 10,
    marginTop: 12,
    letterSpacing: 0.3,
  },

  /* FOOTER */

  bottomContainer: {
    position: "absolute",
    bottom: 32,
    alignItems: "center",
  },

  bottomLine: {
    width: 35,
    height: 3,
    backgroundColor: "#1A4B78",
    borderRadius: 5,
    marginBottom: 15,
  },

  version: {
    color: "#8295AE",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },

  copyright: {
    color: "#40536D",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 8,
  },
});

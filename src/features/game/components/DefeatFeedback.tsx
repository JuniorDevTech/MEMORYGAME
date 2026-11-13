/* eslint-disable react-hooks/immutability */
import { useAudioPlayer } from "expo-audio";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type DefeatFeedbackProps = {
  onReplay: () => void;
  soundSource: number;
};

export default function DefeatFeedback({
  onReplay,
  soundSource,
}: DefeatFeedbackProps) {
  const player = useAudioPlayer(soundSource);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const iconRotation = useSharedValue(-12);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 110,
    });
    iconRotation.value = withSpring(0);

    player.volume = 0.35;
    player
      .seekTo(0)
      .then(() => {
        player.play();
      })
      .catch(() => {
        // Le jeu reste utilisable même si le son ne peut pas être lu.
      });

    return () => {
      player.pause();
    };
  }, [player, opacity, scale, iconRotation]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[styles.iconCircle, iconStyle]}>
          <Text style={styles.icon}>↻</Text>
        </Animated.View>

        <Text style={styles.title}>CE N&lsquo;EST PAS FINI !</Text>

        <Text style={styles.subtitle}>
          Un chemin manqué, une nouvelle occasion de progresser.
        </Text>

        <Text style={styles.encouragement}>
          Respire, concentre-toi et tente à nouveau ta chance.
        </Text>

        <Pressable
          onPress={onReplay}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>REJOUER ↻</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 10, 25, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 100,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    padding: 28,
    borderRadius: 26,
    backgroundColor: "#111C35",
    borderWidth: 1,
    borderColor: "#344767",
    alignItems: "center",
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 105, 120, 0.13)",
    borderWidth: 2,
    borderColor: "#FF6978",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    color: "#FF8290",
    fontSize: 42,
    fontWeight: "800",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  subtitle: {
    color: "#D5DFEF",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 10,
  },
  encouragement: {
    color: "#8FA3C1",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 26,
  },
  button: {
    width: "100%",
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: "#263B60",
    borderWidth: 1,
    borderColor: "#FF6978",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
});

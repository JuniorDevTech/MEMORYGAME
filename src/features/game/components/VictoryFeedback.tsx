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

type VictoryFeedbackProps = {
  onNext: () => void;
  soundSource: number;
};

export default function VictoryFeedback({
  onNext,
  soundSource,
}: VictoryFeedbackProps) {
  const player = useAudioPlayer(soundSource);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const iconScale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 110,
    });
    iconScale.value = withSpring(1, {
      damping: 7,
      stiffness: 140,
    });

    player.volume = 0.4;
    player.seekTo(0);
    player.play();

    return () => {
      player.pause();
    };
  }, [player, opacity, scale, iconScale]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[styles.iconCircle, iconStyle]}>
          <Text style={styles.icon}>✓</Text>
        </Animated.View>

        <Text style={styles.eyebrow}>FÉLICITATIONS</Text>

        <Text style={styles.title}>NIVEAU RÉUSSI !</Text>

        <Text style={styles.message}>
          Excellent travail ! Tu as trouvé le bon chemin.
        </Text>

        <Text style={styles.encouragement}>
          Un nouveau défi t&apos;attend. Prêt à aller plus loin ?
        </Text>

        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>NIVEAU SUIVANT →</Text>
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
    borderColor: "#285D78",
    alignItems: "center",
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(34, 211, 166, 0.14)",
    borderWidth: 2,
    borderColor: "#22D3A6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  icon: {
    color: "#22D3A6",
    fontSize: 48,
    fontWeight: "800",
  },
  eyebrow: {
    color: "#22D3A6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  message: {
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
    backgroundColor: "#168CF5",
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
    letterSpacing: 0.8,
  },
});

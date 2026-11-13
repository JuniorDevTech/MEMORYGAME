import { useEffect, useState } from "react";

import HomeScreen from "@/components/HomeScreen";
import SplashScreen from "@/components/SplashScreen";
import TutorialScreen from "@/components/TutorialScreen";
import GameScreen from "@/features/game/components/GameScreen";

type Screen = "splash" | "home" | "tutorial" | "game";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (currentScreen === "splash") {
    return <SplashScreen />;
  }

  if (currentScreen === "tutorial") {
    return (
      <TutorialScreen
        onBack={() => setCurrentScreen("home")}
        onComplete={() => setCurrentScreen("game")}
      />
    );
  }

  if (currentScreen === "game") {
    return <GameScreen onBackToMenu={() => setCurrentScreen("home")} />;
  }

  return <HomeScreen onNewGame={() => setCurrentScreen("tutorial")} />;
}

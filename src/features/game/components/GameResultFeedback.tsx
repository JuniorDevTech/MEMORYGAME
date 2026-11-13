import DefeatFeedback from "./DefeatFeedback";
import VictoryFeedback from "./VictoryFeedback";

type GameResultFeedbackProps = {
  result: "victory" | "defeat";
  onNext: () => void;
  onReplay: () => void;
  victorySoundSource: number;
  defeatSoundSource: number;
};

export default function GameResultFeedback({
  result,
  onNext,
  onReplay,
  victorySoundSource,
  defeatSoundSource,
}: GameResultFeedbackProps) {
  if (result === "victory") {
    return <VictoryFeedback onNext={onNext} soundSource={victorySoundSource} />;
  }

  if (result === "defeat") {
    return (
      <DefeatFeedback onReplay={onReplay} soundSource={defeatSoundSource} />
    );
  }

  return null;
}

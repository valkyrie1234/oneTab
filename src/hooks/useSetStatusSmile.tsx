import { DifficultyStatus, StatusEmoji } from "../Consts/status";

const useSetStatusSmile = () => {
  const setStatusSmile = (
    status: DifficultyStatus
  ): StatusEmoji | undefined => {
    switch (status) {
      case "easy":
        return "🌿";
      case "medium":
        return "🛡️";
      case "hard":
        return "🗡️";
      case "epic":
        return "👑";
      case "completed":
        return "✅";

      default:
        return undefined;
    }
  };

  return { setStatusSmile };
};

export default useSetStatusSmile;

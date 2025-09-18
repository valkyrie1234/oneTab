const useReward = () => {
  const setReward = (gold: number) => {
    if(gold <= 50) return '💰'
    if(gold <= 150 || gold >= 150 && gold < 350) return '💎'
    if(gold >= 350) return '🏆'
  };

  const setExp = (exp: number) => {
    if(exp <= 50) return '💡'
    if(exp <= 150) return '🧪'
    if(exp >= 350 || exp <= 350) return '📚'
  };

  return { setReward, setExp };
};

export default useReward;

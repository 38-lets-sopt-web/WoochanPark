import { useState } from 'react';

export function useRanking() {
  const [rankings, setRankings] = useState(
    JSON.parse(localStorage.getItem('mole_game_rankings')) || []
  );

  const addRanking = (entry) => {
    const next = [...rankings, entry];
    localStorage.setItem('mole_game_rankings', JSON.stringify(next));
    setRankings(next);
  };

  const clearRankings = () => {
    if (window.confirm('랭킹을 초기화하시겠습니까?')) {
      localStorage.removeItem('mole_game_rankings');
      setRankings([]);
    }
  };

  const getSortedRankings = () => {
    return [...rankings].sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.score - a.score;
    });
  };

  return { rankings, addRanking, clearRankings, getSortedRankings };
}

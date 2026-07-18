const LEADERBOARD_KEY = 'sampah_game_leaderboard';

export const getLeaderboard = () => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading leaderboard data", error);
  }
  return [];
};

export const saveScore = (groupName, score, mode) => {
  const currentLeaderboard = getLeaderboard();
  
  const newEntry = {
    id: Date.now().toString(),
    groupName,
    score,
    mode,
    date: new Date().toISOString()
  };

  currentLeaderboard.push(newEntry);
  currentLeaderboard.sort((a, b) => b.score - a.score);

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(currentLeaderboard));
  } catch (error) {
    console.error("Error saving leaderboard data", error);
  }
};

export const clearLeaderboard = () => {
  localStorage.removeItem(LEADERBOARD_KEY);
};

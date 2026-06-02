export function getDifficulty(stats) {
  if (!stats) return 'easy';

  if (stats.puzzlesSolved >= 20 || stats.avgSolveTime < 40) return 'hard';
  if (stats.puzzlesSolved >= 5 || stats.avgSolveTime < 70) return 'medium';

  return 'easy';
}

export function getBlankCount(difficulty) {
  switch (difficulty) {
    case 'hard':
      return 10;
    case 'medium':
      return 8;
    default:
      return 6;
  }
}

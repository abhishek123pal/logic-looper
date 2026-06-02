export function calculateScore({ time, hintsUsed, streak }) {
  let score = 100;

  score -= time;
  score -= hintsUsed * 15;
  score += streak * 10;

  return Math.max(score, 10);
}

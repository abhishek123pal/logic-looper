export function generatePatternMatch(seed) {
  // 4x4 Grid Patterns
  const basePatterns = [
    ['⬛','⬜','⬛','⬜'],
    ['⬜','⬛','⬜','⬛'],
    ['⬛','⬛','⬜','⬜'],
    ['⬜','⬜','⬛','⬛']
  ];

  // Poora 4x4 grid taiyar karein
  const solution = [
    basePatterns[seed % 4],
    basePatterns[(seed + 1) % 4],
    basePatterns[(seed + 2) % 4],
    basePatterns[(seed + 3) % 4]
  ];

  // Puzzle mein kuch boxes khali karein (Randomly)
  const puzzle = solution.map(row => 
    row.map(cell => (Math.random() > 0.5 ? '' : cell))
  );

  return { puzzle, solution };
}
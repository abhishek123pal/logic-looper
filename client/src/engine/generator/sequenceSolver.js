export function generateSequence(seed) {
  const rules = [n=>n+2, n=>n+3, n=>n*2];
  const start = seed % 4 + 1;
  const rule = rules[seed % rules.length];

  const row = [
    start,
    rule(start),
    rule(rule(start)),
    rule(rule(rule(start)))
  ];

  const solution = [row];
  const puzzle = [[...row]];
  puzzle[0][3] = '';

  return { puzzle, solution };
}

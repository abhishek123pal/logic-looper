export function generateDeduction(seed) {
  const row = ['A','B','C','D'];

  const solution = [row];
  const puzzle = [[...row]];

  puzzle[0][seed % 4] = '';
  puzzle[0][(seed + 2) % 4] = '';

  return { puzzle, solution };
}

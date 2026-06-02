export function generateBinary(seed) {
  const ops = ['AND','OR','XOR'];
  const a = seed % 2;
  const b = (seed + 1) % 2;
  const op = ops[seed % ops.length];

  let r = op === 'AND' ? a & b : op === 'OR' ? a | b : a ^ b;

  const row = [a, op, b, '=', r];

  const solution = [row];
  const puzzle = [[...row]];
  puzzle[0][4] = '';

  return { puzzle, solution };
}

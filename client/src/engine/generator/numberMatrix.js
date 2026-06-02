export function generateNumberMatrix(seed,blanks=6) {
  const size = 4;
  const nums = [1, 2, 3, 4];

  function shift(row, n) {
    return row.map(v => ((v + n - 1) % size) + 1);
  }

  const base = nums;
  const solution = Array.from({ length: size }, (_, i) => shift(base, i));

  const puzzle = solution.map(r => [...r]);

  for (let i = 0; i < blanks; i++) {
    const r = (seed + i) % size;
    const c = (seed * (i + 1)) % size;
    puzzle[r][c] = '';
  }

  return { puzzle, solution };
}














/*export function generateNumberMatrix(seed) {
  const size = 4;
  const numbers = [1, 2, 3, 4];

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0)
  );

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed + i) % arr.length;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  for (let i = 0; i < size; i++) {
    const row = shuffle([...numbers]);
    for (let j = 0; j < size; j++) {
      grid[i][j] = row[j];
    }
  }

  // Remove some cells (create puzzle)
  for (let i = 0; i < 6; i++) {
    const r = (seed + i) % size;
    const c = (seed * i + 1) % size;
    grid[r][c] = null;
  }

  return grid;
}
  */

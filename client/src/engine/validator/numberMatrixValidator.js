export function generateNumberMatrix(seed) {
  const size = 4;
  const numbers = [1, 2, 3, 4];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = (seed + i) % a.length;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const solution = Array.from({ length: size }, (_, i) =>
    shuffle(numbers.map(n => ((n + i - 1) % size) + 1))
  );

  const puzzle = solution.map(row => [...row]);

  for (let i = 0; i < 6; i++) {
    const r = (seed + i) % size;
    const c = (seed * i + 1) % size;
    puzzle[r][c] = '';
  }

  return { puzzle, solution };
}


















/*export function validateNumberMatrix(puzzle, userInput) {
     const size = 4;

  // Check empty cells
  for (let row of userInput) {
    if (row.includes(null) || row.includes(0)) {
      return false;
    }
  }

  // Check rows
  for (let row = 0; row < size; row++) {
    const set = new Set(userInput[row]);
    if (set.size !== size) return false;
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const column = [];
    for (let row = 0; row < size; row++) {
      column.push(userInput[row][col]);
    }
    const set = new Set(column);
    if (set.size !== size) return false;
  }
  return true; // real logic comes next
}
*/
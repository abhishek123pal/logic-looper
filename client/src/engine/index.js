import { generateBinary } from './generator/binaryLogic';
import { generateDeduction } from './generator/deductionGrid';
import { generateSequence } from './generator/sequenceSolver';
import { generateNumberMatrix } from './generator/numberMatrix';
import { generatePatternMatch } from './generator/patternMatch';

// 🎯 In names ko generator keys ke saath sync rakha hai
const types = [
  'numberMatrix',
  'patternMatch',
  'sequence',
  'deduction',
  'binary'
];

// 🎯 Daily rotation
export function getDailyPuzzleType(seed) {
  return types[seed % types.length];
}

// 🧠 Puzzle router
export function generatePuzzle(type, seed, blanks) {
  // Case sensitivity issue fix karne ke liye
  const t = type?.toLowerCase();

  switch (t) {
    // lowercase mein likhna zaroori hai kyunki 't' lowercase hai
    case 'numbermatrix': 
    case 'grid':
      return generateNumberMatrix(seed, blanks);

    case 'pattern':
    case 'patternmatch':
      return generatePatternMatch(seed);

    case 'sequence':
      return generateSequence(seed);

    case 'deduction':
      return generateDeduction(seed);

    case 'binary':
      return generateBinary(seed);

    default:
      console.error("Available types are:", types);
      throw new Error('Unknown puzzle type: ' + type);
  }
}

// 🎚 Difficulty helper
export function calculateDifficulty(stats) {
  if (!stats) return 'easy';
  if (stats.puzzlesSolved > 20) return 'hard';
  if (stats.puzzlesSolved > 5) return 'medium';
  return 'easy';
}
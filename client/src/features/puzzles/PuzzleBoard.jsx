import { useState, useEffect } from "react";
import { getDailySeed } from "../../utils/seed";
import { generatePuzzle, getDailyPuzzleType } from "../../engine";
import { calculateScore } from "../../utils/scoring";
import { getDifficulty, getBlankCount } from "../../utils/difficulty";
import { getGuestUser } from "../../utils/auth";
import { savePuzzle, loadPuzzle } from "../../storage/puzzleStore";
import { markPlayed, getHints, setHints, loadStats, updateStats } from "../../storage/statsStore";
import useStreak from "../../hooks/useStreak";
import StreakHeatmap from "../streaks/StreakHeatmap";

export default function PuzzleBoard() {
  const [solvedCount, setSolvedCount] = useState(0);
  const user = getGuestUser();
  const streak = useStreak();

  const seed = getDailySeed();
  const type = getDailyPuzzleType(seed);
  const today = new Date().toISOString().split("T")[0];

  const [difficulty, setDifficulty] = useState("easy");
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [activeCell, setActiveCell] = useState(null); 
  const urlParams = new URLSearchParams(window.location.search);
  const activeType = (urlParams.get('testType') || type).toLowerCase();

  const isPatternGame = activeType.includes('pattern');

  useEffect(() => {
    async function init() {
      const hints = await getHints();
      setHintsLeft(hints);
      const stats = await loadStats();
      const level = getDifficulty(stats);
      setDifficulty(level);

      const blanks = getBlankCount(level);
      const generated = generatePuzzle(activeType, seed, blanks);

      const puzzleGrid = Array.isArray(generated.puzzle[0]) ? generated.puzzle : [generated.puzzle];
      const solutionGrid = Array.isArray(generated.solution[0]) ? generated.solution : [generated.solution];

      setPuzzle(puzzleGrid);
      setSolution(solutionGrid);

      const saved = await loadPuzzle(today);
      if (saved && !urlParams.get('testType')) {
        setUserGrid(saved.userGrid);
        setSeconds(saved.seconds);
      } else {
        setUserGrid(puzzleGrid.map(row => row.map(cell => (cell === null ? "" : String(cell)))));
      }
    }
    init();
  }, [activeType, seed, today]);

  useEffect(() => {
    if (solved) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [solved]);

  useEffect(() => {
    if (!userGrid.length || !solution.length) return;
    const solvedNow = JSON.stringify(userGrid) === JSON.stringify(solution.map(r => r.map(v => String(v))));
    if (!solvedNow || solved) return;

    setSolved(true);
    const finalScore = calculateScore({ time: seconds, hintsUsed, streak });
    (async () => {
      await updateStats({ userId: user.id, date: today, time: seconds, score: finalScore });
      markPlayed(today);
      setSolvedCount(prev => prev + 1);
    })();
    savePuzzle(today, { puzzle, userGrid, seconds });
  }, [userGrid, solution, seconds, hintsUsed, streak, solved]);

  // ---------------- INTERACTION HANDLERS ----------------

  function handleCellClick(r, c) {
    const isFixed = puzzle[r] && puzzle[r][c] !== "" && puzzle[r][c] !== null;
    if (isFixed || solved) return;

    if (isPatternGame) {
      const newGrid = userGrid.map(row => [...row]);
      const val = newGrid[r][c];

      if (val === '⬛') newGrid[r][c] = '⬜';
      else if (val === '⬜') newGrid[r][c] = '';
      else newGrid[r][c] = '⬛';
      
      setUserGrid(newGrid);
    } else {
      setActiveCell({ r, c });
    }
  }

  function handlePadInput(value) {
    if (!activeCell) return;
    const { r, c } = activeCell;
    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = value;
    setUserGrid(newGrid);
    setActiveCell(null);
  }

  // HINT LOGIC: Finding a random empty or wrong cell
  async function handleHint() {
    if (hintsLeft <= 0 || solved) return;

    const possibleHints = [];
    solution.forEach((row, r) => {
      row.forEach((cellVal, c) => {
        const isFixed = puzzle[r] && puzzle[r][c] !== "" && puzzle[r][c] !== null;
        if (!isFixed && String(userGrid[r][c]) !== String(cellVal)) {
          possibleHints.push({ r, c, val: cellVal });
        }
      });
    });

    if (possibleHints.length > 0) {
      const randomHint = possibleHints[Math.floor(Math.random() * possibleHints.length)];
      const newGrid = userGrid.map(row => [...row]);
      newGrid[randomHint.r][randomHint.c] = String(randomHint.val);
      
      setUserGrid(newGrid);
      const newHintCount = hintsLeft - 1;
      setHintsLeft(newHintCount);
      setHintsUsed(h => h + 1);
      await setHints(newHintCount);
    }
  }

  if (!userGrid || userGrid.length === 0 || !userGrid[0]) {
    return (
      <div className="min-h-screen bg-[#190482] flex items-center justify-center">
        <div className="text-white font-black animate-pulse uppercase tracking-widest">
          Loading Puzzle...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#190482] text-white flex flex-col items-center px-4 pt-10 pb-20">
      
      {/* STATS BAR */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
        <div className="text-xs font-bold uppercase opacity-50">Level: {difficulty}</div>
        <div className="text-lg font-mono font-black">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-xs font-bold uppercase text-cyan-400">Hints: {hintsLeft}</div>
      </div>

      {/* DEBUG MENU */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 p-2 bg-white/5 rounded-xl border border-dashed border-white/20">
        {['numberMatrix', 'pattern', 'sequence', 'deduction', 'binary'].map((genType) => (
          <button 
            key={genType}
            onClick={() => window.location.href = `?testType=${genType.toLowerCase()}`}
            className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${activeType === genType.toLowerCase() ? 'bg-[#F05537] text-white' : 'bg-white/10 text-white/40'}`}
          >
            {genType.toUpperCase()}
          </button>
        ))}
      </div>

      <h1 className="text-4xl font-black mb-2 italic tracking-tighter uppercase text-white text-center leading-none">
        🧩 {activeType} <span className="text-[#F05537]">Puzzle</span>
      </h1>

      {/* GAME GRID */}
      <div className="bg-[#222222]/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl mb-4 relative">
        {solved && (
            <div className="absolute inset-0 bg-[#190482]/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[2.5rem] animate-in fade-in duration-500">
                <h2 className="text-5xl font-black italic text-[#F05537] mb-2">SOLVED!</h2>
                <p className="font-bold opacity-70">Time: {seconds}s | Streak: {streak}d</p>
            </div>
        )}
        <div className={`grid gap-4 ${userGrid[0]?.length > 1 ? 'grid-cols-4' : 'grid-cols-1'}`}>
          {userGrid.map((row, r) =>
            row.map((cell, c) => {
              const cellValue = String(cell || "").trim();
              const isFixed = puzzle[r] && puzzle[r][c] !== "" && puzzle[r][c] !== null;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-16 h-16 flex items-center justify-center text-2xl font-black rounded-2xl cursor-pointer transition-all duration-150 select-none border-2
                    ${isFixed 
                      ? "bg-[#190482]/40 text-white/20 cursor-not-allowed border-transparent" 
                      : "bg-white/5 border-white/10 hover:border-[#F05537]/50"
                    }
                    ${activeCell?.r === r && activeCell?.c === c ? 'ring-4 ring-[#F05537] z-10' : ''}
                    ${cellValue === "⬛" ? "bg-black border-white/30 shadow-inner" : ""}
                    ${cellValue === "⬜" ? "bg-white border-gray-300 shadow-md" : ""}
                  `}
                >
                  {activeType === 'sequence' && activeCell?.r === r && activeCell?.c === c ? (
                    <input
                      autoFocus
                      type="number"
                      className="w-full bg-transparent text-center outline-none text-[#F05537]"
                      value={cell}
                      onChange={(e) => {
                        const newGrid = userGrid.map(row => [...row]);
                        newGrid[r][c] = e.target.value;
                        setUserGrid(newGrid);
                      }}
                      onBlur={() => setActiveCell(null)}
                    />
                  ) : (
                    (!isPatternGame && cellValue !== "⬛" && cellValue !== "⬜") ? cell : ""
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* HINT BUTTON */}
      <button 
        onClick={handleHint}
        disabled={hintsLeft <= 0 || solved}
        className="mb-8 px-6 py-2 bg-white/10 border border-white/20 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-20"
      >
        💡 Use Hint ({hintsLeft})
      </button>

      {/* FLOATING INPUT PAD */}
      {activeCell && activeType !== 'sequence' && !isPatternGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-10 bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#190482] border border-white/20 p-6 rounded-[2.5rem] shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4 text-xs font-black uppercase text-white/40">
              <span>Select Value</span>
              <button onClick={() => setActiveCell(null)} className="p-2">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {activeType === 'numbermatrix' && [1, 2, 3, 4].map(n => (
                <button key={n} onClick={() => handlePadInput(String(n))} className="h-14 bg-white/5 rounded-2xl font-black text-xl hover:bg-[#F05537]"> {n} </button>
              ))}
              {activeType === 'deduction' && ['A', 'B', 'C', 'D'].map(l => (
                <button key={l} onClick={() => handlePadInput(l)} className="h-14 bg-white/5 rounded-2xl font-black text-xl hover:bg-[#414BEA]"> {l} </button>
              ))}
              {activeType === 'binary' && [0, 1].map(b => (
                <button key={b} onClick={() => handlePadInput(String(b))} className="col-span-2 h-14 bg-white/5 rounded-2xl font-black text-xl hover:bg-cyan-500"> {b} </button>
              ))}
              <button onClick={() => handlePadInput("")} className="col-span-4 mt-2 h-10 text-red-400 font-bold uppercase text-[10px] tracking-widest bg-red-500/10 rounded-xl">Clear</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pb-6">
        <StreakHeatmap refresh={solvedCount}/>
      </div>
    </div>
  );
}
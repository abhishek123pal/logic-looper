export default function PatternBoard({ puzzle, userGrid, setUserGrid }) {

  function handleClick(i, value) {
    const newGrid = [...userGrid];
    newGrid[i] = value;
    setUserGrid(newGrid);
  }

  return (
    <div className="flex gap-4 mt-6">
      {puzzle.map((cell, i) => (
        <div
          key={i}
          className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-800 border rounded cursor-pointer"
          onClick={() => cell === '' && handleClick(i, userGrid[i] === '⬛' ? '⬜' : '⬛')}
        >
          {userGrid[i] || cell}
        </div>
      ))}
    </div>
  );
}

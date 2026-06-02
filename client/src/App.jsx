import { useState } from 'react';
import PuzzleBoard from './features/puzzles/puzzleBoard';
import Leaderboard from './features/leaderboard/leaderboard';
import StatsDashboard from './features/stats/StatsDashboard';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [view, setView] = useState('game'); 
  const { user, logout, loading } = useAuth();

  // 🔄 Loading State (Bluestock Theme)
  if (loading) return (
    <div className="min-h-screen bg-[#F6F5F5] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#414BEA] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#190482] font-bold animate-pulse">Initializing Logic Looper...</p>
    </div>
  );

  // 🔐 1. Authentication Check
  if (!user && gameStarted) {
    return <AuthForm />;
  }

  // 🏠 2. Landing Page (Bluestock Branding)
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#F6F5F5] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#D9E2FF] rounded-full blur-3xl opacity-50"></div>
        
        <img src="/logo.jpg" alt="Bluestock" className="h-16 mb-8 drop-shadow-sm" />
        
        <h1 className="text-6xl font-black mb-4 text-[#190482] tracking-tighter">
          LOGIC <span className="text-[#414BEA]">LOOPER</span>
        </h1>
        
        <p className="text-[#3D3B40] text-lg max-w-md mb-10 font-medium">
          Powered by <span className="text-[#414BEA] font-bold">Bluestock</span>. Daily brain training puzzles to sharpen your fintech mind.
        </p>

        <button 
          onClick={() => setGameStarted(true)}
          className="px-12 py-4 bg-[#414BEA] text-white rounded-2xl font-black text-xl hover:bg-[#190482] transition-all shadow-[0_10px_20px_rgba(65,75,234,0.3)] active:scale-95"
        >
          START CHALLENGE
        </button>
      </div>
    );
  }

  // 🎮 3. Main Dashboard View
  return (
    <div className="min-h-screen bg-[#F6F5F5]">
      {/* 🔹 Bluestock Branded Navigation Bar */}
      <nav className="bg-white p-4 flex justify-between items-center border-b border-[#D9E2FF] shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <img 
              src="/logo.jpg" 
              alt="Home" 
              onClick={() => setGameStarted(false)}
              className="h-8 cursor-pointer hover:opacity-80 transition" 
            />
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <span className="text-[#190482] font-black hidden sm:block">LOOPER</span>
        </div>

        <div className="flex bg-[#D9E2FF]/30 p-1 rounded-xl gap-1">
          {[
            { id: 'game', label: 'Play', icon: '🎮' },
            { id: 'stats', label: 'Stats', icon: '📉' },
            { id: 'leaderboard', label: 'Ranking', icon: '🏆' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                view === item.id 
                ? 'bg-white text-[#414BEA] shadow-sm' 
                : 'text-[#3D3B40] hover:bg-white/50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden xs:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#7752FE] uppercase tracking-wider">Player</span>
                <span className="text-xs font-black text-[#190482]">{user?.email?.split('@')[0]}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 bg-[#F05537]/10 text-[#F05537] rounded-lg hover:bg-[#F05537] hover:text-white transition-colors border border-[#F05537]/20"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
        </div>
      </nav>

      {/* 🔹 Dynamic Content Area */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#D9E2FF]/50 border border-[#D9E2FF] min-h-[60vh] overflow-hidden">
            {view === 'game' && <PuzzleBoard />}
            {view === 'stats' && <StatsDashboard userId={user.uid} />}
            {view === 'leaderboard' && <Leaderboard />}
        </div>
      </main>

      {/* Footer Support Info */}
      <footer className="py-6 text-center text-[#3D3B40]/50 text-xs font-medium">
        © 2026 Logic Looper • Strategic Partner: <span className="font-bold text-[#414BEA]">BLUESTOCK.in</span>
      </footer>
    </div>
  );
}

export default App;
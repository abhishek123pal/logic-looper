import { useEffect, useState } from 'react';
import { offlineManager } from '../../utils/offlineManager';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      const cachedData = await offlineManager.get('leaderboard_data');
      if (cachedData) {
        setLeaders(cachedData);
        setLoading(false);
      }

      if (navigator.onLine) {
        try {
         // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
         const API_URL = window.location.hostname === "localhost" 
      ? 'http://localhost:4000' 
      : 'https://your-backend-name.onrender.com';
          const response = await fetch(`${API_URL}/leaderboard`);
          const data = await response.json();
          setLeaders(data);
          await offlineManager.save('leaderboard_data', data);
        } catch (err) {
          console.error("Leaderboard fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    // Leaderboard.jsx

<div className="flex flex-col items-center py-10 px-4 min-h-screen bg-[#23156d]">
  
  {/* 🏆 Header Section */}
  <div className="text-center mb-10">
    <div className="inline-block px-4 py-1 rounded-full bg-[#414BEA]/30 border border-[#414BEA]/50 mb-4">
      <span className="text-[#D9E2FF] text-[10px] font-black uppercase tracking-[0.3em]">Season 1: Hall of Fame</span>
    </div>
    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">
      GLOBAL <span className="text-[#F05537]">LEGENDS</span> 🏆
    </h2>
    <div className="h-1 w-20 bg-[#F05537] mx-auto mt-2 rounded-full"></div>
  </div>

  {/* 📊 Main Container */}
  <div className="w-full max-w-2xl bg-[#222222]/40 backdrop-blur-xl rounded-4xl border border-white/10 shadow-2xl overflow-hidden">
    
    {/* Table Header */}
    <div className="grid grid-cols-4 px-8 py-5 bg-white/5 border-b border-white/5 text-[#D9E2FF]/50 font-black text-[10px] uppercase tracking-widest">
      <span>Rank</span>
      <span>Player</span>
      <span className="text-right">Points</span>
      <span className="text-right">Hash ID</span>
    </div>

    {loading ? (
      <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-[#F05537] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 font-bold animate-pulse">Fetching from Neon...</p>
      </div>
    ) : (
      <div className="p-2 space-y-1">
        {leaders.map((player, index) => (
          <div 
            key={player.id} 
            className={`grid grid-cols-4 items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${
              index === 0 
              ? 'bg-linear-to-r from-[#F05537]/20 to-transparent border border-[#F05537]/30 shadow-lg shadow-[#F05537]/10' 
              : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center">
              {index === 0 ? (
                <div className="bg-[#F05537] text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(240,85,55,0.4)] font-black text-sm">1</div>
              ) : index === 1 ? (
                <div className="text-[#D9E2FF] font-black text-lg ml-2 opacity-80">2</div>
              ) : index === 2 ? (
                <div className="text-[#D9E2FF] font-black text-lg ml-2 opacity-60">3</div>
              ) : (
                <span className="text-white/20 font-bold ml-2">#{index + 1}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <span className={`font-bold truncate ${index === 0 ? 'text-white' : 'text-[#D9E2FF]/80'}`}>
                {player.email ? player.email.split('@')[0] : 'Legend'}
              </span>
              {index === 0 && <span className="text-[8px] text-[#F05537] font-black uppercase">Ultimate Champion</span>}
            </div>

            {/* Points */}
            <div className="text-right">
              <span className={`text-lg font-black ${index === 0 ? 'text-[#F05537]' : 'text-white'}`}>
                {player.totalPoints || 0}
              </span>
            </div>

            {/* ID */}
            <div className="text-right">
              <span className="text-[9px] font-mono text-white/20 group-hover:text-white/40 transition-colors">
                {player.id.substring(0, 6)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Footer */}
  <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
    <img src="/logo.jpg" alt="Bluestock" className="h-4 brightness-0 invert" />
    <span className="text-[8px] text-white font-bold tracking-widest">REAL-TIME LEADERBOARD V1.0</span>
  </div>
</div>
  );
}
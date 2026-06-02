// src/features/stats/StatsDashboard.jsx
import { useEffect, useState } from 'react';

const StatsDashboard = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 🌍 Backend sync (Production ready URL logic)
   // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const API_URL = window.location.hostname === "localhost" 
    ? 'http://localhost:4000' 
    : 'https://your-backend-name.onrender.com';
    fetch(`${API_URL}/stats/${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.stats);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, [userId]);

  // 🔄 Loading State (Bluestock Navy Theme)
  if (!data) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#190482] rounded-[3rem]">
        <div className="w-10 h-10 border-4 border-[#F05537] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#D9E2FF] font-bold animate-pulse tracking-widest text-xs">CALCULATING PERFORMANCE...</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen bg-[#190482] rounded-[3rem] shadow-inner">
      
      {/* 📈 Header Section */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-full bg-[#F05537]/10 border border-[#F05537]/30 mb-4">
          <span className="text-[#F05537] text-[10px] font-black uppercase tracking-[0.3em]">Personal Performance</span>
        </div>
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">
          PLAYER <span className="text-[#414BEA]">INSIGHTS</span> 📉
        </h2>
        <div className="h-1 w-20 bg-[#414BEA] mx-auto mt-2 rounded-full"></div>
      </div>

      {/* ⚡ Stats Grid (Data variable mapped correctly here) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        
        {/* Global Rank Card */}
        <div className="bg-[#222222]/40 backdrop-blur-xl border border-white/10 p-6 rounded-4xl flex flex-col items-center justify-center group hover:border-[#F05537]/50 transition-all duration-300">
          <span className="text-[#D9E2FF]/40 text-[10px] font-black uppercase tracking-widest mb-2">Global Rank</span>
          <div className="text-4xl font-black text-[#F05537] drop-shadow-[0_0_15px_rgba(240,85,55,0.3)]">
            #{data.globalRank || '---'}
          </div>
          <div className="mt-2 w-8 h-1 bg-[#F05537] rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Total Points Card */}
        <div className="bg-[#222222]/40 backdrop-blur-xl border border-white/10 p-6 rounded-4xl flex flex-col items-center justify-center group hover:border-[#414BEA]/50 transition-all duration-300">
          <span className="text-[#D9E2FF]/40 text-[10px] font-black uppercase tracking-widest mb-2">Total Points</span>
          <div className="text-4xl font-black text-white">
            {data.totalPoints || 0}
          </div>
          <div className="mt-2 w-8 h-1 bg-[#414BEA] rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Solved Count Card */}
        <div className="bg-[#222222]/40 backdrop-blur-xl border border-white/10 p-6 rounded-4xl flex flex-col items-center justify-center group hover:border-green-500/50 transition-all duration-300">
          <span className="text-[#D9E2FF]/40 text-[10px] font-black uppercase tracking-widest mb-2">Puzzles Solved</span>
          <div className="text-4xl font-black text-green-400">
            {data.puzzlesSolved || 0}
          </div>
          <div className="mt-2 w-8 h-1 bg-green-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Avg Time Card */}
        <div className="bg-[#222222]/40 backdrop-blur-xl border border-white/10 p-6 rounded-4xl flex flex-col items-center justify-center group hover:border-cyan-400/50 transition-all duration-300">
          <span className="text-[#D9E2FF]/40 text-[10px] font-black uppercase tracking-widest mb-2">Avg Time</span>
          <div className="text-4xl font-black text-cyan-400">
            {Math.round(data.avgTime) || 0}s
          </div>
          <div className="mt-2 w-8 h-1 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
        </div>

      </div>

      {/* 🔥 Heatmap Section Placeholder */}
      <div className="w-full max-w-4xl mt-8 bg-[#222222]/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8">
         <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F05537] rounded-full animate-ping"></span>
            Activity Heatmap
         </h3>
         <div className="text-white/20 text-center py-20 border-2 border-dashed border-white/5 rounded-3xl italic">
            Visualizing your daily streaks...
         </div>
      </div>

      {/* Branding */}
      <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
        <img src="/logo.jpg" alt="Bluestock" className="h-4 brightness-0 invert" />
        <span className="text-[8px] text-white font-bold tracking-[0.5em]">DATA ANALYTICS ENGINE</span>
      </div>
    </div>
  );
};

export default StatsDashboard;
import React from 'react';
import { auth } from '../utils/firebase'; // Auth check ke liye

export default function Navbar() {
  const user = auth.currentUser;

  return (
    <nav className="w-full bg-[#FFFFFF] border-b border-[#D9E2FF] py-3 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* 🖼️ Bluestock Logo Section */}
      <div className="flex items-center gap-3">
        <img 
          src="/logo.jpg" 
          alt="Bluestock Logo" 
          className="h-10 w-auto object-contain" 
        />
        <div className="h-6 w-0.5 bg-[#D9E2FF] hidden md:block"></div>
        <span className="text-[#190482] font-black tracking-tighter text-xl hidden md:block">
          LOGIC LOOPER
        </span>
      </div>

      {/* 🔗 Navigation Links / Actions */}
      <div className="flex items-center gap-6">
        <button className="text-[#3D3B40] font-medium hover:text-[#414BEA] transition-colors">
          Leaderboard
        </button>
        
        {user ? (
          <div className="flex items-center gap-2 bg-[#F8EDFF] px-3 py-1 rounded-full border border-[#7752FE]">
            <span className="text-[#7752FE] text-sm font-bold">
              {user.email?.split('@')[0]}
            </span>
          </div>
        ) : (
          <button className="bg-[#414BEA] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#190482] transition-all shadow-md shadow-[#414BEA]/20">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
import { useEffect, useState, useMemo } from 'react';
import { loadStats } from '../../storage/statsStore';

export default function StreakHeatmap({ refresh }) { 
  const [playedDays, setPlayedDays] = useState([]);

  useEffect(() => {
    async function load() {
      const stats = await loadStats();
      setPlayedDays(stats?.playedDays || []);
    }
    load();
  }, [refresh]);

  // 1. Data ko "Month-wise Groups" mein divide karo
  const monthGroups = useMemo(() => {
    const months = [];
    const today = new Date();
    
    // Last 12 months ka loop
    for (let i = 11; i >= 0; i--) {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const monthName = firstDayOfMonth.toLocaleString('default', { month: 'short' });
      
      const daysInMonth = [];
      const current = new Date(firstDayOfMonth);
      
      while (current <= lastDayOfMonth) {
        const dateStr = current.toISOString().split('T')[0];
        daysInMonth.push({
          date: dateStr,
          active: playedDays.includes(dateStr)
        });
        current.setDate(current.getDate() + 1);
      }
      
      months.push({ name: monthName, days: daysInMonth });
    }
    return months;
  }, [playedDays]);

  return (
    <div className="w-full max-w-[95vw] mt-10 p-6 bg-[#222222]/20 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
      
      {/* Scrollable Container */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max"> {/* Ye 'gap-4' mahino ke beech space banayega */}
          
          {monthGroups.map((month, mIdx) => (
            <div key={mIdx} className="flex flex-col">
              {/* Month Label */}
              <span className="text-[10px] font-black uppercase text-white/20 mb-2 ml-1">
                {month.name}
              </span>
              
              {/* Month Grid (7 rows high) */}
              <div className="grid grid-flow-col grid-rows-7 gap-0.75">
                {month.days.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={day.date}
                    className={`w-2.75 h-2.75 rounded-xs transition-all duration-500 ${
                      day.active 
                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
                        : 'bg-white/5 hover:bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Legend Area */}
      <div className="mt-4 flex items-center justify-between opacity-30">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/50 italic">Yearly Log</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold uppercase">Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-green-900/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
          <span className="text-[8px] font-bold uppercase">More</span>
        </div>
      </div>
    </div>
  );
}
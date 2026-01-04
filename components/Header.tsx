
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update date every minute to keep it current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get current date information
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate().toString().padStart(2, '0');
  const weekday = currentDate.getDay();
  const dayName = dayNames[weekday];

  // Generate dates for current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <header className="flex items-start justify-between px-12 pt-10 pb-8 select-none bg-transparent">
      {/* Date Context - Oversized Serif */}
      <div className="flex items-end gap-6">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="serif-font text-8xl italic font-light text-[#4A4238] leading-none">{month}</span>
            <span className="serif-font text-4xl font-light text-[#E6A05D] mb-1">{day}</span>
          </div>
          <div className="flex gap-5 text-[14px] mt-4 font-bold text-[#4A4238]/60 tracking-widest pl-1">
            {dayNames.map((name, index) => (
              <span key={name} className={index === weekday ? 'text-[#E6A05D]' : ''}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Date Selector Bar */}
        <div className="flex items-center gap-1 mb-2 bg-white/20 backdrop-blur-sm p-1 rounded-full border border-[#4A4238]/10">
          {dates.map(d => (
            <button key={d} className={`w-8 h-8 rounded-full text-[12px] font-bold flex items-center justify-center transition-all ${d === day ? 'bg-[#4A4238] text-white shadow-md' : 'text-[#4A4238]/30 hover:text-[#4A4238]/60'}`}>
              {d}
            </button>
          ))}
          <div className="ml-3 flex gap-1 pr-2">
             {['W1','W2','W3','W4','W5'].map(w => (
               <span key={w} className="px-1.5 py-0.5 text-[9px] font-black border border-[#4A4238]/10 text-[#4A4238]/20 rounded uppercase cursor-default">{w}</span>
             ))}
          </div>
        </div>
      </div>

      {/* Simplified Header Meta */}
      <div className="flex flex-col items-end gap-1 mt-4">
        <div className="text-[10px] font-black tracking-[0.4em] text-[#4A4238]/40 uppercase">ScholarFlow Planner</div>
        <div className="text-[12px] handwriting text-[#4A4238]/60 italic font-bold">Deep Work Edition</div>

      </div>
    </header>
  );
};

export default Header;

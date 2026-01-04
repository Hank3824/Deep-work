
import React, { useState } from 'react';
import { Sun, Cloud, Moon } from 'lucide-react';
import { MOODS } from '../types';

const Sidebar: React.FC = () => {
  const [water, setWater] = useState(3);
  const [mood, setMood] = useState('😊');

  return (
    <div className="w-[300px] px-8 py-4 flex flex-col gap-10 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/20 shadow-sm ml-4">
      {/* Weather Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A4238]/30 flex items-center gap-2">
          天气 <span className="text-[9px] font-normal opacity-50">WEATHER</span>
        </h4>
        <div className="flex justify-between items-center text-[#4A4238]/20 bg-white/20 p-3 rounded-2xl border border-white/30">
          <Sun className="w-6 h-6 text-[#E6A05D]" />
          <Cloud className="w-6 h-6" />
          <Cloud className="w-6 h-6 opacity-50" />
          <Cloud className="w-6 h-6 opacity-20" />
        </div>
      </section>

      {/* Mood Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A4238]/30">
          心情 <span className="text-[9px] font-normal opacity-50">MOOD</span>
        </h4>
        <div className="flex justify-between items-center px-2 bg-white/20 p-3 rounded-2xl border border-white/30">
          {MOODS.map(m => (
            <button 
              key={m.emoji} 
              onClick={() => setMood(m.emoji)}
              className={`text-2xl grayscale transition-all duration-300 ${mood === m.emoji ? 'grayscale-0 scale-125' : 'hover:grayscale-0 hover:scale-110'}`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </section>

      {/* Water Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A4238]/30">饮水 <span className="text-[9px] font-normal opacity-50">WATER</span></h4>
          <span className="text-[11px] font-bold text-[#4A4238]/40">{water * 250} mL</span>
        </div>
        <div className="flex gap-2 items-end h-10 bg-white/20 p-2 rounded-2xl border border-white/30">
          {[...Array(8)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setWater(i + 1)}
              className={`flex-1 rounded-full border border-[#4A4238]/5 transition-all relative overflow-hidden h-full group`}
            >
              <div className={`absolute bottom-0 left-0 right-0 bg-[#A2B9C2]/60 transition-all duration-700 ${i < water ? 'h-full' : 'h-0'}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Sleep Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A4238]/30">睡眠 <span className="text-[9px] font-normal opacity-50">SLEEP</span></h4>
          <span className="text-[11px] font-bold text-[#4A4238]/40">7 小时</span>
        </div>
        <div className="flex justify-between px-3 text-[#4A4238]/10 bg-white/20 p-3 rounded-2xl border border-white/30">
          {[...Array(7)].map((_, i) => (
            <Moon key={i} className={`w-5 h-5 ${i < 6 ? 'text-[#E6A05D]/70' : ''}`} />
          ))}
        </div>
      </section>

      {/* Diet Section */}
      <section className="space-y-5 pt-2">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A4238]/30">饮食 <span className="text-[9px] font-normal opacity-50">DIET</span></h4>
          <span className="text-[11px] italic font-bold text-[#4A4238]/40">≈ 1500 kcal</span>
        </div>
        <div className="space-y-4 bg-white/20 p-4 rounded-2xl border border-white/30">
          <MealItem label="早餐" content="全麦吐司 & 2个煎蛋" />
          <MealItem label="午餐" content="Brunch + 黑咖啡" />
          <MealItem label="晚餐" content="冬阴功海鲜汤 & 菠萝炒饭" />
        </div>
      </section>
    </div>
  );
};

const MealItem = ({ label, content }: { label: string; content: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-black text-[#4A4238]/20 uppercase tracking-tighter">{label}</span>
    <span className="handwriting text-xl leading-none text-[#4A4238]">{content}</span>
  </div>
);

export default Sidebar;

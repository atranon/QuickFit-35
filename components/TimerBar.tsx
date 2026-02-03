import React from 'react';
import { StopCircle } from 'lucide-react';
import clsx from 'clsx';

interface TimerBarProps {
  seconds: number;
  isActive: boolean;
  onStart: (s: number) => void;
  onStop: () => void;
}

const TimerBar: React.FC<TimerBarProps> = ({ seconds, isActive, onStart, onStop }) => {
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      className={clsx(
        "fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-3 py-3 pb-[env(safe-area-inset-bottom)] flex items-center justify-between z-50 transition-transform duration-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
        isActive ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex flex-col mb-[env(safe-area-inset-bottom)]"> {/* Push text up slightly if needed, but padding handles most */}
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rest Timer</span>
        <span className={clsx(
          "text-2xl font-mono font-bold",
          seconds <= 5 && seconds > 0 ? "text-yellow-400" : "text-white"
        )}>
          {formatTime(seconds)}
        </span>
      </div>
      <div className="flex gap-1 sm:gap-2 mb-[env(safe-area-inset-bottom)]">
        {[15, 30, 45, 60].map(t => (
          <button 
            key={t} 
            onClick={() => onStart(t)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition border border-slate-600"
          >
            {t}s
          </button>
        ))}
        <button 
          onClick={onStop} 
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg transition border border-red-500/30"
        >
          <StopCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default TimerBar;
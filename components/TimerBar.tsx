import React, { useMemo } from 'react';
import { StopCircle, Plus, Timer, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface TimerBarProps {
  seconds: number;
  isActive: boolean;
  onStart: (s: number) => void;
  onStop: () => void;
  onExtend?: (s: number) => void;
  prescribedRest?: number;  // The current exercise's programmed rest time
}

const TimerBar: React.FC<TimerBarProps> = ({ seconds, isActive, onStart, onStop, onExtend, prescribedRest = 60 }) => {

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Smart presets based on the prescribed rest
  // Shows: prescribed time, -15s, +15s, and a couple common options
  const presets = useMemo(() => {
    const base = prescribedRest;
    const options = new Set<number>();
    options.add(base);
    if (base - 15 >= 15) options.add(base - 15);
    if (base + 15 <= 180) options.add(base + 15);
    options.add(30);
    options.add(60);
    options.add(90);
    options.add(120);
    // Return sorted, unique, max 5 options
    return Array.from(options).sort((a, b) => a - b).slice(0, 5);
  }, [prescribedRest]);

  // Progress for the circular ring (0 to 1)
  // We track the "started at" value by using prescribed rest as the max
  const maxTime = Math.max(prescribedRest, seconds + 1);
  const progress = isActive ? seconds / maxTime : 0;

  // Urgency state
  const isUrgent = isActive && seconds <= 5 && seconds > 0;
  const isComplete = isActive && seconds === 0;

  // SVG circular progress ring
  const ringSize = 56;
  const ringStroke = 4;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  // ── ACTIVE STATE ──
  if (isActive) {
    return (
      <div className={clsx(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
        isUrgent
          ? "bg-amber-950/95 border-t-2 border-amber-500"
          : "bg-slate-800/95 backdrop-blur border-t border-slate-700"
      )}>
        <div className="px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-4">
          {/* Circular progress ring */}
          <div className="relative shrink-0">
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              {/* Background ring */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                fill="none"
                stroke={isUrgent ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)'}
                strokeWidth={ringStroke}
              />
              {/* Progress ring */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                fill="none"
                stroke={isUrgent ? '#f59e0b' : '#10b981'}
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            {/* Time in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={clsx(
                "font-mono font-black text-sm",
                isUrgent ? "text-amber-400 animate-pulse" : "text-white"
              )}>
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* Label and controls */}
          <div className="flex-1 min-w-0">
            <span className={clsx(
              "text-[9px] font-black uppercase tracking-widest block mb-1",
              isUrgent ? "text-amber-400" : "text-slate-500"
            )}>
              {isUrgent ? 'Get Ready!' : 'Resting'}
            </span>

            <div className="flex gap-1.5">
              {/* +15s quick-add */}
              {onExtend && (
                <button
                  onClick={() => onExtend(15)}
                  className="bg-slate-700/80 hover:bg-slate-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition border border-slate-600"
                >
                  <Plus size={10} /> 15s
                </button>
              )}
              {/* +30s quick-add */}
              {onExtend && (
                <button
                  onClick={() => onExtend(30)}
                  className="bg-slate-700/80 hover:bg-slate-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition border border-slate-600"
                >
                  <Plus size={10} /> 30s
                </button>
              )}
              {/* Restart with prescribed rest */}
              <button
                onClick={() => onStart(prescribedRest)}
                className="bg-slate-700/80 hover:bg-slate-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition border border-slate-600"
              >
                <RotateCcw size={10} /> {prescribedRest}s
              </button>
            </div>
          </div>

          {/* Stop button */}
          <button
            onClick={onStop}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-xl transition border border-red-500/30 shrink-0"
          >
            <StopCircle size={22} />
          </button>
        </div>
      </div>
    );
  }

  // ── IDLE STATE — compact bar with quick-start buttons ──
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur border-t border-slate-800">
      <div className="px-4 py-2 pb-[max(8px,env(safe-area-inset-bottom))] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer size={14} className="text-slate-600" />
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Rest Timer</span>
        </div>
        <div className="flex gap-1">
          {presets.map(t => (
            <button
              key={t}
              onClick={() => onStart(t)}
              className={clsx(
                "text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition border",
                t === prescribedRest
                  ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30"
                  : "bg-slate-800 text-slate-500 border-slate-700 hover:text-white hover:bg-slate-700"
              )}
            >
              {t >= 60 ? `${t / 60}m` : `${t}s`}
              {t === prescribedRest && <span className="ml-0.5 text-[7px] opacity-60">RX</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerBar;

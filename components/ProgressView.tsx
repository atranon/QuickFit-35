
import React, { useMemo, useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Zap, Trophy, BarChart3, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { WorkoutLog } from '../types';

interface ProgressViewProps {
  onBack: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ onBack }) => {
  const [showMoreExercises, setShowMoreExercises] = useState(false);

  const history: WorkoutLog[] = useMemo(() => {
    const saved = localStorage.getItem('workout_history');
    if (!saved) return [];
    try {
      return JSON.parse(saved).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch {
      return [];
    }
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) return null;

    // Total Workouts
    const totalWorkouts = history.length;

    // Streak Calculation
    let streak = 0;
    const sortedDates = [...new Set(history.map(h => new Date(h.date).toDateString()))].reverse();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      streak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i+1]);
        const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak++;
        else break;
      }
    }

    // Volume per workout
    const volumeData = history.map(log => {
      let totalVolume = 0;
      log.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const isStack = set.weight.includes('#');
          const rawWeight = parseFloat(set.weight.replace('#', '')) || 0;
          const weight = isStack ? rawWeight * 10 : rawWeight;
          const reps = parseInt(set.reps) || 0;
          totalVolume += weight * reps;
        });
      });
      return { date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), volume: totalVolume };
    });

    // Frequency (Workouts by Day)
    const dayFrequency = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    history.forEach(log => {
      let d = new Date(log.date).getDay();
      let index = d === 0 ? 6 : d - 1;
      dayFrequency[index]++;
    });

    // Exercise Progress (Normalized to lbs for comparison)
    const exerciseStats: Record<string, { start: number; end: number; displayUnit: string; isStack: boolean }> = {};
    history.forEach(log => {
      log.exercises.forEach(ex => {
        const lastSet = ex.sets[ex.sets.length - 1];
        const isStack = lastSet.weight.includes('#');
        const rawWeight = parseFloat(lastSet.weight.replace('#', '')) || 0;
        const normalizedWeight = isStack ? rawWeight * 10 : rawWeight;
        
        if (!exerciseStats[ex.name]) {
          exerciseStats[ex.name] = { 
            start: normalizedWeight, 
            end: normalizedWeight, 
            displayUnit: isStack ? '#' : 'lbs',
            isStack: isStack
          };
        } else {
          exerciseStats[ex.name].end = normalizedWeight;
        }
      });
    });

    return { totalWorkouts, streak, volumeData, dayFrequency, exerciseStats };
  }, [history]);

  if (!stats) {
    return (
      <div className="pb-24 animate-in fade-in duration-500 text-center py-20">
        <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
           <BarChart3 size={32} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">No Data Captured</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">Complete your first session to unlock performance visualizations and neural load tracking.</p>
        <button onClick={onBack} className="mt-8 text-blue-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto">
           <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    );
  }

  const maxVolume = Math.max(...stats.volumeData.map(d => d.volume), 1);
  const chartHeight = 120;
  const chartWidth = 320;

  const points = stats.volumeData.map((d, i) => {
    const x = (i / (stats.volumeData.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (d.volume / maxVolume) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const barMax = Math.max(...stats.dayFrequency, 1);
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const exercises = Object.entries(stats.exerciseStats) as [string, { start: number; end: number; displayUnit: string; isStack: boolean }][];
  const displayedExercises = showMoreExercises ? exercises : exercises.slice(0, 5);

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Performance Intel</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sessions</span>
            <span className="text-2xl font-black text-blue-400 italic">{stats.totalWorkouts}</span>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Streak</span>
            <div className="flex items-center justify-center gap-1">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-2xl font-black text-white italic">{stats.streak}</span>
            </div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">PRs Hit</span>
            <div className="flex items-center justify-center gap-1">
                <Trophy size={14} className="text-emerald-400" />
                <span className="text-2xl font-black text-white italic">--</span>
            </div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl mb-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500" /> Volume Per Session
            </h3>
            <span className="text-[10px] font-black text-slate-600">Total Work (LBS)</span>
        </div>
        
        <div className="h-[140px] w-full flex items-end">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#334155" strokeWidth="1" />
                
                {/* Area under curve */}
                <path 
                    d={`M0,${chartHeight} L${points} L${chartWidth},${chartHeight} Z`}
                    className="fill-blue-500/10"
                />
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
                {/* Points */}
                {stats.volumeData.map((d, i) => {
                    const x = (i / (stats.volumeData.length - 1 || 1)) * chartWidth;
                    const y = chartHeight - (d.volume / maxVolume) * chartHeight;
                    return <circle key={i} cx={x} cy={y} r="3" className="fill-blue-400 stroke-slate-900 stroke-2" />;
                })}
            </svg>
        </div>
        <div className="flex justify-between mt-2 px-1">
            <span className="text-[8px] font-black text-slate-600 uppercase">{stats.volumeData[0].date}</span>
            <span className="text-[8px] font-black text-slate-600 uppercase">{stats.volumeData[stats.volumeData.length - 1].date}</span>
        </div>
      </div>

      {/* Workout Frequency */}
      <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl mb-6 shadow-xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" /> Weekly Distribution
        </h3>
        <div className="flex justify-between items-end h-24 px-2">
            {stats.dayFrequency.map((count, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                        className={`w-full max-w-[12px] rounded-t-sm transition-all duration-1000 ${count > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-700/50'}`} 
                        style={{ height: `${(count / barMax) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                    />
                    <span className={`text-[9px] font-black ${count > 0 ? 'text-slate-200' : 'text-slate-600'}`}>{dayNames[i]}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Exercise Breakdown */}
      <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl shadow-xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={14} className="text-purple-500" /> Strength Progression
        </h3>
        
        <div className="space-y-4">
            {displayedExercises.map(([name, data]) => {
                const diff = data.end - data.start;
                const percent = data.start > 0 ? ((diff / data.start) * 100).toFixed(1) : '0';
                const isUp = diff > 0;
                
                const formatDisplay = (val: number) => {
                  return data.isStack ? (val / 10).toFixed(2).replace(/\.00$/, '') : val.toString();
                };

                return (
                    <div key={name} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-black text-white uppercase italic truncate max-w-[200px]">{name}</span>
                            <div className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isUp ? 'bg-emerald-500/10 text-emerald-400' : diff < 0 ? 'bg-red-500/10 text-red-400' : 'bg-slate-700/30 text-slate-500'}`}>
                                {isUp ? '+' : ''}{percent}%
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                {formatDisplay(data.start)}{data.displayUnit} <span className="mx-1 text-slate-700">→</span> <span className="text-blue-400">{formatDisplay(data.end)}{data.displayUnit}</span>
                            </div>
                            <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${isUp ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(100, (data.end / (data.end + 20)) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {exercises.length > 5 && (
            <button 
                onClick={() => setShowMoreExercises(!showMoreExercises)}
                className="w-full mt-6 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition"
            >
                {showMoreExercises ? (
                    <><ChevronUp size={12} /> Show Less</>
                ) : (
                    <><ChevronDown size={12} /> Show All Exercises</>
                )}
            </button>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
        <Info size={16} className="text-blue-400 shrink-0" />
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Progress is calculated from the final set of each exercise session. Weight stack units (#) are normalized (1# = 10 lbs) for accurate volume and strength profiling.
        </p>
      </div>
    </div>
  );
};

export default ProgressView;

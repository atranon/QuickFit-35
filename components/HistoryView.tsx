
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, Clock, Clipboard } from 'lucide-react';
import { WorkoutLog } from '../types';

interface HistoryViewProps {
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const [history, setHistory] = useState<WorkoutLog[]>([]);

  const loadHistory = useCallback(() => {
    const saved = localStorage.getItem('workout_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.sort((a: WorkoutLog, b: WorkoutLog) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e) {
        console.error("Failed to parse history", e);
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white">History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
            <Clipboard size={64} className="mx-auto text-slate-600 relative z-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Rounds Yet</h3>
          <p className="text-slate-400 mb-1">Start your first training session to</p>
          <p className="text-green-400 font-semibold">build power for longer drives 🏌️</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(log => (
            <div key={log.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-blue-400">{log.dayTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar size={12} />
                    {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <Clock size={12} />
                    {new Date(log.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-700/50 pt-2">
                {log.exercises.map((ex, i) => (
                  <div key={i} className="text-sm">
                    <div className="text-slate-200 font-medium">{ex.name}</div>
                    <div className="text-xs text-slate-500 font-mono pl-2 border-l-2 border-slate-700 mt-1">
                       {ex.sets.map((s, idx) => (
                         <span key={idx} className="mr-2">
                           <span className="text-slate-400">{s.weight}</span>
                           <span className="text-slate-600 mx-0.5">x</span>
                           <span className="text-slate-400">{s.reps}</span>
                           {idx < ex.sets.length - 1 && <span className="ml-2 opacity-30">|</span>}
                         </span>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

              {log.notes && (
                <div className="mt-3 text-xs text-slate-400 italic border-t border-slate-700/50 pt-2">
                  "{log.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;

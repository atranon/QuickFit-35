
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, Clipboard, Cloud, BookOpen } from 'lucide-react';
import { WorkoutLog } from '../types';
import SyncModal from './SyncModal';

interface HistoryViewProps {
  onBack: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack, onReset, onShowTutorial }) => {
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

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

  const confirmReset = () => {
    if (window.confirm("Are you sure you want to clear ALL history and custom data?")) {
      onReset();
    }
  };

  return (
    <div className="pb-24">
      <SyncModal 
        isOpen={isSyncOpen} 
        onClose={() => setIsSyncOpen(false)} 
        onSyncComplete={loadHistory}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white">History</h2>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => setIsSyncOpen(true)}
                className="text-xs bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition"
            >
                <Cloud size={14} /> Sync
            </button>
            <button
                onClick={onShowTutorial}
                className="text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition"
            >
                <BookOpen size={14} /> Tutorial
            </button>
            <button onClick={confirmReset} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2">
                <Trash2 size={14} /> Reset
            </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Clipboard size={48} className="mx-auto mb-4 opacity-50" />
          <p>No workouts logged yet.</p>
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

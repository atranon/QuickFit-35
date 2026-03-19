import React, { useEffect } from 'react';
import { Trophy, TrendingUp, Dumbbell, Target, CheckCircle2, X } from 'lucide-react';
import { triggerGolfCelebration } from '../utils/confetti';

interface WorkoutStats {
  totalSets: number;
  totalVolume: number;
  prCount: number;
  duration?: string;
  dayTitle: string;
}

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  stats: WorkoutStats;
  onClose: () => void;
}

const WorkoutCompletionModal: React.FC<WorkoutCompletionModalProps> = ({ isOpen, stats, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      triggerGolfCelebration();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-md w-full mx-4 animate-in zoom-in duration-500">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-full shadow-2xl shadow-green-500/20">
              <Trophy className="text-white" size={48} />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="text-green-400" size={28} />
                  Workout Complete!
                </h2>
                <p className="text-sm text-slate-400 mt-1">{stats.dayTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 space-y-4">
            {/* Golf-themed message */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-300 text-center font-semibold text-lg">
                {stats.prCount > 0
                  ? `🏌️ ${stats.prCount} Personal Record${stats.prCount > 1 ? 's' : ''}! You're driving further every day.`
                  : "🏌️ Solid round! Your swing power just got stronger."}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
                <Dumbbell className="mx-auto mb-2 text-blue-400" size={24} />
                <div className="text-2xl font-bold text-white">{stats.totalSets}</div>
                <div className="text-xs text-slate-400">Total Sets</div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
                <TrendingUp className="mx-auto mb-2 text-orange-400" size={24} />
                <div className="text-2xl font-bold text-white">{stats.totalVolume.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Total Volume (lbs)</div>
              </div>

              {stats.prCount > 0 && (
                <div className="col-span-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                  <Trophy className="mx-auto mb-2 text-green-400" size={28} />
                  <div className="text-3xl font-bold text-green-300">{stats.prCount}</div>
                  <div className="text-xs text-green-400 font-semibold">Personal Records</div>
                </div>
              )}
            </div>

            {/* Motivational Quote */}
            <div className="bg-slate-900/30 border-l-4 border-green-500 rounded-r-xl p-4 mt-6">
              <p className="text-slate-300 text-sm italic">
                "Every rep builds the foundation for a better swing. Keep grinding."
              </p>
              <p className="text-slate-500 text-xs mt-2">— Your Strength Coach</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-slate-500 text-xs mt-4">
          Track your progress in the Progress tab
        </p>
      </div>
    </div>
  );
};

export default WorkoutCompletionModal;

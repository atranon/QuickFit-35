import React from 'react';
import { X, RefreshCw, Info } from 'lucide-react';
import { ExerciseAlternative } from '../constants/exerciseAlternatives';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  exerciseName: string;
  alternatives: ExerciseAlternative[];
  onClose: () => void;
  onSwap: (newName: string) => void;
}

const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  isOpen,
  exerciseName,
  alternatives,
  onClose,
  onSwap
}) => {
  if (!isOpen) return null;

  const handleSwap = (newName: string) => {
    onSwap(newName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-4 mb-4 sm:mb-0 animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0">
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <RefreshCw className="text-green-400" size={20} />
              <h3 className="font-bold text-white">Exercise Alternatives</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-700 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Exercise */}
          <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Info size={14} />
              Currently Selected
            </div>
            <div className="font-bold text-white">{exerciseName}</div>
          </div>

          {/* Alternatives List */}
          <div className="px-6 py-4">
            {alternatives.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-3">
                  Tap an alternative to swap it in for the same muscle group:
                </p>
                {alternatives.map((alt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSwap(alt.name)}
                    className="w-full text-left bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-green-500/50 rounded-lg p-4 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-green-400 transition mb-1">
                          {alt.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {alt.reason}
                        </div>
                      </div>
                      <RefreshCw size={16} className="text-slate-600 group-hover:text-green-400 transition mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <p className="text-sm">No alternatives available for this exercise.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              💡 Swapping exercises keeps the workout structure the same but gives you variety or accommodates equipment availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSwapModal;

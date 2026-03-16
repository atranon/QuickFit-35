
import React from 'react';
import { Trophy, CheckCircle2, Star, Quote, ArrowRight } from 'lucide-react';
import { WorkoutLog } from '../types';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: WorkoutLog | null;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  const exerciseCount = log.exercises.length;
  const totalSets = log.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const quotes = [
    "Distance is built in the off-season. Today was another brick.",
    "Force production is the currency of speed.",
    "The ground is your most powerful tool. You loaded it well today.",
    "Technical floors are raised one session at a time.",
    "Consistency over intensity. But today, you brought both."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-sm w-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[80px] -z-10 rounded-full"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-emerald-500/20 rounded-2xl mb-4 animate-bounce">
            <Trophy className="text-emerald-400" size={48} />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
            Session <span className="text-emerald-400">Complete</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Neural Load Verified • Power Logged</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Movements</span>
            <span className="text-2xl font-black text-white italic">{exerciseCount}</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sets</span>
            <span className="text-2xl font-black text-white italic">{totalSets}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border-l-2 border-emerald-500/50 p-4 rounded-r-2xl mb-8">
           <Quote size={16} className="text-emerald-500/30 mb-2" />
           <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
             "{randomQuote}"
           </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-widest text-xs italic"
        >
          Return to Dashboard <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;

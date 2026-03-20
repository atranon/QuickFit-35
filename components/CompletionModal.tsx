
import React from 'react';
import { Trophy, CheckCircle2, Star, Quote, ArrowRight, Gauge, Zap, Share2, Loader2 } from 'lucide-react';
import { WorkoutLog } from '../types';
import { shareOrDownloadCard, ShareCardData } from '../lib/shareCard';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: WorkoutLog | null;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  const [isSharing, setIsSharing] = React.useState(false);
  const [shareResult, setShareResult] = React.useState<string | null>(null);

  const handleShare = async () => {
    setIsSharing(true);
    setShareResult(null);
    try {
      // Build share data from the current session + history
      const historyStr = localStorage.getItem('workout_history') || '[]';
      const history = JSON.parse(historyStr);
      history.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const data: ShareCardData = {
        totalSessions: history.length,
      };

      // Add speed data if this session had it
      const speedSessions = history.filter((h: any) => h.swingSpeed?.driverSpeed);
      if (speedSessions.length >= 2) {
        data.firstSpeed = speedSessions[0].swingSpeed.driverSpeed;
        data.latestSpeed = speedSessions[speedSessions.length - 1].swingSpeed.driverSpeed;
        data.speedGain = data.latestSpeed! - data.firstSpeed!;
        data.estimatedYards = Math.round(data.speedGain! * 2.5);
      } else if (log.swingSpeed?.driverSpeed) {
        data.latestSpeed = log.swingSpeed.driverSpeed;
        data.firstSpeed = data.latestSpeed;
        data.speedGain = 0;
      }

      // Date range
      if (history.length > 0) {
        const first = new Date(history[0].date);
        const last = new Date(history[history.length - 1].date);
        data.dateRange = `${first.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }

      const result = await shareOrDownloadCard(data);
      setShareResult(result === 'shared' ? 'Shared!' : result === 'downloaded' ? 'Saved!' : 'Error');
    } catch (e) {
      setShareResult('Error');
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareResult(null), 3000);
    }
  };

  const exerciseCount = log.exercises.length;
  const totalSets = log.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const hasSpeedData = !!log.swingSpeed?.driverSpeed;

  // Check if this is a new peak speed
  let isNewPeak = false;
  if (hasSpeedData) {
    try {
      const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
      const previousSpeeds = history
        .filter((h: WorkoutLog) => h.swingSpeed?.driverSpeed && h.id !== log.id)
        .map((h: WorkoutLog) => h.swingSpeed!.driverSpeed!);
      isNewPeak = previousSpeeds.length === 0 || log.swingSpeed!.driverSpeed! >= Math.max(...previousSpeeds);
    } catch (e) {
      // If history parsing fails, just don't show peak badge
    }
  }

  const quotes = hasSpeedData ? [
    "Speed is earned in the gym. You just proved it.",
    "Every mph is worth 2-3 yards off the tee. Bank it.",
    "Your body is learning to move faster. The course will notice.",
    "Clubhead speed doesn't lie. Great session.",
    "Force production → speed production. That's the equation."
  ] : [
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
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {hasSpeedData ? 'Speed Session Logged' : 'Power Logged • Progress Tracked'}
          </p>
        </div>

        {/* Speed data callout — prominent when available */}
        {hasSpeedData && (
          <div className={`p-5 rounded-2xl mb-6 text-center ${isNewPeak ? 'bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border-2 border-amber-500/40' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            {isNewPeak && (
              <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
                <Zap size={10} fill="currentColor" /> New Peak Speed!
              </div>
            )}
            <div className="flex items-baseline justify-center gap-2">
              <Gauge size={20} className="text-amber-400" />
              <span className="text-4xl font-black text-white italic">{log.swingSpeed!.driverSpeed}</span>
              <span className="text-sm font-black text-amber-500/60">MPH</span>
            </div>
            {log.swingSpeed!.carryDistance && (
              <p className="text-xs text-slate-400 mt-2 font-bold">
                {log.swingSpeed!.carryDistance} yards carry
              </p>
            )}
          </div>
        )}

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

        <div className="space-y-3">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-widest text-xs italic"
          >
            {isSharing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Share2 size={16} />
            )}
            {shareResult || 'Share Your Progress'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-widest text-xs italic"
          >
            Return to Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;

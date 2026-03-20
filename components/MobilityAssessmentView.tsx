import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Play, ExternalLink, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Activity } from 'lucide-react';
import { MobilityResult, MobilityScore, MobilityAssessmentData, MobilityFlag } from '../types';
import { MOBILITY_TESTS, saveAssessment, getAssessment } from '../constants/mobilityAssessment';

interface MobilityAssessmentViewProps {
  onBack: () => void;
  onComplete: () => void;
}

type Phase = 'intro' | 'testing' | 'summary';

const SCORE_OPTIONS: { value: MobilityScore; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { value: 'pass', label: 'Pass', icon: <CheckCircle2 size={20} />, desc: 'I can do this fully with good control.', color: 'bg-emerald-600 border-emerald-400 text-white' },
  { value: 'partial', label: 'Partial', icon: <AlertTriangle size={20} />, desc: 'I can do this but it\'s limited or tight.', color: 'bg-amber-600 border-amber-400 text-white' },
  { value: 'fail', label: 'Fail', icon: <XCircle size={20} />, desc: 'I can\'t do this or it causes discomfort.', color: 'bg-red-600 border-red-400 text-white' },
];

const MobilityAssessmentView: React.FC<MobilityAssessmentViewProps> = ({ onBack, onComplete }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<MobilityResult[]>([]);
  const [completedAssessment, setCompletedAssessment] = useState<MobilityAssessmentData | null>(null);

  const existing = getAssessment();

  const handleScore = (score: MobilityScore) => {
    const test = MOBILITY_TESTS[currentTest];
    const result: MobilityResult = {
      testId: test.id,
      score,
      side: test.isBilateral ? 'both' : undefined,
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (currentTest < MOBILITY_TESTS.length - 1) {
      setTimeout(() => setCurrentTest(prev => prev + 1), 200);
    } else {
      // Assessment complete — save and show summary
      const data = saveAssessment(newResults);
      setCompletedAssessment(data);
      setPhase('summary');
    }
  };

  const goBackTest = () => {
    if (currentTest > 0) {
      setResults(prev => prev.slice(0, -1));
      setCurrentTest(prev => prev - 1);
    } else {
      setPhase('intro');
    }
  };

  // ============================================
  // INTRO SCREEN
  // ============================================
  if (phase === 'intro') {
    return (
      <div className="pb-24 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Mobility Check</h2>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex p-5 bg-purple-600/20 border border-purple-500/30 rounded-3xl mb-6">
            <Activity className="text-purple-400" size={48} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-3">
            Know Your Body
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            5 simple movement tests. 3 minutes. Find out what's holding your swing back — and get targeted exercises to fix it.
          </p>
        </div>

        {existing && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Previous Assessment</p>
            <p className="text-xs text-slate-400">
              Completed {new Date(existing.completedAt).toLocaleDateString()} — {existing.flags.length} area{existing.flags.length !== 1 ? 's' : ''} flagged
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {existing.flags.map((flag, i) => (
                <span key={i} className={`text-[8px] font-black px-2 py-0.5 rounded ${flag.severity === 'limitation' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {flag.area}
                </span>
              ))}
              {existing.flags.length === 0 && (
                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">All clear!</span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => { setPhase('testing'); setCurrentTest(0); setResults([]); }}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest text-sm"
        >
          {existing ? 'Reassess' : 'Start Assessment'} <ChevronRight size={20} />
        </button>

        <p className="text-center text-slate-700 text-[10px] mt-3 font-bold uppercase tracking-widest">
          No equipment needed • Can be done anywhere
        </p>
      </div>
    );
  }

  // ============================================
  // SUMMARY SCREEN
  // ============================================
  if (phase === 'summary' && completedAssessment) {
    const limitations = completedAssessment.flags.filter(f => f.severity === 'limitation');
    const warnings = completedAssessment.flags.filter(f => f.severity === 'warning');
    const allClear = completedAssessment.flags.length === 0;

    return (
      <div className="pb-24 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Your Results</h2>
        </div>

        {allClear ? (
          <div className="text-center mb-8 p-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-black text-white italic uppercase mb-2">All Clear</h3>
            <p className="text-sm text-slate-400">No significant limitations detected. Your warm-ups will focus on general activation and priming.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {limitations.map((flag, i) => (
              <div key={`l-${i}`} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-xs font-black text-red-400 uppercase tracking-widest">{flag.area}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{flag.message}</p>
                <div className="flex flex-wrap gap-1.5">
                  {flag.correctives.map((c, j) => (
                    <span key={j} className="text-[8px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            ))}
            {warnings.map((flag, i) => (
              <div key={`w-${i}`} className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">{flag.area}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{flag.message}</p>
                <div className="flex flex-wrap gap-1.5">
                  {flag.correctives.map((c, j) => (
                    <span key={j} className="text-[8px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            {allClear
              ? 'Your warm-ups will include standard activation drills. Reassess in 4 weeks to track changes.'
              : `Your warm-ups will now include ${completedAssessment.flags.reduce((sum, f) => sum + f.correctives.length, 0)} targeted corrective exercises before each workout. These address the areas flagged above. Reassess in 4 weeks to track your improvement.`
            }
          </p>
        </div>

        <button
          onClick={() => { onComplete(); onBack(); }}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest text-sm italic"
        >
          Done — Back to Training <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  // ============================================
  // TESTING SCREEN
  // ============================================
  const test = MOBILITY_TESTS[currentTest];

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBackTest} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {MOBILITY_TESTS.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= currentTest ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-800'}`} />
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-600 uppercase">{currentTest + 1}/{MOBILITY_TESTS.length}</span>
      </div>

      <div className="text-center mb-6" key={currentTest}>
        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{test.area}</span>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1 mb-3">
          {test.name}
        </h2>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mb-6">
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{test.whyItMatters}</p>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">How to test</p>
          <p className="text-xs text-slate-300 leading-relaxed">{test.howToTest}</p>
        </div>

        <a
          href={test.videoSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-red-500/30 text-xs"
        >
          <Play size={14} fill="currentColor" /> Watch Demo <ExternalLink size={12} className="opacity-60" />
        </a>
      </div>

      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">How did you do?</p>

      <div className="grid gap-3">
        {SCORE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleScore(opt.value)}
            className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
              results[currentTest]?.score === opt.value
                ? opt.color
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={results[currentTest]?.score === opt.value ? 'text-white' : 'text-slate-500'}>
                {opt.icon}
              </span>
              <div>
                <span className={`block font-black uppercase italic tracking-tight text-lg ${results[currentTest]?.score === opt.value ? 'text-white' : 'text-slate-300'}`}>
                  {opt.label}
                </span>
                <span className={`text-xs font-medium block mt-0.5 ${results[currentTest]?.score === opt.value ? 'text-white/80' : 'text-slate-500'}`}>
                  {opt.desc}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Per-score descriptions */}
      <div className="mt-4 bg-slate-800/30 rounded-xl p-3 text-[10px] text-slate-600 space-y-1">
        <p><span className="text-emerald-500 font-bold">Pass:</span> {test.passDescription}</p>
        <p><span className="text-amber-500 font-bold">Partial:</span> {test.partialDescription}</p>
        <p><span className="text-red-500 font-bold">Fail:</span> {test.failDescription}</p>
      </div>
    </div>
  );
};

export default MobilityAssessmentView;


import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Columns, List, Sparkles, Clock, Check, Info, StickyNote, TrendingUp, Target, History, Timer, Trophy, Activity, Zap, ShieldCheck, Cloud, ArrowRight, Gauge, Play, ExternalLink, ChevronDown, ChevronUp, RefreshCw, X } from 'lucide-react';
import { DaySchedule, Exercise, WorkoutLog, SetData, SwingSpeedData, WarmUpExercise } from '../types';
import { generateFormDescription, generateWorkoutRoutine } from '../services/geminiService';
import GeminiModal from './GeminiModal';
import VideoModal from './VideoModal';
import ExerciseDemoModal from './ExerciseDemoModal';
import { triggerBackgroundSync } from '../services/storageService';
import { getExerciseDemo, getFallbackVideoUrl } from '../constants/exerciseDemos';
import { getExerciseAlternatives } from '../constants/exerciseAlternatives';
import { buildWarmUp, getCoolDown } from '../constants/mobilityAssessment';

interface WorkoutViewProps {
  dayKey: string;
  schedule: DaySchedule;
  onBack: () => void;
  onStartTimer: (seconds: number) => void;
  onFinish: (log: WorkoutLog) => void;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ dayKey, schedule, onBack, onStartTimer, onFinish }) => {
  const [layout, setLayout] = useState<'list' | 'split'>('split');
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, { weight: string; reps: string; rpe: string; unit: 'lbs' | '#' }>>({});
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [prevNotes, setPrevNotes] = useState('');
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done'>('idle');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>('');
  const [modalTextForTTS, setModalTextForTTS] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string | undefined>(undefined);
  const [modalIsGolfSpecific, setModalIsGolfSpecific] = useState(false);

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState('');
  const [videoModalExercise, setVideoModalExercise] = useState('');

  // Exercise Demo Modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoExerciseName, setDemoExerciseName] = useState('');
  const [demoData, setDemoData] = useState<any>(null);
  const [demoFallbackUrl, setDemoFallbackUrl] = useState('');

  // Exercise Swap Modal state
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapExerciseId, setSwapExerciseId] = useState('');
  const [swapExerciseName, setSwapExerciseName] = useState('');

  const [showTutorial, setShowTutorial] = useState(false);

  // Swing speed tracking — only used when the workout has speed exercises
  const hasSpeedWork = schedule.exercises.some(e => e.type === 'speed');
  const [swingSpeed, setSwingSpeed] = useState<SwingSpeedData>({});
  const [showSpeedInput, setShowSpeedInput] = useState(hasSpeedWork);

  // Warm-up and cool-down state
  const [showWarmUp, setShowWarmUp] = useState(true);
  const [showCoolDown, setShowCoolDown] = useState(false);
  const [warmUpExercises] = useState<WarmUpExercise[]>(() => buildWarmUp(schedule.type));
  const [coolDownExercises] = useState<WarmUpExercise[]>(() => getCoolDown());

  useEffect(() => {
    const savedNotes = localStorage.getItem(`workout_notes_${dayKey}`);
    if (savedNotes) setNotes(savedNotes);

    const savedInputs = localStorage.getItem(`current_inputs_${dayKey}`);
    if (savedInputs) {
      try {
        setInputValues(JSON.parse(savedInputs));
      } catch (e) { console.error("Failed to load saved inputs", e); }
    }

    const savedCompleted = localStorage.getItem(`current_completed_${dayKey}`);
    if (savedCompleted) {
      try {
        setCompletedSets(new Set(JSON.parse(savedCompleted)));
      } catch (e) { console.error("Failed to load saved completed sets", e); }
    }

    const loadedNames: Record<string, string> = {};
    schedule.exercises.forEach(ex => {
      const savedName = localStorage.getItem(`ex_name_${ex.id}`);
      if (savedName) loadedNames[ex.id] = savedName;
    });
    setCustomNames(loadedNames);

    try {
      const savedHistory = localStorage.getItem('workout_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        const sortedHistory = parsed.sort((a: WorkoutLog, b: WorkoutLog) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistory(sortedHistory);

        // Load last recorded swing speed for reference
        if (hasSpeedWork) {
          const lastSpeedSession = sortedHistory.find((log: WorkoutLog) => log.swingSpeed?.driverSpeed);
          if (lastSpeedSession?.swingSpeed) {
            // Pre-fill the device field from their last session (they probably use the same device)
            setSwingSpeed(prev => ({ ...prev, device: lastSpeedSession.swingSpeed?.device || '' }));
          }
        }

        // Check if we should show the tutorial
        const tutorialSeen = localStorage.getItem('workout_tutorial_seen');
        if (parsed.length === 0 && !tutorialSeen) {
          setShowTutorial(true);
        }
      } else {
        // No history at all, definitely show tutorial
        const tutorialSeen = localStorage.getItem('workout_tutorial_seen');
        if (!tutorialSeen) {
          setShowTutorial(true);
        }
      }
    } catch (e) {
      console.error("Failed to load history context", e);
    }
  }, [dayKey, schedule]);

  useEffect(() => {
    if (history.length > 0) {
      const lastSession = history.find(log => log.dayKey === dayKey);
      if (lastSession?.notes) {
        setPrevNotes(lastSession.notes);
      } else {
        setPrevNotes('');
      }
    }
  }, [history, dayKey]);

  const handleNameChange = (id: string, val: string) => {
    setCustomNames(prev => ({ ...prev, [id]: val }));
    if (val.trim()) {
      localStorage.setItem(`ex_name_${id}`, val.trim());
    } else {
      localStorage.removeItem(`ex_name_${id}`);
    }
  };

  const handleInputChange = (exId: string, setNum: number, field: 'weight' | 'reps' | 'rpe', val: string) => {
    const key = `${exId}_${setNum}`;
    setInputValues(prev => {
      const current = prev[key] || { weight: '', reps: '', rpe: '', unit: 'lbs' };
      const next = {
        ...prev,
        [key]: {
          ...current,
          [field]: val
        }
      };
      localStorage.setItem(`current_inputs_${dayKey}`, JSON.stringify(next));
      return next;
    });
  };

  const toggleUnit = (exId: string, setNum: number) => {
    const key = `${exId}_${setNum}`;
    setInputValues(prev => {
      const current = prev[key] || { weight: '', reps: '', rpe: '', unit: 'lbs' };
      const next = {
        ...prev,
        [key]: {
          ...current,
          unit: current.unit === '#' ? 'lbs' : '#'
        }
      };
      localStorage.setItem(`current_inputs_${dayKey}`, JSON.stringify(next));
      return next;
    });
  };

  const toggleComplete = (exId: string, setNum: number, weight: string, reps: string) => {
    const key = `${exId}_${setNum}`;
    if (weight && reps) {
      setCompletedSets(prev => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
          const input = inputValues[key] || { unit: 'lbs' };
          let finalWeight = weight;
          if (input.unit === '#') finalWeight = '#' + finalWeight;
          localStorage.setItem(`last_${exId}`, JSON.stringify({ weight: finalWeight, reps: reps, date: new Date().toISOString() }));
          setSyncStatus('syncing');
          setTimeout(() => { triggerBackgroundSync().then(() => setSyncStatus('done')).catch(() => setSyncStatus('idle')); }, 2000);
          onStartTimer(schedule.exercises.find(e => e.id === exId)?.rest || 60);
        }
        localStorage.setItem(`current_completed_${dayKey}`, JSON.stringify(Array.from(next)));
        return next;
      });
    }
  };

  const handleFinish = () => {
    const logs = schedule.exercises.map(ex => {
      const exLog = { name: customNames[ex.id] || ex.name, sets: [] as any[] };
      for(let i=1; i<=ex.sets; i++) {
        const key = `${ex.id}_${i}`;
        const val = inputValues[key];
        if (val && val.weight && val.reps) {
          let w = val.weight;
          if (val.unit === '#') w = '#' + w;
          exLog.sets.push({ set: i, weight: w, reps: val.reps, rpe: val.rpe });
        }
      }
      return exLog;
    }).filter(l => l.sets.length > 0);
    if (logs.length === 0 && !notes.trim()) { alert("Record at least one set or a note to finish."); return; }
    const fullLog: WorkoutLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      dayKey,
      dayTitle: schedule.title,
      notes,
      exercises: logs,
      // Only include swing speed data if they actually entered a driver speed
      ...(swingSpeed.driverSpeed ? { swingSpeed } : {})
    };
    onFinish(fullLog);
  };

  const openFormCheck = async (exId: string, defaultName: string, category: string) => {
    const name = customNames[exId] || defaultName;

    // Look up demo data for this exercise
    const demo = getExerciseDemo(name);
    const videoUrl = demo?.videoSearchUrl || getFallbackVideoUrl(name);

    setModalTitle(`${name} - Technical Check`);
    setModalVideoUrl(videoUrl);
    setModalIsGolfSpecific(demo?.isGolfSpecific || false);
    setIsModalLoading(true);
    setModalOpen(true);
    setModalContent('');
    setModalTextForTTS('');
    try {
      const text = await generateFormDescription(name, category);
      setModalContent(<p className="italic text-slate-300 leading-relaxed font-medium">"{text}"</p>);
      setModalTextForTTS(text);
    } catch (e) { setModalContent(<p className="text-red-400">Consultation failed.</p>); }
    finally { setIsModalLoading(false); }
  };

  const openRoutineGen = async () => {
    setModalTitle(`Session Prep & Recovery`);
    setIsModalLoading(true);
    setModalOpen(true);
    setModalContent('');
    setModalTextForTTS('');
    try {
      const names = schedule.exercises.map(e => customNames[e.id] || e.name);
      const text = await generateWorkoutRoutine(schedule.title, names);
      const lines = text.split('\n').map((line, i) => {
          if (line.startsWith('###')) return <h4 key={i} className="text-sm font-black text-blue-400 mt-4 uppercase tracking-wider">{line.replace('###', '')}</h4>;
          if (line.startsWith('##')) return <h3 key={i} className="text-md font-black text-emerald-400 mt-6 uppercase">{line.replace('##', '')}</h3>;
          if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="ml-4 list-disc text-slate-400 text-xs py-0.5">{line.replace(/[*|-]/, '')}</li>;
          return <p key={i} className="text-xs text-slate-300 leading-snug">{line}</p>;
      });
      setModalContent(<div>{lines}</div>);
      setModalTextForTTS(text.replace(/[#*-]/g, ''));
    } catch (e) {
      // Fixed typo: removed extra tag start <p
      setModalContent(<p className="text-red-400">Generation failed.</p>);
    } finally {
      setIsModalLoading(false);
    }
  };

  const getPreviousSetData = useCallback((exName: string, setNum: number): SetData | null => {
    if (!history.length) return null;
    const previousLog = history.find(log => log.exercises.some(e => e.name.toLowerCase() === exName.toLowerCase()));
    if (!previousLog) return null;
    const exerciseLog = previousLog.exercises.find(e => e.name.toLowerCase() === exName.toLowerCase());
    return exerciseLog ? (exerciseLog.sets.find(s => s.set === setNum) || null) : null;
  }, [history]);

  const getProgressiveSuggestion = (prev: SetData | null, targetRepsRange: string): { weight: string, reps: string, isIncrease: boolean, originalWeight: string } => {
    if (!prev) {
      const targetMatch = targetRepsRange.match(/(\d+)(?!.*\d)/);
      return { weight: '', reps: targetMatch ? targetMatch[0] : '10', isIncrease: false, originalWeight: '' };
    }
    const isStack = prev.weight.includes('#');
    const weightLastStr = prev.weight.replace('#', '');
    const weightLastRaw = parseFloat(weightLastStr) || 0;
    const weightLastNormalized = isStack ? weightLastRaw * 10 : weightLastRaw;
    const repsLast = parseInt(prev.reps) || 0;
    
    const targetMatch = targetRepsRange.match(/(\d+)(?!.*\d)/);
    const targetMax = targetMatch ? parseInt(targetMatch[0]) : 10;
    
    if (repsLast >= targetMax) {
      const increment = weightLastNormalized >= 100 ? 5 : 2.5;
      const newWeightNormalized = weightLastNormalized + increment;
      const suggestionWeight = isStack ? `${(newWeightNormalized / 10).toFixed(2).replace(/\.00$/, '')}#` : `${newWeightNormalized}`;
      return { weight: suggestionWeight, reps: `${targetMax}`, isIncrease: true, originalWeight: prev.weight };
    } else {
      return { weight: prev.weight, reps: `${targetMax}`, isIncrease: false, originalWeight: prev.weight };
    }
  };

  const renderSetInputs = (ex: Exercise, isSplit: boolean) => {
    const currentName = customNames[ex.id] || ex.name;
    const rows = [];
    for(let i=1; i<=ex.sets; i++) {
      const key = `${ex.id}_${i}`;
      const val = inputValues[key] || { weight: '', reps: '', rpe: '', unit: 'lbs' };
      const isComplete = completedSets.has(key);
      const prevSetData = getPreviousSetData(currentName, i);
      const suggestion = getProgressiveSuggestion(prevSetData, ex.reps);
      const placeholderWeight = suggestion.weight ? suggestion.weight.replace('#', '') : (prevSetData ? prevSetData.weight.replace('#', '') : '');
      const placeholderReps = suggestion.reps || '10';
      const placeholderRPE = prevSetData?.rpe || '8';
      
      // Normalized PR detection
      const currentIsStack = val.unit === '#';
      const currentWeightRaw = parseFloat(val.weight || placeholderWeight) || 0;
      const currentWeightNormalized = currentIsStack ? currentWeightRaw * 10 : currentWeightRaw;
      const currentRepsVal = parseInt(val.reps || placeholderReps) || 0;
      
      const currentRPEVal = parseFloat(val.rpe || placeholderRPE) || 10;
      
      const prevIsStack = prevSetData?.weight.includes('#') || false;
      const prevWeightRaw = prevSetData ? parseFloat(prevSetData.weight.replace('#', '')) || 0 : 0;
      const prevWeightNormalized = prevIsStack ? prevWeightRaw * 10 : prevWeightRaw;
      const prevRepsVal = prevSetData ? parseInt(prevSetData.reps) || 0 : 0;
      const prevRPEVal = prevSetData ? parseFloat(prevSetData.rpe) || 10 : 10;
      
      const isWeightUp = currentWeightNormalized > prevWeightNormalized;
      const isRepsUp = currentRepsVal > prevRepsVal;
      const isRpeDown = currentRPEVal < prevRPEVal;
      
      const isAchievement = isComplete && (
        (isWeightUp && currentRepsVal >= prevRepsVal) || 
        (isRepsUp && currentWeightNormalized >= prevWeightNormalized) ||
        (currentWeightNormalized >= prevWeightNormalized && currentRepsVal >= prevRepsVal && isRpeDown)
      );

      rows.push(
        <div key={i} className="mb-3 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="flex items-center gap-2 mb-1 px-0.5 overflow-hidden">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter shrink-0">Set {i}</span>
             {prevSetData && (
               <div className={`flex items-center gap-1 text-[8px] font-bold px-1 py-0.5 rounded shrink-0 whitespace-nowrap ${suggestion.isIncrease ? 'bg-blue-500/10 text-blue-300' : 'bg-slate-700/30 text-slate-500'}`}>
                 <History size={7} />
                 <span>{prevSetData.weight}{prevSetData.weight.includes('#') ? '' : 'lbs'} x {prevSetData.reps}</span>
               </div>
             )}
             {isAchievement && (
                <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 animate-bounce duration-1000">
                    <Trophy size={7} /> <span>PR!</span>
                </div>
             )}
          </div>
          <div className={`flex items-center ${isSplit ? 'gap-1' : 'gap-2'}`}>
            <div className="relative flex-1 min-w-0">
                <input
                type="text" inputMode="decimal" placeholder={placeholderWeight} value={val.weight}
                onChange={(e) => handleInputChange(ex.id, i, 'weight', e.target.value)}
                className={`bg-slate-900/60 border leading-none transition-all duration-300 ${isAchievement ? 'border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : isComplete ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-white'} rounded w-full py-1.5 ${isSplit ? 'pl-1.5 pr-6 text-sm' : 'pl-3 pr-10 text-lg'} font-black focus:outline-none focus:border-blue-500 placeholder:text-slate-800`}
                />
                <button 
                    onClick={() => toggleUnit(ex.id, i)}
                    className={`absolute ${isSplit ? 'right-0.5' : 'right-1'} top-1/2 -translate-y-1/2 text-[8px] font-black py-0.5 px-0.5 rounded transition border border-transparent ${val.unit === '#' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-600'}`}
                >
                    {val.unit}
                </button>
            </div>
            <div className={`${isSplit ? 'w-10' : 'w-16'}`}>
                <input
                type="text" inputMode="text" placeholder={placeholderReps} value={val.reps}
                onChange={(e) => handleInputChange(ex.id, i, 'reps', e.target.value)}
                className={`bg-slate-900/60 border leading-none transition-all duration-300 ${isAchievement ? 'border-emerald-500 text-emerald-300' : isComplete ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-white'} rounded w-full py-1.5 text-center ${isSplit ? 'text-sm' : 'text-lg'} font-black focus:outline-none focus:border-blue-500 placeholder:text-slate-800`}
                />
            </div>
            <div className={`${isSplit ? 'w-10' : 'w-16'}`}>
                <input
                type="text" inputMode="decimal" placeholder={placeholderRPE} value={val.rpe}
                onChange={(e) => handleInputChange(ex.id, i, 'rpe', e.target.value)}
                className={`bg-slate-900/60 border leading-none transition-all duration-300 ${isComplete ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-white'} rounded w-full py-1.5 text-center ${isSplit ? 'text-sm' : 'text-lg'} font-black focus:outline-none focus:border-blue-500 placeholder:text-slate-800`}
                />
            </div>
            <button
                onClick={() => toggleComplete(ex.id, i, val.weight || placeholderWeight, val.reps || placeholderReps)}
                className={`${isSplit ? 'w-7 h-7' : 'w-10 h-10'} rounded flex items-center justify-center transition-all ${isAchievement ? 'bg-emerald-500 text-white' : isComplete ? 'bg-green-600 text-white scale-95' : 'bg-slate-700 text-slate-500 hover:bg-slate-600'}`}
            >
                <Check size={isSplit ? 14 : 20} strokeWidth={4} />
            </button>
          </div>
        </div>
      );
    }
    return rows;
  };

  const groups: { name: string; items: Exercise[] }[] = [];
  let currentGroupItem: any = null;
  schedule.exercises.forEach(ex => {
    if (currentGroupItem && currentGroupItem.name === ex.group) { currentGroupItem.items.push(ex); } 
    else { currentGroupItem = { name: ex.group, items: [ex] }; groups.push(currentGroupItem); }
  });

  const handleManualSync = async () => {
    setSyncStatus('syncing');
    try {
      await triggerBackgroundSync();
      setSyncStatus('done');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (e) {
      setSyncStatus('idle');
      alert("Sync failed. Check credentials.");
    }
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('workout_tutorial_seen', 'true');
  };

  const openDemoModal = (exerciseName: string) => {
    const demo = getExerciseDemo(exerciseName);
    setDemoExerciseName(exerciseName);
    setDemoData(demo);
    setDemoFallbackUrl(demo?.videoSearchUrl || getFallbackVideoUrl(exerciseName));
    setDemoModalOpen(true);
  };

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <ExerciseDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        exerciseName={demoExerciseName}
        demo={demoData}
        fallbackSearchUrl={demoFallbackUrl}
      />

      {/* Exercise Swap Modal */}
      {swapModalOpen && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-white uppercase italic">Swap Exercise</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">{swapExerciseName}</p>
              </div>
              <button onClick={() => setSwapModalOpen(false)} className="p-1 text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Alternatives List */}
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {getExerciseAlternatives(swapExerciseName).map((alt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleNameChange(swapExerciseId, alt.name);
                    setSwapModalOpen(false);
                  }}
                  className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-xl transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-black text-white group-hover:text-purple-400 transition">{alt.name}</span>
                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0 ${
                      alt.difficulty === 'easier' ? 'bg-blue-500/20 text-blue-400' :
                      alt.difficulty === 'harder' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {alt.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{alt.reason}</p>
                </button>
              ))}
            </div>

            {/* Keep Original Button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setSwapModalOpen(false)}
                className="w-full py-2.5 text-[10px] font-black text-slate-500 hover:text-slate-400 uppercase tracking-widest transition"
              >
                Keep Original
              </button>
            </div>
          </div>
        </div>
      )}

      <GeminiModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
        textContent={modalTextForTTS}
        loading={isModalLoading}
        videoUrl={modalVideoUrl}
        isGolfSpecific={modalIsGolfSpecific}
        onOpenVideo={() => {
          if (modalVideoUrl) {
            setVideoModalUrl(modalVideoUrl);
            setVideoModalExercise(modalTitle.replace(' - Technical Check', ''));
            setVideoModalOpen(true);
            setModalOpen(false); // Close the info modal when opening video
          }
        }}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoModalUrl}
        exerciseName={videoModalExercise}
      />

      {/* First Time Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-[120] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-sm w-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 blur-[80px] -z-10 rounded-full"></div>
            
            <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-blue-500/20 rounded-2xl mb-4">
                    <Sparkles className="text-blue-400" size={40} />
                </div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                    Neural <span className="text-blue-400">Onboarding</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">First Session Protocol Initialized</p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-blue-400 font-black italic">1</div>
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">Establish Your Floor</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Pick a weight you can move with <span className="text-blue-300">perfect technical integrity</span> for the target reps. Don't chase max load today.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-blue-400 font-black italic">2</div>
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">Technical Intel</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Tap the <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-700 text-slate-300"><Info size={8} /></span> icon on any exercise to get AI-powered technical cues and form guidance.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-blue-400 font-black italic">3</div>
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">Log RPE</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Rate your effort from 1-10. Aim for <span className="text-blue-300">RPE 7-8</span> today. This sets the baseline for your future PRs.</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={dismissTutorial}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-widest text-[10px] italic"
            >
                Start Training <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700 transition">
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={handleManualSync} 
            className={`p-2 rounded-lg transition border ${syncStatus === 'syncing' ? 'bg-blue-600 animate-pulse border-blue-400' : syncStatus === 'done' ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
            title="Sync Progress to Cloud"
          >
            <Cloud size={20} className={syncStatus === 'done' ? 'text-white' : ''} />
          </button>
        </div>
        <div className="text-center">
            <h2 className="text-lg font-bold text-white leading-tight uppercase italic">{schedule.title}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Clock size={10} className="text-slate-500" />
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{schedule.subtitle}</span>
            </div>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button onClick={() => setLayout('list')} className={`p-1.5 rounded transition ${layout === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><List size={16} /></button>
          <button onClick={() => setLayout('split')} className={`p-1.5 rounded transition ${layout === 'split' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Columns size={16} /></button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Built-in Warm-Up Section */}
        <div className="bg-slate-800/30 border border-emerald-500/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowWarmUp(!showWarmUp)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Warm-Up ({warmUpExercises.length} moves)
              </span>
              {warmUpExercises.some(e => e.isCorrectiveFor) && (
                <span className="text-[7px] font-black bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase">
                  + correctives
                </span>
              )}
            </div>
            {showWarmUp ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
          </button>

          {showWarmUp && (
            <div className="px-4 pb-4 space-y-2 animate-in fade-in duration-300">
              {warmUpExercises.map((ex, i) => (
                <div key={i} className={`flex items-start gap-3 py-2 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
                  <span className="text-[9px] font-black text-slate-600 w-4 text-right shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">{ex.name}</span>
                      {ex.isCorrectiveFor && (
                        <span className="text-[7px] font-black bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded uppercase">Fix</span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500">{ex.duration}</span>
                    <p className="text-[9px] text-slate-600 italic mt-0.5">{ex.cue}</p>
                  </div>
                </div>
              ))}
              {/* Keep the AI button as a secondary option */}
              <button onClick={openRoutineGen} className="w-full mt-2 py-2 text-[9px] font-black text-blue-400/50 hover:text-blue-400 uppercase tracking-widest flex items-center justify-center gap-1.5 transition">
                <Sparkles size={10} /> Generate AI Warm-Up Instead
              </button>
            </div>
          )}
        </div>

        {groups.map((group, gIdx) => (
          <div key={gIdx} className={`bg-slate-800/20 border-l-2 border-slate-700 rounded-xl overflow-hidden shadow-xl ${schedule.color}`}>
            <div className="bg-slate-800/50 px-3 py-1.5 border-b border-slate-700/50 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={10} className="text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{group.name}</span>
               </div>
               {group.name.toLowerCase().includes('superset') && (
                 <span className="text-[8px] font-black bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">CNS Efficient Pairing</span>
               )}
            </div>
            
            <div className={`p-3 ${layout === 'split' && group.items.length > 1 ? 'grid grid-cols-2 gap-3' : 'space-y-6'}`}>
              {group.items.map(ex => (
                <div key={ex.id} className="relative">
                  {(() => {
                    const currentName = customNames[ex.id] || ex.name;
                    const demo = getExerciseDemo(currentName);
                    return (
                      <>
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1 mr-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <input type="text" value={currentName} onChange={(e) => handleNameChange(ex.id, e.target.value)} className="bg-transparent border-none p-0 text-xs font-black text-blue-400 focus:ring-0 flex-1 min-w-0 truncate" />
                              {demo?.isGolfSpecific && (
                                <span className="text-[7px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-tighter">Golf</span>
                              )}
                            </div>
                            <div className="text-[8px] text-slate-600 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-tight">
                               <span className="text-slate-500">{ex.defaultCategory}</span>
                               {demo?.muscles && <><span className="w-0.5 h-0.5 bg-slate-700 rounded-full"></span><span className="text-slate-600">{demo.muscles}</span></>}
                               {ex.tempo && <><span className="w-0.5 h-0.5 bg-slate-700 rounded-full"></span><span className="text-amber-500/70">Tempo: {ex.tempo}</span></>}
                               {ex.rpe && <><span className="w-0.5 h-0.5 bg-slate-700 rounded-full"></span><span className="text-emerald-500/70">RPE {ex.rpe}</span></>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Video demo button — opens exercise demo modal */}
                            <button
                              onClick={() => openDemoModal(currentName)}
                              className="text-red-500/60 hover:text-red-400 transition p-0.5"
                              title="Watch Demo"
                            >
                              <Play size={12} fill="currentColor" />
                            </button>
                            {/* Swap button — show alternatives if they exist */}
                            {getExerciseAlternatives(currentName).length > 0 && (
                              <button
                                onClick={() => {
                                  setSwapExerciseId(ex.id);
                                  setSwapExerciseName(currentName);
                                  setSwapModalOpen(true);
                                }}
                                className="text-purple-500/60 hover:text-purple-400 transition p-0.5"
                                title="Swap Exercise"
                              >
                                <RefreshCw size={12} />
                              </button>
                            )}
                            <button onClick={() => onStartTimer(ex.rest)} title="Rest" className="text-slate-600 hover:text-amber-500 transition p-0.5"><Timer size={12} /></button>
                            <button onClick={() => openFormCheck(ex.id, ex.name, ex.defaultCategory)} className="text-slate-600 hover:text-blue-400 transition p-0.5"><Info size={12} /></button>
                          </div>
                        </div>
                        {/* Inline form cue — always visible, no tap needed */}
                        {demo?.formCue && (
                          <p className="text-[9px] text-slate-600 italic mb-2 leading-snug pl-0.5">
                            {demo.formCue}
                          </p>
                        )}
                      </>
                    );
                  })()}
                  {renderSetInputs(ex, layout === 'split')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {/* Swing Speed Input — only shows on days with speed exercises */}
        {hasSpeedWork && (
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-2 border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Gauge size={18} className="text-amber-400" />
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Swing Speed Log</span>
              </div>
              {(() => {
                // Find their last recorded speed to show as reference
                const lastSpeed = history.find((log: WorkoutLog) => log.swingSpeed?.driverSpeed);
                if (lastSpeed?.swingSpeed?.driverSpeed) {
                  return (
                    <div className="flex items-center gap-1 text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
                      <History size={8} />
                      <span>Last: {lastSpeed.swingSpeed.driverSpeed} mph</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
              Log your fastest driver swing speed from today's session. This is the #1 metric that connects your gym work to your game.
            </p>

            {/* Driver Speed — the main field, large and prominent */}
            <div className="mb-4">
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Driver Clubhead Speed (mph) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 105"
                  value={swingSpeed.driverSpeed || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || undefined;
                    setSwingSpeed(prev => ({ ...prev, driverSpeed: val }));
                  }}
                  className="w-full bg-slate-900/60 border-2 border-amber-500/30 focus:border-amber-400 rounded-xl py-3 px-4 text-2xl font-black text-white focus:outline-none placeholder:text-slate-800 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-500/50">MPH</span>
              </div>
            </div>

            {/* Optional fields — ball speed and carry distance in a row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Ball Speed (optional)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 155"
                  value={swingSpeed.ballSpeed || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || undefined;
                    setSwingSpeed(prev => ({ ...prev, ballSpeed: val }));
                  }}
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-amber-500/50 rounded-lg py-2 px-3 text-sm font-black text-white focus:outline-none placeholder:text-slate-800 transition"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Carry Distance (optional)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 260"
                  value={swingSpeed.carryDistance || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || undefined;
                    setSwingSpeed(prev => ({ ...prev, carryDistance: val }));
                  }}
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-amber-500/50 rounded-lg py-2 px-3 text-sm font-black text-white focus:outline-none placeholder:text-slate-800 transition"
                />
              </div>
            </div>

            {/* Device selector — remembers their last choice */}
            <div>
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Measured With
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'superspeed', label: 'SuperSpeed' },
                  { value: 'prgr', label: 'PRGR' },
                  { value: 'mevo', label: 'Mevo/Mevo+' },
                  { value: 'trackman', label: 'Trackman' },
                  { value: 'other', label: 'Other' },
                  { value: 'manual', label: 'Estimated' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSwingSpeed(prev => ({ ...prev, device: opt.value }))}
                    className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition uppercase tracking-tight ${
                      swingSpeed.device === opt.value
                        ? 'bg-amber-500 border-amber-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cool-Down Section */}
        <div className="bg-slate-800/30 border border-blue-500/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowCoolDown(!showCoolDown)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Cool-Down ({coolDownExercises.length} stretches)
              </span>
            </div>
            {showCoolDown ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
          </button>

          {showCoolDown && (
            <div className="px-4 pb-4 space-y-2 animate-in fade-in duration-300">
              {coolDownExercises.map((ex, i) => (
                <div key={i} className={`flex items-start gap-3 py-2 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
                  <span className="text-[9px] font-black text-slate-600 w-4 text-right shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-300">{ex.name}</span>
                    <span className="text-[9px] text-slate-500 ml-2">{ex.duration}</span>
                    <p className="text-[9px] text-slate-600 italic mt-0.5">{ex.cue}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {prevNotes && (
             <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400/50 mb-2 uppercase tracking-widest text-[8px] font-black"><History size={10} /> Previous Session Intel</div>
                <p className="text-xs text-slate-400 italic font-medium">"{prevNotes}"</p>
            </div>
        )}
        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
          <textarea value={notes} onChange={(e) => { setNotes(e.target.value); localStorage.setItem(`workout_notes_${dayKey}`, e.target.value); }} placeholder="Fatigue? Focus cues? Gear used?" className="w-full bg-slate-900/50 border border-slate-700 rounded p-3 text-xs text-slate-400 h-24 resize-none placeholder:text-slate-700" />
        </div>
        <button onClick={handleFinish} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2 transition active:scale-95 uppercase tracking-widest text-xs">
          <Check size={18} strokeWidth={4} /> Complete & Sync Session
        </button>
      </div>
    </div>
  );
};

export default WorkoutView;

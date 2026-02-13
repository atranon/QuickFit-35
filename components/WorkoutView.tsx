import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Columns, List, Sparkles, Clock, Check, Info, StickyNote, TrendingUp, Target, History, Timer, Trophy, RefreshCw } from 'lucide-react';
import { DaySchedule, Exercise, WorkoutLog, SetData } from '../types';
import { generateFormDescription, generateWorkoutRoutine } from '../services/geminiService';
import GeminiModal from './GeminiModal';
import WorkoutCompletionModal from './WorkoutCompletionModal';
import ExerciseSwapModal from './ExerciseSwapModal';
import { triggerBackgroundSync } from '../services/storageService';
import { triggerPRCelebration } from '../utils/confetti';
import { EXERCISE_ALTERNATIVES } from '../constants/exerciseAlternatives';
import { DEFAULT_WARMUP_COOLDOWN } from '../constants/defaultWarmup';

interface WorkoutViewProps {
  dayKey: string;
  schedule: DaySchedule;
  onBack: () => void;
  onStartTimer: (seconds: number) => void;
  onFinish: (log: WorkoutLog) => void;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ dayKey, schedule, onBack, onStartTimer, onFinish }) => {
  // Default to split view as requested
  const [layout, setLayout] = useState<'list' | 'split'>('split');
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, { weight: string; reps: string; unit: 'lbs' | '#' }>>({});
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

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState({
    totalSets: 0,
    totalVolume: 0,
    prCount: 0,
    dayTitle: schedule.title
  });
  const [pendingWorkoutLog, setPendingWorkoutLog] = useState<WorkoutLog | null>(null);

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapExerciseId, setSwapExerciseId] = useState<string | null>(null);
  const [swapExerciseName, setSwapExerciseName] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem(`workout_notes_${dayKey}`);
    if (savedNotes) setNotes(savedNotes);

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

  const handleInputChange = (exId: string, setNum: number, field: 'weight' | 'reps', val: string) => {
    const key = `${exId}_${setNum}`;
    setInputValues(prev => {
      const current = prev[key] || { weight: '', reps: '', unit: 'lbs' };
      return {
        ...prev,
        [key]: {
          ...current,
          [field]: val
        }
      };
    });
  };

  const toggleUnit = (exId: string, setNum: number) => {
    const key = `${exId}_${setNum}`;
    setInputValues(prev => {
      const current = prev[key] || { weight: '', reps: '', unit: 'lbs' };
      return {
        ...prev,
        [key]: {
          ...current,
          unit: current.unit === '#' ? 'lbs' : '#'
        }
      };
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

          // Check if this is a PR
          const ex = schedule.exercises.find(e => e.id === exId);
          if (ex) {
            const currentName = customNames[exId] || ex.name;
            const prevSetData = getPreviousSetData(currentName, setNum);
            if (prevSetData) {
              const currentWeightVal = parseFloat((input.weight || weight).replace('#', '')) || 0;
              const currentRepsVal = parseInt(input.reps || reps) || 0;
              const prevWeightVal = parseFloat(prevSetData.weight.replace('#', '')) || 0;
              const prevRepsVal = parseInt(prevSetData.reps) || 0;

              const isWeightUp = currentWeightVal > prevWeightVal;
              const isRepsUp = currentRepsVal > prevRepsVal;

              if (isWeightUp || isRepsUp) {
                // Trigger PR celebration!
                triggerPRCelebration();
              }
            }
          }

          localStorage.setItem(`last_${exId}`, JSON.stringify({
            weight: finalWeight,
            reps: reps,
            date: new Date().toISOString()
          }));

          setSyncStatus('syncing');
          setTimeout(() => {
            triggerBackgroundSync()
                .then(() => setSyncStatus('done'))
                .catch(() => setSyncStatus('idle'));
          }, 2000);

          onStartTimer(schedule.exercises.find(e => e.id === exId)?.rest || 60);
        }
        return next;
      });
    }
  };

  const handleFinish = () => {
    const logs = schedule.exercises.map(ex => {
      const exLog = {
        name: customNames[ex.id] || ex.name,
        sets: [] as any[]
      };
      for(let i=1; i<=ex.sets; i++) {
        const key = `${ex.id}_${i}`;
        const val = inputValues[key];
        if (val && val.weight && val.reps) {
          let w = val.weight;
          if (val.unit === '#') w = '#' + w;
          exLog.sets.push({
            set: i,
            weight: w,
            reps: val.reps
          });
        }
      }
      return exLog;
    }).filter(l => l.sets.length > 0);

    if (logs.length === 0 && !notes.trim()) {
      alert("Record at least one set or a note to finish.");
      return;
    }

    const fullLog: WorkoutLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      dayKey,
      dayTitle: schedule.title,
      notes,
      exercises: logs
    };

    // Calculate stats for completion modal
    let totalSets = 0;
    let totalVolume = 0;
    let prCount = 0;

    logs.forEach(exLog => {
      totalSets += exLog.sets.length;

      exLog.sets.forEach(set => {
        const weight = parseFloat(set.weight.replace('#', '')) || 0;
        const reps = parseInt(set.reps) || 0;
        totalVolume += weight * reps;

        // Check if this set was a PR
        const prevSetData = getPreviousSetData(exLog.name, set.set);
        if (prevSetData) {
          const prevWeight = parseFloat(prevSetData.weight.replace('#', '')) || 0;
          const prevReps = parseInt(prevSetData.reps) || 0;

          if (weight > prevWeight || reps > prevReps) {
            prCount++;
          }
        }
      });
    });

    setPendingWorkoutLog(fullLog);
    setCompletionStats({
      totalSets,
      totalVolume: Math.round(totalVolume),
      prCount,
      dayTitle: schedule.title
    });
    setShowCompletionModal(true);
  };

  const handleCompletionClose = () => {
    setShowCompletionModal(false);
    if (pendingWorkoutLog) {
      onFinish(pendingWorkoutLog);
    }
  };

  const handleOpenSwapModal = (exId: string, exerciseName: string) => {
    setSwapExerciseId(exId);
    setSwapExerciseName(exerciseName);
    setShowSwapModal(true);
  };

  const handleSwapExercise = (newName: string) => {
    if (swapExerciseId) {
      handleNameChange(swapExerciseId, newName);
    }
    setShowSwapModal(false);
    setSwapExerciseId(null);
    setSwapExerciseName('');
  };

  const openFormCheck = async (exId: string, defaultName: string, category: string) => {
    const name = customNames[exId] || defaultName;
    setModalTitle(`${name} - Form`);
    setIsModalLoading(true);
    setModalOpen(true);
    setModalContent('');
    setModalTextForTTS('');

    try {
      const text = await generateFormDescription(name, category);
      setModalContent(<p>{text}</p>);
      setModalTextForTTS(text);
    } catch (e) {
      setModalContent(<p className="text-red-400">Failed to load.</p>);
    } finally {
      setIsModalLoading(false);
    }
  };

  const openRoutineGen = async () => {
    setModalTitle(`${schedule.title} - Warm-up & Cool-down`);
    setIsModalLoading(true);
    setModalOpen(true);
    setModalContent('');
    setModalTextForTTS('');

    try {
      const names = schedule.exercises.map(e => customNames[e.id] || e.name);
      const text = await generateWorkoutRoutine(schedule.title, names);

      const lines = text.split('\n').map((line, i) => {
          if (line.startsWith('###')) return <h4 key={i} className="text-lg font-bold text-blue-300 mt-3">{line.replace('###', '')}</h4>;
          if (line.startsWith('##')) return <h3 key={i} className="text-xl font-bold text-blue-400 mt-4">{line.replace('##', '')}</h3>;
          if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="ml-4 list-disc text-slate-300">{line.replace(/[*|-]/, '')}</li>;
          return <p key={i} className="mb-1">{line}</p>;
      });

      setModalContent(<div>{lines}</div>);
      setModalTextForTTS(text.replace(/[#*-]/g, ''));
    } catch (e) {
      // Gracefully degrade to default warm-up if Gemini API is not available
      console.log('Gemini API unavailable, using default warm-up');
      const text = DEFAULT_WARMUP_COOLDOWN;
      const lines = text.split('\n').map((line, i) => {
          if (line.startsWith('###')) return <h4 key={i} className="text-lg font-bold text-green-300 mt-3">{line.replace('###', '')}</h4>;
          if (line.startsWith('##')) return <h3 key={i} className="text-xl font-bold text-green-400 mt-4">{line.replace('##', '')}</h3>;
          if (line.startsWith('*') || line.startsWith('-')) return <li key={i} className="ml-4 list-disc text-slate-300">{line.replace(/[*|-]/, '')}</li>;
          return <p key={i} className="mb-1">{line}</p>;
      });

      setModalContent(
        <div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-300">
              💡 Showing default routine (Gemini AI not configured)
            </p>
          </div>
          <div>{lines}</div>
        </div>
      );
      setModalTextForTTS(text.replace(/[#*-]/g, ''));
    } finally {
      setIsModalLoading(false);
    }
  };

  const getPreviousSetData = useCallback((exName: string, setNum: number): SetData | null => {
    if (!history.length) return null;
    
    const previousLog = history.find(log => 
      log.exercises.some(e => e.name.toLowerCase() === exName.toLowerCase())
    );

    if (!previousLog) return null;

    const exerciseLog = previousLog.exercises.find(e => e.name.toLowerCase() === exName.toLowerCase());
    if (!exerciseLog) return null;

    return exerciseLog.sets.find(s => s.set === setNum) || null;
  }, [history]);

  const getProgressiveSuggestion = (prev: SetData | null, targetRepsRange: string): { weight: string, reps: string, isIncrease: boolean, originalWeight: string } => {
    if (!prev) {
      const targetMatch = targetRepsRange.match(/(\d+)(?!.*\d)/);
      return { weight: '', reps: targetMatch ? targetMatch[0] : '10', isIncrease: false, originalWeight: '' };
    }

    const repsLast = parseInt(prev.reps) || 0;
    const weightLastStr = prev.weight.replace('#', '');
    const weightLast = parseFloat(weightLastStr) || 0;
    
    const targetMatch = targetRepsRange.match(/(\d+)(?!.*\d)/);
    const targetMax = targetMatch ? parseInt(targetMatch[0]) : 10;

    if (repsLast >= targetMax) {
      const increment = weightLast >= 100 ? 5 : 2.5;
      const newWeight = weightLast + increment;
      return { 
        weight: prev.weight.startsWith('#') ? `#${newWeight}` : `${newWeight}`, 
        reps: `${targetMax}`, 
        isIncrease: true,
        originalWeight: prev.weight
      };
    } else {
      return { 
        weight: prev.weight, 
        reps: `${targetMax}`, 
        isIncrease: false,
        originalWeight: prev.weight
      };
    }
  };

  const renderSetInputs = (ex: Exercise, isSplit: boolean) => {
    const currentName = customNames[ex.id] || ex.name;
    const rows = [];
    
    for(let i=1; i<=ex.sets; i++) {
      const key = `${ex.id}_${i}`;
      const val = inputValues[key] || { weight: '', reps: '', unit: 'lbs' };
      const isComplete = completedSets.has(key);

      const prevSetData = getPreviousSetData(currentName, i);
      const suggestion = getProgressiveSuggestion(prevSetData, ex.reps);
      
      const placeholderWeight = suggestion.weight ? suggestion.weight.replace('#', '') : (prevSetData ? prevSetData.weight.replace('#', '') : '');
      const placeholderReps = suggestion.reps || '10';

      const currentWeightVal = parseFloat((val.weight || placeholderWeight).replace('#', '')) || 0;
      const currentRepsVal = parseInt(val.reps || placeholderReps) || 0;
      const prevWeightVal = prevSetData ? parseFloat(prevSetData.weight.replace('#', '')) || 0 : 0;
      const prevRepsVal = prevSetData ? parseInt(prevSetData.reps) || 0 : 0;

      const isWeightUp = currentWeightVal > prevWeightVal;
      const isRepsUp = currentRepsVal > prevRepsVal;
      const isAchievement = isComplete && (isWeightUp || isRepsUp);

      rows.push(
        <div key={i} className="mb-4">
          <div className="flex items-center gap-2 mb-1 px-0.5 overflow-hidden">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter shrink-0">Set {i}</span>
             {prevSetData && (
               <div className={`flex items-center gap-1 text-[9px] font-bold px-1 py-0.5 rounded shrink-0 whitespace-nowrap ${suggestion.isIncrease ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700/50 text-slate-400'}`}>
                 <History size={8} />
                 <span>{prevSetData.weight}{prevSetData.weight.includes('#') ? '' : 'lbs'} x {prevSetData.reps}</span>
                 {suggestion.isIncrease && <TrendingUp size={8} className="ml-0.5 text-blue-400" />}
               </div>
             )}
             {isAchievement && (
                <div className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 animate-in zoom-in duration-300">
                    <Trophy size={8} /> <span>PR!</span>
                </div>
             )}
             {!isAchievement && suggestion.isIncrease && (
                <div className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                    <Target size={8} /> <span>Goal: {suggestion.weight.replace('#', '')}</span>
                </div>
             )}
          </div>
          <div className={`flex items-center ${isSplit ? 'gap-1' : 'gap-2'}`}>
            <div className="relative flex-1 min-w-0">
                <input
                type="text"
                inputMode="decimal"
                placeholder={placeholderWeight}
                value={val.weight}
                onChange={(e) => handleInputChange(ex.id, i, 'weight', e.target.value)}
                className={`bg-slate-900/80 border leading-none transition-all duration-300 ${isAchievement ? 'border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : isComplete ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-white'} rounded w-full py-2 ${isSplit ? 'pl-1.5 pr-6 text-sm' : 'pl-3 pr-10 text-lg'} font-black focus:outline-none focus:border-blue-500 placeholder:text-slate-700`}
                />
                <button 
                    onClick={() => toggleUnit(ex.id, i)}
                    className={`absolute ${isSplit ? 'right-0.5' : 'right-1'} top-1/2 -translate-y-1/2 text-[9px] font-black py-1 px-1 rounded transition border border-transparent ${val.unit === '#' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-500'}`}
                >
                    {val.unit}
                </button>
            </div>
            
            <div className={`${isSplit ? 'w-10' : 'w-20'}`}>
                <input
                type="text"
                inputMode="text"
                placeholder={placeholderReps}
                value={val.reps}
                onChange={(e) => handleInputChange(ex.id, i, 'reps', e.target.value)}
                className={`bg-slate-900/80 border leading-none transition-all duration-300 ${isAchievement ? 'border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : isComplete ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-white'} rounded w-full py-2 text-center ${isSplit ? 'text-sm' : 'text-lg'} font-black focus:outline-none focus:border-blue-500 placeholder:text-slate-700`}
                />
            </div>

            <button
                onClick={() => toggleComplete(ex.id, i, val.weight || placeholderWeight, val.reps || placeholderReps)}
                className={`${isSplit ? 'w-8 h-8' : 'w-11 h-11'} rounded-lg flex items-center justify-center transition-all ${isAchievement ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : isComplete ? 'bg-green-500 text-white scale-95 shadow-lg shadow-green-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 active:scale-90'}`}
            >
                <Check size={isSplit ? 16 : 22} strokeWidth={4} />
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
    if (currentGroupItem && currentGroupItem.name === ex.group) {
      currentGroupItem.items.push(ex);
    } else {
      currentGroupItem = { name: ex.group, items: [ex] };
      groups.push(currentGroupItem);
    }
  });

  return (
    <div className="pb-32">
      <GeminiModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle} 
        content={modalContent} 
        textContent={modalTextForTTS}
        loading={isModalLoading}
      />

      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-bold text-white leading-tight">{schedule.title}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Clock size={12} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{schedule.subtitle}</span>
            </div>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button onClick={() => setLayout('list')} className={`p-1.5 rounded transition ${layout === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <List size={18} />
          </button>
          <button onClick={() => setLayout('split')} className={`p-1.5 rounded transition ${layout === 'split' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <Columns size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex gap-2 mb-2">
            <button 
                onClick={openRoutineGen}
                className="flex-1 bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 border border-indigo-500/30 active:scale-[0.98] transition-transform"
            >
                <Sparkles size={16} /> Warm-up & Cool-down
            </button>
        </div>

        {groups.map((group, gIdx) => (
          <div key={gIdx} className={`bg-slate-800/40 border-l-4 border-slate-700 rounded-xl overflow-hidden shadow-inner ${schedule.color}`}>
            <div className="bg-slate-800/60 px-4 py-1.5 border-b border-slate-700/50 flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{group.name}</span>
               <div className="flex gap-4 text-[9px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 uppercase tracking-tighter"><Target size={10}/> Progressive Overload</span>
               </div>
            </div>
            
            <div className={`p-3 ${layout === 'split' && group.items.length > 1 ? 'grid grid-cols-2 gap-3' : 'space-y-6'}`}>
              {group.items.map(ex => (
                <div key={ex.id} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-1 min-w-0">
                        <input
                          type="text"
                          value={customNames[ex.id] || ex.name}
                          onChange={(e) => handleNameChange(ex.id, e.target.value)}
                          className="bg-transparent border-none p-0 text-xs font-black text-blue-400 focus:ring-0 w-full placeholder:text-slate-700 truncate"
                        />
                        <div className="text-[9px] text-slate-500 flex items-center gap-1.5 mt-0.5 whitespace-nowrap overflow-hidden">
                           <span className="shrink-0">{ex.defaultCategory}</span>
                           <span className="w-0.5 h-0.5 bg-slate-700 rounded-full shrink-0"></span>
                           <span className="text-blue-300/50 shrink-0">{ex.reps} reps</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                          onClick={() => handleOpenSwapModal(ex.id, customNames[ex.id] || ex.name)}
                          title="Swap Exercise"
                          className="text-slate-600 hover:text-green-400 transition p-0.5"
                      >
                          <RefreshCw size={13} />
                      </button>
                      <button
                          onClick={() => onStartTimer(ex.rest)}
                          title="Start Rest"
                          className="text-slate-500 hover:text-amber-400 transition p-0.5"
                      >
                          <Timer size={13} />
                      </button>
                      <button
                          onClick={() => openFormCheck(ex.id, ex.name, ex.defaultCategory)}
                          className="text-slate-600 hover:text-blue-400 transition shrink-0 p-0.5"
                      >
                          <Info size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    {renderSetInputs(ex, layout === 'split')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {prevNotes && (
             <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400/70 mb-2">
                    <History size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Last Session Intel</span>
                </div>
                <p className="text-sm text-slate-400 italic font-medium leading-relaxed">"{prevNotes}"</p>
            </div>
        )}

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <StickyNote size={16} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">Coach Notes</h4>
          </div>
          <textarea
            value={notes}
            onChange={(e) => {
                setNotes(e.target.value);
                localStorage.setItem(`workout_notes_${dayKey}`, e.target.value);
            }}
            placeholder="Fatigue levels? Grip issues? Focus cues?"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 h-24 resize-none transition-colors placeholder:text-slate-600"
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-4 rounded-xl shadow-xl shadow-green-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-green-400/20"
        >
          <Check size={20} strokeWidth={4} /> Complete & Sync Session
        </button>
      </div>

      <WorkoutCompletionModal
        isOpen={showCompletionModal}
        stats={completionStats}
        onClose={handleCompletionClose}
      />

      <ExerciseSwapModal
        isOpen={showSwapModal}
        exerciseName={swapExerciseName}
        alternatives={EXERCISE_ALTERNATIVES[swapExerciseName] || []}
        onClose={() => setShowSwapModal(false)}
        onSwap={handleSwapExercise}
      />
    </div>
  );
};

export default WorkoutView;
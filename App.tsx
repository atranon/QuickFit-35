
import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Coffee, ChevronRight, History, Settings, Zap, Target, RefreshCw, Trophy, Dumbbell as StrengthIcon, Activity } from 'lucide-react';
import { PLANS } from './constants';
import { ViewState, WorkoutLog, WorkoutPlanFrequency, ProgramType } from './types';
import WorkoutView from './components/WorkoutView';
import HistoryView from './components/HistoryView';
import TimerBar from './components/TimerBar';
import { playBeep } from './utils/audioUtils';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeDayKey, setActiveDayKey] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>(
    (localStorage.getItem('selected_program') as ProgramType) || 'golf'
  );
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlanFrequency>(
    (localStorage.getItem('selected_plan') as WorkoutPlanFrequency) || '3x'
  );
  
  const intervalRef = useRef<number | null>(null);

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  const todayIndex = new Date().getDay(); 
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1; // Mon=0, Sun=6

  useEffect(() => {
    localStorage.setItem('selected_plan', selectedPlan);
    localStorage.setItem('selected_program', selectedProgram);
  }, [selectedPlan, selectedProgram]);

  // Timer Logic
  useEffect(() => {
    if (timerSeconds > 0 && timerActive) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            playBeep();
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, timerSeconds]);

  const startTimer = (sec: number) => {
    setTimerSeconds(sec);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
  };

  const handleWorkoutSelect = (dayKey: string) => {
    stopTimer();
    setActiveDayKey(dayKey);
    setView('workout');
  };

  const handleWorkoutFinish = (log: WorkoutLog) => {
    const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
    history.push(log);
    localStorage.setItem('workout_history', JSON.stringify(history));
    // Clean up temp notes
    localStorage.removeItem(`workout_notes_${log.dayKey}`);
    setView('dashboard');
    setActiveDayKey(null);
  };

  const handleReset = () => {
    stopTimer();
    // Preserve sync credentials
    const apiKey = localStorage.getItem('sync_api_key');
    const binId = localStorage.getItem('sync_bin_id');
    
    localStorage.clear();
    
    if (apiKey) localStorage.setItem('sync_api_key', apiKey);
    if (binId) localStorage.setItem('sync_bin_id', binId);
    
    window.location.reload();
  };

  const renderPlanSelection = () => {
    const currentOptions = PLANS[selectedProgram];
    
    return (
      <div className="pt-24 px-4 max-w-md mx-auto pb-24 animate-in fade-in duration-300">
        <h2 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-tight italic">Select Your Path</h2>
        <p className="text-center text-slate-500 text-xs mb-8 font-bold uppercase tracking-widest">Choose your training focus</p>

        {/* Program Selection Cards */}
        <div className="grid grid-cols-2 gap-3 mb-10">
            <button 
                onClick={() => setSelectedProgram('golf')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedProgram === 'golf' ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
                <Zap size={24} className={selectedProgram === 'golf' ? 'text-blue-100' : 'text-slate-500'} />
                <span className="font-black text-[10px] uppercase tracking-widest">Golf Speed</span>
            </button>
            <button 
                onClick={() => setSelectedProgram('powerbuilding')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedProgram === 'powerbuilding' ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
                <StrengthIcon size={24} className={selectedProgram === 'powerbuilding' ? 'text-indigo-100' : 'text-slate-500'} />
                <span className="font-black text-[10px] uppercase tracking-widest">Powerbuilding</span>
            </button>
        </div>

        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-1">Choose Frequency</h3>
        <div className="grid gap-4">
          {(Object.keys(currentOptions) as WorkoutPlanFrequency[]).map((key) => (
            <div 
              key={key}
              onClick={() => {
                setSelectedPlan(key);
                setView('dashboard');
              }}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 group ${
                selectedPlan === key 
                ? 'bg-slate-800 border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]' 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black text-white uppercase italic">{key} Frequency</h3>
                <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${selectedPlan === key ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {currentOptions[key].name}
                </div>
              </div>
              <p className={`text-sm font-medium leading-snug ${selectedPlan === key ? 'text-slate-200' : 'text-slate-400'}`}>
                {currentOptions[key].description}
              </p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setView('dashboard')}
          className="w-full mt-8 bg-slate-800/50 text-slate-400 font-bold py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  const renderDashboard = () => {
    const currentSchedule = PLANS[selectedProgram][selectedPlan].schedule;
    
    return (
      <div className="pt-20 px-4 max-w-md mx-auto pb-24">
        <div className="flex justify-between items-end mb-8 px-1">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight italic">Schedule</h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest ${selectedProgram === 'golf' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                {selectedProgram === 'golf' ? 'Golf Speed' : 'Powerbuilding'}
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full uppercase tracking-widest border border-slate-700">
                {selectedPlan}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setView('plan-selection')}
            className="bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-white transition active:scale-95 border border-slate-700 shadow-lg"
            title="Change Frequency"
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="grid gap-4">
          {days.map((day, index) => {
            const isToday = index === todayMapped;
            const scheduleData = currentSchedule[day.key];
            
            if (!scheduleData) {
              return (
                <div key={day.key} className="p-4 rounded-xl border border-slate-800 bg-slate-800/20 flex justify-between items-center opacity-40">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-black text-sm">
                       {day.label}
                     </div>
                     <div>
                       <h3 className="font-black text-slate-500 uppercase text-sm italic">Rest / Recovery</h3>
                       <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Mobility & Active Rest</p>
                     </div>
                   </div>
                   <Coffee className="text-slate-700" size={20} />
                </div>
              );
            }

            return (
              <div 
                key={day.key}
                onClick={() => handleWorkoutSelect(day.key)}
                className={`cursor-pointer p-4 rounded-xl bg-slate-800/70 backdrop-blur border-l-4 hover:bg-slate-800 transition relative group ${scheduleData.color} ${isToday ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/10 scale-[1.01]' : ''}`}
              >
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm transition-transform group-hover:scale-110 ${isToday ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-700'}`}>
                       {day.label}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <h3 className="font-black text-white group-hover:text-blue-400 transition uppercase text-sm tracking-tight italic truncate">{scheduleData.title}</h3>
                         {scheduleData.type === 'speed' && <Zap size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
                         {scheduleData.type === 'technique' && <Target size={14} className="text-emerald-400 shrink-0" />}
                         {selectedProgram === 'powerbuilding' && <StrengthIcon size={12} className="text-indigo-400 shrink-0" />}
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{scheduleData.subtitle}</p>
                     </div>
                   </div>
                   <ChevronRight className="text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" size={18} />
                 </div>
                 {isToday && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg shadow-blue-500/30 uppercase tracking-tighter">TODAY</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => setView('dashboard')}>
           <Dumbbell className="text-blue-500" />
           <h1 className="font-black text-xl tracking-tighter uppercase italic">QuickFit <span className="text-blue-500">35</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView('history')} className="text-[10px] text-slate-300 hover:text-blue-400 transition font-black uppercase tracking-widest flex items-center gap-1.5 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
            <History size={14} /> <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </nav>

      <main className="pt-4">
        {view === 'dashboard' && renderDashboard()}
        {view === 'plan-selection' && renderPlanSelection()}
        {view === 'workout' && activeDayKey && (
          <div className="pt-20 px-4 max-w-md mx-auto">
             <WorkoutView 
               dayKey={activeDayKey} 
               schedule={PLANS[selectedProgram][selectedPlan].schedule[activeDayKey]} 
               onBack={() => setView('dashboard')}
               onStartTimer={startTimer}
               onFinish={handleWorkoutFinish}
             />
          </div>
        )}
        {view === 'history' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <HistoryView onBack={() => setView('dashboard')} onReset={handleReset} />
          </div>
        )}
      </main>

      <TimerBar 
        seconds={timerSeconds} 
        isActive={timerActive} 
        onStart={startTimer} 
        onStop={stopTimer} 
      />
    </div>
  );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Coffee, ChevronRight, History, TrendingUp } from 'lucide-react';
import { SCHEDULE } from './constants';
import { ViewState, WorkoutLog } from './types';
import WorkoutView from './components/WorkoutView';
import HistoryView from './components/HistoryView';
import ProgressView from './components/ProgressView';
import TimerBar from './components/TimerBar';
import OnboardingModal from './components/OnboardingModal';
import { playBeep } from './utils/audioUtils';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeDayKey, setActiveDayKey] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const days = [
    { key: 'monday', label: 'Mon', rest: false },
    { key: 'tuesday', label: 'Tue', rest: false },
    { key: 'wednesday', label: 'Wed', rest: true },
    { key: 'thursday', label: 'Thu', rest: false },
    { key: 'friday', label: 'Fri', rest: false },
    { key: 'saturday', label: 'Sat', rest: true },
    { key: 'sunday', label: 'Sun', rest: true },
  ];

  const todayIndex = new Date().getDay(); 
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1; // Mon=0, Sun=6

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

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleShowTutorial = () => {
    setShowOnboarding(true);
  };

  const renderDashboard = () => (
    <div className="pt-20 px-4 max-w-md mx-auto pb-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Weekly Overview</h2>
        <p className="text-slate-400 text-sm">Select a day to start tracking.</p>
      </div>
      
      <div className="grid gap-4">
        {days.map((day, index) => {
          const isToday = index === todayMapped;
          
          if (day.rest) {
            return (
              <div key={day.key} className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 flex justify-between items-center opacity-70">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 font-bold">
                     {day.label}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-300">Rest / Active Recovery</h3>
                     <p className="text-xs text-slate-500">Cardio or Stretch</p>
                   </div>
                 </div>
                 <Coffee className="text-slate-600" />
              </div>
            );
          }

          const scheduleData = SCHEDULE[day.key];
          return (
            <div 
              key={day.key}
              onClick={() => handleWorkoutSelect(day.key)}
              className={`cursor-pointer p-4 rounded-xl bg-slate-800/70 backdrop-blur border-l-4 hover:bg-slate-800 transition relative group ${scheduleData.color} ${isToday ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''}`}
            >
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                     {day.label}
                   </div>
                   <div>
                     <h3 className="font-bold text-white group-hover:text-blue-400 transition">{scheduleData.title}</h3>
                     <p className="text-xs text-slate-400">{scheduleData.subtitle}</p>
                   </div>
                 </div>
                 <ChevronRight className="text-slate-500" />
               </div>
               {isToday && <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">TODAY</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
           <Dumbbell className="text-blue-500" />
           <h1 className="font-bold text-lg tracking-wide hidden sm:block">QuickFit <span className="text-blue-500">35</span></h1>
           <h1 className="font-bold text-lg tracking-wide sm:hidden">QF<span className="text-blue-500">35</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView('progress')} className="text-xs text-slate-300 hover:text-blue-400 transition font-bold flex items-center gap-1">
            <TrendingUp size={14} /> <span className="hidden sm:inline">Progress</span>
          </button>
          <button onClick={() => setView('history')} className="text-xs text-slate-300 hover:text-blue-400 transition font-bold flex items-center gap-1">
            <History size={14} /> <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </nav>

      <main className="pt-4">
        {view === 'dashboard' && renderDashboard()}
        {view === 'workout' && activeDayKey && (
          <div className="pt-20 px-4 max-w-md mx-auto">
             <WorkoutView 
               dayKey={activeDayKey} 
               schedule={SCHEDULE[activeDayKey]} 
               onBack={() => setView('dashboard')}
               onStartTimer={startTimer}
               onFinish={handleWorkoutFinish}
             />
          </div>
        )}
        {view === 'history' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <HistoryView
              onBack={() => setView('dashboard')}
              onReset={handleReset}
              onShowTutorial={handleShowTutorial}
            />
          </div>
        )}
        {view === 'progress' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <ProgressView onBack={() => setView('dashboard')} />
          </div>
        )}
      </main>

      <TimerBar
        seconds={timerSeconds}
        isActive={timerActive}
        onStart={startTimer}
        onStop={stopTimer}
      />

      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;

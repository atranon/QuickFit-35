
import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Coffee, ChevronRight, History, Settings, Zap, Target, RefreshCw, Trophy, Dumbbell as StrengthIcon, Activity, Heart, ShieldCheck, ShieldAlert, BookOpen, BarChart3, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLANS, COACH_AUDIT } from './constants';
import { ViewState, WorkoutLog, WorkoutPlanFrequency, ProgramType } from './types';
import WorkoutView from './components/WorkoutView';
import HistoryView from './components/HistoryView';
import TimerBar from './components/TimerBar';
import OnboardingView from './components/OnboardingView';
import ProgressView from './components/ProgressView';
import CompletionModal from './components/CompletionModal';
import SettingsView from './components/SettingsView';
import PreferencesView from './components/PreferencesView';
import FeedbackPage from './components/FeedbackPage';
import FloatingFeedbackButton from './components/FloatingFeedbackButton';
import { playBeep } from './utils/audioUtils';
import { connectToHeartRateDevice } from './services/bleService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(() => {
    const complete = localStorage.getItem('onboarding_complete');
    return complete ? 'dashboard' : 'onboarding';
  });
  
  const [activeDayKey, setActiveDayKey] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>(
    (localStorage.getItem('selected_program') as ProgramType) || 'golf'
  );
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlanFrequency>(
    (localStorage.getItem('selected_plan') as WorkoutPlanFrequency) || '3x'
  );
  
  // Completion Celebration State
  const [completionLog, setCompletionLog] = useState<WorkoutLog | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Heart Rate State
  const [bpm, setBpm] = useState<number | null>(null);
  const [hrDevice, setHrDevice] = useState<any>(null);
  
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
    localStorage.removeItem(`workout_notes_${log.dayKey}`);
    localStorage.removeItem(`current_inputs_${log.dayKey}`);
    localStorage.removeItem(`current_completed_${log.dayKey}`);
    
    // Celebration!
    const colors = ['#10b981', '#ffffff', '#059669']; // Golf emerald and white
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    setCompletionLog(log);
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setCompletionLog(null);
    setView('dashboard');
    setActiveDayKey(null);
  };

  const handleConnectHR = async () => {
    try {
        const device = await connectToHeartRateDevice(
            (rate) => setBpm(rate),
            () => {
                setHrDevice(null);
                setBpm(null);
            }
        );
        setHrDevice(device);
    } catch (e: any) {
        alert(e.message || "Connection failed");
    }
  };

  const handleReset = () => {
    stopTimer();
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
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedProgram === 'golf' ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/20 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
                <Zap size={24} className={selectedProgram === 'golf' ? 'text-emerald-100' : 'text-slate-500'} />
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
                ? 'bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]' 
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black text-white uppercase italic">{key} Frequency</h3>
                <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${selectedPlan === key ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
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
      <div className="pt-20 px-4 max-w-md mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Scientific Audit Header */}
        <div className="mb-8 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Coach Scientific Audit</span>
                </div>
                {hrDevice ? (
                    <div className="flex items-center gap-1.5 animate-pulse bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                        <Heart size={10} className="text-red-500 fill-red-500" />
                        <span className="text-[10px] font-black text-red-400">{bpm || '--'} BPM</span>
                    </div>
                ) : (
                    <button onClick={handleConnectHR} className="text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-emerald-400 flex items-center gap-1">
                        <Activity size={10} /> Link HR Device
                    </button>
                )}
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic border-l-2 border-emerald-500/40 pl-3">
                "{COACH_AUDIT.assessment}"
            </p>
        </div>

        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight italic">Schedule</h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest ${selectedProgram === 'golf' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                {selectedProgram === 'golf' ? 'Golf Speed' : 'Powerbuilding'}
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full uppercase tracking-widest border border-slate-700">
                {selectedPlan}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setView('onboarding')}
                className="bg-slate-800 p-2.5 rounded-xl text-blue-400 hover:text-white transition active:scale-95 border border-slate-700 shadow-lg"
                title="Restart Tutorial"
            >
                <BookOpen size={20} />
            </button>
            <button 
                onClick={() => setView('plan-selection')}
                className="bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-white transition active:scale-95 border border-slate-700 shadow-lg"
                title="Change Frequency"
            >
                <Settings size={20} />
            </button>
          </div>
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
                className={`cursor-pointer p-4 rounded-xl bg-slate-800/70 backdrop-blur border-l-4 hover:bg-slate-800 transition relative group ${scheduleData.color} ${isToday ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]' : ''}`}
              >
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm transition-transform group-hover:scale-110 ${isToday ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-700'}`}>
                       {day.label}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <h3 className="font-black text-white group-hover:text-emerald-400 transition uppercase text-sm tracking-tight italic truncate">{scheduleData.title}</h3>
                         {scheduleData.type === 'speed' && <Zap size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
                         {scheduleData.type === 'technique' && <Target size={14} className="text-emerald-400 shrink-0" />}
                         {selectedProgram === 'powerbuilding' && <StrengthIcon size={12} className="text-indigo-400 shrink-0" />}
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{scheduleData.subtitle}</p>
                     </div>
                   </div>
                   <ChevronRight className="text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" size={18} />
                 </div>
                 {isToday && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg shadow-emerald-500/30 uppercase tracking-tighter">TODAY</span>}
              </div>
            );
          })}
        </div>

        {/* Beta Feedback Button */}
        <div className="mt-10">
            <a 
                href={`mailto:rob.j.lara@gmail.com?subject=QuickFit 35 Beta Feedback&body=Device: ${navigator.userAgent}%0D%0A%0D%0AFeedback:`}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between group hover:bg-slate-800 transition-all duration-300 shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight italic">Beta Feedback</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Report bugs or suggest features</p>
                    </div>
                </div>
                <div className="bg-slate-700/50 p-1.5 rounded-full text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <CompletionModal 
        isOpen={showCompletionModal} 
        onClose={closeCompletionModal} 
        log={completionLog} 
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => setView('dashboard')}>
           <Dumbbell className="text-emerald-500" />
           <h1 className="font-black text-xl tracking-tighter uppercase italic">QuickFit <span className="text-emerald-500">35</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView('progress')} className={`text-[10px] transition font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-2 rounded-lg border ${view === 'progress' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:text-emerald-400'}`}>
            <BarChart3 size={14} /> <span className="hidden sm:inline">Progress</span>
          </button>
          <button onClick={() => setView('history')} className={`text-[10px] transition font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-2 rounded-lg border ${view === 'history' ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:text-blue-400'}`}>
            <History size={14} /> <span className="hidden sm:inline">History</span>
          </button>
          <button onClick={() => setView('settings')} className={`text-[10px] transition font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-2 rounded-lg border ${view === 'settings' ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:text-purple-400'}`}>
            <Settings size={14} /> <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>

      <main className="pt-4">
        {view === 'onboarding' && <OnboardingView onComplete={() => setView('plan-selection')} />}
        {view === 'dashboard' && renderDashboard()}
        {view === 'plan-selection' && renderPlanSelection()}
        {view === 'progress' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <ProgressView onBack={() => setView('dashboard')} />
          </div>
        )}
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
        {view === 'settings' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <SettingsView
              onBack={() => setView('dashboard')}
              onReset={handleReset}
              onShowTutorial={() => setView('onboarding')}
              onShowPreferences={() => setView('preferences')}
            />
          </div>
        )}
        {view === 'preferences' && (
          <div className="pt-20 px-4 max-w-md mx-auto">
            <PreferencesView onBack={() => setView('settings')} />
          </div>
        )}
        {view === 'feedback' && (
          <FeedbackPage onBack={() => setView('dashboard')} />
        )}
      </main>

      <TimerBar
        seconds={timerSeconds}
        isActive={timerActive}
        onStart={startTimer}
        onStop={stopTimer}
      />

      {/* Floating feedback button - shows on all pages except feedback page */}
      {view !== 'feedback' && <FloatingFeedbackButton />}
    </div>
  );
};

export default App;

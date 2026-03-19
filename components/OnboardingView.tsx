import React, { useState } from 'react';
import { Zap, Target, Scale, Trophy, ChevronRight, ArrowLeft, Gauge, Calendar, Dumbbell, User } from 'lucide-react';
import { UserPreferences, DrivingDistance, HandicapRange, SeasonStatus } from '../types';
import { saveUserPreferences } from '../services/storageService';

interface OnboardingViewProps {
  onComplete: (prefs: UserPreferences) => void;
}

/*
  The onboarding has 3 phases:
  1. HERO SCREEN — emotional hook, dream outcome ("Add 15-30 yards")
  2. STEP QUESTIONS — golf-identity questions that make the golfer feel understood
  3. SUMMARY SCREEN — reflects their answers back, builds confidence in the recommendation

  Questions ordered from "most exciting/identity" to "most practical":
  - Driving distance (the #1 thing golfers care about)
  - Handicap (establishes where they are as a player)
  - Season status (determines training intensity)
  - Primary goal (now informed by the golf context above)
  - Training experience (practical — determines starting difficulty)
  - Weight unit (quick practical setting)
*/

type OnboardingStep = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: { label: string; value: string; desc?: string; emoji?: string }[];
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'drivingDistance',
    title: "Current Driver Distance",
    subtitle: "Be honest — this is your starting line, not your ceiling.",
    icon: <Gauge className="text-emerald-400" size={32} />,
    options: [
      { label: "Under 200 yds", value: "under200", desc: "Building from the ground up." },
      { label: "200 – 230 yds", value: "200-230", desc: "Solid foundation to build on." },
      { label: "230 – 260 yds", value: "230-260", desc: "Above average. Room to unlock." },
      { label: "260 – 290 yds", value: "260-290", desc: "Strong. Let's get you elite." },
    ]
  },
  {
    id: 'handicapRange',
    title: "Your Handicap Range",
    subtitle: "Helps us balance speed work vs. stability.",
    icon: <Target className="text-blue-400" size={32} />,
    options: [
      { label: "New / No Handicap", value: "beginner", desc: "Still learning the game." },
      { label: "20+ (High)", value: "high", desc: "Working on consistency." },
      { label: "10 – 20 (Mid)", value: "mid", desc: "Breaking 90 territory." },
      { label: "Under 10 (Low / Scratch)", value: "low", desc: "Serious competitive player." }
    ]
  },
  {
    id: 'seasonStatus',
    title: "Where Are You in Your Season?",
    subtitle: "This changes everything about how hard we push.",
    icon: <Calendar className="text-amber-400" size={32} />,
    options: [
      { label: "Off-Season", value: "offseason", desc: "No tournaments. Time to build." },
      { label: "Pre-Season", value: "preseason", desc: "Ramping up. Season is 4-8 weeks away." },
      { label: "In-Season", value: "inseason", desc: "Playing weekly. Maintain & perform." },
      { label: "Year-Round Player", value: "yearround", desc: "Always playing. Smart maintenance." }
    ]
  },
  {
    id: 'primaryGoal',
    title: "Primary Goal",
    subtitle: "What do you want most from this program?",
    icon: <Trophy className="text-emerald-400" size={32} />,
    options: [
      { label: "Add Distance", value: "distance", desc: "Max clubhead speed & power." },
      { label: "Build Strength", value: "strength", desc: "Overall force production." },
      { label: "Improve Stability", value: "stability", desc: "Balance, sequencing, injury prevention." },
      { label: "General Fitness", value: "fitness", desc: "Look better, feel better, play better." }
    ]
  },
  {
    id: 'trainingExperience',
    title: "Gym Experience",
    subtitle: "How comfortable are you with weights?",
    icon: <Dumbbell className="text-purple-400" size={32} />,
    options: [
      { label: "Brand New", value: "none", desc: "Never touched a barbell. That's fine." },
      { label: "Some Experience", value: "some", desc: "Been to the gym, not consistent." },
      { label: "Regular Lifter", value: "regular", desc: "Comfortable with compound lifts." }
    ]
  },
  {
    id: 'weightUnit',
    title: "Weight Unit",
    subtitle: "Quick preference — you can change this later.",
    icon: <Scale className="text-slate-400" size={32} />,
    options: [
      { label: "Pounds (lbs)", value: "lbs" },
      { label: "Kilograms (kg)", value: "kg" }
    ]
  }
];

const getDistanceTarget = (distance?: DrivingDistance): string => {
  switch (distance) {
    case 'under200': return '200-220 yards';
    case '200-230': return '240-260 yards';
    case '230-260': return '270-290 yards';
    case '260-290': return '290-310 yards';
    case '290plus': return '310+ yards';
    default: return '20-30 more yards';
  }
};

const getSeasonLabel = (status?: SeasonStatus): string => {
  switch (status) {
    case 'offseason': return 'Off-Season Build';
    case 'preseason': return 'Pre-Season Ramp';
    case 'inseason': return 'In-Season Maintain';
    case 'yearround': return 'Year-Round Smart';
    default: return 'Balanced';
  }
};

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'hero' | 'steps' | 'summary'>('hero');
  const [currentStep, setCurrentStep] = useState(0);
  const [prefs, setPrefs] = useState<Record<string, string>>({});

  const handleSelect = (value: string) => {
    const stepId = ONBOARDING_STEPS[currentStep].id;
    setPrefs(prev => ({ ...prev, [stepId]: value }));

    // Auto-advance after brief delay
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  };

  const handleFinish = () => {
    const finalPreferences: UserPreferences = {
      fitnessLevel: prefs.trainingExperience === 'regular' ? 'advanced' : prefs.trainingExperience === 'some' ? 'intermediate' : 'beginner',
      primaryGoal: (prefs.primaryGoal as any) || 'distance',
      weightUnit: (prefs.weightUnit as any) || 'lbs',
      trainingExperience: (prefs.trainingExperience as any) || 'some',
      drivingDistance: (prefs.drivingDistance as DrivingDistance) || 'under200',
      handicapRange: (prefs.handicapRange as HandicapRange) || 'beginner',
      seasonStatus: (prefs.seasonStatus as SeasonStatus) || 'offseason',
      completedAt: Date.now()
    };
    saveUserPreferences(finalPreferences);
    localStorage.setItem('onboarding_complete', 'true');
    onComplete(finalPreferences);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setPhase('hero');
    }
  };

  // ============================================
  // PHASE 1: HERO SCREEN
  // ============================================
  if (phase === 'hero') {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-y-auto">
        <div className="max-w-sm w-full text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 w-24 h-24 bg-emerald-500/20 blur-[40px] rounded-full mx-auto"></div>
            <div className="relative inline-flex p-5 bg-emerald-600/20 border-2 border-emerald-500/30 rounded-3xl">
              <Zap className="text-emerald-400" size={48} fill="currentColor" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
            Add 15–30 Yards
          </h1>
          <h2 className="text-xl font-black text-emerald-400 italic uppercase tracking-tight mb-6">
            Off the Tee
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-2 max-w-xs mx-auto">
            Science-backed golf fitness in <span className="text-white font-bold">35 minutes a day</span>.
            Built around your game, your season, and your body.
          </p>
          <p className="text-slate-600 text-xs mb-10">
            Used by scratch golfers and weekend warriors alike.
          </p>

          <button
            onClick={() => setPhase('steps')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            Build My Program <ChevronRight size={20} />
          </button>

          <p className="text-slate-700 text-[10px] mt-4 font-bold uppercase tracking-widest">
            Takes 60 seconds
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE 3: SUMMARY SCREEN
  // ============================================
  if (phase === 'summary') {
    const distanceTarget = getDistanceTarget(prefs.drivingDistance as DrivingDistance);
    const seasonLabel = getSeasonLabel(prefs.seasonStatus as SeasonStatus);

    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col p-6 animate-in fade-in duration-500 overflow-y-auto">
        <div className="max-w-md w-full mx-auto flex flex-col min-h-full">
          <div className="flex items-center mb-8 mt-4">
            <button onClick={() => { setPhase('steps'); setCurrentStep(ONBOARDING_STEPS.length - 1); }} className="text-slate-500 hover:text-white transition p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
          </div>

          <div className="flex-1">
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-emerald-600/20 rounded-2xl mb-4">
                <User className="text-emerald-400" size={36} />
              </div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                Your Program
              </h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                Built for you
              </p>
            </div>

            {/* Personalized target callout */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border-2 border-emerald-500/30 rounded-2xl p-6 mb-6 text-center">
              <p className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest mb-2">Your 12-Week Target</p>
              <p className="text-2xl font-black text-white italic uppercase tracking-tight">
                {distanceTarget}
              </p>
              <p className="text-xs text-slate-400 mt-2">Based on your current distance and training status</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Season</p>
                <p className="text-sm font-black text-white uppercase italic">{seasonLabel}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Goal</p>
                <p className="text-sm font-black text-white uppercase italic">{prefs.primaryGoal || 'Distance'}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-sm font-black text-white uppercase italic">{prefs.trainingExperience || 'Some'}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Unit</p>
                <p className="text-sm font-black text-white uppercase italic">{prefs.weightUnit || 'lbs'}</p>
              </div>
            </div>
          </div>

          <div className="pb-8">
            <button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest text-sm italic"
            >
              Lock In & Start Training <Zap size={20} fill="currentColor" />
            </button>
            <p className="text-center text-slate-700 text-[10px] mt-3 font-bold uppercase tracking-widest">
              You can adjust preferences anytime in Settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE 2: STEP-BY-STEP QUESTIONS
  // ============================================
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-md w-full mx-auto flex flex-col min-h-full">
        {/* Header with back, progress dots, skip */}
        <div className="flex items-center justify-between mb-8 mt-4">
          <button onClick={goBack} className="text-slate-500 hover:text-white transition p-2 -ml-2">
            <ArrowLeft size={24} />
          </button>

          <div className="flex gap-1.5">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`}
              />
            ))}
          </div>

          <button onClick={handleFinish} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition">
            Skip
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-bottom-8 duration-500" key={currentStep}>
          <div className="mb-10 text-center">
            <div className="inline-flex p-5 bg-slate-800/50 border border-slate-700 rounded-2xl mb-6 shadow-xl">
              {step.icon}
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
              {step.title}
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              {step.subtitle}
            </p>
          </div>

          <div className="grid gap-3 mb-12">
            {step.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                  prefs[step.id] === opt.value
                    ? 'bg-emerald-600 border-emerald-400 shadow-2xl shadow-emerald-500/20 translate-x-1'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`block font-black uppercase italic tracking-tight text-lg ${prefs[step.id] === opt.value ? 'text-white' : 'text-slate-300'}`}>
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className={`text-xs font-medium block mt-1 ${prefs[step.id] === opt.value ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    )}
                  </div>
                  {prefs[step.id] === opt.value && <ChevronRight className="text-white" size={24} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Show "See My Program" on last step */}
        {isLastStep && prefs[step.id] && (
          <div className="pb-8 animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setPhase('summary')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest italic"
            >
              See My Program <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingView;

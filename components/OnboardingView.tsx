
import React, { useState } from 'react';
import { Zap, Target, Scale, Trophy, ChevronRight, ArrowLeft } from 'lucide-react';
import { UserPreferences } from '../types';

interface OnboardingViewProps {
  onComplete: () => void;
}

type OnboardingStep = {
  id: keyof UserPreferences;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: { label: string; value: string; desc?: string }[];
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'fitnessLevel',
    title: "Fitness Level",
    subtitle: "Determine your current technical floor.",
    icon: <Trophy className="text-blue-500" size={32} />,
    options: [
      { label: "Beginner", value: "Beginner", desc: "New to structured training." },
      { label: "Intermediate", value: "Intermediate", desc: "6+ months of consistent load." },
      { label: "Advanced", value: "Advanced", desc: "Elite technical proficiency." }
    ]
  },
  {
    id: 'goal',
    title: "Primary Goal",
    subtitle: "What is your high-priority output?",
    icon: <Target className="text-emerald-400" size={32} />,
    options: [
      { label: "Add Distance", value: "Add Distance", desc: "Max clubhead velocity focus." },
      { label: "Build Strength", value: "Build Strength", desc: "Hypertrophy and force production." },
      { label: "Improve Stability", value: "Improve Stability", desc: "Sequence and lead-leg integrity." },
      { label: "General Fitness", value: "General Fitness", desc: "Broad metabolic conditioning." }
    ]
  },
  {
    id: 'unit',
    title: "Weight Unit",
    subtitle: "Standardize your performance tracking.",
    icon: <Scale className="text-purple-400" size={32} />,
    options: [
      { label: "Pounds (lbs)", value: "lbs", desc: "Imperial measurement." },
      { label: "Kilograms (kg)", value: "kg", desc: "Metric measurement." }
    ]
  },
  {
    id: 'experience',
    title: "Training Experience",
    subtitle: "Your history with high-intensity load.",
    icon: <Zap className="text-amber-400" size={32} />,
    options: [
      { label: "None", value: "None", desc: "Starting fresh today." },
      { label: "Some", value: "Some", desc: "Occasional gym attendance." },
      { label: "Regular", value: "Regular", desc: "Structured athlete background." }
    ]
  }
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({});

  const handleSelect = (value: string) => {
    const stepId = ONBOARDING_STEPS[currentStep].id;
    const newPrefs = { ...prefs, [stepId]: value };
    setPrefs(newPrefs);
    
    // Auto-advance
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const canFinish = isLastStep && prefs[step.id];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-md w-full mx-auto flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-4">
          {currentStep > 0 ? (
            <button onClick={goBack} className="text-slate-500 hover:text-white transition p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
          ) : <div className="w-10 h-10" />}
          
          <div className="flex gap-1.5">
            {ONBOARDING_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`}
              />
            ))}
          </div>
          
          <button onClick={handleFinish} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition">
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-bottom-8 duration-500">
          <div className="mb-10 text-center">
            <div className="inline-flex p-5 bg-slate-800/50 border border-slate-700 rounded-2xl mb-6 shadow-xl">
              {step.icon}
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
              {step.title}
            </h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              {step.subtitle}
            </p>
          </div>

          <div className="grid gap-4 mb-12">
            {step.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                  prefs[step.id] === opt.value
                    ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/20 translate-x-1'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`block font-black uppercase italic tracking-tight text-xl ${prefs[step.id] === opt.value ? 'text-white' : 'text-slate-300'}`}>
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className={`text-xs font-medium block mt-1 ${prefs[step.id] === opt.value ? 'text-blue-100' : 'text-slate-500'}`}>
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

        {/* Footer Action */}
        {isLastStep && prefs[step.id] && (
          <div className="pb-8 animate-in fade-in zoom-in duration-300">
             <button 
                onClick={handleFinish}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition active:scale-[0.98] uppercase tracking-widest italic"
              >
                Launch Performance Engine <Zap size={20} fill="currentColor" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingView;

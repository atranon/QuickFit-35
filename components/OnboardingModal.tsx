import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, TrendingUp, Calendar, Target, User, Trophy, Scale, Zap } from 'lucide-react';
import { FitnessLevel, PrimaryGoal, WeightUnit, TrainingExperience, UserPreferences } from '../types';
import { saveUserPreferences } from '../services/storageService';

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const infoCards = [
    {
      type: 'info' as const,
      icon: <Target className="w-16 h-16 text-blue-500 mb-4" />,
      title: "Your Caddy for Strength",
      subtitle: "Welcome to QuickFit 35",
      description: "Golf-specific strength training designed to add yards off the tee. 4 focused workouts per week, 35 minutes each. No fluff, just results.",
      highlight: "Build power, stability, and rotational force for a better game."
    },
    {
      type: 'info' as const,
      icon: <Calendar className="w-16 h-16 text-green-500 mb-4" />,
      title: "Simple Game Plan",
      subtitle: "How It Works",
      description: "Pick your training day from the weekly schedule. Log your sets, reps, and weight for each exercise. The app tracks your progress and suggests when to increase the load.",
      highlight: "Like having a coach in your pocket—no guesswork needed."
    },
    {
      type: 'info' as const,
      icon: <TrendingUp className="w-16 h-16 text-orange-500 mb-4" />,
      title: "Track Every Rep",
      subtitle: "Progressive Overload Made Easy",
      description: "See your last workout stats, PR alerts, and rest timers. Export your data anytime. Backup to the cloud or your device.",
      highlight: "What gets measured gets improved—especially your swing speed."
    }
  ];

  const preferenceCards = [
    {
      type: 'preference' as const,
      icon: <User className="w-16 h-16 text-purple-500 mb-4" />,
      title: "What's Your Fitness Level?",
      subtitle: "Customize Your Experience",
      description: "This helps us understand where you're starting from.",
      preferenceKey: 'fitnessLevel' as const,
      options: [
        { value: 'beginner' as FitnessLevel, label: 'Beginner', desc: 'New to strength training' },
        { value: 'intermediate' as FitnessLevel, label: 'Intermediate', desc: 'Some lifting experience' },
        { value: 'advanced' as FitnessLevel, label: 'Advanced', desc: 'Regular lifter' }
      ]
    },
    {
      type: 'preference' as const,
      icon: <Trophy className="w-16 h-16 text-yellow-500 mb-4" />,
      title: "What's Your Primary Goal?",
      subtitle: "Focus Your Training",
      description: "Choose what matters most to your game.",
      preferenceKey: 'primaryGoal' as const,
      options: [
        { value: 'distance' as PrimaryGoal, label: 'Add Distance', desc: 'More yards off the tee' },
        { value: 'strength' as PrimaryGoal, label: 'Build Strength', desc: 'Overall power' },
        { value: 'stability' as PrimaryGoal, label: 'Improve Stability', desc: 'Balance & control' },
        { value: 'fitness' as PrimaryGoal, label: 'General Fitness', desc: 'Feel better, play better' }
      ]
    },
    {
      type: 'preference' as const,
      icon: <Scale className="w-16 h-16 text-blue-500 mb-4" />,
      title: "Preferred Weight Unit?",
      subtitle: "Choose Your Display",
      description: "Select how you want weights displayed.",
      preferenceKey: 'weightUnit' as const,
      options: [
        { value: 'lbs' as WeightUnit, label: 'Pounds (lbs)', desc: 'Standard US units' },
        { value: 'kg' as WeightUnit, label: 'Kilograms (kg)', desc: 'Metric units' }
      ]
    },
    {
      type: 'preference' as const,
      icon: <Zap className="w-16 h-16 text-orange-500 mb-4" />,
      title: "Training Experience?",
      subtitle: "Final Question",
      description: "How familiar are you with weight training?",
      preferenceKey: 'trainingExperience' as const,
      options: [
        { value: 'none' as TrainingExperience, label: 'None', desc: 'First time with weights' },
        { value: 'some' as TrainingExperience, label: 'Some', desc: 'Occasional lifter' },
        { value: 'regular' as TrainingExperience, label: 'Regular', desc: 'Consistent training' }
      ]
    }
  ];

  const cards = [...infoCards, ...preferenceCards];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleSkip = () => {
    // Skip with default preferences
    handleComplete();
  };

  const handleComplete = () => {
    // Save preferences with defaults if not selected
    const finalPreferences: UserPreferences = {
      fitnessLevel: preferences.fitnessLevel || 'intermediate',
      primaryGoal: preferences.primaryGoal || 'distance',
      weightUnit: preferences.weightUnit || 'lbs',
      trainingExperience: preferences.trainingExperience || 'some',
      completedAt: Date.now()
    };
    saveUserPreferences(finalPreferences);
    onComplete();
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const isPreferenceSelected = (card: number): boolean => {
    if (card === 3) return !!preferences.fitnessLevel;
    if (card === 4) return !!preferences.primaryGoal;
    if (card === 5) return !!preferences.weightUnit;
    if (card === 6) return !!preferences.trainingExperience;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-md w-full mx-4">
        {/* Card Container */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="text-white" size={24} />
              <h1 className="font-bold text-xl text-white tracking-tight">QuickFit <span className="text-green-200">Golf</span> <span className="text-white">35</span></h1>
            </div>
            <button
              onClick={handleSkip}
              className="text-green-100 hover:text-white text-sm font-semibold transition"
            >
              Skip
            </button>
          </div>

          {/* Card Content */}
          <div className="p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
            {cards[currentCard].icon}
            <h2 className="text-2xl font-bold text-white mb-2">{cards[currentCard].title}</h2>
            <p className="text-blue-400 text-sm font-semibold mb-4">{cards[currentCard].subtitle}</p>
            <p className="text-slate-300 text-base leading-relaxed mb-4">{cards[currentCard].description}</p>

            {cards[currentCard].type === 'info' && 'highlight' in cards[currentCard] && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 mt-2">
                <p className="text-slate-400 text-sm italic">{cards[currentCard].highlight}</p>
              </div>
            )}

            {cards[currentCard].type === 'preference' && 'options' in cards[currentCard] && (
              <div className="w-full mt-4 space-y-3">
                {cards[currentCard].options.map((option: any) => {
                  const isSelected = preferences[cards[currentCard].preferenceKey as keyof UserPreferences] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => updatePreference(cards[currentCard].preferenceKey as keyof UserPreferences, option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-white mb-1">{option.label}</div>
                      <div className="text-sm text-slate-400">{option.desc}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 pb-4">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentCard
                    ? 'w-8 bg-green-500'
                    : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="px-6 pb-6 flex justify-between items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentCard === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition ${
                currentCard === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={cards[currentCard].type === 'preference' && !isPreferenceSelected(currentCard)}
              className={`flex items-center gap-1 px-6 py-3 rounded-lg font-bold transition shadow-lg ${
                cards[currentCard].type === 'preference' && !isPreferenceSelected(currentCard)
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {currentCard === cards.length - 1 ? (
                <>Let's Go <Target size={18} /></>
              ) : (
                <>Next <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Hint */}
        <p className="text-center text-slate-500 text-xs mt-4">
          You can revisit this tutorial and change your preferences anytime from Settings
        </p>
      </div>
    </div>
  );
};

export default OnboardingModal;

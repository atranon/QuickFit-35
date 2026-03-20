import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Trophy, Scale, Zap, Save, CheckCircle, Dumbbell } from 'lucide-react';
import { FitnessLevel, PrimaryGoal, WeightUnit, TrainingExperience, UserPreferences, EquipmentAccess } from '../types';
import { getUserPreferences, saveUserPreferences } from '../services/storageService';

interface PreferencesViewProps {
  onBack: () => void;
}

const PreferencesView: React.FC<PreferencesViewProps> = ({ onBack }) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) {
      setPreferences(prefs);
    } else {
      // Set defaults if no preferences exist
      setPreferences({
        fitnessLevel: 'intermediate',
        primaryGoal: 'distance',
        weightUnit: 'lbs',
        trainingExperience: 'some',
        completedAt: Date.now()
      });
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: value });
      setSaved(false);
    }
  };

  const handleSave = () => {
    if (preferences) {
      saveUserPreferences(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!preferences) {
    return (
      <div className="pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white">My Preferences</h2>
        </div>
        <p className="text-slate-400">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white">My Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Fitness Level */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <User size={18} className="text-purple-400" />
              Fitness Level
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { value: 'beginner' as FitnessLevel, label: 'Beginner', desc: 'New to strength training' },
              { value: 'intermediate' as FitnessLevel, label: 'Intermediate', desc: 'Some lifting experience' },
              { value: 'advanced' as FitnessLevel, label: 'Advanced', desc: 'Regular lifter' }
            ].map((option) => {
              const isSelected = preferences.fitnessLevel === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updatePreference('fitnessLevel', option.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Goal */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" />
              Primary Goal
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { value: 'distance' as PrimaryGoal, label: 'Add Distance', desc: 'More yards off the tee' },
              { value: 'strength' as PrimaryGoal, label: 'Build Strength', desc: 'Overall power' },
              { value: 'stability' as PrimaryGoal, label: 'Improve Stability', desc: 'Balance & control' },
              { value: 'fitness' as PrimaryGoal, label: 'General Fitness', desc: 'Feel better, play better' }
            ].map((option) => {
              const isSelected = preferences.primaryGoal === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updatePreference('primaryGoal', option.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-yellow-500 bg-yellow-500/20'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight Unit */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Scale size={18} className="text-blue-400" />
              Weight Unit
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { value: 'lbs' as WeightUnit, label: 'Pounds (lbs)', desc: 'Standard US units' },
              { value: 'kg' as WeightUnit, label: 'Kilograms (kg)', desc: 'Metric units' }
            ].map((option) => {
              const isSelected = preferences.weightUnit === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updatePreference('weightUnit', option.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Training Experience */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-orange-400" />
              Training Experience
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { value: 'none' as TrainingExperience, label: 'None', desc: 'First time with weights' },
              { value: 'some' as TrainingExperience, label: 'Some', desc: 'Occasional lifter' },
              { value: 'regular' as TrainingExperience, label: 'Regular', desc: 'Consistent training' }
            ].map((option) => {
              const isSelected = preferences.trainingExperience === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updatePreference('trainingExperience', option.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Access */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Dumbbell size={18} className="text-orange-400" />
              Equipment Access
            </h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-500 mb-3">
              This adapts every exercise in your program to match your equipment. You can change it anytime.
            </p>
            <div className="grid gap-2">
              {[
                { value: 'full-gym', label: 'Full Gym', desc: 'Barbells, cables, machines, racks' },
                { value: 'home-dumbbells', label: 'Home — Dumbbells', desc: 'Dumbbells, bench (optional), bands' },
                { value: 'bands-only', label: 'Bands & Bodyweight', desc: 'Resistance bands, door anchor, bodyweight' },
                { value: 'no-equipment', label: 'Bodyweight Only', desc: 'No equipment at all' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updatePreference('equipmentAccess' as any, opt.value)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    (preferences as any).equipmentAccess === opt.value || (!((preferences as any).equipmentAccess) && opt.value === 'full-gym')
                      ? 'bg-orange-600/20 border-orange-500/50 shadow-lg'
                      : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className={`block text-sm font-black uppercase italic tracking-tight ${
                    (preferences as any).equipmentAccess === opt.value || (!((preferences as any).equipmentAccess) && opt.value === 'full-gym')
                      ? 'text-white' : 'text-slate-300'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg ${
            saved
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              Preferences Saved!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save size={20} />
              Save Preferences
            </span>
          )}
        </button>

        <p className="text-center text-slate-500 text-xs">
          Changes take effect immediately after saving
        </p>
      </div>
    </div>
  );
};

export default PreferencesView;

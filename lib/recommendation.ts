
import { UserPreferences, ProgramType, WorkoutPlanFrequency } from '../types';

export function getRecommendedPlan(prefs: UserPreferences): { program: ProgramType; frequency: WorkoutPlanFrequency } {
  // 1. Determine Program Type based on Primary Goal
  let program: ProgramType = 'golf';
  if (prefs.primaryGoal === 'strength' || prefs.primaryGoal === 'fitness') {
    program = 'powerbuilding';
  }

  // 2. Determine Frequency based on Fitness Level and Training Experience
  // We use a scoring system:
  // Fitness Level: Beginner (1), Intermediate (2), Advanced (3)
  // Training Experience: None (0), Some (1), Regular (2)
  
  const levelScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }[prefs.fitnessLevel] || 2;
  const expScore = { 'none': 0, 'some': 1, 'regular': 2 }[prefs.trainingExperience] || 1;
  const totalScore = levelScore + expScore;

  let frequency: WorkoutPlanFrequency = '3x';

  if (totalScore <= 1) {
    frequency = '2x';
  } else if (totalScore === 2) {
    frequency = '3x';
  } else if (totalScore === 3) {
    frequency = '3x';
  } else if (totalScore === 4) {
    frequency = '4x';
  } else {
    frequency = '5x';
  }

  // Specific overrides based on user examples
  if (prefs.fitnessLevel === 'beginner' && prefs.trainingExperience === 'none' && prefs.primaryGoal === 'fitness') {
    frequency = '2x';
    program = 'powerbuilding';
  }
  
  if (prefs.fitnessLevel === 'advanced' && prefs.primaryGoal === 'distance') {
    frequency = '5x';
    program = 'golf';
  }

  return { program, frequency };
}

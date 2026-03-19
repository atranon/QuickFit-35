import { UserPreferences, ProgramType, WorkoutPlanFrequency } from '../types';

/*
  HOW THE RECOMMENDATION WORKS:

  1. PROGRAM TYPE (golf vs powerbuilding):
     - If goal is "distance" or "stability" -> golf program
     - If goal is "strength" or "fitness" -> powerbuilding

  2. FREQUENCY (how many days per week):
     - In-season golfers train LESS (2-3x) to save energy for play
     - Off-season golfers can train MORE (4-5x) to build a foundation
     - Beginners always start lower regardless of season
     - Advanced + off-season = max frequency (5x)

  3. The scoring system:
     - We assign points based on experience and fitness
     - Then adjust UP or DOWN based on season status
*/

export function getRecommendedPlan(prefs: UserPreferences): { program: ProgramType; frequency: WorkoutPlanFrequency } {

    // Step 1: Determine program type based on primary goal
    let program: ProgramType = 'golf';
    if (prefs.primaryGoal === 'strength' || prefs.primaryGoal === 'fitness') {
        program = 'powerbuilding';
    }

    // Step 2: Calculate a "readiness score" from experience + fitness
    const levelScore = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }[prefs.fitnessLevel] || 2;
    const expScore = { 'none': 0, 'some': 1, 'regular': 2 }[prefs.trainingExperience] || 1;
    let totalScore = levelScore + expScore; // Range: 1 to 5

    // Step 3: Adjust based on season status
    // In-season players should train less — pull the score down
    // Off-season players can train more — push the score up
    if (prefs.seasonStatus === 'inseason' || prefs.seasonStatus === 'yearround') {
        totalScore = Math.max(1, totalScore - 1);
    } else if (prefs.seasonStatus === 'offseason') {
        totalScore = Math.min(5, totalScore + 1);
    }
    // preseason stays neutral

    // Step 4: Map score to frequency
    let frequency: WorkoutPlanFrequency = '3x';
    if (totalScore <= 1) {
        frequency = '2x';
    } else if (totalScore <= 2) {
        frequency = '3x';
    } else if (totalScore <= 3) {
        frequency = '3x';
    } else if (totalScore <= 4) {
        frequency = '4x';
    } else {
        frequency = '5x';
    }

    // Step 5: Specific overrides for extreme cases

    // Complete beginner who's never trained -> always 2x
    if (prefs.fitnessLevel === 'beginner' && prefs.trainingExperience === 'none') {
        frequency = '2x';
    }

    // Advanced golfer chasing distance in off-season -> max it out
    if (prefs.fitnessLevel === 'advanced' && prefs.primaryGoal === 'distance' && prefs.seasonStatus === 'offseason') {
        frequency = '5x';
        program = 'golf';
    }

    // In-season players should never go above 3x (they need recovery for play)
    if (prefs.seasonStatus === 'inseason' && (frequency === '4x' || frequency === '5x')) {
        frequency = '3x';
    }

    return { program, frequency };
}

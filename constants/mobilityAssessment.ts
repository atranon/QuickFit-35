import { MobilityTestId, MobilityScore, MobilityResult, MobilityFlag, MobilityAssessmentData, WarmUpExercise } from '../types';

/*
  THE 5 TPI-LITE TESTS:

  These are simplified versions of real TPI screens.
  The golfer does each test, watches a description/video,
  and self-grades: Pass, Partial, or Fail.

  Each test maps to specific mobility areas. When a test
  scores Partial or Fail, the app adds corrective exercises
  to the warm-up and flags the limitation on the dashboard.
*/

export interface MobilityTest {
  id: MobilityTestId;
  name: string;
  area: string;            // Body area tested
  whyItMatters: string;    // Golf-specific relevance
  howToTest: string;       // Step-by-step instructions
  passDescription: string;
  partialDescription: string;
  failDescription: string;
  videoSearchUrl: string;  // YouTube search for the test demo
  isBilateral: boolean;    // Test each side separately?
}

export const MOBILITY_TESTS: MobilityTest[] = [
  {
    id: 'overhead_squat',
    name: 'Overhead Deep Squat',
    area: 'Full Body Mobility',
    whyItMatters: 'Tests ankle, hip, and thoracic spine mobility together. Limitations here affect your ability to stay in posture through the swing and transfer power from the ground.',
    howToTest: 'Stand with feet shoulder-width apart, arms extended overhead. Slowly squat as deep as you can while keeping arms overhead and heels on the ground.',
    passDescription: 'Thighs below parallel, arms stay overhead, heels stay down, no excessive forward lean.',
    partialDescription: 'Can squat to parallel but arms fall forward, OR heels come up slightly, OR significant forward lean.',
    failDescription: 'Cannot squat to parallel, arms collapse, or heels lift significantly.',
    videoSearchUrl: 'https://www.youtube.com/results?search_query=overhead+deep+squat+assessment+TPI+golf',
    isBilateral: false,
  },
  {
    id: 'trunk_rotation',
    name: 'Seated Trunk Rotation',
    area: 'Thoracic Rotation',
    whyItMatters: 'The golf swing demands 45°+ of upper body rotation. Limited thoracic rotation forces compensations in the lower back and arms, costing you both power and consistency.',
    howToTest: 'Sit on a chair or bench with feet flat, hold a club across your chest. Without moving your hips, rotate your upper body as far as you can to each side.',
    passDescription: 'Can rotate 45°+ to each side without hip movement or discomfort.',
    partialDescription: 'Can rotate 30-45° but feel tightness, or one side is noticeably more restricted.',
    failDescription: 'Less than 30° rotation, significant asymmetry between sides, or pain.',
    videoSearchUrl: 'https://www.youtube.com/results?search_query=seated+trunk+rotation+test+TPI+golf',
    isBilateral: true,
  },
  {
    id: 'toe_touch',
    name: 'Toe Touch',
    area: 'Posterior Chain Flexibility',
    whyItMatters: 'Hamstring and lower back flexibility directly affect your ability to hinge at address and maintain posture during the swing. Tight hamstrings pull the pelvis under, robbing you of power.',
    howToTest: 'Stand with feet together, legs straight. Slowly bend forward and reach for your toes. Don\'t bounce — just reach and hold.',
    passDescription: 'Fingertips touch toes or past them, with straight legs.',
    partialDescription: 'Fingertips reach mid-shin to ankles, or knees bend slightly.',
    failDescription: 'Cannot reach past knees, or significant rounding/pain in lower back.',
    videoSearchUrl: 'https://www.youtube.com/results?search_query=toe+touch+test+hamstring+flexibility+golf',
    isBilateral: false,
  },
  {
    id: 'single_leg_balance',
    name: 'Single Leg Balance',
    area: 'Stability & Balance',
    whyItMatters: 'Your lead leg absorbs 4-6x your body weight during the downswing. Poor single-leg stability means you leak energy at impact and lose distance and accuracy.',
    howToTest: 'Stand on one leg with eyes open, hands on hips. Hold for 20 seconds. Test both sides.',
    passDescription: 'Can hold 20+ seconds on each leg without wobbling or touching down.',
    partialDescription: 'Can hold 10-20 seconds, or significant wobbling, or noticeable difference between sides.',
    failDescription: 'Cannot hold 10 seconds, or immediately lose balance.',
    videoSearchUrl: 'https://www.youtube.com/results?search_query=single+leg+balance+test+golf+stability',
    isBilateral: true,
  },
  {
    id: 'pelvic_tilt',
    name: 'Pelvic Tilt Control',
    area: 'Hip & Pelvis Control',
    whyItMatters: 'The ability to control anterior/posterior pelvic tilt is fundamental to maintaining posture at address, creating X-factor stretch, and transferring rotational power from lower body to upper body.',
    howToTest: 'Stand with your back against a wall, feet 6 inches from the wall. Try to press your lower back flat against the wall (posterior tilt), then arch it away from the wall (anterior tilt). Can you do both?',
    passDescription: 'Can clearly perform both anterior and posterior tilt with control.',
    partialDescription: 'Can do one direction but not the other, or movement is jerky/limited.',
    failDescription: 'Cannot feel the difference between positions, or stuck in one position.',
    videoSearchUrl: 'https://www.youtube.com/results?search_query=pelvic+tilt+test+anterior+posterior+golf',
    isBilateral: false,
  },
];

/*
  CORRECTIVE EXERCISES:

  When a test scores Partial or Fail, the corresponding corrective
  exercises get added to the warm-up. Each corrective targets the
  specific limitation identified by the test.
*/

const CORRECTIVE_EXERCISES: Record<MobilityTestId, WarmUpExercise[]> = {
  overhead_squat: [
    { name: 'Ankle Rocks', duration: '10 each side', cue: 'Knee over toe, press forward, heel stays down.', isCorrectiveFor: 'overhead_squat' },
    { name: 'Cat-Cow', duration: '10 reps', cue: 'Alternate between arching and rounding your spine slowly.', isCorrectiveFor: 'overhead_squat' },
    { name: 'Goblet Squat Hold', duration: '30 seconds', cue: 'Hold the bottom of a squat, elbows push knees out.', isCorrectiveFor: 'overhead_squat' },
  ],
  trunk_rotation: [
    { name: 'Open Book Stretch', duration: '8 each side', cue: 'Side-lying, rotate top arm open, follow with eyes.', isCorrectiveFor: 'trunk_rotation' },
    { name: 'Seated T-Spine Rotation', duration: '10 each side', cue: 'Sit tall, club across chest, rotate without moving hips.', isCorrectiveFor: 'trunk_rotation' },
    { name: 'Thread the Needle', duration: '8 each side', cue: 'On all fours, reach one arm under and through, follow with eyes.', isCorrectiveFor: 'trunk_rotation' },
  ],
  toe_touch: [
    { name: 'Standing Hamstring Scoop', duration: '10 reps', cue: 'Hinge forward, scoop arms up through legs, stand tall.', isCorrectiveFor: 'toe_touch' },
    { name: 'Adductor Rock-Back', duration: '8 each side', cue: 'Kneel, one leg straight out to side, rock hips back.', isCorrectiveFor: 'toe_touch' },
    { name: 'Toe Touch Progression', duration: '10 reps', cue: 'Toes on rolled towel, bend forward, reach for floor.', isCorrectiveFor: 'toe_touch' },
  ],
  single_leg_balance: [
    { name: 'Single Leg RDL (Bodyweight)', duration: '8 each side', cue: 'Hinge forward on one leg, reach hands to floor.', isCorrectiveFor: 'single_leg_balance' },
    { name: 'Stork Turns', duration: '6 each side', cue: 'Stand on one leg, slowly rotate torso left and right.', isCorrectiveFor: 'single_leg_balance' },
    { name: 'Single Leg Glute Bridge', duration: '10 each side', cue: 'One foot on floor, drive hips up, hold 2 sec at top.', isCorrectiveFor: 'single_leg_balance' },
  ],
  pelvic_tilt: [
    { name: 'Pelvic Tilts (Supine)', duration: '15 reps', cue: 'On your back, knees bent, alternate flattening and arching lower back.', isCorrectiveFor: 'pelvic_tilt' },
    { name: 'Hip CARs', duration: '5 each direction', cue: 'Standing on one leg, draw the biggest circle you can with the other knee.', isCorrectiveFor: 'pelvic_tilt' },
    { name: '90/90 Hip Switches', duration: '10 reps', cue: 'Both knees at 90°, rotate hips side to side smoothly.', isCorrectiveFor: 'pelvic_tilt' },
  ],
};

/*
  BASE WARM-UP EXERCISES:

  These are the standard warm-up movements that EVERY golfer does
  before a session, regardless of their assessment results.
  They're organized by workout type so that the warm-up primes
  the specific movements they're about to do.
*/

const BASE_WARMUP_GENERAL: WarmUpExercise[] = [
  { name: 'Arm Circles', duration: '10 forward, 10 backward', cue: 'Big, controlled circles. Opens shoulders for rotation.' },
  { name: 'Hip Circles', duration: '10 each direction', cue: 'Hands on hips, draw big circles. Lubricates the hip joint.' },
  { name: 'Torso Twists', duration: '15 controlled reps', cue: 'Feet planted, rotate through the mid-back, not the lower back.' },
  { name: 'Leg Swings', duration: '10 each direction', cue: 'Front-to-back, then side-to-side. Hold something for balance.' },
];

const BASE_WARMUP_STRENGTH: WarmUpExercise[] = [
  { name: 'Bodyweight Squats', duration: '12 reps', cue: 'Controlled depth, knees track toes, chest up.' },
  { name: 'Push-Ups', duration: '8 reps', cue: 'Full range, tight core, warm up the pressing pattern.' },
  { name: 'Band Pull-Aparts', duration: '15 reps', cue: 'Squeeze shoulder blades together. Activates upper back.' },
];

const BASE_WARMUP_SPEED: WarmUpExercise[] = [
  { name: 'High Knees', duration: '20 reps', cue: 'Quick feet, pump arms, prime the nervous system.' },
  { name: 'A-Skips', duration: '10 each leg', cue: 'Drive knee up, snap foot down. Builds neural speed.' },
  { name: 'Practice Swings (50%)', duration: '5 smooth swings', cue: 'Half speed, focus on sequencing. Groove the pattern.' },
];

const BASE_COOLDOWN: WarmUpExercise[] = [
  { name: 'Figure-4 Pigeon Stretch', duration: '30 sec each side', cue: 'Cross ankle over knee, press knee away gently. Opens hips.' },
  { name: 'Cross-Body Shoulder Stretch', duration: '30 sec each side', cue: 'Pull arm across chest, feel the stretch in rear shoulder.' },
  { name: 'Standing Quad Stretch', duration: '30 sec each side', cue: 'Pull heel to glute, keep knees together, stand tall.' },
  { name: 'Child\'s Pose', duration: '45 seconds', cue: 'Sink hips back, arms extended, breathe deep. Decompress the spine.' },
  { name: 'Deep Breathing', duration: '5 slow breaths', cue: 'In through nose 4 sec, hold 4 sec, out through mouth 6 sec.' },
];

// ============================================
// PUBLIC FUNCTIONS
// ============================================

/**
 * Generates mobility flags from assessment results.
 * Called when the user completes or updates their assessment.
 */
export function generateFlags(results: MobilityResult[]): MobilityFlag[] {
  const flags: MobilityFlag[] = [];

  const flagMap: Record<MobilityTestId, { area: string; warningMsg: string; limitationMsg: string; correctives: string[] }> = {
    overhead_squat: {
      area: 'Full Body Mobility',
      warningMsg: 'Mild mobility restrictions may affect posture and power transfer.',
      limitationMsg: 'Significant mobility limitation in squat pattern — prioritize ankle, hip, and thoracic work.',
      correctives: CORRECTIVE_EXERCISES.overhead_squat.map(e => e.name),
    },
    trunk_rotation: {
      area: 'Thoracic Rotation',
      warningMsg: 'Rotation is slightly limited — this may reduce backswing turn and X-factor.',
      limitationMsg: 'Limited trunk rotation is likely costing you swing speed and consistency. Focus on thoracic mobility.',
      correctives: CORRECTIVE_EXERCISES.trunk_rotation.map(e => e.name),
    },
    toe_touch: {
      area: 'Posterior Chain',
      warningMsg: 'Hamstring tightness may affect your ability to maintain posture at address.',
      limitationMsg: 'Significant posterior chain tightness — this pulls your pelvis under and limits power. Stretch daily.',
      correctives: CORRECTIVE_EXERCISES.toe_touch.map(e => e.name),
    },
    single_leg_balance: {
      area: 'Stability',
      warningMsg: 'Balance is slightly off — your lead leg may leak energy at impact.',
      limitationMsg: 'Poor single-leg stability means you\'re losing power at impact. This is trainable.',
      correctives: CORRECTIVE_EXERCISES.single_leg_balance.map(e => e.name),
    },
    pelvic_tilt: {
      area: 'Pelvis Control',
      warningMsg: 'Pelvic control is limited — this affects setup posture and power transfer.',
      limitationMsg: 'Unable to control pelvic position — this is fundamental to a consistent golf swing. Prioritize hip CARs and tilts.',
      correctives: CORRECTIVE_EXERCISES.pelvic_tilt.map(e => e.name),
    },
  };

  results.forEach(result => {
    if (result.score === 'pass') return;

    const config = flagMap[result.testId];
    if (!config) return;

    const sideNote = result.side && result.side !== 'both' ? ` (${result.side} side)` : '';

    flags.push({
      area: config.area + sideNote,
      severity: result.score === 'partial' ? 'warning' : 'limitation',
      message: result.score === 'partial' ? config.warningMsg : config.limitationMsg,
      correctives: config.correctives,
    });
  });

  return flags;
}

/**
 * Builds the warm-up exercise list for a specific workout.
 * Combines:
 * 1. Base general warm-up (always)
 * 2. Workout-type-specific activation (strength, speed, or technique)
 * 3. Corrective exercises from the golfer's assessment (if they have one)
 *
 * Returns a flat list of WarmUpExercise objects.
 */
export function buildWarmUp(workoutType: 'strength' | 'speed' | 'technique' | 'rest' | undefined): WarmUpExercise[] {
  const warmup: WarmUpExercise[] = [...BASE_WARMUP_GENERAL];

  // Add type-specific exercises
  if (workoutType === 'speed') {
    warmup.push(...BASE_WARMUP_SPEED);
  } else {
    warmup.push(...BASE_WARMUP_STRENGTH);
  }

  // Add corrective exercises from assessment
  try {
    const assessmentStr = localStorage.getItem('mobility_assessment');
    if (assessmentStr) {
      const assessment: MobilityAssessmentData = JSON.parse(assessmentStr);
      // Collect unique corrective exercises for any flagged areas
      const addedNames = new Set<string>();
      assessment.flags.forEach(flag => {
        flag.correctives.forEach(name => {
          if (!addedNames.has(name)) {
            addedNames.add(name);
            // Find the full exercise definition from our corrective banks
            for (const exercises of Object.values(CORRECTIVE_EXERCISES)) {
              const found = exercises.find(e => e.name === name);
              if (found) {
                warmup.push(found);
                break;
              }
            }
          }
        });
      });
    }
  } catch (e) {
    // Assessment data corrupted — just use base warm-up
  }

  return warmup;
}

/**
 * Returns the cool-down exercises (same for all workout types).
 */
export function getCoolDown(): WarmUpExercise[] {
  return [...BASE_COOLDOWN];
}

/**
 * Save assessment to localStorage.
 */
export function saveAssessment(results: MobilityResult[]): MobilityAssessmentData {
  const flags = generateFlags(results);
  const data: MobilityAssessmentData = {
    results,
    completedAt: Date.now(),
    flags,
  };
  localStorage.setItem('mobility_assessment', JSON.stringify(data));
  return data;
}

/**
 * Load assessment from localStorage.
 */
export function getAssessment(): MobilityAssessmentData | null {
  try {
    const str = localStorage.getItem('mobility_assessment');
    if (!str) return null;
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Check if the user should be prompted to reassess
 * (returns true if their assessment is older than 4 weeks).
 */
export function shouldReassess(): boolean {
  const assessment = getAssessment();
  if (!assessment) return false; // They haven't assessed at all — don't nag, prompt differently
  const fourWeeksMs = 28 * 24 * 60 * 60 * 1000;
  return Date.now() - assessment.completedAt > fourWeeksMs;
}

// Re-export test definitions for the assessment UI
export { MOBILITY_TESTS };

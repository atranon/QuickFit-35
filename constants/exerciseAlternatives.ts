/*
  EXERCISE ALTERNATIVES & SUBSTITUTIONS

  When a user doesn't have the equipment or wants a variation,
  they can swap to an alternative that targets the same movement pattern.

  Each alternative includes:
  - name: The substitute exercise name
  - reason: Why you'd use this (equipment, injury, etc.)
  - difficulty: easier/same/harder relative to the original
*/

export interface ExerciseAlternative {
  name: string;
  reason: string;
  difficulty: 'easier' | 'same' | 'harder';
}

export const EXERCISE_ALTERNATIVES: Record<string, ExerciseAlternative[]> = {

  // ============================================
  // LOWER BODY — COMPOUND
  // ============================================

  "Trap Bar Deadlift": [
    {
      name: "Barbell Deadlift",
      reason: "No trap bar — use straight barbell from the floor",
      difficulty: "same"
    },
    {
      name: "DB Romanian Deadlift",
      reason: "No barbell — dumbbells work for hip hinge",
      difficulty: "easier"
    },
    {
      name: "Single-Leg DB Deadlift",
      reason: "Build unilateral stability (great for golf)",
      difficulty: "harder"
    }
  ],

  "Front Squat": [
    {
      name: "Goblet Squats",
      reason: "No barbell — dumbbell keeps upright torso",
      difficulty: "easier"
    },
    {
      name: "Heel-Elevated Front Squat",
      reason: "Limited ankle mobility — elevate heels",
      difficulty: "same"
    },
    {
      name: "Safety Bar Squat",
      reason: "Shoulder/wrist issues — easier to hold",
      difficulty: "same"
    }
  ],

  "Heel-Elevated Front Squat": [
    {
      name: "Goblet Squats",
      reason: "No barbell — use dumbbell at chest",
      difficulty: "easier"
    },
    {
      name: "Front Squat",
      reason: "Good ankle mobility — no elevation needed",
      difficulty: "same"
    },
    {
      name: "Leg Press",
      reason: "No squat rack — machine-based option",
      difficulty: "easier"
    }
  ],

  "Goblet Squats": [
    {
      name: "Front Squat",
      reason: "Want more load — barbell allows heavier weight",
      difficulty: "harder"
    },
    {
      name: "Bodyweight Squats",
      reason: "No equipment — build the pattern first",
      difficulty: "easier"
    }
  ],

  "Bulgarian Split Squat": [
    {
      name: "Split Squat",
      reason: "Both feet on floor — easier to balance",
      difficulty: "easier"
    },
    {
      name: "Reverse Lunges",
      reason: "Easier on knees — step back vs. split stance",
      difficulty: "easier"
    },
    {
      name: "Walking Lunges",
      reason: "Dynamic movement — builds coordination",
      difficulty: "same"
    }
  ],

  "Split Squat": [
    {
      name: "Bulgarian Split Squat",
      reason: "Want more range — elevate rear foot",
      difficulty: "harder"
    },
    {
      name: "Reverse Lunges",
      reason: "Easier on knees — step back instead",
      difficulty: "easier"
    }
  ],

  "Walking Lunges": [
    {
      name: "Reverse Lunges",
      reason: "Easier on knees — less forward momentum",
      difficulty: "easier"
    },
    {
      name: "Bulgarian Split Squat",
      reason: "Static position — more control",
      difficulty: "same"
    }
  ],

  "Lateral Lunges": [
    {
      name: "Cossack Squats",
      reason: "Deeper adductor stretch — more mobility",
      difficulty: "harder"
    },
    {
      name: "Side Step-Ups",
      reason: "Easier — step up to box laterally",
      difficulty: "easier"
    }
  ],

  "Box Jumps": [
    {
      name: "Broad Jumps",
      reason: "No box — jump forward for distance",
      difficulty: "same"
    },
    {
      name: "Jump Squats",
      reason: "No equipment — explosive bodyweight",
      difficulty: "easier"
    }
  ],

  // ============================================
  // LOWER BODY — ISOLATION
  // ============================================

  "Leg Extensions": [
    {
      name: "Spanish Squats",
      reason: "No machine — band around knees, sit back",
      difficulty: "same"
    },
    {
      name: "Sissy Squats",
      reason: "No equipment — bodyweight quad isolation",
      difficulty: "harder"
    }
  ],

  "DB Hip Thrusts": [
    {
      name: "Barbell Hip Thrust",
      reason: "Want more load — barbell allows heavier weight",
      difficulty: "harder"
    },
    {
      name: "Glute Bridges",
      reason: "No bench — lie flat on floor",
      difficulty: "easier"
    },
    {
      name: "Single-Leg Hip Thrust",
      reason: "Build unilateral strength",
      difficulty: "harder"
    }
  ],

  "Copenhagen Plank": [
    {
      name: "Adductor Squeezes",
      reason: "Easier — squeeze ball between knees",
      difficulty: "easier"
    },
    {
      name: "Side Plank",
      reason: "No bench — standard side plank",
      difficulty: "easier"
    }
  ],

  "90/90 Hip Switches": [
    {
      name: "Seated Hip Rotations",
      reason: "Easier — rotate knees from seated",
      difficulty: "easier"
    },
    {
      name: "Fire Hydrants",
      reason: "On hands and knees — hip rotation drill",
      difficulty: "easier"
    }
  ],

  // ============================================
  // UPPER BODY — PUSH
  // ============================================

  "DB Bench Press": [
    {
      name: "Barbell Bench Press",
      reason: "Want to lift heavier — barbell allows more load",
      difficulty: "easier"
    },
    {
      name: "Push-Ups",
      reason: "No equipment — bodyweight variation",
      difficulty: "easier"
    },
    {
      name: "Floor Press",
      reason: "No bench — press from floor",
      difficulty: "same"
    }
  ],

  "Bench Press": [
    {
      name: "DB Bench Press",
      reason: "Want more range — dumbbells go deeper",
      difficulty: "same"
    },
    {
      name: "Floor Press",
      reason: "No bench — reduces shoulder stress",
      difficulty: "easier"
    }
  ],

  "Incline DB Press": [
    {
      name: "Incline Barbell Press",
      reason: "Want heavier load on upper chest",
      difficulty: "easier"
    },
    {
      name: "Pike Push-Ups",
      reason: "No equipment — bodyweight shoulder emphasis",
      difficulty: "same"
    },
    {
      name: "Flat DB Press",
      reason: "No incline bench — more chest focus",
      difficulty: "same"
    }
  ],

  "Overhead DB Press": [
    {
      name: "Barbell Overhead Press",
      reason: "Want more load — barbell is stable",
      difficulty: "same"
    },
    {
      name: "Pike Push-Ups",
      reason: "No equipment — bodyweight overhead press",
      difficulty: "easier"
    },
    {
      name: "Handstand Push-Ups",
      reason: "Advanced bodyweight — full overhead strength",
      difficulty: "harder"
    }
  ],

  "Landmine Press": [
    {
      name: "Single-Arm DB Press",
      reason: "No landmine — dumbbell similar arc pattern",
      difficulty: "same"
    },
    {
      name: "Half-Kneeling Press",
      reason: "More core demand — single-arm overhead",
      difficulty: "same"
    }
  ],

  "Lateral Raises": [
    {
      name: "Band Lateral Raises",
      reason: "No dumbbells — use resistance band",
      difficulty: "same"
    },
    {
      name: "Cable Lateral Raises",
      reason: "Constant tension through range",
      difficulty: "same"
    }
  ],

  "Tricep Pushdowns": [
    {
      name: "Overhead Tricep Extensions",
      reason: "No cable — use dumbbells overhead",
      difficulty: "same"
    },
    {
      name: "Close-Grip Push-Ups",
      reason: "No equipment — bodyweight tricep work",
      difficulty: "easier"
    },
    {
      name: "Dips",
      reason: "Want more overload — bodyweight compound",
      difficulty: "harder"
    }
  ],

  // ============================================
  // UPPER BODY — PULL
  // ============================================

  "1-Arm Row": [
    {
      name: "Barbell Row",
      reason: "Bilateral rowing — lift heavier",
      difficulty: "same"
    },
    {
      name: "Inverted Rows",
      reason: "No dumbbells — bodyweight row",
      difficulty: "same"
    }
  ],

  "1-Arm Rows": [
    {
      name: "Barbell Row",
      reason: "Bilateral rowing — lift heavier",
      difficulty: "same"
    },
    {
      name: "Inverted Rows",
      reason: "No dumbbells — bodyweight row",
      difficulty: "same"
    }
  ],

  "Single-Arm DB Row": [
    {
      name: "Barbell Row",
      reason: "Bilateral rowing — lift heavier",
      difficulty: "same"
    },
    {
      name: "Chest-Supported Row",
      reason: "No lower back fatigue",
      difficulty: "same"
    }
  ],

  "Seated Cable Row": [
    {
      name: "Barbell Row",
      reason: "No cable — barbell bent-over row",
      difficulty: "same"
    },
    {
      name: "Band Rows",
      reason: "No cable — anchor band and pull",
      difficulty: "easier"
    }
  ],

  "Seated Row": [
    {
      name: "Barbell Row",
      reason: "No machine — barbell bent-over row",
      difficulty: "same"
    },
    {
      name: "1-Arm Row",
      reason: "Build unilateral back strength",
      difficulty: "same"
    }
  ],

  "Pullups": [
    {
      name: "Band-Assisted Pullups",
      reason: "Can't do full bodyweight yet",
      difficulty: "easier"
    },
    {
      name: "Lat Pulldowns",
      reason: "No pull-up bar — cable machine",
      difficulty: "easier"
    },
    {
      name: "Weighted Pullups",
      reason: "Want more challenge — add weight",
      difficulty: "harder"
    }
  ],

  "Weighted Pullups": [
    {
      name: "Pullups",
      reason: "Reduce load — bodyweight only",
      difficulty: "easier"
    },
    {
      name: "Weighted Chin-Ups",
      reason: "Supinated grip — more bicep",
      difficulty: "same"
    }
  ],

  "Face Pulls": [
    {
      name: "Band Face Pulls",
      reason: "No cable — use resistance band",
      difficulty: "same"
    },
    {
      name: "Reverse Flyes",
      reason: "No cable — dumbbells target rear delts",
      difficulty: "same"
    }
  ],

  "Hammer Curls": [
    {
      name: "Regular DB Curls",
      reason: "Palms up — more bicep emphasis",
      difficulty: "same"
    },
    {
      name: "Band Curls",
      reason: "No dumbbells — use resistance band",
      difficulty: "easier"
    }
  ],

  // ============================================
  // CORE / ANTI-ROTATION
  // ============================================

  "Pallof Press": [
    {
      name: "Band Pallof Press",
      reason: "No cable — anchor band to stable point",
      difficulty: "same"
    },
    {
      name: "Plank with Reaches",
      reason: "No equipment — plank with arm reaches",
      difficulty: "easier"
    }
  ],

  "Rotational Band Woodchop": [
    {
      name: "Cable Woodchops",
      reason: "Cable machine — smoother resistance",
      difficulty: "same"
    },
    {
      name: "Med-ball Throws",
      reason: "Want explosive power — throw ball",
      difficulty: "harder"
    }
  ],

  "Dead Bug": [
    {
      name: "Bird Dog",
      reason: "Easier — hands and knees, opposite arm/leg",
      difficulty: "easier"
    },
    {
      name: "Hollow Body Hold",
      reason: "More anti-extension challenge",
      difficulty: "harder"
    }
  ],

  // ============================================
  // GOLF-SPECIFIC: SPEED TRAINING
  // ============================================

  "Max Intent Swings (Driver)": [
    {
      name: "Upside-Down Club Swings",
      reason: "No speed sticks — hold driver by head, swing handle (lighter and faster)",
      difficulty: "same"
    },
    {
      name: "Alignment Stick Swings",
      reason: "No speed sticks — use alignment stick for light fast swings",
      difficulty: "same"
    }
  ],

  "Light Stick Swings": [
    {
      name: "Upside-Down Club Swings",
      reason: "No speed sticks — hold driver by head, swing handle",
      difficulty: "same"
    },
    {
      name: "Alignment Stick Swings",
      reason: "No speed sticks — alignment stick is light and whippy",
      difficulty: "same"
    },
    {
      name: "Empty Swing (No Club)",
      reason: "Lightest option — focus on speed without resistance",
      difficulty: "easier"
    }
  ],

  "Heavy Stick Swings": [
    {
      name: "Weighted Club Swings",
      reason: "No heavy stick — use weighted training club",
      difficulty: "same"
    },
    {
      name: "Two-Club Swings",
      reason: "No weights — swing two irons together for resistance",
      difficulty: "same"
    },
    {
      name: "Driver with Head Cover",
      reason: "Add resistance — keep head cover on for drag",
      difficulty: "same"
    }
  ],

  // ============================================
  // GOLF-SPECIFIC: TECHNIQUE
  // ============================================

  "Slow-Mo Transition Drills": [
    {
      name: "Pause-at-Top Drill",
      reason: "Shorter version — pause 1 second at top",
      difficulty: "easier"
    },
    {
      name: "Step-Through Drill",
      reason: "Add footwork — step through after impact",
      difficulty: "same"
    }
  ],

  "Lead Arm Only Swings": [
    {
      name: "Trail Arm Only Swings",
      reason: "Work other side — right arm only for righties",
      difficulty: "same"
    },
    {
      name: "Pump Drill",
      reason: "Lead arm — pump to top 3x then swing",
      difficulty: "same"
    }
  ],

  // ============================================
  // POWER / ROTATIONAL
  // ============================================

  "Med-ball Throws": [
    {
      name: "Rotational Band Woodchop",
      reason: "No medicine ball — band gives rotation pattern",
      difficulty: "easier"
    },
    {
      name: "Med-ball Slams",
      reason: "Want overhead power — slam ball down",
      difficulty: "same"
    },
    {
      name: "Shot Put Throws",
      reason: "Explosive chest pass against wall",
      difficulty: "same"
    }
  ],
};

/**
 * Get alternative exercises for a given exercise name.
 * Returns an empty array if no alternatives are defined.
 */
export function getExerciseAlternatives(exerciseName: string): ExerciseAlternative[] {
  // Try exact match first
  if (EXERCISE_ALTERNATIVES[exerciseName]) {
    return EXERCISE_ALTERNATIVES[exerciseName];
  }

  // Try case-insensitive match
  const lowerName = exerciseName.toLowerCase();
  for (const [key, alternatives] of Object.entries(EXERCISE_ALTERNATIVES)) {
    if (key.toLowerCase() === lowerName) {
      return alternatives;
    }
  }

  // Try partial match (useful when users rename exercises)
  for (const [key, alternatives] of Object.entries(EXERCISE_ALTERNATIVES)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return alternatives;
    }
  }

  return [];
}

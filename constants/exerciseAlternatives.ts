// Exercise alternatives for swapping movements
// Organized by exercise name with 2-3 alternatives per exercise

export interface ExerciseAlternative {
  name: string;
  reason: string;
}

export const EXERCISE_ALTERNATIVES: Record<string, ExerciseAlternative[]> = {
  // Monday - Upper Hypertrophy
  "Incline DB Press": [
    { name: "Flat DB Press", reason: "More chest focus, less shoulder" },
    { name: "Barbell Incline Press", reason: "More weight, requires spotter" },
    { name: "Push-Ups (Weighted)", reason: "No equipment needed" }
  ],
  "Seated Cable Row": [
    { name: "Bent-Over Barbell Row", reason: "Builds more back thickness" },
    { name: "T-Bar Row", reason: "Better lat activation" },
    { name: "Machine Row", reason: "Safer for beginners" }
  ],
  "Lateral Raises": [
    { name: "Cable Lateral Raises", reason: "Constant tension" },
    { name: "Arnold Press", reason: "Compound movement, saves time" },
    { name: "Upright Rows", reason: "More weight, traps involvement" }
  ],
  "Face Pulls": [
    { name: "Reverse Pec Deck", reason: "Better isolation" },
    { name: "Band Pull-Aparts", reason: "Can do anywhere" },
    { name: "Rear Delt Flyes", reason: "More rear delt focus" }
  ],
  "Tricep Pushdowns": [
    { name: "Overhead Tricep Extension", reason: "Long head emphasis" },
    { name: "Dips", reason: "More weight, compound" },
    { name: "Close-Grip Bench", reason: "Strength builder" }
  ],
  "Hammer Curls": [
    { name: "Barbell Curls", reason: "Classic bicep builder" },
    { name: "Cable Curls", reason: "Constant tension" },
    { name: "Preacher Curls", reason: "Better peak contraction" }
  ],

  // Tuesday - Lower Body: Force & Rotation
  "Trap Bar Deadlift": [
    { name: "Conventional Deadlift", reason: "Classic posterior chain" },
    { name: "Romanian Deadlift", reason: "More hamstring focus" },
    { name: "Hex Bar Deadlift", reason: "Same as trap bar" }
  ],
  "Lateral Goblet Lunges": [
    { name: "Cossack Squats", reason: "More mobility challenge" },
    { name: "Side Lunges", reason: "Bodyweight option" },
    { name: "Lateral Step-Ups", reason: "Unilateral power" }
  ],
  "Pallof Press": [
    { name: "Cable Anti-Rotation Press", reason: "Standing version" },
    { name: "Band Pallof Press", reason: "Can do at home" },
    { name: "Landmine Anti-Rotation", reason: "More core challenge" }
  ],
  "Single Leg RDL": [
    { name: "B-Stance RDL", reason: "Easier balance" },
    { name: "Bulgarian RDL", reason: "More stretch" },
    { name: "Kickstand RDL", reason: "Modified single leg" }
  ],
  "Rotational Band Woodchop": [
    { name: "Cable Woodchops", reason: "Constant tension" },
    { name: "Medicine Ball Slams", reason: "Power development" },
    { name: "Russian Twists", reason: "Core rotation" }
  ],

  // Thursday - Upper Strength
  "Barbell Bench Press": [
    { name: "DB Bench Press", reason: "Better range of motion" },
    { name: "Close-Grip Bench", reason: "More triceps" },
    { name: "Floor Press", reason: "Shorter range, joint-friendly" }
  ],
  "Weighted Pullups": [
    { name: "Lat Pulldowns", reason: "Easier to load" },
    { name: "Assisted Pullups", reason: "Building strength" },
    { name: "Chin-Ups", reason: "More bicep involvement" }
  ],
  "Overhead DB Press": [
    { name: "Barbell OHP", reason: "More weight" },
    { name: "Arnold Press", reason: "More shoulder rotation" },
    { name: "Push Press", reason: "Power component" }
  ],
  "Single Arm DB Row": [
    { name: "Kroc Rows", reason: "Heavy, momentum allowed" },
    { name: "Chest-Supported Row", reason: "No lower back fatigue" },
    { name: "Pendlay Rows", reason: "Power from floor" }
  ],
  "Landmine Press": [
    { name: "Half-Kneeling Press", reason: "More core demand" },
    { name: "Viking Press", reason: "Overhead pressing" },
    { name: "Meadows Press", reason: "Chest and shoulder" }
  ],
  "Dead Bug": [
    { name: "Hollow Body Hold", reason: "Isometric core" },
    { name: "Bird Dog", reason: "Back-friendly option" },
    { name: "Ab Wheel Rollout", reason: "More advanced" }
  ],

  // Friday - Lower Body: Hypertrophy & Engine
  "Heel-Elevated Goblet Squat": [
    { name: "Front Squat", reason: "More weight capacity" },
    { name: "Goblet Squat", reason: "No heel elevation" },
    { name: "Leg Press", reason: "Machine-based, safer" }
  ],
  "Bulgarian Split Squats": [
    { name: "Reverse Lunges", reason: "Easier on knees" },
    { name: "Walking Lunges", reason: "Dynamic movement" },
    { name: "Step-Ups", reason: "Lower skill requirement" }
  ],
  "DB Hip Thrusts": [
    { name: "Barbell Hip Thrust", reason: "More weight" },
    { name: "Glute Bridge", reason: "Easier setup" },
    { name: "Single Leg Hip Thrust", reason: "Unilateral focus" }
  ],
  "Copenhagen Plank": [
    { name: "Side Plank", reason: "Easier progression" },
    { name: "Adductor Machine", reason: "Direct adductor work" },
    { name: "Side-Lying Leg Raises", reason: "Bodyweight option" }
  ],
  "90/90 Hip Switches": [
    { name: "Shin Box Switches", reason: "Same movement" },
    { name: "Pigeon Stretch", reason: "Static hip mobility" },
    { name: "Fire Hydrants", reason: "Hip rotation drill" }
  ]
};

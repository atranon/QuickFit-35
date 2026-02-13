
import { PlanData, WorkoutPlanFrequency, Exercise } from './types';

export const COACH_AUDIT = {
    status: "Elite Performance Optimized",
    assessment: "Scientific programming applied. Golf plans focus on Force-Velocity profiling. Powerbuilding plans prioritize Antagonistic Supersets for structural hypertrophy and CNS sparing.",
    recommendations: [
        "Force Production: On 'Force' days, move the weight as fast as possible on the concentric (up) phase.",
        "CNS Management: Speed swings must happen at 100% intent. If you feel 95%, stop the session.",
        "Hypertrophy: On 'Engine' or 'Hypertrophy' days, focus on the stretch (eccentric) to maximize mechanical tension.",
        "Recovery: Speed training is neural. 48 hours between 'Max Intent' sessions is mandatory."
    ]
};

const SPEED_BLOCK_MAX: Exercise[] = [
    { id: "sp1", group: "Max Intent", order: "1", name: "Max Intent Swings (Driver)", defaultCategory: "Speed", sets: 4, reps: "5-8", rest: 120, type: 'speed' },
    { id: "sp2", group: "Overspeed", order: "2", name: "Light Stick Swings (Overspeed)", defaultCategory: "Velocity", sets: 3, reps: "10", rest: 60, type: 'speed' }
];

const TECH_BLOCK_SEQUENCE: Exercise[] = [
    { id: "te1", group: "Patterning", order: "1", name: "Slow-Mo Transition Drills", defaultCategory: "Technique", sets: 2, reps: "15", rest: 30, type: 'technique' },
    { id: "te2", group: "Sequence", order: "2", name: "Rehearsal Impact Pauses", defaultCategory: "Sequence", sets: 2, reps: "15", rest: 30, type: 'technique' }
];

export const GOLF_PLANS: Record<WorkoutPlanFrequency, PlanData> = {
    '2x': {
        id: '2x',
        name: 'Maintenance & Speed',
        description: '2 Strength + 2 Speed. Optimized for in-season performance.',
        schedule: {
            tuesday: {
                title: "Strength: Force A", subtitle: "Full Body Ground Force • 40m", color: "border-blue-500", type: 'strength',
                exercises: [
                    { id: "g2a1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "3-5", rest: 150 },
                    { id: "g2a2", group: "Upper", order: "2", name: "DB Bench Press", defaultCategory: "Push", sets: 3, reps: "8-10", rest: 60 },
                    { id: "g2a3", group: "Core", order: "3", name: "Pallof Press", defaultCategory: "Anti-Rotation", sets: 3, reps: "12/side", rest: 45 },
                    ...TECH_BLOCK_SEQUENCE
                ]
            },
            thursday: {
                title: "Strength: Power B", subtitle: "Rotational Dynamics • 40m", color: "border-purple-500", type: 'strength',
                exercises: [
                    { id: "g2b1", group: "Main", order: "1", name: "Goblet Squats", defaultCategory: "Lower", sets: 3, reps: "8-10", rest: 90 },
                    { id: "g2b2", group: "Upper", order: "2", name: "1-Arm Row", defaultCategory: "Pull", sets: 3, reps: "10/side", rest: 60 },
                    { id: "g2b3", group: "Core", order: "3", name: "Dead Bug", defaultCategory: "Stability", sets: 3, reps: "15", rest: 45 },
                    ...TECH_BLOCK_SEQUENCE
                ]
            },
            wednesday: { title: "Speed Session", subtitle: "Max Intent • 25m", color: "border-amber-500", type: 'speed', exercises: SPEED_BLOCK_MAX },
            friday: { title: "Speed Session", subtitle: "Velocity Output • 20m", color: "border-amber-500", type: 'speed', exercises: [SPEED_BLOCK_MAX[0]] }
        }
    },
    '3x': {
        id: '3x',
        name: 'The Speed Engine',
        description: 'High frequency speed and strength. The pro-standard.',
        schedule: {
            monday: {
                title: "Lower Force + Tech", subtitle: "Ground Load Focus • 45m", color: "border-green-500", type: 'strength',
                exercises: [
                    { id: "g3a1", group: "Force", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 4, reps: "3-5", rest: 150 },
                    { id: "g3a2", group: "Stability", order: "2", name: "Walking Lunges", defaultCategory: "Lead Leg", sets: 3, reps: "8/leg", rest: 60 },
                    ...TECH_BLOCK_SEQUENCE
                ]
            },
            tuesday: { title: "Speed Session", subtitle: "CNS Priming • 25m", color: "border-amber-500", type: 'speed', exercises: SPEED_BLOCK_MAX },
            wednesday: {
                title: "Upper Force + Tech", subtitle: "Rotational Push/Pull • 45m", color: "border-blue-500", type: 'strength',
                exercises: [
                    { id: "g3b1", group: "Push", order: "1", name: "DB Bench Press", defaultCategory: "Upper", sets: 3, reps: "5-8", rest: 120 },
                    { id: "g3b2", group: "Pull", order: "2", name: "1-Arm Rows", defaultCategory: "Upper", sets: 3, reps: "8-10", rest: 90 },
                    { id: "g3b3", group: "Core", order: "3", name: "Pallof Press", defaultCategory: "Anti-Rotation", sets: 3, reps: "12/side", rest: 60 }
                ]
            },
            thursday: { title: "Speed + Sequence", subtitle: "Max Effort Patterning • 30m", color: "border-emerald-500", type: 'speed', exercises: [...SPEED_BLOCK_MAX, ...TECH_BLOCK_SEQUENCE] },
            friday: {
                title: "Power Dynamics", subtitle: "Explosive Transfer • 45m", color: "border-purple-500", type: 'strength',
                exercises: [
                    { id: "g3c1", group: "Power", order: "1", name: "Med-ball Rotational Throws", defaultCategory: "Power", sets: 4, reps: "6/side", rest: 60 },
                    { id: "g3c2", group: "Power", order: "2", name: "Box Jumps", defaultCategory: "Vertical", sets: 3, reps: "5", rest: 90 },
                    { id: "g3c3", group: "Main", order: "3", name: "Front Squat", defaultCategory: "Strength", sets: 3, reps: "5", rest: 120 }
                ]
            },
            saturday: { title: "Speed Play", subtitle: "Play Fast Focus • 20m", color: "border-amber-500", type: 'speed', exercises: [SPEED_BLOCK_MAX[0]] }
        }
    },
    '4x': {
        id: '4x',
        name: 'Hybrid Performance',
        description: 'Splits for strength + 2 specialized speed sessions.',
        schedule: {
            monday: { title: "Upper Hypertrophy", subtitle: "Volume Pump • 40m", color: "border-blue-500", type: 'strength', exercises: [{ id: "g4a1", group: "Main", order: "1", name: "Incline DB Press", defaultCategory: "Push", sets: 3, reps: "10-12", rest: 60 }, { id: "g4a2", group: "Main", order: "2", name: "Seated Row", defaultCategory: "Pull", sets: 3, reps: "10-12", rest: 60 }, ...TECH_BLOCK_SEQUENCE] },
            tuesday: { title: "Lower Force + Speed", subtitle: "Neural Load • 45m", color: "border-green-500", type: 'strength', exercises: [SPEED_BLOCK_MAX[0], { id: "g4b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "5-8", rest: 120 }] },
            thursday: { title: "Upper Power + Speed", subtitle: "Vertical Force • 45m", color: "border-purple-500", type: 'strength', exercises: [SPEED_BLOCK_MAX[1], { id: "g4c1", group: "Main", order: "1", name: "Weighted Pullups", defaultCategory: "Upper", sets: 3, reps: "6-8", rest: 90 }] },
            friday: { title: "Lower Stability", subtitle: "Braking Force • 35m", color: "border-orange-500", type: 'strength', exercises: [{ id: "g4d1", group: "Main", order: "1", name: "Bulgarian Split Squat", defaultCategory: "Stability", sets: 3, reps: "10/leg", rest: 60 }, { id: "g4d2", group: "Core", order: "2", name: "Copenhagen Plank", defaultCategory: "Core", sets: 2, reps: "30s", rest: 45 }] }
        }
    },
    '5x': {
        id: '5x',
        name: 'Elite Training Lab',
        description: '5 Days of high-intensity performance coaching.',
        schedule: {
            monday: { title: "Lower: Pure Force", subtitle: "Max Ground Load • 40m", color: "border-green-500", type: 'strength', exercises: [{ id: "g5a1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Power", sets: 4, reps: "3-5", rest: 150 }] },
            tuesday: { title: "Upper: Push + Speed", subtitle: "Vertical Drive • 45m", color: "border-blue-500", type: 'strength', exercises: [SPEED_BLOCK_MAX[0], { id: "g5b1", group: "Main", order: "1", name: "DB Press", defaultCategory: "Push", sets: 3, reps: "8-10", rest: 90 }] },
            wednesday: { title: "Lead Leg Stability", subtitle: "Sequence Logic • 40m", color: "border-orange-500", type: 'strength', exercises: [...TECH_BLOCK_SEQUENCE, { id: "g5c1", group: "Main", order: "1", name: "Split Squat", defaultCategory: "Stability", sets: 3, reps: "10/leg", rest: 60 }] },
            thursday: { title: "Upper: Pull + Speed", subtitle: "Horizontal Pull • 45m", color: "border-purple-500", type: 'strength', exercises: [SPEED_BLOCK_MAX[1], { id: "g5d1", group: "Main", order: "1", name: "1-Arm Row", defaultCategory: "Pull", sets: 3, reps: "10/side", rest: 60 }] },
            friday: { title: "Full Body Dynamic", subtitle: "X-Factor Focus • 40m", color: "border-indigo-500", type: 'strength', exercises: [{ id: "g5e1", group: "Power", order: "1", name: "Box Jumps", defaultCategory: "Vertical", sets: 3, reps: "5", rest: 90 }, { id: "g5e2", group: "Power", order: "2", name: "Med-ball Toss", defaultCategory: "Rotational", sets: 3, reps: "6/side", rest: 60 }] }
        }
    }
};

export const POWERBUILDING_PLANS: Record<WorkoutPlanFrequency, PlanData> = {
    '2x': {
        id: '2x',
        name: 'Full Body Power',
        description: 'Scientific consolidation of your 4-day split into 2 mega-sessions.',
        schedule: {
            tuesday: {
                title: "Upper Strength & Lower Force", subtitle: "Historical Compounds • 45m", color: "border-blue-600",
                exercises: [
                    { id: "p2a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Push", sets: 3, reps: "6-8", rest: 90 },
                    { id: "p2a2", group: "Superset 1", order: "2", name: "Pullups / Lat Pulldown", defaultCategory: "Pull", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p2a3", group: "Main", order: "3", name: "Trap Bar Deadlift", defaultCategory: "Force", sets: 4, reps: "3-5", rest: 150 },
                    { id: "p2a4", group: "Superset 2", order: "4", name: "Overhead DB Press", defaultCategory: "Push", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p2a5", group: "Superset 2", order: "5", name: "Single-Arm DB Row", defaultCategory: "Pull", sets: 3, reps: "10/side", rest: 60 },
                ]
            },
            thursday: {
                title: "Lower Engine & Upper Pump", subtitle: "Squat Focus • 45m", color: "border-purple-600",
                exercises: [
                    { id: "p2b1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Lower", sets: 3, reps: "6-8", rest: 120 },
                    { id: "p2b2", group: "Superset 1", order: "2", name: "Incline DB Press", defaultCategory: "Push", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p2b3", group: "Superset 1", order: "3", name: "Seated Cable Row", defaultCategory: "Pull", sets: 3, reps: "10-12", rest: 60 },
                    { id: "p2b4", group: "Superset 2", order: "4", name: "Lateral Raises", defaultCategory: "Delt", sets: 3, reps: "12-15", rest: 45 },
                    { id: "p2b5", group: "Superset 2", order: "5", name: "Hammer Curls", defaultCategory: "Arm", sets: 3, reps: "12-15", rest: 45 },
                ]
            }
        }
    },
    '3x': {
        id: '3x',
        name: 'The Strength Mix',
        description: 'A 3-day rotation focusing on the core movements of your split.',
        schedule: {
            monday: {
                title: "Upper Strength", subtitle: "Horizontal Power • 45m", color: "border-blue-500",
                exercises: [
                    { id: "p3a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 },
                    { id: "p3a2", group: "Superset 1", order: "2", name: "Pullups / Lat Pulldown", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p3a3", group: "Superset 2", order: "3", name: "Overhead DB Press", defaultCategory: "Shoulders", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p3a4", group: "Superset 2", order: "4", name: "Single-Arm DB Row", defaultCategory: "Back", sets: 3, reps: "10/side", rest: 60 },
                    { id: "p3a5", group: "Superset 3", order: "5", name: "Landmine Press", defaultCategory: "Shoulders", sets: 3, reps: "10/side", rest: 60 },
                    { id: "p3a6", group: "Superset 3", order: "6", name: "Dead Bug", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 45 },
                ]
            },
            wednesday: {
                title: "Lower Force & Squat", subtitle: "Hinge Focus • 45m", color: "border-green-500",
                exercises: [
                    { id: "p3b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Hinge", sets: 4, reps: "3-5", rest: 150 },
                    { id: "p3b2", group: "Superset 1", order: "2", name: "Heel-Elevated Front Squat", defaultCategory: "Quads", sets: 3, reps: "6-8", rest: 120 },
                    { id: "p3b3", group: "Superset 1", order: "3", name: "Pallof Press", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 60 },
                    { id: "p3b4", group: "Superset 2", order: "4", name: "Leg Extensions", defaultCategory: "Quads", sets: 3, reps: "12-15", rest: 60 },
                    { id: "p3b5", group: "Superset 2", order: "5", name: "DB Hip Thrusts", defaultCategory: "Glutes", sets: 3, reps: "12", rest: 60 },
                ]
            },
            friday: {
                title: "Hypertrophy Pump", subtitle: "Volume Focus • 45m", color: "border-purple-500",
                exercises: [
                    { id: "p3c1", group: "Superset 1", order: "1", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p3c2", group: "Superset 1", order: "2", name: "Seated Cable Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 },
                    { id: "p3c3", group: "Superset 2", order: "3", name: "Lateral Raises", defaultCategory: "Shoulders", sets: 3, reps: "15", rest: 45 },
                    { id: "p3c4", group: "Superset 2", order: "4", name: "Tricep Pushdowns", defaultCategory: "Arms", sets: 3, reps: "15", rest: 45 },
                    { id: "p3c5", group: "Superset 2", order: "5", name: "Hammer Curls", defaultCategory: "Arms", sets: 3, reps: "15", rest: 45 },
                ]
            }
        }
    },
    '4x': {
        id: '4x',
        name: 'The Power Split (Original)',
        description: 'Your scientific 4-day rotation. Re-implemented exactly as logged.',
        schedule: {
            monday: {
                title: "Upper Strength", subtitle: "Bench & Pull Focus • 45m", color: "border-blue-500",
                exercises: [
                    { id: "p4a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 },
                    { id: "p4a2", group: "Superset 1", order: "2", name: "Pullups / Lat Pulldown", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p4a3", group: "Superset 2", order: "3", name: "Overhead DB Press", defaultCategory: "Shoulders", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p4a4", group: "Superset 2", order: "4", name: "Single-Arm DB Row", defaultCategory: "Back", sets: 3, reps: "10/side", rest: 60 },
                    { id: "p4a5", group: "Superset 3", order: "5", name: "Landmine Press", defaultCategory: "Shoulders", sets: 3, reps: "10/side", rest: 60 },
                    { id: "p4a6", group: "Superset 3", order: "6", name: "Dead Bug", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 45 },
                ]
            },
            tuesday: {
                title: "Lower Body: Force", subtitle: "Hinge & Rotation • 45m", color: "border-green-500",
                exercises: [
                    { id: "p4b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 4, reps: "3-5", rest: 150 },
                    { id: "p4b2", group: "Superset 1", order: "2", name: "Lateral Lunges", defaultCategory: "Lower", sets: 3, reps: "10/leg", rest: 60 },
                    { id: "p4b3", group: "Superset 1", order: "3", name: "Pallof Press", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 60 },
                    { id: "p4b4", group: "Superset 2", order: "4", name: "Leg Extensions", defaultCategory: "Quads", sets: 3, reps: "12-15", rest: 60 },
                    { id: "p4b5", group: "Superset 2", order: "5", name: "Rotational Band Woodchop", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 45 },
                ]
            },
            thursday: {
                title: "Upper Hypertrophy", subtitle: "Incline & Pump • 40m", color: "border-purple-500",
                exercises: [
                    { id: "p4c1", group: "Superset 1", order: "1", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "8-10", rest: 90 },
                    { id: "p4c2", group: "Superset 1", order: "2", name: "Seated Cable Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 },
                    { id: "p4c3", group: "Superset 2", order: "3", name: "Lateral Raises", defaultCategory: "Shoulders", sets: 3, reps: "12-15", rest: 45 },
                    { id: "p4c4", group: "Superset 2", order: "4", name: "Face Pulls", defaultCategory: "Back", sets: 3, reps: "15", rest: 45 },
                    { id: "p4c5", group: "Superset 3", order: "5", name: "Tricep Pushdowns", defaultCategory: "Arms", sets: 3, reps: "12-15", rest: 45 },
                    { id: "p4c6", group: "Superset 3", order: "6", name: "Hammer Curls", defaultCategory: "Arms", sets: 3, reps: "12-15", rest: 45 },
                ]
            },
            friday: {
                title: "Lower Body: Engine", subtitle: "Squat & Stability • 40m", color: "border-orange-500",
                exercises: [
                    { id: "p4d1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Lower", sets: 3, reps: "6-8", rest: 120 },
                    { id: "p4d2", group: "Superset 1", order: "2", name: "Leg Extensions (Rehab)", defaultCategory: "Quads", sets: 3, reps: "15", rest: 60 },
                    { id: "p4d3", group: "Superset 1", order: "3", name: "DB Hip Thrusts", defaultCategory: "Glutes", sets: 3, reps: "12", rest: 60 },
                    { id: "p4d4", group: "Superset 2", order: "4", name: "Copenhagen Plank", defaultCategory: "Core", sets: 3, reps: "30s/side", rest: 60 },
                    { id: "p4d5", group: "Superset 2", order: "5", name: "90/90 Hip Switches", defaultCategory: "Mobility", sets: 3, reps: "10/side", rest: 45 },
                ]
            }
        }
    },
    '5x': {
        id: '5x',
        name: 'Hypertrophy Max',
        description: 'Advanced volume expansion. Your 4-day split + 1 mobility/arm day.',
        schedule: {
            monday: { title: "Upper Strength", subtitle: "Bench Focus • 45m", color: "border-blue-500", exercises: [{ id: "p5a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 }, { id: "p5a2", group: "Superset 1", order: "2", name: "Pullups / Lat Pulldown", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 }] },
            tuesday: { title: "Lower Force", subtitle: "Hinge Focus • 45m", color: "border-green-500", exercises: [{ id: "p5b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 4, reps: "3-5", rest: 150 }] },
            wednesday: { title: "Upper Hypertrophy", subtitle: "Vertical Pull Focus • 40m", color: "border-indigo-500", exercises: [{ id: "p5c1", group: "Main", order: "1", name: "Weighted Pullups", defaultCategory: "Back", sets: 3, reps: "6-8", rest: 90 }, { id: "p5c2", group: "Superset 1", order: "2", name: "OHP", defaultCategory: "Shoulders", sets: 3, reps: "8-10", rest: 90 }] },
            thursday: { title: "Pump & Accessory", subtitle: "Arms / Delts / Abs • 35m", color: "border-amber-500", exercises: [{ id: "p5d1", group: "Superset 1", order: "1", name: "Lateral Raises", defaultCategory: "Delts", sets: 3, reps: "15", rest: 45 }, { id: "p5d2", group: "Superset 1", order: "2", name: "Hammer Curls", defaultCategory: "Arms", sets: 3, reps: "12", rest: 45 }] },
            friday: { title: "Lower Engine", subtitle: "Squat Focus • 40m", color: "border-orange-500", exercises: [{ id: "p5e1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Lower", sets: 3, reps: "6-8", rest: 120 }] }
        }
    }
};

export const PLANS = {
    golf: GOLF_PLANS,
    powerbuilding: POWERBUILDING_PLANS
};

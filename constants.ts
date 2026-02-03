import { Schedule } from './types';

export const COACH_AUDIT = {
    status: "Partially Optimal -> Elite Performance Optimized",
    assessment: "The original program lacked Frontal and Transverse plane specificity required for a high-velocity golf swing. By integrating 'Antagonistic Supersets' for the upper body and 'Power-Hypertrophy Complexes' for the lower body, we maximize metabolic stress for muscle growth while developing the rotational force-transfer required for 120+ mph clubhead speed. We have replaced sagittal-only movements with multi-planar stability work to enhance the 'Braking Force' of the lead leg.",
    recommendations: [
        "Kinetic Linking: On rotational movements (Woodchops/Pallof), focus on the hip-to-shoulder separation (The X-Factor).",
        "Lead Leg Stability: During unilateral work, imagine 'planting' into the ground to create an immovable post for your swing.",
        "Strict Rest: To maintain the 35-min cap, transitions between supersets must be <30 seconds.",
        "Tempo Control: Use a 3-0-X-1 tempo (3s down, explode up) on compounds to maximize fast-twitch fiber recruitment."
    ]
};

export const SCHEDULE: Schedule = {
    monday: {
        title: "Upper Hypertrophy",
        subtitle: "Push/Pull Pump • 30 Mins",
        color: "border-purple-500",
        exercises: [
            { id: "m1a", group: "Superset 1", order: "1A", name: "Incline DB Press", defaultCategory: "Chest/Shoulders", sets: 3, reps: "10-12", rest: 15 },
            { id: "m1b", group: "Superset 1", order: "1B", name: "Seated Cable Row", defaultCategory: "Back - Horizontal Pull", sets: 3, reps: "10-12", rest: 60 },
            { id: "m2a", group: "Superset 2", order: "2A", name: "Lateral Raises", defaultCategory: "Medial Delts", sets: 3, reps: "12-15", rest: 15 },
            { id: "m2b", group: "Superset 2", order: "2B", name: "Face Pulls", defaultCategory: "Posterior Chain / Cuff", sets: 3, reps: "15-20", rest: 60 },
            { id: "m3a", group: "Superset 3", order: "3A", name: "Tricep Pushdowns", defaultCategory: "Triceps", sets: 2, reps: "12-15", rest: 0 },
            { id: "m3b", group: "Superset 3", order: "3B", name: "Hammer Curls", defaultCategory: "Forearms/Biceps", sets: 2, reps: "12-15", rest: 45 },
        ]
    },
    tuesday: {
        title: "Lower Body: Force & Rotation",
        subtitle: "Swing Speed Engine • 33 Mins",
        color: "border-green-500",
        exercises: [
            { id: "t1", group: "Main Lift", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Ground Force Production", sets: 3, reps: "5-8", rest: 120 },
            { id: "t2a", group: "Superset 2", order: "2A", name: "Lateral Goblet Lunges", defaultCategory: "Frontal Plane Stability", sets: 2, reps: "10/leg", rest: 30 },
            { id: "t2b", group: "Superset 2", order: "2B", name: "Pallof Press", defaultCategory: "Anti-Rotation Core", sets: 2, reps: "12/side", rest: 60 },
            { id: "t3a", group: "Superset 3", order: "3A", name: "Single Leg RDL", defaultCategory: "Posterior Chain / Balance", sets: 2, reps: "10/leg", rest: 15 },
            { id: "t3b", group: "Superset 3", order: "3B", name: "Rotational Band Woodchop", defaultCategory: "Transverse Power", sets: 2, reps: "12/side", rest: 45 },
        ]
    },
    thursday: {
        title: "Upper Strength",
        subtitle: "Vertical Power • 32 Mins",
        color: "border-blue-500",
        exercises: [
            { id: "th1a", group: "Superset 1", order: "1A", name: "Barbell Bench Press", defaultCategory: "Horizontal Push", sets: 3, reps: "6-8", rest: 30 },
            { id: "th1b", group: "Superset 1", order: "1B", name: "Weighted Pullups", defaultCategory: "Vertical Pull", sets: 3, reps: "6-8", rest: 90 },
            { id: "th2a", group: "Superset 2", order: "2A", name: "Overhead DB Press", defaultCategory: "Vertical Push", sets: 3, reps: "8-10", rest: 15 },
            { id: "th2b", group: "Superset 2", order: "2B", name: "Single Arm DB Row", defaultCategory: "Horizontal Pull", sets: 3, reps: "10/side", rest: 60 },
            { id: "th3a", group: "Superset 3", order: "3A", name: "Landmine Press", defaultCategory: "Rotational Push", sets: 2, reps: "10/side", rest: 15 },
            { id: "th3b", group: "Superset 3", order: "3B", name: "Dead Bug", defaultCategory: "Core Stability", sets: 2, reps: "15", rest: 45 },
        ]
    },
    friday: {
        title: "Lower Body: Hypertrophy & Engine",
        subtitle: "Braking Force & Glutes • 34 Mins",
        color: "border-orange-500",
        exercises: [
            { id: "f1", group: "Main Lift", order: "1", name: "Heel-Elevated Goblet Squat", defaultCategory: "Quad Hypertrophy", sets: 3, reps: "10-12", rest: 90 },
            { id: "f2a", group: "Superset 2", order: "2A", name: "Bulgarian Split Squats", defaultCategory: "Lead Leg Stability", sets: 2, reps: "10/leg", rest: 30 },
            { id: "f2b", group: "Superset 2", order: "2B", name: "DB Hip Thrusts", defaultCategory: "Glute Power", sets: 2, reps: "12-15", rest: 60 },
            { id: "f3a", group: "Superset 3", order: "3A", name: "Copenhagen Plank", defaultCategory: "Adductor/Groin Health", sets: 2, reps: "30s/side", rest: 15 },
            { id: "f3b", group: "Superset 3", order: "3B", name: "90/90 Hip Switches", defaultCategory: "Golf Hip Mobility", sets: 2, reps: "10/side", rest: 45 },
        ]
    }
};
# QuickFit Golf 35

Golf-specific strength training app designed to add yards off the tee. 4 focused workouts per week, 35 minutes each.

## Features

- **4-Day Training Split** - Science-backed workout programs (2x, 3x, 4x, 5x frequency options)
- **Golf-Specific & Powerbuilding Programs** - Choose between explosive golf speed training or hypertrophy-focused powerbuilding
- **Progressive Overload Tracking** - Log sets, reps, weight with automatic PR detection
- **Smart Rest Timer** - Built-in countdown timer with audio alerts
- **Workout History** - Complete log of all sessions with detailed stats
- **Progress Charts** - Visual analytics powered by Recharts
- **Cloud Sync** - Backup/restore data via JSONBin.io
- **User Preferences** - Customize fitness level, goals, weight units (lbs/kg)
- **PWA Ready** - Install as a mobile app with offline support
- **Heart Rate Monitoring** - Connect Bluetooth HR devices during workouts
- **Feedback System** - Integrated Tally form for user feedback

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend:** Express.js (SSR)
- **Database:** Supabase
- **Build:** Vite + esbuild
- **Storage:** localStorage + cloud sync (JSONBin)

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (optional, for database features)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Run development server
npm run dev
```

Visit `http://localhost:5173` (Vite default port)

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn_here
```

**Note:** `.env` is gitignored to protect your credentials.

### Getting Your Sentry DSN
1. Create a free account at [sentry.io](https://sentry.io)
2. Create a new project (select "React")
3. Copy your DSN from Project Settings → Client Keys (DSN)
4. Add it to your `.env` file

## Project Structure

```
QuickFit-35/
├── components/          # React components
│   ├── WorkoutView.tsx
│   ├── HistoryView.tsx
│   ├── ProgressView.tsx
│   ├── SettingsView.tsx
│   └── ...
├── constants/           # Workout plans & exercise data
├── services/            # API services (storage, BLE, Gemini)
├── utils/               # Helper functions
├── lib/                 # Supabase client
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
└── server.ts            # Express SSR server
```

## Key Features Explained

### Workout Programs
- **Golf Speed:** Explosive power for rotational force & clubhead speed
- **Powerbuilding:** Hypertrophy-focused strength building

### Frequency Options
- **2x/week** - Minimal effective dose
- **3x/week** - Balanced approach
- **4x/week** - Optimal (recommended)
- **5x/week** - Advanced volume

### Cloud Sync
Backup your workout data to JSONBin.io:
1. Get a free API key from [jsonbin.io](https://jsonbin.io)
2. Create a bin
3. Add credentials in Settings → Sync & Backup

## Scripts

```bash
npm run dev       # Start development server (tsx + Vite)
npm run build     # Build for production
npm start         # Run production server
npm run preview   # Preview production build
npm run lint      # TypeScript type checking
```

## Contributing

This is a personal project, but feedback is welcome! Use the in-app feedback button or open an issue.

## License

Private project - All rights reserved.

---

**Built with ❤️ for golfers who want to bomb drives**

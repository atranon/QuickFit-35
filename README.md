<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4f397747-cd44-4c72-99c2-7e66316d283e

## Run Locally

**Prerequisites:**  Node.js


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

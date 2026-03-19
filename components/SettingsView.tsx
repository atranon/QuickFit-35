import React, { useState } from 'react';
import { ArrowLeft, Cloud, BookOpen, Mail, Info, Trash2, AlertCircle, User, RefreshCw, Bug } from 'lucide-react';
import SyncModal from './SyncModal';
import * as Sentry from '@sentry/react';

interface SettingsViewProps {
  onBack: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
  onShowPreferences?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onReset, onShowTutorial, onShowPreferences }) => {
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  const confirmReset = () => {
    if (window.confirm("Are you sure you want to clear ALL history and custom data? This cannot be undone.")) {
      onReset();
    }
  };

  const handleSyncComplete = () => {
    // Reload any necessary data after sync
    console.log('Sync completed');
  };

  const triggerTestError = () => {
    try {
      throw new Error('Sentry Test Error - Error monitoring is working! 🚨');
    } catch (error) {
      Sentry.captureException(error);
      alert('Test error sent to Sentry! Check your Sentry dashboard.');
    }
  };

  return (
    <div className="pb-24">
      <SyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onSyncComplete={handleSyncComplete}
      />

      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white">Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Restart Tutorial - Prominent Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/40 rounded-xl overflow-hidden shadow-lg shadow-green-500/10">
          <div className="px-4 py-3 border-b border-green-500/30 bg-green-600/20">
            <h3 className="font-bold text-white flex items-center gap-2">
              <RefreshCw size={18} className="text-green-400" />
              Restart Tutorial
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-300 mb-4">
              Want to replay the onboarding and update your preferences? Start fresh here.
            </p>
            <button
              onClick={onShowTutorial}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
            >
              <RefreshCw size={18} />
              Restart Tutorial & Change Preferences
            </button>
          </div>
        </div>

        {/* User Preferences Section */}
        {onShowPreferences && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <User size={18} className="text-purple-400" />
                My Preferences
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-400 mb-4">
                View and update your fitness level, goals, and weight unit preferences.
              </p>
              <button
                onClick={onShowPreferences}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-purple-500/30"
              >
                <User size={18} />
                Manage Preferences
              </button>
            </div>
          </div>
        )}

        {/* Sync & Backup Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Cloud size={18} className="text-blue-400" />
              Sync & Backup
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-400 mb-4">
              Backup your workout history to JSONBin or export to file/clipboard.
            </p>
            <button
              onClick={() => setIsSyncOpen(true)}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-blue-500/30"
            >
              <Cloud size={18} />
              Open Sync & Backup
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-purple-400" />
              Feedback
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-400 mb-4">
              Found a bug? Have a feature request? Send feedback directly.
            </p>
            <a
              href="mailto:placeholder@email.com?subject=QuickFit%20Golf%2035%20Feedback"
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-purple-500/30 block"
            >
              <Mail size={18} />
              Send Feedback
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/30">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Info size={18} className="text-slate-400" />
              About
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">App Name</span>
              <span className="text-sm font-semibold text-white">QuickFit Golf 35</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Version</span>
              <span className="text-sm font-mono text-green-400">1.0.0-beta.1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Built For</span>
              <span className="text-sm text-white">Golfers 🏌️</span>
            </div>
            <div className="pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-500 leading-relaxed">
                Golf-specific strength training designed to add yards off the tee.
                4 focused workouts per week, 35 minutes each.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/30 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-red-500/30 bg-red-500/10">
            <h3 className="font-bold text-red-400 flex items-center gap-2">
              <AlertCircle size={18} />
              Danger Zone
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-400 mb-4">
              Clear all workout history and custom data. This action cannot be undone.
            </p>
            <button
              onClick={confirmReset}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-red-500/30"
            >
              <Trash2 size={18} />
              Reset All Data
            </button>
          </div>
        </div>

        {/* Sentry Test (Development Only) */}
        {import.meta.env.DEV && (
          <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-yellow-500/30 bg-yellow-500/10">
              <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                <Bug size={18} />
                Sentry Test (Dev Only)
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-400 mb-4">
                Test Sentry error monitoring by triggering a test error.
              </p>
              <button
                onClick={triggerTestError}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition border border-yellow-500/30"
              >
                <Bug size={18} />
                Trigger Test Error
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;

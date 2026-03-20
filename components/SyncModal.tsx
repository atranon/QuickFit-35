import React, { useState, useEffect, useRef } from 'react';
import { X, CloudUpload, CloudDownload, Save, AlertCircle, CheckCircle2, Loader2, Info, FileDown, FileUp, FolderInput, Copy, ClipboardPaste, ArrowRight, LogIn, UserPlus, LogOut, RefreshCw } from 'lucide-react';
import { createBackup, restoreBackup, downloadBackupFile, parseBackupFile, encodeBackup, decodeBackup } from '../services/storageService';
import { signUp, signIn, signOut, getCurrentUser, pushBackup, pullAndRestore, getLastSyncTime } from '../services/supabaseSync';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { BackupData } from '../types';
import type { User } from '@supabase/supabase-js';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

type Tab = 'cloud' | 'file' | 'text';

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const [activeTab, setActiveTab] = useState<Tab>('cloud');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Pending Restore State
  const [pendingData, setPendingData] = useState<BackupData | null>(null);

  // Text Mode State
  const [textCode, setTextCode] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus({ type: 'idle', msg: '' });
      setPendingData(null);
      setTextCode('');
      // Check current auth state
      getCurrentUser().then(u => {
        setUser(u);
        if (u) {
          getLastSyncTime().then(t => setLastSync(t));
        }
      });
    }
  }, [isOpen]);

  // --- AUTH HANDLERS ---

  const handleSignIn = async () => {
    if (!email || !password) { setStatus({ type: 'error', msg: 'Enter email and password.' }); return; }
    setStatus({ type: 'loading', msg: 'Signing in...' });
    const result = await signIn(email, password);
    if (result.error) {
      setStatus({ type: 'error', msg: result.error });
    } else {
      setUser(result.user);
      setStatus({ type: 'success', msg: 'Signed in! Checking for cloud data...' });
      // Auto-pull on sign in
      const pullResult = await pullAndRestore();
      if (pullResult.data) {
        setStatus({ type: 'success', msg: `Restored ${pullResult.data.history?.length || 0} workouts from cloud.` });
        if (onSyncComplete) onSyncComplete();
      } else if (pullResult.error) {
        setStatus({ type: 'success', msg: 'Signed in. No cloud backup found — your local data is safe.' });
      } else {
        setStatus({ type: 'success', msg: 'Signed in. No cloud backup yet — your data will sync after your next workout.' });
      }
      getLastSyncTime().then(t => setLastSync(t));
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) { setStatus({ type: 'error', msg: 'Enter email and password.' }); return; }
    if (password.length < 6) { setStatus({ type: 'error', msg: 'Password must be at least 6 characters.' }); return; }
    setStatus({ type: 'loading', msg: 'Creating account...' });
    const result = await signUp(email, password);
    if (result.error) {
      setStatus({ type: 'error', msg: result.error });
    } else {
      setUser(result.user);
      // Push current local data to cloud immediately on signup
      setStatus({ type: 'loading', msg: 'Account created! Pushing your data to the cloud...' });
      const pushResult = await pushBackup();
      if (pushResult.success) {
        setStatus({ type: 'success', msg: 'Account created and data synced to cloud!' });
      } else {
        setStatus({ type: 'success', msg: 'Account created! Data will sync after your next workout.' });
      }
      getLastSyncTime().then(t => setLastSync(t));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setLastSync(null);
    setStatus({ type: 'idle', msg: 'Signed out. Your local data is still on this device.' });
  };

  const handlePush = async () => {
    setStatus({ type: 'loading', msg: 'Pushing to cloud...' });
    const result = await pushBackup();
    if (result.success) {
      setStatus({ type: 'success', msg: 'Data synced to cloud.' });
      getLastSyncTime().then(t => setLastSync(t));
    } else {
      setStatus({ type: 'error', msg: result.error || 'Push failed.' });
    }
  };

  const handlePull = async () => {
    setStatus({ type: 'loading', msg: 'Pulling from cloud...' });
    const result = await pullAndRestore();
    if (result.data) {
      setStatus({ type: 'success', msg: `Restored ${result.data.history?.length || 0} workouts from cloud.` });
      if (onSyncComplete) onSyncComplete();
    } else if (result.error) {
      setStatus({ type: 'error', msg: result.error });
    } else {
      setStatus({ type: 'idle', msg: 'No cloud backup found.' });
    }
  };

  // --- FILE HANDLERS (unchanged from before) ---

  const handleDownload = () => {
    try {
      const backup = createBackup();
      downloadBackupFile(backup);
      setStatus({ type: 'success', msg: 'File downloaded.' });
    } catch (e) {
      setStatus({ type: 'error', msg: 'Failed to generate file.' });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus({ type: 'loading', msg: 'Reading file...' });
    try {
      const data = await parseBackupFile(file);
      setPendingData(data);
      setStatus({ type: 'idle', msg: '' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyCode = () => {
    try {
      const backup = createBackup();
      const code = encodeBackup(backup);
      navigator.clipboard.writeText(code);
      setTextCode(code);
      setStatus({ type: 'success', msg: 'Code copied to clipboard!' });
    } catch (e) {
      setStatus({ type: 'error', msg: 'Failed to generate code.' });
    }
  };

  const handlePasteRestore = () => {
    try {
      if (!textCode) { setStatus({ type: 'error', msg: 'Paste a code first.' }); return; }
      const data = decodeBackup(textCode);
      setPendingData(data);
      setStatus({ type: 'idle', msg: '' });
    } catch (e) {
      setStatus({ type: 'error', msg: 'Invalid code.' });
    }
  };

  const confirmRestore = () => {
    if (!pendingData) return;
    try {
      const stats = restoreBackup(pendingData);
      setStatus({ type: 'success', msg: `Restored ${stats.workouts} workouts!` });
      setPendingData(null);
      if (onSyncComplete) onSyncComplete();
    } catch (e) {
      setStatus({ type: 'error', msg: 'Restore failed.' });
    }
  };

  if (!isOpen) return null;

  // --- REVIEW / VERIFY SCREEN ---
  if (pendingData) {
    const dateStr = pendingData.timestamp ? new Date(pendingData.timestamp).toLocaleString() : 'Unknown';
    const count = pendingData.history?.length || 0;

    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-slate-800 border-2 border-blue-500 p-6 rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-bold text-white mb-4">Review Backup</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg mb-6 border border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Date:</span>
              <span className="text-white font-mono text-sm">{dateStr}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Workouts:</span>
              <span className="text-blue-400 font-bold text-sm">{count}</span>
            </div>
          </div>
          <div className="text-amber-400 text-xs mb-6 flex gap-2 items-start bg-amber-900/20 p-2 rounded">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>Confirming will <strong>overwrite</strong> your current data on this device.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPendingData(null)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition">Cancel</button>
            <button onClick={confirmRestore} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const supabaseAvailable = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Sync & Backup</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-900 rounded-lg p-1 mb-4 gap-1">
          <button onClick={() => setActiveTab('cloud')} className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'cloud' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
            <CloudUpload size={14} /> Cloud
          </button>
          <button onClick={() => setActiveTab('file')} className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'file' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
            <FolderInput size={14} /> File
          </button>
          <button onClick={() => setActiveTab('text')} className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'text' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
            <Copy size={14} /> Text
          </button>
        </div>

        {/* Status Message */}
        {status.msg && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            'bg-blue-500/10 text-blue-300 border border-blue-500/20'
          }`}>
            {status.type === 'loading' && <Loader2 size={16} className="animate-spin" />}
            {status.type === 'error' && <AlertCircle size={16} />}
            {status.type === 'success' && <CheckCircle2 size={16} />}
            <span>{status.msg}</span>
          </div>
        )}

        {/* --- CLOUD TAB --- */}
        {activeTab === 'cloud' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {!supabaseAvailable ? (
              /* Supabase not configured */
              <div className="text-center py-8">
                <CloudUpload size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-2">Cloud sync is not configured yet.</p>
                <p className="text-xs text-slate-600">Use the File or Text tabs to back up your data.</p>
              </div>
            ) : !user ? (
              /* Not signed in — show auth form */
              <div>
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-300 mb-1">
                    {authMode === 'signin' ? 'Sign in to sync across devices' : 'Create an account to enable cloud sync'}
                  </p>
                  <p className="text-[10px] text-slate-600">Your data is always saved locally too.</p>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && (authMode === 'signin' ? handleSignIn() : handleSignUp())}
                  />
                </div>

                <button
                  onClick={authMode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={status.type === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition mb-3"
                >
                  {status.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : authMode === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>

                <button
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="w-full text-xs text-slate-500 hover:text-slate-300 transition py-2"
                >
                  {authMode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
                </button>
              </div>
            ) : (
              /* Signed in — show sync controls */
              <div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signed In</span>
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Cloud Active</span>
                  </div>
                  <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  {lastSync && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Last synced: {new Date(lastSync).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={handlePush}
                    disabled={status.type === 'loading'}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex flex-col items-center gap-2 transition"
                  >
                    <CloudUpload size={22} />
                    <span className="text-xs">Push to Cloud</span>
                  </button>
                  <button
                    onClick={handlePull}
                    disabled={status.type === 'loading'}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex flex-col items-center gap-2 transition"
                  >
                    <CloudDownload size={22} />
                    <span className="text-xs">Pull from Cloud</span>
                  </button>
                </div>

                <button onClick={handleSignOut} className="w-full text-xs text-slate-500 hover:text-red-400 transition py-2 flex items-center justify-center gap-2">
                  <LogOut size={12} /> Sign Out
                </button>

                <div className="mt-3 flex gap-2 items-start bg-blue-900/20 p-2 rounded text-[10px] text-blue-200">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>Auto-sync is on. Your data pushes to the cloud after every completed workout.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- FILE TAB (unchanged) --- */}
        {activeTab === 'file' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <button onClick={handleDownload} className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition group">
              <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 group-hover:bg-emerald-500/30"><FileDown size={24} /></div>
              <div className="text-left"><div className="text-sm">Download Backup</div><div className="text-[10px] text-slate-400 font-normal">Save .json file to device</div></div>
            </button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div><div className="relative flex justify-center text-xs"><span className="px-2 bg-slate-800 text-slate-500">OR</span></div></div>
            <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition group">
              <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500/30"><FileUp size={24} /></div>
              <div className="text-left"><div className="text-sm">Restore from File</div><div className="text-[10px] text-slate-400 font-normal">Select .json file to load</div></div>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".json" className="hidden" />
          </div>
        )}

        {/* --- TEXT TAB (unchanged) --- */}
        {activeTab === 'text' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-xs text-slate-400 mb-2">Copy this code to save your data. Paste it back to restore.</p>
            <div className="flex gap-2">
              <button onClick={handleCopyCode} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"><Copy size={14} /> Copy Current Data</button>
              <button onClick={() => setTextCode('')} className="bg-slate-700 text-slate-300 hover:text-white px-3 rounded">Clear</button>
            </div>
            <textarea value={textCode} onChange={(e) => setTextCode(e.target.value)} placeholder="Paste backup code here..." className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-2 text-[10px] font-mono text-slate-300 focus:border-blue-500 focus:outline-none resize-none" />
            <button onClick={handlePasteRestore} disabled={!textCode} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><ClipboardPaste size={16} /> Restore from Text</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncModal;

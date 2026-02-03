
import React, { useState, useEffect, useRef } from 'react';
import { X, CloudUpload, CloudDownload, Save, AlertCircle, CheckCircle2, Loader2, Info, FileDown, FileUp, FolderInput, Copy, ClipboardPaste, ArrowRight } from 'lucide-react';
import { getSyncConfig, saveSyncConfig, createBackup, restoreBackup, pushToCloud, pullFromCloud, downloadBackupFile, parseBackupFile, encodeBackup, decodeBackup } from '../services/storageService';
import { BackupData } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

type Tab = 'cloud' | 'file' | 'text';

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const [activeTab, setActiveTab] = useState<Tab>('file');
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });
  
  // Pending Restore State (Replaces window.confirm)
  const [pendingData, setPendingData] = useState<BackupData | null>(null);
  
  // Text Mode State
  const [textCode, setTextCode] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getSyncConfig();
      setApiKey(config.apiKey);
      setBinId(config.binId);
      setStatus({ type: 'idle', msg: '' });
      setPendingData(null);
      setTextCode('');
    }
  }, [isOpen]);

  const handleSaveConfig = () => {
    saveSyncConfig(apiKey, binId);
    const config = getSyncConfig();
    setApiKey(config.apiKey);
    setBinId(config.binId);
    setStatus({ type: 'success', msg: 'Credentials saved.' });
  };

  const handlePush = async () => {
    setStatus({ type: 'loading', msg: 'Uploading...' });
    try {
        const backup = createBackup();
        await pushToCloud(apiKey, binId, backup);
        setStatus({ type: 'success', msg: 'Uploaded to cloud.' });
    } catch (e: any) {
        setStatus({ type: 'error', msg: e.message || 'Upload failed.' });
    }
  };

  const handlePull = async () => {
    setStatus({ type: 'loading', msg: 'Checking cloud...' });
    try {
        const data = await pullFromCloud(apiKey, binId);
        setPendingData(data); // Trigger Verify Screen
        setStatus({ type: 'idle', msg: '' });
    } catch (e: any) {
        setStatus({ type: 'error', msg: e.message || 'Download failed.' });
    }
  };

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
        setPendingData(data); // Trigger Verify Screen
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
          if (!textCode) {
              setStatus({ type: 'error', msg: 'Paste a code first.' });
              return;
          }
          const data = decodeBackup(textCode);
          setPendingData(data); // Trigger Verify Screen
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
                    <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Version:</span>
                        <span className="text-slate-500 text-sm">v{pendingData.version || 1}</span>
                    </div>
                </div>

                <div className="text-amber-400 text-xs mb-6 flex gap-2 items-start bg-amber-900/20 p-2 rounded">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>Confirming will <strong>overwrite</strong> your current data on this device.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setPendingData(null)}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmRestore}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={18} /> Confirm
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- MAIN SCREEN ---
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl shadow-2xl max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-400">Sync & Backup</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900/50 p-1 rounded-lg mb-6">
            <button 
                onClick={() => setActiveTab('file')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'file' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <FolderInput size={14} /> File
            </button>
            <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'text' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Copy size={14} /> Text
            </button>
            <button 
                onClick={() => setActiveTab('cloud')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${activeTab === 'cloud' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <CloudUpload size={14} /> Cloud
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

        {/* --- FILE TAB --- */}
        {activeTab === 'file' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                <button 
                    onClick={handleDownload}
                    className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition group"
                >
                    <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 group-hover:bg-emerald-500/30">
                        <FileDown size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm">Download Backup</div>
                        <div className="text-[10px] text-slate-400 font-normal">Save .json file to device</div>
                    </div>
                </button>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-slate-800 text-slate-500">OR</span>
                    </div>
                </div>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition group"
                >
                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500/30">
                        <FileUp size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm">Restore from File</div>
                        <div className="text-[10px] text-slate-400 font-normal">Select .json file to load</div>
                    </div>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".json" className="hidden" />
            </div>
        )}

        {/* --- TEXT TAB --- */}
        {activeTab === 'text' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                 <p className="text-xs text-slate-400 mb-2">
                    Copy this code and paste it into a Google Doc, Email, or Notes app to save it. Paste it back here to restore.
                 </p>
                 
                 <div className="flex gap-2">
                     <button 
                        onClick={handleCopyCode}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
                     >
                        <Copy size={14} /> Copy Current Data
                     </button>
                     <button 
                        onClick={() => setTextCode('')}
                        className="bg-slate-700 text-slate-300 hover:text-white px-3 rounded"
                     >
                        Clear
                     </button>
                 </div>

                 <textarea 
                    value={textCode}
                    onChange={(e) => setTextCode(e.target.value)}
                    placeholder="Paste backup code here..."
                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-2 text-[10px] font-mono text-slate-300 focus:border-blue-500 focus:outline-none resize-none"
                 />

                 <button 
                    onClick={handlePasteRestore}
                    disabled={!textCode}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                 >
                    <ClipboardPaste size={16} /> Restore from Text
                 </button>
            </div>
        )}

        {/* --- CLOUD TAB --- */}
        {activeTab === 'cloud' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Bin ID</label>
                        <input 
                            type="text" 
                            value={binId}
                            onChange={(e) => setBinId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white" 
                            placeholder="67c..."
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">API Key</label>
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white" 
                            placeholder="..."
                        />
                    </div>
                </div>
                <button onClick={handleSaveConfig} className="w-full bg-slate-700 text-xs py-2 rounded text-slate-300 hover:text-white mb-4">
                    Save Credentials
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={handlePush}
                        disabled={status.type === 'loading'}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex flex-col items-center gap-1"
                    >
                        <CloudUpload size={20} />
                        <span className="text-xs">Push</span>
                    </button>
                    <button 
                        onClick={handlePull}
                        disabled={status.type === 'loading'}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex flex-col items-center gap-1"
                    >
                        <CloudDownload size={20} />
                        <span className="text-xs">Pull</span>
                    </button>
                </div>
                
                 <div className="flex gap-2 items-start bg-blue-900/20 p-2 rounded text-[10px] text-blue-200">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>Using <a href="https://jsonbin.io" target="_blank" className="underline">JSONBin.io</a>. Use Text/File tabs for Google Docs/Drive support.</span>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SyncModal;

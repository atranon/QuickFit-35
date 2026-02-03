
import { BackupData } from '../types';

const BIN_API_URL = "https://api.jsonbin.io/v3/b";

export const getSyncConfig = () => {
  return {
    apiKey: localStorage.getItem('sync_api_key') || '',
    binId: localStorage.getItem('sync_bin_id') || ''
  };
};

export const saveSyncConfig = (apiKey: string, binId: string) => {
  // Strip potential URL garbage if user pasted a full URL
  const cleanBinId = binId.replace('https://api.jsonbin.io/v3/b/', '').replace('/', '').trim();
  localStorage.setItem('sync_api_key', apiKey.trim());
  localStorage.setItem('sync_bin_id', cleanBinId);
};

export const createBackup = (): BackupData => {
  const history = JSON.parse(localStorage.getItem('workout_history') || '[]');
  const customNames: Record<string, string> = {};
  const lastStats: Record<string, any> = {};
  const notes: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('ex_name_')) {
        customNames[key] = localStorage.getItem(key) || '';
    } else if (key?.startsWith('last_')) {
        try {
            lastStats[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch(e) {
            console.warn(`Failed to parse ${key}`, e);
        }
    } else if (key?.startsWith('workout_notes_')) {
        notes[key] = localStorage.getItem(key) || '';
    }
  }

  return {
    version: 1,
    timestamp: Date.now(),
    history,
    customNames,
    lastStats,
    notes
  };
};

export const restoreBackup = (data: BackupData) => {
    if (!data) throw new Error("No data to restore");
    
    // Restore History
    if (Array.isArray(data.history)) {
        localStorage.setItem('workout_history', JSON.stringify(data.history));
    }
    
    // Restore Custom Names
    if (data.customNames) {
        Object.entries(data.customNames).forEach(([k, v]) => localStorage.setItem(k, v as string));
    }

    // Restore Stats
    if (data.lastStats) {
        Object.entries(data.lastStats).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
    }

    // Restore Notes
    if (data.notes) {
        Object.entries(data.notes).forEach(([k, v]) => localStorage.setItem(k, v as string));
    }
    
    return {
        workouts: data.history?.length || 0,
        names: Object.keys(data.customNames || {}).length,
        timestamp: data.timestamp
    };
};

// --- Text/Clipboard Utils ---

export const encodeBackup = (data: BackupData): string => {
    try {
        const json = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(json))); // Unicode-safe Base64
    } catch (e) {
        throw new Error("Failed to encode backup.");
    }
};

export const decodeBackup = (base64: string): BackupData => {
    try {
        const json = decodeURIComponent(escape(atob(base64)));
        const data = JSON.parse(json);
        validateBackupData(data);
        return data;
    } catch (e) {
        throw new Error("Invalid backup code.");
    }
};

const validateBackupData = (data: any) => {
    if (!data || (!Array.isArray(data.history) && !data.customNames)) {
        throw new Error("Invalid data structure.");
    }
}

// --- Cloud Sync ---

export const pushToCloud = async (apiKey: string, binId: string, data: BackupData) => {
    if (!apiKey || !binId) throw new Error("Missing API Key or Bin ID");

    const response = await fetch(`${BIN_API_URL}/${binId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey,
            'X-Bin-Meta': 'false' 
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error("Invalid API Key");
        if (response.status === 404) throw new Error("Bin ID not found");
        throw new Error(`Upload failed: ${response.statusText}`);
    }
    return await response.json();
};

export const pullFromCloud = async (apiKey: string, binId: string): Promise<BackupData> => {
    if (!apiKey || !binId) throw new Error("Missing API Key or Bin ID");

    const response = await fetch(`${BIN_API_URL}/${binId}`, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey,
            'X-Bin-Meta': 'false' 
        }
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error("Invalid API Key");
        if (response.status === 404) throw new Error("Bin ID not found");
        throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const json = await response.json();
    let data = json;
    if (data.record) data = data.record;

    validateBackupData(data);
    return data as BackupData;
};

export const triggerBackgroundSync = async () => {
  const { apiKey, binId } = getSyncConfig();
  if (apiKey && binId) {
    try {
      const backup = createBackup();
      await pushToCloud(apiKey, binId, backup);
    } catch (e) {
      console.warn("Auto-sync failed", e);
      throw e;
    }
  }
};

// --- File Backup ---

export const downloadBackupFile = (data: BackupData) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `quickfit_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseBackupFile = async (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        validateBackupData(json);
        resolve(json as BackupData);
      } catch (err) {
        reject(new Error("Failed to parse JSON file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
};

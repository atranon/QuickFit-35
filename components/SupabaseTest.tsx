import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Checking connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // A simple auth check is enough to confirm the client is configured correctly
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus('connected');
        setMessage('Supabase is connected!');
      } catch (err: any) {
        setStatus('error');
        setMessage(`Connection failed: ${err.message}`);
      }
    };
    testConnection();
  }, []);

  const colors = {
    checking: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    connected: 'text-green-400 border-green-500/30 bg-green-500/10',
    error: 'text-red-400 border-red-500/30 bg-red-500/10',
  };

  return (
    <div className={`border rounded-lg px-4 py-3 text-sm font-semibold ${colors[status]}`}>
      {status === 'checking' && '⏳ '}
      {status === 'connected' && '✅ '}
      {status === 'error' && '❌ '}
      {message}
    </div>
  );
};

export default SupabaseTest;

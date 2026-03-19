import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FeedbackPageProps {
  onBack: () => void;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Send Feedback</h2>
            <p className="text-sm text-slate-400">Help us improve QuickFit 35</p>
          </div>
        </div>

        {/* Full-screen Tally embed */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <iframe
            src="https://tally.so/r/rjE1rp"
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title="Feedback Form"
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

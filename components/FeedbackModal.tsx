import React from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close if clicking the backdrop (not the content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl h-[90vh] mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors shadow-lg border border-slate-700"
          aria-label="Close feedback form"
        >
          <X size={20} />
        </button>

        {/* Tally embed iframe */}
        <iframe
          src="https://tally.so/r/rjE1rp"
          className="w-full h-full rounded-xl shadow-2xl border border-slate-700"
          title="Feedback Form"
        />
      </div>
    </div>
  );
};

export default FeedbackModal;

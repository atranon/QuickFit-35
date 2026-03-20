import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

export interface TourStep {
  target: string;           // CSS selector for the element to spotlight (e.g., '[data-tour="weight-input"]')
  title: string;            // Bold heading in the tooltip
  description: string;      // Explanatory text
  position?: 'top' | 'bottom' | 'left' | 'right';  // Where the tooltip appears relative to the target
}

interface AppTourProps {
  steps: TourStep[];
  tourKey: string;           // localStorage key to track if this tour has been seen
  onComplete: () => void;    // Called when tour finishes or is skipped
  delay?: number;            // ms to wait before starting (lets the UI render first)
}

const AppTour: React.FC<AppTourProps> = ({ steps, tourKey, onComplete, delay = 600 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if this tour has been seen before
  useEffect(() => {
    const seen = localStorage.getItem(tourKey);
    if (seen) {
      onComplete();
      return;
    }
    // Delay to let the page render before starting
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [tourKey, delay, onComplete]);

  // Find and measure the target element for the current step
  const updateTargetRect = useCallback(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);

      // Scroll element into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [isVisible, currentStep, steps]);

  useEffect(() => {
    updateTargetRect();
    // Re-measure on resize or scroll
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    // Also re-measure after a short delay (for scroll-into-view to finish)
    const timer = setTimeout(updateTargetRect, 400);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
      clearTimeout(timer);
    };
  }, [updateTargetRect]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(tourKey, 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  // Spotlight dimensions (with padding around the target)
  const padding = 8;
  const hasTarget = targetRect && targetRect.width > 0;

  // Calculate tooltip position
  let tooltipStyle: React.CSSProperties = {};
  const pos = step.position || 'bottom';

  if (hasTarget) {
    const centerX = targetRect.left + targetRect.width / 2;
    const tooltipWidth = 280;

    if (pos === 'bottom') {
      tooltipStyle = {
        position: 'fixed',
        top: targetRect.bottom + padding + 12,
        left: Math.max(16, Math.min(centerX - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
        width: tooltipWidth,
      };
    } else if (pos === 'top') {
      tooltipStyle = {
        position: 'fixed',
        bottom: window.innerHeight - targetRect.top + padding + 12,
        left: Math.max(16, Math.min(centerX - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
        width: tooltipWidth,
      };
    } else {
      // Default to bottom for left/right on mobile (screen too narrow for side tooltips)
      tooltipStyle = {
        position: 'fixed',
        top: targetRect.bottom + padding + 12,
        left: Math.max(16, Math.min(centerX - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
        width: tooltipWidth,
      };
    }
  } else {
    // No target found — center the tooltip
    tooltipStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 300,
    };
  }

  return (
    <div className="fixed inset-0 z-[200]" style={{ pointerEvents: 'auto' }}>
      {/* Dark overlay — uses an SVG with a cutout for the spotlight */}
      <svg className="fixed inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White = visible (dark overlay), Black = hidden (spotlight hole) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {hasTarget && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(2, 6, 23, 0.85)"
          mask="url(#tour-spotlight-mask)"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        />
      </svg>

      {/* Spotlight ring — glowing border around the target element */}
      {hasTarget && (
        <div
          className="fixed border-2 border-blue-400 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500 ease-out"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="bg-slate-800 border-2 border-blue-500/50 rounded-2xl shadow-2xl shadow-blue-500/20 p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ ...tooltipStyle, zIndex: 201, pointerEvents: 'auto' }}
      >
        {/* Step counter and skip */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-6 bg-blue-500' :
                  i < currentStep ? 'w-3 bg-blue-500/50' :
                  'w-3 bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleFinish}
            className="text-slate-600 hover:text-slate-300 transition p-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <h4 className="text-sm font-black text-white uppercase italic tracking-tight mb-1.5">
          {step.title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleFinish}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-400 transition uppercase tracking-widest"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 uppercase tracking-widest"
            >
              {isLast ? 'Got it' : 'Next'}
              {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTour;

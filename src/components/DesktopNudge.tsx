import React, { useEffect, useState } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface DesktopNudgeProps {
  text: string;
  side?: 'left' | 'right';
  visible?: boolean;
}

export const DesktopNudge: React.FC<DesktopNudgeProps> = ({ text, side = 'left', visible = true }) => {
  const { isMobile, isTouch } = useDeviceDetection();
  const [show, setShow] = useState(visible);

  useEffect(() => setShow(visible), [visible]);

  if (isMobile || isTouch) return null;
  if (!show) return null;

  const isLeft = side === 'left';
  // Add a consistent 24px gap between the device frame and the copy
  const GAP_PX = 24;
  const containerStyle: React.CSSProperties = isLeft
    ? { left: `calc(50% - 420px - ${GAP_PX}px)`, top: 'calc(50% - 140px)' }
    : { right: `calc(50% - 420px - ${GAP_PX}px)`, top: 'calc(50% - 140px)' };

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="absolute max-w-[260px] text-left"
        style={containerStyle}
      >
        <div className="text-sm text-gray-900 font-medium leading-5 mb-3 pr-6">
          {text}
        </div>
        {/* Curvy arrow */}
        {isLeft ? (
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nudgeGradL" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#6D28D9"/>
              </linearGradient>
            </defs>
            <path d="M5 70 C 80 60, 140 40, 210 30" stroke="url(#nudgeGradL)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M200 37 l14 -7 l-9 -10" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none"/>
          </svg>
        ) : (
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nudgeGradR" x1="220" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#6D28D9"/>
              </linearGradient>
            </defs>
            <path d="M215 70 C 140 60, 80 40, 10 30" stroke="url(#nudgeGradR)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M20 37 l-14 -7 l9 -10" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none"/>
          </svg>
        )}

        {/* Dismiss */}
        <button
          className="pointer-events-auto absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow text-sm text-gray-700"
          onClick={() => setShow(false)}
          aria-label="Dismiss nudge"
        >
          ×
        </button>
      </div>
    </div>
  );
};



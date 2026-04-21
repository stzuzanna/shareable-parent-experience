import React from 'react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface DemoHeaderProps {
  showFrame: boolean;
  showTips?: boolean;
  onToggleTips?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ showFrame, showTips, onToggleTips }) => {
  const { isMobile, isTouch } = useDeviceDetection();
  
  // Hide on mobile/touch devices; show on desktop regardless of frame
  if (isMobile || isTouch) return null;

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between relative z-50">
      <div className="text-left">
        <h1 className="text-lg font-semibold text-gray-800">Famly Parent Experience Demo</h1>
        <p className="text-sm text-gray-600 mt-1">Experience what parents see in the Famly app</p>
      </div>
      <div className="text-right">
        <button
          type="button"
          onClick={onToggleTips}
          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
        >
          {showTips ? 'Hide tips' : 'Show tips'}
        </button>
      </div>
    </div>
  );
};
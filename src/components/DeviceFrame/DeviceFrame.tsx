import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, showFrame }) => {
  const [scale, setScale] = useState(0.8);
  const [isReady, setIsReady] = useState(false);

  // Memoize the scale calculation to prevent unnecessary recalculations
  const calculateScale = useCallback(() => {
    if (!showFrame) return 0.8;

    const frameWidth = 430 + 64; // Device width + padding
    const frameHeight = 932 + 64; // Device height + padding
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate scale to fit both width and height with some margin
    const scaleX = (viewportWidth * 0.85) / frameWidth;
    const scaleY = (viewportHeight * 0.85) / frameHeight;
    return Math.min(scaleX, scaleY, 0.9); // Cap at 0.9 for better fit
  }, [showFrame]);

  // Initialize scale immediately and mark as ready
  useEffect(() => {
    if (!showFrame) {
      setIsReady(true);
      return;
    }

    const initialScale = calculateScale();
    setScale(initialScale);
    setIsReady(true);

    // Debounced resize handler to prevent excessive recalculations
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newScale = calculateScale();
        setScale(newScale);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [showFrame, calculateScale]);

  // Memoize the transform style to prevent recalculation on every render
  const transformStyle = useMemo(() => ({
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center',
    willChange: 'transform',
    transition: 'none' // Explicitly disable transitions
  }), [scale]);

  if (!showFrame) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Don't render until we have calculated the initial scale
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 flex-shrink-0"
        style={transformStyle}
      >
        {/* iPhone 15 Pro Max Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl select-none">
          <div className="bg-black rounded-[2.5rem] p-1">
            <div className="relative bg-white rounded-[2rem] overflow-hidden" style={{ width: '430px', height: '932px' }}>
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50"></div>
              
              {/* Content */}
              <div className="w-full h-full overflow-hidden relative touch-manipulation">
                {children}
              </div>
            </div>
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute left-0 top-20 w-1 h-12 bg-gray-800 rounded-r-lg select-none pointer-events-none"></div>
        <div className="absolute left-0 top-36 w-1 h-16 bg-gray-800 rounded-r-lg select-none pointer-events-none"></div>
        <div className="absolute left-0 top-56 w-1 h-16 bg-gray-800 rounded-r-lg select-none pointer-events-none"></div>
        <div className="absolute right-0 top-48 w-1 h-20 bg-gray-800 rounded-l-lg select-none pointer-events-none"></div>
      </div>
    </div>
  );
};
import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XIcon className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[100] animate-fade-up">
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getBgColor()}`}>
        {getIcon()}
        <span className="flex-1 text-gray-800 font-medium">{message}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-6 h-6 p-0 hover:bg-transparent"
        >
          <XIcon className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { StatusType } from '@/types';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface StatusMessageProps {
  message: string;
  type: StatusType;
  duration?: number;
  onClose?: () => void;
}

const StatusMessage = ({ message, type, duration = 5000, onClose }: StatusMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (!message || !type) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [message, type, duration, onClose]);
  
  if (!message || !type) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  return (
    <div
      className={cn(
        'rounded-md p-4 mb-4 flex items-center gap-3 transition-all duration-300',
        isVisible ? 'animate-fade-in' : 'animate-fade-out opacity-0',
        type === 'success' && 'bg-green-50 text-green-600 border border-green-200',
        type === 'error' && 'bg-red-50 text-red-600 border border-red-200',
        type === 'warning' && 'bg-yellow-50 text-yellow-600 border border-yellow-200',
        type === 'info' && 'bg-blue-50 text-blue-600 border border-blue-200'
      )}
    >
      {getIcon()}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default StatusMessage;

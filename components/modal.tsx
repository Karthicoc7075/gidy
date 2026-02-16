'use client'
import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}) {


  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
   
      document.addEventListener('keydown', handleEscape);

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">

     
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

  
      <div
        className="relative flex flex-col bg-white dark:bg-gray-800 rounded-md p-6 w-[90%] max-w-[600px] max-h-[90vh] z-10 mt-[2rem] h-[fit-content] "
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>

    </div>
  );
}
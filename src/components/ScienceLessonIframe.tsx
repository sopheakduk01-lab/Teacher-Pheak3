import React from 'react';

export const ScienceLessonIframe: React.FC<{isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl w-full h-full relative shadow-2xl">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-[101] p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe src="/science-lesson.html" className="w-full h-full rounded-3xl" title="Science Lesson" />
      </div>
    </div>
  );
};

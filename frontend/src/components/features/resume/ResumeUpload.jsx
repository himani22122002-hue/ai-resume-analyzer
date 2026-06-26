import React from 'react';

/**
 * ResumeUpload - A professional, modern, and reusable file upload component.
 * Features:
 * - Glassmorphism card styling
 * - Drag and drop area visual
 * - Responsive layout
 * - Purely presentational (no logic or validation included)
 */
const ResumeUpload = () => {
  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
        <p className="text-gray-400">Upload your resume in PDF format (.pdf)</p>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-white/40 transition-colors cursor-pointer">
        {/* Upload Icon */}
        <svg
          className="w-12 h-12 text-purple-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {/* Browse Resume Button - Decorative/Non-functional */}
        <button
          type="button"
          className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors"
        >
          Browse Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;

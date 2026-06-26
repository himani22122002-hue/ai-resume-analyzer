import React from 'react';

const ResumePreview = ({ text }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          ✓ Text extracted successfully
        </span>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Extracted Resume</h3>
          <button
            onClick={copyToClipboard}
            className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
          >
            Copy Text
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto bg-gray-950/50 p-4 rounded-lg border border-white/5 text-gray-300 font-mono text-sm whitespace-pre-wrap">
          {text || 'No text extracted.'}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

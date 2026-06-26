import React, { useState, useRef } from 'react';
import api from '../../../services/api';
import ATSDashboard from '../analysis/ATSDashboard';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset state
    setError('');
    setUploadResult(null);

    // Validation
    if (file.type !== 'application/pdf') {
      setError('Invalid file type. Please upload a PDF file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!uploadResult ? (
        <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
            <p className="text-gray-400">Upload your resume in PDF format (.pdf)</p>
          </div>

          <div
            className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-white/40 transition-colors cursor-pointer"
            onClick={() => !loading && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />

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

            <button
              type="button"
              className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Browse Resume
            </button>
          </div>

          {selectedFile && (
            <div className="mt-4 text-center">
              <p className="text-green-400 font-medium mb-4">
                Selected: {selectedFile.name}
              </p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Analyze Resume'}
              </button>
            </div>
          )}

          {loading && (
            <p className="mt-4 text-center text-gray-300 font-medium animate-pulse">
              Processing...
            </p>
          )}

          {error && (
            <p className="mt-4 text-center text-red-400 font-medium">
              {error}
            </p>
          )}
        </div>
      ) : (
        <ATSDashboard analysisData={uploadResult} />
      )}
    </div>
  );
};

export default ResumeUpload;

import React, { useState, useEffect, useCallback } from 'react';
import { getHistory } from '../../../services/resumeService';

const ResumeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    // Expose fetchHistory to window for parent components to trigger refresh
    window.refreshResumeHistory = fetchHistory;
    return () => delete window.refreshResumeHistory;
  }, [fetchHistory]);

  if (loading) return <div className="text-gray-400 text-center py-4">Loading history...</div>;
  if (error) return <div className="text-red-400 text-center py-4">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Previous Analyses</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No previous analyses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">ATS Score</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">{item.filename}</td>
                  <td className="py-3 px-4">{item.atsScore}</td>
                  <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;

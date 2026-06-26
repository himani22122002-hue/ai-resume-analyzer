import React from 'react';

const DashboardCard = ({ title, children, gradient }) => (
  <div className={`relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:border-white/20 transition-all duration-300 ${gradient}`}>
    <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
    <div className="text-white">
      {children}
    </div>
  </div>
);

const ATSDashboard = ({ analysisData }) => {
  if (!analysisData) {
    return <div className="text-center text-gray-400 p-8">No analysis data available.</div>;
  }

  const { atsScore, missingSkills, missingKeywords, suggestions } = analysisData;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Resume Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="ATS Score" gradient="hover:shadow-purple-500/10">
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {atsScore !== undefined ? `${atsScore}%` : 'N/A'}
          </div>
        </DashboardCard>

        <DashboardCard title="Missing Skills" gradient="hover:shadow-blue-500/10">
          {missingSkills && missingSkills.length > 0 ? (
            <ul className="text-sm text-gray-400 space-y-2">
              {missingSkills.map((skill, index) => <li key={index}>• {skill}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No missing skills identified.</p>
          )}
        </DashboardCard>

        <DashboardCard title="Missing Keywords" gradient="hover:shadow-green-500/10">
          {missingKeywords && missingKeywords.length > 0 ? (
            <ul className="text-sm text-gray-400 space-y-2">
              {missingKeywords.map((keyword, index) => <li key={index}>• {keyword}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No missing keywords identified.</p>
          )}
        </DashboardCard>

        <DashboardCard title="AI Suggestions" gradient="hover:shadow-orange-500/10">
          {suggestions && suggestions.length > 0 ? (
            <ul className="text-sm text-gray-400 leading-relaxed space-y-2">
              {suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No suggestions at this time.</p>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default ATSDashboard;

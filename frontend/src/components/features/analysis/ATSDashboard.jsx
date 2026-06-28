import React from 'react';

const ScoreRing = ({ score }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s < 50) return 'text-red-500 stroke-red-500';
    if (s < 75) return 'text-yellow-500 stroke-yellow-500';
    return 'text-green-500 stroke-green-500';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          className="text-white/10 stroke-current"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`${getColor(score)} transition-all duration-1000 ease-out`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className={`absolute text-2xl font-bold ${getColor(score).split(' ')[0]}`}>
        {score}
      </span>
    </div>
  );
};

const DashboardCard = ({ title, icon, children, gradient }) => (
  <div className={`relative p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl ${gradient}`}>
    <div className="flex items-center gap-3 mb-4">
      <span className="text-purple-400">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
    </div>
    <div className="text-white">{children}</div>
  </div>
);

const Badge = ({ children, type }) => {
  const styles = type === 'match' 
    ? 'bg-green-900/30 text-green-300 border-green-700' 
    : 'bg-red-900/30 text-red-300 border-red-700';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles}`}>{children}</span>;
};

const ATSDashboard = ({ analysisData }) => {
  if (!analysisData) return <div className="text-center text-gray-400 p-8">No analysis data available.</div>;

  const { atsScore, missingSkills, missingKeywords, suggestions, jobMatchAnalysis } = analysisData;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <h2 className="text-4xl font-bold text-white text-center">Analysis Report</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="ATS Score" icon={<span>🎯</span>} gradient="lg:col-span-1 items-center justify-center flex flex-col">
          <ScoreRing score={atsScore || 0} />
        </DashboardCard>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Missing Skills" icon={<span>🛠️</span>}>
            <ul className="text-sm text-gray-400 space-y-2 h-32 overflow-y-auto">
              {missingSkills?.map((skill, i) => <li key={i}>• {skill}</li>) || <li>No missing skills identified.</li>}
            </ul>
          </DashboardCard>
          <DashboardCard title="Missing Keywords" icon={<span>🔑</span>}>
            <ul className="text-sm text-gray-400 space-y-2 h-32 overflow-y-auto">
              {missingKeywords?.map((k, i) => <li key={i}>• {k}</li>) || <li>No missing keywords identified.</li>}
            </ul>
          </DashboardCard>
        </div>
      </div>

      {jobMatchAnalysis && (
        <DashboardCard title="Job Match Analysis" icon={<span>⚖️</span>} gradient="lg:col-span-3">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>Match Score</span>
              <span className="font-bold">{jobMatchAnalysis.matchScore}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${jobMatchAnalysis.matchScore}%` }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {jobMatchAnalysis.matchedSkills?.map(s => <Badge key={s} type="match">{s}</Badge>)}
                  {jobMatchAnalysis.missingSkills?.map(s => <Badge key={s} type="miss">{s}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {jobMatchAnalysis.matchedKeywords?.map(k => <Badge key={k} type="match">{k}</Badge>)}
                  {jobMatchAnalysis.missingKeywords?.map(k => <Badge key={k} type="miss">{k}</Badge>)}
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      )}

      <DashboardCard title="AI Suggestions" icon={<span>💡</span>} gradient="lg:col-span-3">
        <ul className="text-sm text-gray-400 leading-relaxed space-y-3 h-48 overflow-y-auto pr-4">
          {suggestions?.map((s, i) => <li key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">{s}</li>) || <li>No suggestions available.</li>}
        </ul>
      </DashboardCard>
    </div>
  );
};

export default ATSDashboard;

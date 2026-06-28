import React from 'react';

const Section = ({ title, children }) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-purple-400 mb-3 border-b border-white/10 pb-1">{title}</h3>
      {children}
    </div>
  );
};

const Badge = ({ children }) => (
  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-gray-200 border border-white/10">
    {children}
  </span>
);

const EnhancedResumePreview = ({ rewrittenResume }) => {
  if (!rewrittenResume) return null;

  const {
    name,
    professionalSummary,
    skills,
    experience,
    projects,
    education,
    certifications,
    languages
  } = rewrittenResume;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-gray-100 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
      </header>

      {/* Professional Summary */}
      <Section title="Professional Summary">
        <p className="text-gray-300 leading-relaxed">{professionalSummary}</p>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {skills?.map((skill, index) => <Badge key={index}>{skill}</Badge>)}
        </div>
      </Section>

      {/* Experience */}
<Section title="Experience">
  <div className="space-y-4">
    {experience?.map((exp, index) => (
      <div
        key={index}
        className="pl-4 border-l-2 border-purple-500/50"
      >
        <h4 className="font-semibold text-white">
          {exp.title}
        </h4>

        <p className="text-purple-300 text-sm">
          {exp.company} • {exp.location}
        </p>

        <p className="text-gray-500 text-sm">
          {exp.dates}
        </p>

        <p className="text-gray-300 mt-2">
          {exp.description}
        </p>
      </div>
    ))}
  </div>
</Section>
      
      {/* Projects */}
<Section title="Projects">
  <div className="space-y-4">
    {projects?.map((project, index) => (
      <div
        key={index}
        className="pl-4 border-l-2 border-blue-500/50"
      >
        <h4 className="font-semibold text-white">
          {project.title}
        </h4>

        <p className="text-gray-300 mt-2">
          {project.description}
        </p>
      </div>
    ))}
  </div>
</Section>

      {/* Education */}
      <Section title="Education">
  <div className="space-y-4">
    {education?.map((edu, index) => (
      <div key={index}>
        <h4 className="font-semibold text-white">
          {edu.degree}
        </h4>

        <p className="text-purple-300">
          {edu.institution}
        </p>

        <p className="text-gray-400">
          {edu.year}
        </p>
      </div>
    ))}
  </div>
</Section>

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="Certifications">
          <ul className="space-y-2">
            {certifications?.map((cert, index) => (
              <li key={index} className="text-gray-300">• {cert}</li>
            ))}
          </ul>
        </Section>
        <Section title="Languages">
          <ul className="space-y-2">
            {languages?.map((lang, index) => (
              <li key={index} className="text-gray-300">• {lang}</li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default EnhancedResumePreview;

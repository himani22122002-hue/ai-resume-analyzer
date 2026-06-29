import React from 'react';
import { getResumeSections } from '../../../utils/resumeHelper';

const SectionHeader = ({ title }) => (
  <h2 className="text-[20px] font-bold uppercase border-b border-gray-400 mb-2 mt-6">
    {title}
  </h2>
);

const EnhancedResumePreview = ({ rewrittenResume }) => {
  if (!rewrittenResume) return null;

  const sections = getResumeSections(rewrittenResume);

  return (
    <div className="max-w-[850px] mx-auto bg-white text-[#222] p-12 font-sans text-[16px] leading-[1.6]">
      <header className="text-center mb-6">
        <h1 className="text-[40px] font-bold">{rewrittenResume.name || "Name Not Provided"}</h1>
      </header>

      {sections.map((section) => (
        <React.Fragment key={section.id}>
          <SectionHeader title={section.title} />
          
          {section.type === 'text' && <p>{section.content}</p>}
          
          {section.type === 'list' && (
            section.items.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">{item.header}</p>
                {item.subHeader && <p className="text-[15px] text-gray-600">{item.subHeader}</p>}
                {item.footer && <p className="text-[15px] text-gray-600">{item.footer}</p>}
                {item.details && item.details.length > 0 && (
                  <ul className="list-disc ml-5 mt-1">
                    {item.details.map((detail, i) => <li key={i}>{detail}</li>)}
                  </ul>
                )}
              </div>
            ))
          )}

          {section.type === 'skills' && (
            <div className="space-y-1">
              {section.items.map((skillGroup, index) => (
                <p key={index}>
                  <span className="font-bold">{skillGroup.category || "General"}:</span>{" "}
                  {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : (skillGroup.items || "")}
                </p>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EnhancedResumePreview;

import React from 'react';
import { getResumeSections, formatItem } from '../../../utils/resumeHelper';

const SectionHeader = ({ title }) => (
  <h2 className="text-[20px] font-bold uppercase border-b border-gray-400 mb-2 mt-6">
    {title}
  </h2>
);

const EnhancedResumePreview = ({ rewrittenResume }) => {
  if (!rewrittenResume || typeof rewrittenResume !== 'object') return null;

  const sections = getResumeSections(rewrittenResume);

  return (
    <div className="max-w-[850px] mx-auto bg-white text-[#222] p-12 font-sans text-[16px] leading-[1.6]">
      {rewrittenResume.name && (
        <header className="text-center mb-6">
          <h1 className="text-[40px] font-bold">{rewrittenResume.name}</h1>
        </header>
      )}

      {Array.isArray(sections) && sections.map((section) => (
        <React.Fragment key={section.id}>
          <SectionHeader title={section.title} />
          
          {section.type === 'text' && section.content && <p>{section.content}</p>}
          
          {section.type === 'list' && Array.isArray(section.items) && section.items.map((item, index) => (
              <div key={index} className="mb-4">
                {item.header && <p className="font-bold">{item.header}</p>}
                {item.subHeader && <p className="text-[15px] text-gray-600">{item.subHeader}</p>}
                {item.footer && <p className="text-[15px] text-gray-600">{item.footer}</p>}
                {Array.isArray(item.details) && item.details.length > 0 && (
                  <ul className="list-disc ml-5 mt-1">
                    {item.details.map((detail, i) => <li key={i}>{formatItem(detail)}</li>)}
                  </ul>
                )}
              </div>
            ))
          }

          {section.type === 'skills' && Array.isArray(section.items) && (
            <div className="space-y-1">
              {section.items.map((skillGroup, index) => (
                <div key={index} className="mb-1">
                  {skillGroup.category && <span className="font-bold">{skillGroup.category}: </span>}
                  {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EnhancedResumePreview;

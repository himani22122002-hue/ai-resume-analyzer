// Helper functions to structure resume data consistently for Preview, PDF, and DOCX.

export const formatItem = (item, type = 'text') => {
  if (typeof item === 'string') return item;
  if (typeof item === 'object' && item !== null) {
    switch (type) {
      case 'skill':
        return `${item.category || ''}: ${Array.isArray(item.items) ? item.items.join(', ') : (item.items || '')}`;
      case 'experience':
        return `${item.title || ''} at ${item.company || ''} (${item.dates || ''}) - ${item.description || ''}`;
      case 'project':
        return `${item.title || ''}: ${item.description || ''}`;
      case 'education':
        return `${item.degree || ''} from ${item.institution || ''} (${item.graduationYear || ''}) - CGPA: ${item.cgpa || ''}`;
      case 'certification':
        return `${item.name || ''} issued by ${item.issuer || ''}`;
      case 'language':
        return `${item.name || ''} - ${item.proficiency || ''}`;
      default:
        // Only return properties if they are strings or numbers to avoid object rendering errors
        return Object.values(item).filter(val => typeof val === 'string' || typeof val === 'number').join(' - ');
    }
  }
  return typeof item === 'string' || typeof item === 'number' ? String(item) : '';
};

export const getResumeSections = (resume) => {
  if (!resume || typeof resume !== 'object') return [];
  const sections = [];

  if (resume.professionalSummary && typeof resume.professionalSummary === 'string' && resume.professionalSummary.trim().length > 0) {
    sections.push({
      id: 'summary',
      title: 'Professional Summary',
      type: 'text',
      content: resume.professionalSummary
    });
  }

  if (Array.isArray(resume.education)) {
    const validItems = resume.education.map(edu => {
      const details = [];
      const date = edu.graduationYear || edu.expectedGraduation || edu.endDate || edu.passingYear;
      if (date) details.push(`Graduation: ${date}`);
      if (edu.cgpa) details.push(`CGPA: ${edu.cgpa}`);
      if (edu.GPA) details.push(`GPA: ${edu.GPA}`);
      if (edu.percentage) details.push(`Percentage: ${edu.percentage}`);
      if (edu.score) details.push(`Score: ${edu.score}`);
      if (edu.grade) details.push(`Grade: ${edu.grade}`);

      return {
        header: edu.degree,
        subHeader: [edu.institution, edu.location].filter(Boolean).join(' | '),
        details: details
      };
    }).filter(edu => edu.header || edu.subHeader);

    if (validItems.length > 0) {
      sections.push({ id: 'education', title: 'Education', type: 'list', items: validItems });
    }
  }

  if (Array.isArray(resume.experience)) {
    const validItems = resume.experience.map(exp => ({
        header: [exp.company || exp.organization, exp.title, exp.dates].filter(Boolean).join(' | '),
        subHeader: exp.location,
        details: Array.isArray(exp.description) ? exp.description : (exp.description ? [exp.description] : [])
      })).filter(exp => exp.header);

    if (validItems.length > 0) {
      sections.push({ id: 'experience', title: 'Experience', type: 'list', items: validItems });
    }
  }

  if (Array.isArray(resume.volunteerExperience)) {
    const validItems = resume.volunteerExperience.map(vol => ({
        header: [vol.organization, vol.title, vol.dates].filter(Boolean).join(' | '),
        details: Array.isArray(vol.description) ? vol.description : (vol.description ? [vol.description] : [])
      })).filter(vol => vol.header);

    if (validItems.length > 0) {
      sections.push({ id: 'volunteer', title: 'Volunteer Experience', type: 'list', items: validItems });
    }
  }

  if (Array.isArray(resume.projects)) {
    const validItems = resume.projects.map(proj => ({
        header: proj.title,
        details: Array.isArray(proj.description) ? proj.description : (proj.description ? [proj.description] : [])
      })).filter(proj => proj.header);

    if (validItems.length > 0) {
      sections.push({ id: 'projects', title: 'Projects', type: 'list', items: validItems });
    }
  }

  if (Array.isArray(resume.skills)) {
    const validItems = resume.skills.map(skill => {
        if (typeof skill === 'string' && skill.trim().length > 0) return { category: 'General', items: [skill] };
        if (typeof skill === 'object' && skill !== null) {
          const items = Array.isArray(skill.items) ? skill.items.filter(i => i) : (skill.items ? [skill.items] : []);
          if (items.length > 0) {
            return {
              category: skill.category || 'Skills',
              items: items
            };
          }
        }
        return null;
      }).filter(Boolean);

    if (validItems.length > 0) {
      sections.push({ id: 'skills', title: 'Skills', type: 'skills', items: validItems });
    }
  }

  if (Array.isArray(resume.certifications)) {
    const validItems = resume.certifications.map(cert => ({
        header: (typeof cert === 'string') ? cert : ([cert.name, cert.title, cert.issuer].filter(Boolean).join(' | '))
      })).filter(cert => cert.header);

    if (validItems.length > 0) {
      sections.push({ id: 'certifications', title: 'Certifications', type: 'list', items: validItems });
    }
  }

  if (Array.isArray(resume.languages)) {
    const validItems = resume.languages.map(lang => {
      if (typeof lang === 'string') return { header: lang };
      if (typeof lang === 'object' && lang !== null && (lang.name || lang.proficiency)) {
        const parts = [];
        if (lang.name) parts.push(lang.name);
        if (lang.proficiency) parts.push(`(${lang.proficiency})`);
        return { header: parts.join(' ') };
      }
      return null;
    }).filter(lang => lang && lang.header);

    if (validItems.length > 0) {
      sections.push({ id: 'languages', title: 'Languages', type: 'list', items: validItems });
    }
  }

  return sections;
};

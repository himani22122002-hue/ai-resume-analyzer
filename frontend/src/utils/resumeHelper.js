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
        return item.name || item.title || JSON.stringify(item);
    }
  }
  return String(item);
};

export const getResumeSections = (resume) => {
  if (!resume) return [];
  const sections = [];

  if (resume.professionalSummary) {
    sections.push({
      id: 'summary',
      title: 'Professional Summary',
      type: 'text',
      content: resume.professionalSummary
    });
  }

  if (Array.isArray(resume.education) && resume.education.length > 0) {
    sections.push({
      id: 'education',
      title: 'Education',
      type: 'list',
      items: resume.education.map(edu => ({
       header: edu.degree || "N/A",
subHeader: `${edu.institution || "N/A"}${edu.location ? ` | ${edu.location}` : ""}`,
footer: edu.graduationYear || "N/A",
details: edu.cgpa ? [`CGPA: ${edu.cgpa}`] : []
      }))
    });
  }

  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    sections.push({
      id: 'experience',
      title: 'Experience',
      type: 'list',
      items: resume.experience.map(exp => ({
        header: `${exp.company || exp.organization || "N/A"} | ${exp.title || "N/A"} | ${exp.dates || "N/A"}`,
        subHeader: exp.location || "",
        details: exp.description
  ? (Array.isArray(exp.description)
      ? exp.description
      : [exp.description])
  : []
      }))
    });
  }

  if (Array.isArray(resume.volunteerExperience) && resume.volunteerExperience.length > 0) {
    sections.push({
      id: 'volunteer',
      title: 'Volunteer Experience',
      type: 'list',
      items: resume.volunteerExperience.map(vol => ({
        header: `${vol.organization || "N/A"} | ${vol.title || "N/A"} | ${vol.dates || "N/A"}`,
        details: vol.description
  ? (Array.isArray(vol.description)
      ? vol.description
      : [vol.description])
  : []
      }))
    });
  }

  if (Array.isArray(resume.projects) && resume.projects.length > 0) {
    sections.push({
      id: 'projects',
      title: 'Projects',
      type: 'list',
      items: resume.projects.map(proj => ({
        header: proj.title || "Untitled Project",
        details: proj.description
  ? (Array.isArray(proj.description)
      ? proj.description
      : [proj.description])
  : []
      }))
    });
  }

  if (Array.isArray(resume.skills) && resume.skills.length > 0) {
    sections.push({
      id: 'skills',
      title: 'Skills',
      type: 'skills',
      items: resume.skills
    });
  }

  if (Array.isArray(resume.certifications) && resume.certifications.length > 0) {
    sections.push({
      id: 'certifications',
      title: 'Certifications',
      type: 'list',
      items: resume.certifications.map(cert => ({
        header: `${cert.name || "N/A"}${cert.issuer ? ` | ${cert.issuer}` : ""}`
      }))
    });
  }

  if (Array.isArray(resume.languages) && resume.languages.length > 0) {
    sections.push({
      id: 'languages',
      title: 'Languages',
      type: 'list',
      items: resume.languages.map(lang => ({
        header: `${lang.name || "N/A"}${lang.proficiency ? ` (${lang.proficiency})` : ""}`
      }))
    });
  }

  return sections;
};

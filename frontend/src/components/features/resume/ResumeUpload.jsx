import React, { useState, useRef } from 'react';
import api from '../../../services/api';
import ATSDashboard from '../analysis/ATSDashboard';
import EnhancedResumePreview from './EnhancedResumePreview';
import ResumePreview from './ResumePreview';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const ResumeUpload = ({ jobDescription }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const loadingSteps = ['Uploading Resume', 'Extracting Text', 'AI Resume Analysis'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setUploadResult(null);

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
    setLoadingStep(0);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      setLoadingStep(3);
      setUploadResult(response.data);
      setLoading(false);
      
      // Save to history
      try {
        await saveHistory(selectedFile.name, response.data.atsAnalysis.atsScore);
        if (window.refreshResumeHistory) {
          window.refreshResumeHistory();
        }
      } catch (historyErr) {
        console.error("Failed to save to history:", historyErr);
      }
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.message || 'An error occurred during analysis.');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!uploadResult || !uploadResult.atsAnalysis) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const { atsScore, missingSkills, missingKeywords, suggestions } = uploadResult.atsAnalysis;

    const pageWidth = doc.internal.pageSize.width;

    const addHeaderFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        // Header
        doc.setFillColor(0, 51, 102);
        const pageHeight = doc.internal.pageSize.height;
        doc.rect(0, 0, pageWidth, 22, "F");
        doc.setTextColor(255);
        doc.setFontSize(18);
        doc.text("AI Resume Analyzer Report", 18, 14);
        // Footer
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(`Generated using AI Resume Analyzer | Page ${i} of ${pageCount}`, 10, 290);
      }
    };

    // ATS Score
    const getScoreColor = (s) => (s >= 80 ? [0, 128, 0] : s >= 60 ? [204, 204, 0] : [255, 0, 0]);
    doc.setFillColor(...getScoreColor(atsScore));
    doc.roundedRect(18, 30, 80, 18, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`ATS Score: ${atsScore}%`, 25, 42);

    const createTable = (title, items) => {
      autoTable(doc, {
        head: [[title]],
        body: items.map((item) => [`• ${item}`]),
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 55,
        theme: "grid",
        margin: { top: 25, bottom: 20, left: 18, right: 18 },
        styles: { fontSize: 10, overflow: "linebreak", cellPadding: 4 },
        headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 12 },
        pageBreak: "auto",
        didDrawPage: function () {
            const pageHeight = doc.internal.pageSize.getHeight();
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.text(`Generated using AI Resume Analyzer | Page ${pageNumber}`, 18, pageHeight - 10);
        }
      });
    };

    createTable('Missing Skills', missingSkills);
    createTable('Missing Keywords', missingKeywords);
    createTable('AI Suggestions', suggestions);

    addHeaderFooter();
    doc.save('resume-report.pdf');
  };

  const handleDownloadRewrittenPdf = () => {
    if (!uploadResult?.rewrittenResume) return;
    const { name, professionalSummary, skills, experience, projects, education, certifications, languages } = uploadResult.rewrittenResume;
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(name, 10, 20);
    doc.setFontSize(12);
    
    let y = 30;
    const addSection = (title, items) => {
        doc.setFontSize(14);
        doc.text(title, 10, y);
        y += 7;
        doc.setFontSize(12);
        (Array.isArray(items) ? items : [items]).forEach(item => {
            const lines = doc.splitTextToSize(item, 180);
            doc.text(lines, 10, y);
            y += lines.length * 7;
        });
        y += 5;
    };

    addSection("Professional Summary", professionalSummary);
    addSection("Skills", skills.join(", "));
    addSection("Experience", experience);
    addSection("Projects", projects);
    addSection("Education", education);
    addSection("Certifications", certifications);
    addSection("Languages", languages);

    doc.save('enhanced-resume.pdf');
  };

  const handleDownloadRewrittenDocx = async () => {
  if (!uploadResult?.rewrittenResume) return;

  const {
    name,
    professionalSummary,
    skills = [],
    experience = [],
    projects = [],
    education = [],
    certifications = [],
    languages = [],
  } = uploadResult.rewrittenResume;

  const children = [];

  // Name
  children.push(
    new Paragraph({
      text: name || "Resume",
      heading: HeadingLevel.HEADING_1,
    })
  );

  // Summary
  children.push(
    new Paragraph({
      text: "Professional Summary",
      heading: HeadingLevel.HEADING_2,
    })
  );

  children.push(
    new Paragraph({
      text: professionalSummary || "",
    })
  );

  // Skills
  if (skills.length) {
    children.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
      })
    );

    children.push(
      new Paragraph({
        text: skills.join(", "),
      })
    );
  }

  // Experience
  if (experience.length) {
    children.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_2,
      })
    );

    experience.forEach((exp) => {
      if (typeof exp === "string") {
        children.push(
          new Paragraph({
            text: exp,
            bullet: { level: 0 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            text: `${exp.title || ""} - ${exp.company || ""}`,
            bullet: { level: 0 },
          })
        );

        if (exp.dates) {
          children.push(
            new Paragraph({
              text: exp.dates,
            })
          );
        }

        if (exp.description) {
          children.push(
            new Paragraph({
              text: exp.description,
            })
          );
        }
      }
    });
  }

  // Projects
  if (projects.length) {
    children.push(
      new Paragraph({
        text: "Projects",
        heading: HeadingLevel.HEADING_2,
      })
    );

    projects.forEach((project) => {
      if (typeof project === "string") {
        children.push(
          new Paragraph({
            text: project,
            bullet: { level: 0 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            text: project.title || "",
            bullet: { level: 0 },
          })
        );

        if (project.description) {
          children.push(
            new Paragraph({
              text: project.description,
            })
          );
        }
      }
    });
  }

  // Education
  if (education.length) {
    children.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
      })
    );

    education.forEach((edu) => {
      if (typeof edu === "string") {
        children.push(
          new Paragraph({
            text: edu,
          })
        );
      } else {
        children.push(
          new Paragraph({
            text: `${edu.degree || ""} - ${edu.institution || ""}`,
          })
        );
      }
    });
  }

  // Certifications
  if (certifications.length) {
    children.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_2,
      })
    );

    certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          text: cert,
          bullet: { level: 0 },
        })
      );
    });
  }

  // Languages
  if (languages.length) {
    children.push(
      new Paragraph({
        text: "Languages",
        heading: HeadingLevel.HEADING_2,
      })
    );

    languages.forEach((lang) => {
      children.push(
        new Paragraph({
          text: lang,
          bullet: { level: 0 },
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  // Browser-compatible
  const blob = await Packer.toBlob(doc);

  saveAs(blob, "enhanced-resume.docx");
};

  return (
    <div className="w-full">
      {!uploadResult ? (
        <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
            <p className="text-gray-400">Upload your resume in PDF format (.pdf)</p>
          </div>

          {!loading && (
            <div
              className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-white/40 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <button type="button" className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Browse Resume
              </button>
            </div>
          )}

          {selectedFile && !loading && (
            <div className="mt-4 text-center">
              <p className="text-green-400 font-medium mb-4">Selected: {selectedFile.name}</p>
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
              >
                Analyze Resume
              </button>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              <p className="text-center text-purple-300 font-medium animate-pulse">AI is analyzing your resume...</p>
              
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full animate-progress" style={{ width: `${(loadingStep + 1) * 33.3}%` }}></div>
              </div>

              <div className="space-y-2">
                {loadingSteps.map((step, index) => (
                  <div key={step} className={`flex items-center gap-2 text-sm ${index <= loadingStep ? 'text-white' : 'text-gray-500'}`}>
                    {index < loadingStep ? '✓' : index === loadingStep ? '⏳' : '○'} {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-center text-red-400 font-medium">{error}</p>}
        </div>
      ) : (
        <div className="space-y-8">
          <ResumePreview text={uploadResult.extractedText} />
          <ATSDashboard
  analysisData={{
    ...uploadResult.atsAnalysis,
    jobMatchAnalysis: uploadResult.jobMatchAnalysis,
    optimizer: uploadResult.optimizer,
  }}
/>
          {uploadResult.rewrittenResume && (
            <div className="space-y-6">
                <EnhancedResumePreview rewrittenResume={uploadResult.rewrittenResume} />
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDownloadRewrittenPdf}
                        disabled={!uploadResult.rewrittenResume}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        Download Enhanced Resume (PDF)
                    </button>
                    <button
                        onClick={handleDownloadRewrittenDocx}
                        disabled={!uploadResult.rewrittenResume}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        Download Enhanced Resume (DOCX)
                    </button>
                </div>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResumeUpload;

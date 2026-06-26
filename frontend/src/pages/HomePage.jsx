import ResumeUpload from '../components/features/resume/ResumeUpload';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pt-16">
      {/* Hero Section */}
      <header className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Resume Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Upload your resume and receive an AI-powered ATS score, missing skills, keyword analysis, and improvement suggestions.
          </p>
          <button className="px-8 py-4 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out">
            Analyze Resume
          </button>
        </div>
      </header>

      {/* Resume Upload Section */}
      <section className="py-12 p-4">
        <ResumeUpload />
      </section>

      {/* Optional: Footer */}
      <footer className="p-4 bg-gray-800 text-gray-400 text-center text-sm">
        <div className="container mx-auto">
          &copy; 2023 AI Resume Analyzer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

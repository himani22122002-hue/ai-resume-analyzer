/**
 * JobDescriptionInput Component
 * 
 * A reusable text area component designed for users to paste a job description.
 * Features a character counter, configurable maximum length, dynamic warning states,
 * and standard styling matching the AI Resume Analyzer dark theme.
 * 
 * Props:
 * @param {string} value - Current value of the input.
 * @param {function} onChange - Callback triggered when input value changes. Receives the raw text string.
 * @param {number} maxLength - Maximum allowable character length (default: 5000).
 * @param {string} placeholder - Placeholder text inside the textarea.
 * @param {string} label - Text label for the component. Set to null or empty string to hide.
 * @param {boolean} disabled - Whether the field is disabled (e.g. during an ongoing analysis).
 * @param {string} error - Optional validation error message to display under the input.
 * @param {string} className - Additional CSS classes for the container.
 */
const JobDescriptionInput = ({
  value = '',
  onChange,
  maxLength = 5000,
  placeholder = 'Paste the job description here to analyze how well your resume matches its requirements...',
  label = 'Job Description',
  disabled = false,
  error = '',
  className = '',
}) => {
  const charCount = value.length;
  const isLimitReached = charCount >= maxLength;
  const isNearLimit = charCount >= maxLength * 0.9; // Warning color when at 90% capacity

  const handleChange = (e) => {
    const text = e.target.value;
    // Enforce hard character limit
    if (text.length <= maxLength) {
      if (onChange) {
        onChange(text);
      }
    }
  };

  return (
    <div className={`flex flex-col w-full text-left ${className}`}>
      {label && (
        <label className="mb-2 text-sm font-semibold text-gray-300 flex justify-between items-center">
          <span>{label}</span>
          <span className="text-xs font-normal text-gray-500">
            For targeted ATS analysis
          </span>
        </label>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          rows={6}
          className={`w-full p-4 rounded-xl bg-gray-800 border text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-200 resize-y min-h-[160px] md:min-h-[220px] ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-700 hover:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-900' : ''}`}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2 px-1">
        {/* Info or error message block */}
        <div className="flex-1">
          {error ? (
            <p className="text-sm text-red-400 flex items-center gap-1.5" role="alert">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Paste details like responsibilities, key skills, and qualifications.
            </p>
          )}
        </div>

        {/* Responsive Character Counter */}
        <div className="flex-shrink-0 self-end sm:self-auto">
          <span
            className={`text-xs px-2.5 py-1 rounded bg-gray-800/40 border font-mono font-medium transition-colors duration-200 ${
              isLimitReached
                ? 'text-red-400 border-red-500/30 bg-red-950/10'
                : isNearLimit
                ? 'text-amber-400 border-amber-500/30 bg-amber-950/10'
                : 'text-gray-400 border-gray-700/30'
            }`}
          >
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { uploadResume } from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const ResumeUpload = () => {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);

  const navigate = useNavigate();

  const steps = [
    'Parsing PDF layout and content...',
    'Evaluating ATS compatibility index...',
    'Identifying skill gaps & strong qualifications...',
    'Formulating day-wise 30-day learning roadmap...',
    'Curating courses & YouTube recommendations...'
  ];

  // Rotate analysis steps text while waiting for response
  useEffect(() => {
    let interval;
    if (loading && analysisStep < steps.length - 1) {
      interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 5000); // Progress to next text every 5 seconds
    }
    return () => clearInterval(interval);
  }, [loading, analysisStep, steps.length]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Only PDF files are supported.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Only PDF files are supported.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      return setError('Please upload your resume PDF first.');
    }
    if (!role.trim()) {
      return setError('Please specify your target job role.');
    }

    setLoading(true);
    setAnalysisStep(0);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      const report = await uploadResume(formData);
      // Wait momentarily for loader experience
      setTimeout(() => {
        navigate(`/report/${report._id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Failed to parse or analyze resume. Please ensure the PDF is not encrypted and try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <Sidebar />

      <div className="pl-64 min-h-screen relative">
        {/* Glow backgrounds */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>

        <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-8 bg-gray-900/10 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white">New Career Readiness Scan</h1>
        </header>

        {loading ? (
          // Dynamic Loading Screen with Steps
          <div className="flex flex-col items-center justify-center p-12 min-h-[calc(100vh-80px)]">
            <div className="relative flex items-center justify-center mb-10">
              <div className="absolute w-28 h-28 rounded-full border-4 border-purple-500/15 border-t-purple-500 animate-spin"></div>
              <div className="w-20 h-20 rounded-full border-4 border-blue-500/15 border-t-blue-400 animate-spin [animation-direction:reverse]"></div>
              <FileText className="absolute w-7 h-7 text-purple-400 animate-pulse" />
            </div>

            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-lg font-bold text-white text-center mb-4">Gemini AI is Reviewing Your Application</h2>
              
              <div className="space-y-3.5">
                {steps.map((stepText, idx) => {
                  const isCompleted = idx < analysisStep;
                  const isActive = idx === analysisStep;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 transition-opacity duration-300 ${
                        isCompleted ? 'text-purple-400 font-medium' : isActive ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-purple-500 fill-purple-500/10" />
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0"></div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-800 shrink-0"></div>
                      )}
                      <span className="text-sm">{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Form Interface
          <main className="p-8 max-w-3xl mx-auto space-y-8 pt-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Upload & Analyze</h2>
              <p className="text-gray-400 text-sm">
                Provide your target job role and upload your latest resume. Our AI will analyze your suitability and construct your career-bridging roadmap.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-800">
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Frontend Engineer, ML Engineer"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-500 transition-colors duration-200 text-sm"
                  required
                />
              </div>

              {/* Upload Dropzone */}
              <div 
                className={`glass-panel p-8 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  dragActive ? 'border-purple-500 bg-purple-950/10' : 'border-gray-800 hover:border-gray-700'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl text-gray-400 mb-4 shadow-inner">
                    <UploadCloud className="w-8 h-8 text-purple-400" />
                  </div>
                  
                  {file ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {Math.round(file.size / 1024)} KB • PDF Document
                      </p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 underline"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-white">
                        Drag and drop your PDF resume here
                      </p>
                      <p className="text-xs text-gray-400">
                        or click the button below to browse files
                      </p>
                      
                      <div className="pt-4">
                        <label className="px-4 py-2 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/50 text-gray-300 hover:text-white font-semibold text-xs transition-all duration-200 cursor-pointer shadow-inner">
                          Select PDF File
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-purple-blue hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-base transition-all duration-200 shadow-xl shadow-purple-500/10 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Career Readiness
              </button>
            </form>
          </main>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Search, 
  Compass, 
  Layers, 
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck,
  GraduationCap
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] bg-grid-pattern relative">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

      {/* Header / Navbar */}
      <header className="border-b border-gray-800/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              SkillGap <span className="text-purple-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg bg-gradient-purple-blue text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-500/20"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/50 text-xs font-semibold text-purple-300 mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 1.5 Flash
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
          Bridge the Gap Between <span className="text-gradient">Academics</span> and your <span className="text-gradient">Dream Job</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and get an instant ATS score check, custom industry skills analysis, a 30-day day-wise learning roadmap, and direct learning resources.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link
            to={user ? '/upload' : '/register'}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-purple-blue text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-purple-500/10 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            Start Analyzing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 text-gray-300 hover:text-white font-semibold text-base transition-all duration-200"
          >
            Learn How It Works
          </a>
        </div>

        {/* Dashboard Preview / Mockup Panel */}
        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-gray-800/80 shadow-2xl shadow-purple-500/5 glass-panel p-2 animate-fade-in">
          <div className="rounded-xl overflow-hidden bg-gray-950/80 border border-gray-800 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 text-left space-y-4">
              <div className="h-6 w-32 bg-gray-800 rounded-md animate-pulse"></div>
              <div className="h-10 w-3/4 bg-gray-800 rounded-md animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-800/60 rounded-md animate-pulse"></div>
                <div className="h-4 w-full bg-gray-800/60 rounded-md animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-800/60 rounded-md animate-pulse"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse"></div>
                <div className="h-8 w-28 bg-gray-800 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="w-full md:w-64 flex items-center justify-center bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#1F2937" strokeWidth="10" fill="transparent" />
                  <circle cx="72" cy="72" r="60" stroke="#8B5CF6" strokeWidth="10" fill="transparent" strokeDasharray="377" strokeDashoffset="113" strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-white">70%</span>
                  <span className="block text-[10px] text-gray-400 font-medium">ATS Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800/40 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Core Platform Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to optimize your credentials and build the exact skills recruiters look for.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-gray-800 hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ATS Compatibility Scorer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find out how your resume scores against standard applicant tracking filters. Identify missing keywords and get recommendations to optimize formatting.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl border border-gray-800 hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Skill Gap Analyzer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Gemini AI analyzes the job description requirements for your target role, contrasts it with your resume, and maps out exact skill deficiencies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-gray-800 hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-fit mb-6">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">30-Day Custom Roadmap</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get an interactive day-by-day learning structure targeting your weaknesses, complete with links to free and paid courses to accelerate your studies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/40 py-8 bg-gray-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SkillGap AI. Built for Student Career Readiness.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

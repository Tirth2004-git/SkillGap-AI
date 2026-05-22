import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getReportById } from '../services/api';
import { 
  Award, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  PlayCircle, 
  CheckSquare, 
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Bookmark,
  CalendarDays
} from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const AIReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeWeek, setActiveWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the requested report details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Load task completion status from localStorage
  useEffect(() => {
    if (report) {
      const savedTasks = localStorage.getItem(`report_${id}_tasks`);
      if (savedTasks) {
        setCompletedTasks(JSON.parse(savedTasks));
      }
    }
  }, [report, id]);

  const toggleTask = (day, taskIdx) => {
    const taskKey = `${day}_${taskIdx}`;
    const updated = {
      ...completedTasks,
      [taskKey]: !completedTasks[taskKey]
    };
    setCompletedTasks(updated);
    localStorage.setItem(`report_${id}_tasks`, JSON.stringify(updated));
  };

  if (loading) {
    return <LoadingScreen message="Retrieving your personalized career report..." />;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-gray-200">
        <Sidebar />
        <div className="pl-64 flex flex-col items-center justify-center p-12 min-h-screen">
          <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Report</h2>
            <p className="text-gray-400 text-sm mb-6">{error || 'Report not found or access denied.'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ATS color scheme
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-red-400 stroke-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <Sidebar />

      <div className="pl-64 min-h-screen pb-16">
        <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-8 bg-gray-900/10 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Analysis Report for {report.role}
            </h1>
            <span className="text-xs text-gray-400">
              Analyzed on {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/40 text-gray-300 hover:text-white font-semibold text-sm transition-all duration-200"
          >
            All Reports
          </button>
        </header>

        <main className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Top Panel: Score and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ATS Score Card */}
            <div className={`glass-panel p-8 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreBg(report.atsScore)}`}>
              <h2 className="text-base font-bold text-white mb-6 uppercase tracking-wider">ATS Compatibility</h2>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="68" 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="68" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="427" 
                    strokeDashoffset={427 - (427 * report.atsScore) / 100} 
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${getScoreColor(report.atsScore)}`}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-extrabold text-white">{report.atsScore}%</span>
                  <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Score</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-6 max-w-[200px]">
                Higher compatibility increases your resume review callback rates.
              </p>
            </div>

            {/* AI Summary Card */}
            <div className="glass-panel p-8 rounded-2xl border border-gray-800 lg:col-span-2 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  AI Readiness Assessment
                </h2>
                <p className="text-gray-300 text-base leading-relaxed font-light">
                  {report.summary}
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Target Role</span>
                  <span className="block text-sm font-semibold text-purple-400">{report.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status</span>
                  <span className={`block text-xs font-bold ${
                    report.atsScore >= 70 ? 'text-emerald-400' : report.atsScore >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {report.atsScore >= 70 ? 'Ready' : report.atsScore >= 50 ? 'Needs Work' : 'Skill Gap'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Panel: Strong vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strong Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-4 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Matching Strengths ({report.strongSkills.length})
              </h3>
              {report.strongSkills.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No corresponding skills detected in the resume.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {report.strongSkills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-4 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Identified Skill Gaps ({report.missingSkills.length})
              </h3>
              {report.missingSkills.length === 0 ? (
                <p className="text-xs text-emerald-400 italic">Excellent! No missing major technical skills found.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {report.missingSkills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-4 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-purple-400" />
              Resume Optimization Suggestions
            </h3>
            <ul className="space-y-3.5">
              {report.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed font-light">
                  <div className="mt-1 text-purple-500 shrink-0">•</div>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 30-Day Learning Roadmap */}
          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gray-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <CalendarDays className="w-5 h-5 text-purple-400" />
                  30-Day Learning Roadmap
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Check off the days as you complete each study plan.
                </p>
              </div>

              {/* Week Switcher Tabs */}
              <div className="flex bg-gray-950/80 border border-gray-800 rounded-xl p-1 self-start sm:self-center">
                {[1, 2, 3, 4].map((weekNum) => (
                  <button
                    key={weekNum}
                    onClick={() => setActiveWeek(weekNum)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeWeek === weekNum 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Week {weekNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Week View */}
            <div className="p-6">
              {report.roadmap && report.roadmap.map((weekObj, wIdx) => {
                if (weekObj.week !== activeWeek) return null;
                return (
                  <div key={wIdx} className="space-y-6">
                    {/* Focus banner */}
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Weekly Objective</span>
                      <p className="text-sm font-semibold text-white mt-0.5">{weekObj.focus}</p>
                    </div>

                    {/* Days Accordion */}
                    <div className="space-y-4">
                      {weekObj.days && weekObj.days.map((dayObj, dIdx) => (
                        <div 
                          key={dIdx}
                          className="border border-gray-800 rounded-xl bg-gray-900/10 overflow-hidden"
                        >
                          <div className="px-5 py-4 bg-gray-900/30 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white">
                              Day {dayObj.day}: <span className="text-gray-300 font-normal">{dayObj.topic}</span>
                            </h4>
                          </div>

                          <div className="px-5 py-4 border-t border-gray-800 bg-gray-950/10 space-y-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Day Tasks</span>
                            
                            <ul className="space-y-2.5">
                              {dayObj.tasks && dayObj.tasks.map((task, tIdx) => {
                                const isDone = completedTasks[`${dayObj.day}_${tIdx}`];
                                return (
                                  <li 
                                    key={tIdx}
                                    onClick={() => toggleTask(dayObj.day, tIdx)}
                                    className="flex items-start gap-3 cursor-pointer group text-sm"
                                  >
                                    <div className="mt-0.5 shrink-0 transition-colors duration-200">
                                      {isDone ? (
                                        <CheckSquare className="w-4.5 h-4.5 text-purple-500 fill-purple-500/10" />
                                      ) : (
                                        <Square className="w-4.5 h-4.5 text-gray-600 group-hover:text-gray-400" />
                                      )}
                                    </div>
                                    <span className={`transition-all duration-200 leading-normal ${
                                      isDone ? 'line-through text-gray-500' : 'text-gray-300 group-hover:text-white'
                                    }`}>
                                      {task}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Recommended Course Pathways
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {report.recommendedCourses && report.recommendedCourses.map((course, idx) => (
                <div 
                  key={idx}
                  className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded uppercase tracking-wide">
                        {course.platform}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                        course.type === 'Free' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'
                      }`}>
                        {course.type}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {course.name}
                    </h4>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
                    <a
                      href={course.url || `https://www.google.com/search?q=${encodeURIComponent(course.name + ' ' + course.platform)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors duration-150"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Access Course
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIReport;

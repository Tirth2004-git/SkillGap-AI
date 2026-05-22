import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getReportsHistory, deleteReport } from '../services/api';
import { 
  FileText, 
  Award, 
  History, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Briefcase,
  Calendar,
  AlertCircle
} from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const data = await getReportsHistory();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your reports history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent navigation
    if (window.confirm('Are you sure you want to delete this analysis report?')) {
      try {
        await deleteReport(id);
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete report.');
      }
    }
  };

  // Compute metrics
  const totalScans = reports.length;
  const avgScore = totalScans 
    ? Math.round(reports.reduce((acc, curr) => acc + curr.atsScore, 0) / totalScans) 
    : 0;
  const maxScore = totalScans 
    ? Math.max(...reports.map(r => r.atsScore)) 
    : 0;

  if (loading) {
    return <LoadingScreen message="Loading dashboard overview..." />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="pl-64 min-h-screen">
        <header className="h-20 border-b border-gray-800/50 flex items-center justify-between px-8 bg-gray-900/10 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white">Dashboard Overview</h1>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-purple-blue text-white text-sm font-semibold shadow-lg shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Scan
          </Link>
        </header>

        <main className="p-8 max-w-6xl mx-auto space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-5">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Resumes Scanned</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{totalScans}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-5">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Average ATS Score</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{avgScore}%</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-5">
              <div className="p-4 bg-pink-500/10 text-pink-400 rounded-xl">
                <History className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest Match</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{maxScore}%</span>
              </div>
            </div>
          </div>

          {/* Scans List / History */}
          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800/80 bg-gray-900/20 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                Analysis History
              </h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-full">
                {reports.length} report{reports.length !== 1 ? 's' : ''}
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4 border border-gray-800 text-gray-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No resumes scanned yet</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                  Upload your first PDF resume to run an automated ATS check and career roadmap.
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-800/60">
                {reports.map((report) => (
                  <div 
                    key={report._id}
                    className="p-6 hover:bg-gray-900/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => navigate(`/report/${report._id}`)}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 font-semibold text-xs border border-purple-500/20 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {report.role}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(report.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 pr-6">
                        {report.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 self-start sm:self-center shrink-0">
                      {/* ATS Score Indicator */}
                      <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-xl">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-bold tracking-wide text-gray-500">ATS Match</span>
                          <span className="text-base font-bold text-white">{report.atsScore}%</span>
                        </div>
                        <div className="w-2.5 h-10 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`w-full rounded-full transition-all duration-500 ${
                              report.atsScore >= 70 
                                ? 'bg-emerald-500' 
                                : report.atsScore >= 50 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ height: `${report.atsScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={(e) => handleDelete(report._id, e)}
                        className="p-2.5 rounded-lg border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

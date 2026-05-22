import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  LogOut, 
  Sparkles,
  User,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Resume', path: '/upload', icon: UploadCloud },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-gray-800 flex flex-col justify-between z-30">
      <div>
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800/60 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              SkillGap <span className="text-purple-400">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="mt-8 px-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600/10 text-purple-400 border-l-2 border-purple-500'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`
            }
          >
            <Home className="w-4 h-4" />
            Landing Page
          </NavLink>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-400 border-l-2 border-purple-500 shadow-[inset_0_0_10px_rgba(168,85,247,0.05)]'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Session profile and logout */}
      <div className="p-4 border-t border-gray-800/60 bg-gray-900/30">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name || 'Guest User'}</h4>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'guest@skillgap.ai'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

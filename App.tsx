
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Utensils,
  ChefHat,
  BarChart3,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu as MenuIcon,
  X,
  MessageSquare,
  BarChart2
} from 'lucide-react';
import { SidebarTab } from './types';
import Dashboard from './components/Dashboard';
import LeaveManagement from './components/LeaveManagement';
import MealPlanning from './components/MealPlanning';
import MenuManagement from './components/MenuManagement';
import Analytics from './components/Analytics';
import Billing from './components/Billing';
import UserManagement from './components/UserManagement';
import SystemSettings from './components/SystemSettings';
import Polls from './components/Polls';
import Reviews from './components/Reviews';

import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check for existing session
  useEffect(() => {
    const savedEmail = localStorage.getItem('messease_user');
    if (savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('messease_user', email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('messease_user');
  };

  const navigation = [
    { id: SidebarTab.Dashboard, icon: LayoutDashboard, label: 'Dashboard' },
    { id: SidebarTab.Leaves, icon: CalendarCheck, label: 'Attendance & Leaves' },
    { id: SidebarTab.MealPlanning, icon: ChefHat, label: 'Meal Planning' },
    { id: SidebarTab.Menu, icon: Utensils, label: 'Manage Menu' },
    { id: SidebarTab.Reviews, icon: MessageSquare, label: 'Feedback & Reviews' },
    { id: SidebarTab.Polls, icon: BarChart2, label: 'Student Polls' },
    { id: SidebarTab.Analytics, icon: BarChart3, label: 'Analytics' },
    { id: SidebarTab.Billing, icon: CreditCard, label: 'Billing & Finance' },
    { id: SidebarTab.Users, icon: Users, label: 'Users' },
    { id: SidebarTab.Settings, icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case SidebarTab.Dashboard: return <Dashboard />;
      case SidebarTab.Leaves: return <LeaveManagement />;
      case SidebarTab.MealPlanning: return <MealPlanning />;
      case SidebarTab.Menu: return <MenuManagement />;
      case SidebarTab.Reviews: return <Reviews />;
      case SidebarTab.Polls: return <Polls />;
      case SidebarTab.Analytics: return <Analytics />;
      case SidebarTab.Billing: return <Billing />;
      case SidebarTab.Users: return <UserManagement />;
      case SidebarTab.Settings: return <SystemSettings />;
      default: return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const isConfigMissing = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'PLACEHOLDER';

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden animate-in fade-in duration-700 relative font-sans">
      {isConfigMissing && (
        <div className="absolute top-0 left-0 w-full bg-red-500/90 backdrop-blur text-white z-[60] p-3 text-center text-sm font-semibold shadow-lg">
          CRITICAL: Firebase Configuration Missing. Please update .env.local via terminal.
        </div>
      )}
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-sm border border-slate-100"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} className="text-slate-600" /> : <MenuIcon size={20} className="text-slate-600" />}
      </button>

      {/* Modern Floating-style Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-4 left-4 z-40 w-72 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform lg:relative lg:translate-x-0 lg:inset-y-0 lg:left-0 lg:shadow-none lg:bg-transparent lg:border-none lg:rounded-none flex flex-col
      `}>
        {/* lg:bg-transparent to blend with background, but we need inner container if we want card look. 
             Actually, let's make the sidebar on Desktop a clean white panel attached to the left, 
             or a floating island. Let's go for specific distinct look: "Soft Island" */}

        <div className="h-full flex flex-col bg-white lg:bg-transparent lg:pr-4">
          {/* Inner container for desktop spacing */}
          <div className="flex-1 flex flex-col lg:bg-white lg:rounded-r-3xl lg:border-r lg:border-slate-100">
            <div className="p-8 pb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
                <Utensils size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight font-heading">MessEase</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
              {navigation.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                      ${activeTab === item.id
                      ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100/50 translate-x-1'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                  <item.icon size={18} className={`transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              ))}

              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Management</p>
              {navigation.slice(5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                      ${activeTab === item.id
                      ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100/50 translate-x-1'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                  <item.icon size={18} className={`transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-50 mx-4 mb-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 z-30 bg-[#F8F9FC]/80 backdrop-blur-sm sticky top-0">
          <div className="flex items-center space-x-4 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-800 font-heading">
              {navigation.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center space-x-5">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-full text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-48 shadow-sm transition-all focus:w-64"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-full transition-all hover:shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F8F9FC]"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 font-heading">Admin</p>
                <p className="text-[10px] text-slate-400 font-medium">Head Manager</p>
              </div>
              <div className="p-0.5 bg-white rounded-full border border-slate-100 shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=${userEmail}&background=6366f1&color=fff`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogOut, LayoutDashboard, Users, UserCircle, Briefcase } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-md mb-1
        ${isActive(to) 
          ? 'bg-ppms-light text-ppms-blue border-r-4 border-ppms-blue' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <Icon className={`mr-3 h-5 w-5 ${isActive(to) ? 'text-ppms-blue' : 'text-gray-400'}`} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="bg-ppms-blue p-2 rounded-lg">
             <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-ppms-blue tracking-tight">PPMS</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {user?.role === UserRole.ADMIN ? (
            <>
              <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/admin/employees" icon={Users} label="Employees" />
            </>
          ) : (
            <>
              <NavItem to="/dashboard" icon={LayoutDashboard} label="My Expenses" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-ppms-blue flex items-center justify-center text-white font-medium text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate w-32">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 md:hidden flex items-center justify-between p-4">
           <div className="flex items-center space-x-2">
            <div className="bg-ppms-blue p-1 rounded">
             <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ppms-blue">PPMS</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
            <LogOut className="h-6 w-6" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};
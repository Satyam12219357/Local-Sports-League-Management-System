import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Users, ShieldCheck, Trophy, Calendar, BarChart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Layout: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to">
      {/* Mobile menu button */}
      <button 
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-soft"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ease-in-out z-40 lg:static shadow-medium`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-blue-700/50 bg-gradient-to-r from-blue-900 to-blue-800">
            <h1 className="text-2xl font-bold">SportsLeague</h1>
            <p className="text-blue-300 text-sm">{currentUser?.name}</p>
            <p className="text-blue-300 text-xs capitalize">{currentUser?.role}</p>
          </div>
          
          <nav className="flex-1 py-5 overflow-y-auto">
            <ul className="space-y-1 px-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center px-4 py-3 text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShieldCheck size={20} className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/teams"
                  className="flex items-center px-4 py-3 text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy size={20} className="mr-3" />
                  Teams
                </Link>
              </li>
              <li>
                <Link
                  to="/players"
                  className="flex items-center px-4 py-3 text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users size={20} className="mr-3" />
                  Players
                </Link>
              </li>
              <li>
                <Link
                  to="/matches"
                  className="flex items-center px-4 py-3 text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar size={20} className="mr-3" />
                  Matches
                </Link>
              </li>
              <li>
                <Link
                  to="/standings"
                  className="flex items-center px-4 py-3 text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart size={20} className="mr-3" />
                  Standings
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-5 border-t border-blue-700/50 bg-gradient-to-r from-blue-900 to-blue-800">
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center px-4 py-2 w-full text-blue-100 rounded-md hover:bg-blue-700/50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
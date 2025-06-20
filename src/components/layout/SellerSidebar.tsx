import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SellerSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">GemNet</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <NavLink
              to="/dashboard/advertisements"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              <Megaphone className="w-5 h-5" />
              <span className="font-medium">Advertisements</span>
            </NavLink>
            
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </NavLink>
          </div>
        </nav>

        {/* Profile section - Fixed at bottom */}
        <div className="border-t border-gray-200 flex-shrink-0 bg-white">
          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  ✓ Verified Seller
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;

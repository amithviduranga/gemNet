import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Components
import SellerSidebar from '@/components/layout/SellerSidebar';
import AdvertisementDashboard from '@/components/advertisements/AdvertisementDashboard';
import ProfilePage from '@/components/profile/ProfilePage';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <SellerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content - Offset by sidebar width on desktop */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-30">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 pt-20 lg:pt-6">
          <Routes>
            {/* Default route - redirect to advertisements */}
            <Route index element={<Navigate to="/dashboard/advertisements" replace />} />
            
            {/* Advertisements - This will show your current dashboard view */}
            <Route path="advertisements" element={<AdvertisementDashboard />} />
            
            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />

            {/* Catch all - redirect to advertisements */}
            <Route path="*" element={<Navigate to="/dashboard/advertisements" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

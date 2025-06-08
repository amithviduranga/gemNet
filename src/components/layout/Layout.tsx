import React from 'react';
import { useAuth } from '@/hooks';
import { LogOut, Shield, User } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">GemNet</h1>
                <p className="text-xs text-secondary-500">Identity Verification</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-secondary-500">
            <p>&copy; 2024 GemNet. All rights reserved.</p>
            <p className="mt-1">Secure Identity Verification Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

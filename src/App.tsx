import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';

// Customer Pages
import CustomerLoginPage from '@/pages/customer/CustomerLoginPage';
import CustomerRegisterPage from '@/pages/customer/CustomerRegisterPage';
import CustomerDashboardPage from '@/pages/customer/CustomerDashboardPage';

import Layout from '@/components/layout/Layout';

import { useAuth, useCustomerAuth } from '@/hooks';
import { UserRole } from '@/types';

// Protected Route Component for Sellers
const SellerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component for Customers
const CustomerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component for Sellers (redirect if authenticated)
const SellerPublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component for Customers (redirect if authenticated)
const CustomerPublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          {/* Seller Routes */}
          <Route
            path="/login"
            element={
              <SellerPublicRoute>
                <LoginPage />
              </SellerPublicRoute>
            }
          />
          <Route
            path="/register/*"
            element={
              <SellerPublicRoute>
                <RegisterPage />
              </SellerPublicRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <SellerProtectedRoute>
                <DashboardPage />
              </SellerProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/login"
            element={
              <CustomerPublicRoute>
                <CustomerLoginPage />
              </CustomerPublicRoute>
            }
          />
          <Route
            path="/customer/register"
            element={
              <CustomerPublicRoute>
                <CustomerRegisterPage />
              </CustomerPublicRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <CustomerProtectedRoute>
                <CustomerDashboardPage />
              </CustomerProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/customer/login" replace />} />
          
          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
                  <p className="text-secondary-600 mb-4">Page not found</p>
                  <div className="space-x-4">
                    <a
                      href="/customer/login"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Customer Login
                    </a>
                    <a
                      href="/login"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Seller Login
                    </a>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;

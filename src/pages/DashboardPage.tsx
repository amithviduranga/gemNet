import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks';
import { CheckCircle, Clock, Shield, User } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getVerificationStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-secondary-50 text-secondary-700 border-secondary-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-secondary-600">
              Your account status and verification details
            </p>
          </div>
        </div>
      </motion.div>

      {/* Verification Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
        >
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Name:</span>
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Status:</span>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${getVerificationStatusColor(user?.verificationStatus || 'pending')}`}>
                {getVerificationStatusIcon(user?.verificationStatus || 'pending')}
                <span className="capitalize">
                  {user?.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
        >
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Verification Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-secondary-700">Identity Verification</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm border ${getVerificationStatusColor(user?.verificationStatus || 'pending')}`}>
                {user?.isVerified ? 'Verified' : 'Pending'}
              </div>
            </div>
            
            {user?.isVerified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-medium">
                    Your identity has been successfully verified!
                  </span>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  You now have full access to all GemNet features and services.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
      >
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
            <Shield className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-secondary-900">Security Settings</h3>
            <p className="text-sm text-secondary-600">Manage your account security</p>
          </button>
          
          <button className="p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
            <User className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-secondary-900">Profile</h3>
            <p className="text-sm text-secondary-600">Update your information</p>
          </button>
          
          <button className="p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
            <CheckCircle className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-secondary-900">Verification History</h3>
            <p className="text-sm text-secondary-600">View verification logs</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  Edit
} from 'lucide-react';

// Components
import Button from '@/components/ui/Button';

// Hooks
import { useAuth } from '@/hooks';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">Verified Seller Account</p>
            </div>
          </div>
          
          <Button className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </motion.div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">+94 70 123 4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">Colombo, Sri Lanka</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">January 2024</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Identity Verified</p>
                  <p className="text-sm text-green-700">Your identity has been verified</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Face Verification</p>
                  <p className="text-sm text-green-700">Face verification completed</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">NIC Verification</p>
                  <p className="text-sm text-green-700">NIC verification completed</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-900">Account Active</p>
                  <p className="text-sm text-blue-700">You can create advertisements</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Account Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Total Advertisements</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Active Advertisements</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">45K</div>
            <div className="text-sm text-gray-600">Total Revenue (LKR)</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

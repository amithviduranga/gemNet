import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  User, 
  Megaphone, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';

// Hooks
import { useAuth } from '@/hooks';

// Components
import Button from '@/components/ui/Button';

const DashboardHome: React.FC = () => {
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

  // Mock stats data
  const stats = [
    {
      title: 'Total Advertisements',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: Megaphone,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Ads',
      value: '8',
      change: '+1',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Total Views',
      value: '1,234',
      change: '+156',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenue',
      value: 'LKR 45,000',
      change: '+12%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Advertisement approved',
      item: 'iPhone 14 Pro Max - Excellent Condition',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: 'New advertisement created',
      item: 'Toyota Corolla 2020 - Low Mileage',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 3,
      action: 'Advertisement under review',
      item: 'Apartment for Rent - Colombo 03',
      time: '2 days ago',
      status: 'warning'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-secondary-600">
                Here's what's happening with your advertisements today
              </p>
            </div>
          </div>
          
          {/* Verification Status */}
          <div className={`px-4 py-2 rounded-lg border ${getVerificationStatusColor(user?.verificationStatus || 'pending')}`}>
            <div className="flex items-center space-x-2">
              {getVerificationStatusIcon(user?.verificationStatus || 'pending')}
              <span className="text-sm font-medium">
                {user?.verificationStatus === 'VERIFIED' ? 'Verified Seller' : 'Verification Pending'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/advertisements"
            className="group bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-4 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Manage Ads</h3>
                <p className="text-blue-700 text-sm">View and edit your advertisements</p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 opacity-60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600">Analytics</h3>
                <p className="text-gray-500 text-sm">Coming Soon</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 opacity-60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600">Messages</h3>
                <p className="text-gray-500 text-sm">Coming Soon</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link
              to="/dashboard/advertisements"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.item}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-green-900 font-medium">Identity Verified</p>
                <p className="text-green-700 text-sm">Your account is fully verified</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-blue-900 font-medium">Account Active</p>
                <p className="text-blue-700 text-sm">You can create advertisements</p>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>

            <div className="pt-4">
              <Link to="/dashboard/advertisements">
                <Button className="w-full">
                  Create New Advertisement
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;

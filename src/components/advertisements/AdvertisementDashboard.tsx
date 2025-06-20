import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Plus,
  List,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Hooks
import { useAuth } from '@/hooks';

// Components
import Button from '@/components/ui/Button';
import AdvertisementTable from '@/components/advertisements/AdvertisementTable';
import CreateAdvertisementModal from '@/components/advertisements/CreateAdvertisementModal';

// Types
import { Advertisement, AdvertisementStatus } from '@/types';

const AdvertisementDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'table'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for latest advertisements
  const mockAdvertisements: Advertisement[] = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max - Excellent Condition',
      category: 'Electronics',
      description: 'Brand new iPhone 14 Pro Max, 256GB, Deep Purple. Includes original box and accessories.',
      contactInfo: {
        email: 'seller@example.com',
        phone: '+94701234567',
        address: 'Colombo, Sri Lanka'
      },
      images: ['https://via.placeholder.com/300x200?text=iPhone'],
      price: 450000,
      currency: 'LKR',
      status: AdvertisementStatus.APPROVED,
      sellerId: 'user123',
      sellerName: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      approvedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '2',
      title: 'Toyota Corolla 2020 - Low Mileage',
      category: 'Vehicles',
      description: 'Well-maintained Toyota Corolla 2020 with low mileage. Full service history available.',
      contactInfo: {
        email: 'seller@example.com',
        phone: '+94701234567'
      },
      images: ['https://via.placeholder.com/300x200?text=Toyota'],
      price: 6500000,
      currency: 'LKR',
      status: AdvertisementStatus.PENDING,
      sellerId: 'user123',
      sellerName: 'John Doe',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      title: 'Apartment for Rent - Colombo 03',
      category: 'Property',
      description: '2 bedroom apartment in prime location. Fully furnished with modern amenities.',
      contactInfo: {
        email: 'seller@example.com',
        phone: '+94701234567',
        address: 'Colombo 03, Sri Lanka'
      },
      images: ['https://via.placeholder.com/300x200?text=Apartment'],
      price: 75000,
      currency: 'LKR',
      status: AdvertisementStatus.CREATED,
      sellerId: 'user123',
      sellerName: 'John Doe',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: '4',
      title: 'MacBook Pro M2 - Like New',
      category: 'Electronics',
      description: 'MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Barely used, includes original packaging.',
      contactInfo: {
        email: 'seller@example.com',
        phone: '+94701234567'
      },
      images: ['https://via.placeholder.com/300x200?text=MacBook'],
      price: 850000,
      currency: 'LKR',
      status: AdvertisementStatus.APPROVED,
      sellerId: 'user123',
      sellerName: 'John Doe',
      createdAt: '2024-01-12T14:20:00Z',
      updatedAt: '2024-01-12T14:20:00Z'
    },
    {
      id: '5',
      title: 'Gaming Setup - Complete Package',
      category: 'Electronics',
      description: 'Complete gaming setup including PC, monitor, keyboard, mouse, and chair.',
      contactInfo: {
        email: 'seller@example.com',
        phone: '+94701234567'
      },
      images: ['https://via.placeholder.com/300x200?text=Gaming'],
      price: 275000,
      currency: 'LKR',
      status: AdvertisementStatus.APPROVED,
      sellerId: 'user123',
      sellerName: 'John Doe',
      createdAt: '2024-01-11T11:30:00Z',
      updatedAt: '2024-01-11T11:30:00Z'
    }
  ];

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAdvertisements(mockAdvertisements);
    } catch (error) {
      toast.error('Failed to load advertisements');
      console.error('Error loading advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadAdvertisements();
    toast.success('Advertisement created successfully!');
  };

  const getStatusBadge = (status: AdvertisementStatus) => {
    const statusConfig = {
      [AdvertisementStatus.CREATED]: {
        color: 'bg-gray-100 text-gray-800',
        text: 'Draft'
      },
      [AdvertisementStatus.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pending Review'
      },
      [AdvertisementStatus.APPROVED]: {
        color: 'bg-green-100 text-green-800',
        text: 'Approved'
      },
      [AdvertisementStatus.REJECTED]: {
        color: 'bg-red-100 text-red-800',
        text: 'Rejected'
      },
      [AdvertisementStatus.SUSPENDED]: {
        color: 'bg-orange-100 text-orange-800',
        text: 'Suspended'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

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

  if (currentView === 'table') {
    return <AdvertisementTable onBackToOverview={() => setCurrentView('overview')} />;
  }

  return (
    <div className="space-y-8">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisements</h1>
      
        </div>
        
        <div className="flex space-x-3">
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Advertisement</span>
          </Button>
        </div>
      </div>

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
                Welcome back, {user?.firstName || 'Amith'}!
              </h1>
              <p className="text-secondary-600">
                Here's what's happening with your advertisements today
              </p>
            </div>
          </div>
          
          {/* Verification Status */}
          <div className="bg-green-50 text-green-700 border-green-200 px-4 py-2 rounded-lg border">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Verified Seller</span>
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

      {/* Latest Advertisements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Latest Advertisements</h2>
          <button
            onClick={() => setCurrentView('table')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements yet</h3>
            <p className="text-gray-500 mb-6">Create your first advertisement to get started</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Advertisement
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Advertisement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {advertisements.slice(0, 5).map((ad, index) => (
                  <motion.tr
                    key={ad.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            src={ad.images[0] || 'https://via.placeholder.com/48x48?text=No+Image'}
                            alt={ad.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {ad.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{ad.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {ad.price ? (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {ad.price.toLocaleString()} {ad.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Recent Activity & Account Status */}
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
            <button
              onClick={() => setCurrentView('table')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </button>
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
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Advertisement Modal */}
      <CreateAdvertisementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default AdvertisementDashboard;

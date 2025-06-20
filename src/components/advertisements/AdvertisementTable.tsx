import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Send,
  Calendar,
  Tag,
  DollarSign,
  Megaphone,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Components
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CreateAdvertisementModal from '@/components/advertisements/CreateAdvertisementModal';

// Types and Services
import { Advertisement, AdvertisementStatus, AdvertisementFilters } from '@/types';
import { advertisementAPI } from '@/services/api';

interface AdvertisementTableProps {
  onBackToOverview: () => void;
}

const AdvertisementTable: React.FC<AdvertisementTableProps> = ({ onBackToOverview }) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdvertisementStatus | ''>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  // Mock data for development
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
    }
  ];

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      // For now, use mock data
      // In production, uncomment the line below and remove mock data
      // const response = await advertisementAPI.getSellerAdvertisements('user123', filters);
      
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

  const handleSubmitForApproval = async (adId: string) => {
    try {
      // await advertisementAPI.submitForApproval(adId);
      toast.success('Advertisement submitted for approval!');
      loadAdvertisements();
    } catch (error) {
      toast.error('Failed to submit advertisement');
    }
  };

  const handleDelete = async (adId: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        // await advertisementAPI.deleteAdvertisement(adId);
        toast.success('Advertisement deleted successfully!');
        loadAdvertisements();
      } catch (error) {
        toast.error('Failed to delete advertisement');
      }
    }
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

  const filteredAdvertisements = advertisements.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || ad.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToOverview}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Overview</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Advertisements</h1>
            <p className="text-gray-600">Manage your advertisement listings</p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Advertisement</span>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search advertisements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdvertisementStatus | '')}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value={AdvertisementStatus.CREATED}>Draft</option>
              <option value={AdvertisementStatus.PENDING}>Pending</option>
              <option value={AdvertisementStatus.APPROVED}>Approved</option>
              <option value={AdvertisementStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredAdvertisements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Create your first advertisement to get started'}
            </p>
            {!searchTerm && !statusFilter && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Advertisement
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Advertisement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdvertisements.map((ad) => (
                  <motion.tr
                    key={ad.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            src={ad.images[0] || 'https://via.placeholder.com/64x64?text=No+Image'}
                            alt={ad.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {ad.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{ad.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ad.price ? (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {ad.price.toLocaleString()} {ad.currency}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900">
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedAd(ad)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {ad.status === AdvertisementStatus.CREATED && (
                          <button
                            onClick={() => handleSubmitForApproval(ad.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            title="Submit for Approval"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
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

export default AdvertisementTable;

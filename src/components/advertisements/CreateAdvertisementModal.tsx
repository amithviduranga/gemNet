import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  DollarSign,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Components
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

// Types and Services
import { CreateAdvertisementRequest, ADVERTISEMENT_CATEGORIES } from '@/types';
import { advertisementAPI } from '@/services/api';
import { useFormValidation } from '@/hooks';
import { validators } from '@/utils';

interface CreateAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAdvertisementModal: React.FC<CreateAdvertisementModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const initialValues: Omit<CreateAdvertisementRequest, 'images'> = {
    title: '',
    category: '',
    description: '',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    price: undefined,
    currency: 'LKR'
  };

  const validationRules = {
    title: validators.required,
    category: validators.required,
    description: validators.required,
    'contactInfo.email': (value: string) => {
      const required = validators.required(value);
      if (required) return required;
      return validators.email(value);
    },
    'contactInfo.phone': (value: string) => {
      const required = validators.required(value);
      if (required) return required;
      return validators.phone(value);
    },
    'contactInfo.address': () => null, // Optional
    price: () => null, // Optional
    currency: () => null // Optional
  };

  const { values, errors, touched, setValue, setTouched, validate, reset } = useFormValidation(
    initialValues,
    validationRules
  );

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setValue(parent as any, {
        ...values[parent as keyof typeof values],
        [child]: e.target.value
      });
    } else {
      setValue(field as keyof typeof values, e.target.value);
    }
  };

  const handleInputBlur = (field: string) => () => {
    setTouched(field as keyof typeof values);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files');
      return;
    }

    if (selectedImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = [...selectedImages, ...validFiles];
    setSelectedImages(newImages);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const advertisementData: CreateAdvertisementRequest = {
        ...values,
        images: selectedImages,
        price: values.price ? Number(values.price) : undefined
      };

      // await advertisementAPI.createAdvertisement(advertisementData);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Advertisement created successfully!');
      handleClose();
      onSuccess();
    } catch (error) {
      toast.error('Failed to create advertisement');
      console.error('Error creating advertisement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Reset form
    reset();
    setSelectedImages([]);
    setImagePreviewUrls([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Advertisement">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Title"
                name="title"
                value={values.title}
                onChange={handleInputChange('title')}
                onBlur={handleInputBlur('title')}
                error={touched.title ? errors.title : undefined}
                required
                placeholder="Enter advertisement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={values.category}
                onChange={handleInputChange('category')}
                onBlur={handleInputBlur('category')}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  touched.category && errors.category ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select category</option>
                {ADVERTISEMENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  label="Price (Optional)"
                  name="price"
                  type="number"
                  value={values.price || ''}
                  onChange={handleInputChange('price')}
                  placeholder="0.00"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={values.currency}
                  onChange={handleInputChange('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={values.description}
              onChange={handleInputChange('description')}
              onBlur={handleInputBlur('description')}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                touched.description && errors.description ? 'border-red-500' : ''
              }`}
              rows={4}
              placeholder="Describe your item or service in detail..."
              required
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={values.contactInfo.email}
                  onChange={handleInputChange('contactInfo.email')}
                  onBlur={handleInputBlur('contactInfo.email')}
                  className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    touched['contactInfo.email'] && errors['contactInfo.email'] ? 'border-red-500' : ''
                  }`}
                  placeholder="your@email.com"
                  required
                />
              </div>
              {touched['contactInfo.email'] && errors['contactInfo.email'] && (
                <p className="mt-1 text-sm text-red-600">{errors['contactInfo.email']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={values.contactInfo.phone}
                  onChange={handleInputChange('contactInfo.phone')}
                  onBlur={handleInputBlur('contactInfo.phone')}
                  className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    touched['contactInfo.phone'] && errors['contactInfo.phone'] ? 'border-red-500' : ''
                  }`}
                  placeholder="+94701234567"
                  required
                />
              </div>
              {touched['contactInfo.phone'] && errors['contactInfo.phone'] && (
                <p className="mt-1 text-sm text-red-600">{errors['contactInfo.phone']}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={values.contactInfo.address || ''}
                  onChange={handleInputChange('contactInfo.address')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your location or address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <span className="text-primary-600 font-medium">Upload images</span>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each (max 5 images)</p>
            </label>
          </div>

          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Advertisement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAdvertisementModal;

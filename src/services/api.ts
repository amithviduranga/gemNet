import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  UserRegistrationRequest,
  CustomerRegistrationRequest,
  GoogleSignInRequest,
  LoginRequest,
  AuthenticationResponse,
  FaceVerificationResult,
  NicVerificationResult,
  Advertisement,
  CreateAdvertisementRequest,
  AdvertisementFilters
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9091';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Health check
  healthCheck: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/api/auth/health');
    return response.data;
  },

  // Register new user
  register: async (userData: UserRegistrationRequest): Promise<ApiResponse<string>> => {
    const response: AxiosResponse<ApiResponse<string>> = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthenticationResponse>> = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Face verification
  verifyFace: async (userId: string, faceImage: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('faceImage', faceImage);

    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      `/api/auth/verify-face/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // NIC verification with enhanced error handling
  verifyNIC: async (userId: string, nicImage: File): Promise<ApiResponse<NicVerificationResult>> => {
    const formData = new FormData();
    formData.append('nicImage', nicImage);

    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(
        `/api/auth/verify-nic/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Transform the response to match our enhanced NIC verification result type
      const transformedResponse: ApiResponse<NicVerificationResult> = {
        success: response.data.success,
        message: response.data.message,
        data: {
          success: response.data.success,
          message: response.data.message,
          ...response.data.data // Spread all the detailed data from backend
        }
      };

      return transformedResponse;
    } catch (error: any) {
      console.error('NIC verification API error:', error);
      
      // Handle different types of errors
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'NIC verification failed',
          data: {
            success: false,
            message: error.response.data.message || 'NIC verification failed',
            error: 'SYSTEM_ERROR',
            userMessage: error.response.data.data?.userMessage || 'We encountered a technical issue while processing your verification.',
            suggestions: error.response.data.data?.suggestions || [
              'Check your internet connection and try again',
              'Make sure your image file is not corrupted',
              'Try using a different image format (JPG or PNG)',
              'Contact support if the problem persists'
            ],
            technicalError: error.response.data.data?.technicalError || error.message,
            ...error.response.data.data
          }
        };
      }
      
      // Network or other errors
      return {
        success: false,
        message: 'Network error occurred',
        data: {
          success: false,
          message: 'Network error occurred',
          error: 'SYSTEM_ERROR',
          userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
          suggestions: [
            'Check your internet connection',
            'Try again in a few moments',
            'Contact support if the problem persists'
          ],
          technicalError: error.message
        }
      };
    }
  },
};

// Customer API
export const customerAPI = {
  // Health check
  healthCheck: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/api/customer/health');
    return response.data;
  },

  // Register new customer
  register: async (customerData: CustomerRegistrationRequest): Promise<ApiResponse<string>> => {
    const response: AxiosResponse<ApiResponse<string>> = await api.post('/api/customer/register', customerData);
    return response.data;
  },

  // Customer login
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthenticationResponse>> = await api.post('/api/customer/login', credentials);
    return response.data;
  },

  // Google Sign-In
  googleSignIn: async (googleData: GoogleSignInRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthenticationResponse>> = await api.post('/api/customer/google-signin', googleData);
    return response.data;
  },

  // Get customer profile
  getProfile: async (userId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(`/api/customer/profile/${userId}`);
    return response.data;
  },
};

// Advertisement API
export const advertisementAPI = {
  // Get all advertisements for a seller
  getSellerAdvertisements: async (sellerId: string, filters?: AdvertisementFilters): Promise<ApiResponse<Advertisement[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const response: AxiosResponse<ApiResponse<Advertisement[]>> = await api.get(
      `/api/advertisements/seller/${sellerId}?${params.toString()}`
    );
    return response.data;
  },

  // Create new advertisement
  createAdvertisement: async (advertisementData: CreateAdvertisementRequest): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('title', advertisementData.title);
    formData.append('category', advertisementData.category);
    formData.append('description', advertisementData.description);
    formData.append('contactInfo', JSON.stringify(advertisementData.contactInfo));
    
    if (advertisementData.price) {
      formData.append('price', advertisementData.price.toString());
    }
    if (advertisementData.currency) {
      formData.append('currency', advertisementData.currency);
    }

    // Append images
    advertisementData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      '/api/advertisements',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get advertisement by ID
  getAdvertisement: async (id: string): Promise<ApiResponse<Advertisement>> => {
    const response: AxiosResponse<ApiResponse<Advertisement>> = await api.get(`/api/advertisements/${id}`);
    return response.data;
  },

  // Update advertisement
  updateAdvertisement: async (id: string, advertisementData: Partial<CreateAdvertisementRequest>): Promise<ApiResponse<Advertisement>> => {
    const formData = new FormData();
    
    if (advertisementData.title) formData.append('title', advertisementData.title);
    if (advertisementData.category) formData.append('category', advertisementData.category);
    if (advertisementData.description) formData.append('description', advertisementData.description);
    if (advertisementData.contactInfo) formData.append('contactInfo', JSON.stringify(advertisementData.contactInfo));
    if (advertisementData.price) formData.append('price', advertisementData.price.toString());
    if (advertisementData.currency) formData.append('currency', advertisementData.currency);

    // Append new images if any
    if (advertisementData.images && advertisementData.images.length > 0) {
      advertisementData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    const response: AxiosResponse<ApiResponse<Advertisement>> = await api.put(
      `/api/advertisements/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Delete advertisement
  deleteAdvertisement: async (id: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/api/advertisements/${id}`);
    return response.data;
  },

  // Submit advertisement for approval
  submitForApproval: async (id: string): Promise<ApiResponse<Advertisement>> => {
    const response: AxiosResponse<ApiResponse<Advertisement>> = await api.post(`/api/advertisements/${id}/submit`);
    return response.data;
  },
};

// Test API (for development/debugging)
export const testAPI = {
  // Complete NIC verification test
  verifyNICFull: async (nicImage: File, faceImage: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('nicImage', nicImage);
    formData.append('faceImage', faceImage);

    const response: AxiosResponse<ApiResponse> = await api.post(
      '/api/test/verify-nic-full',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Extract NIC number only
  extractNICNumber: async (nicImage: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('nicImage', nicImage);

    const response: AxiosResponse<ApiResponse> = await api.post(
      '/api/test/extract-nic-number',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Validate face only
  validateFace: async (faceImage: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('faceImage', faceImage);

    const response: AxiosResponse<ApiResponse> = await api.post(
      '/api/test/validate-face',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Convert blob to file
  blobToFile: (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
  },

  // Check if API is available
  checkAPIHealth: async (): Promise<boolean> => {
    try {
      await authAPI.healthCheck();
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  },

  // Format error message
  formatErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};

export default api;

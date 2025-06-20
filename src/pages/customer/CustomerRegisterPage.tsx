import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Calendar, ShoppingBag, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Components
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GoogleSignInButton from '@/components/customer/GoogleSignInButton';

// Hooks & Services
import { useFormValidation } from '@/hooks';
import { customerAPI } from '@/services/api';
import { validators } from '@/utils';
import { CustomerRegistrationRequest } from '@/types';

const CustomerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: CustomerRegistrationRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
  };

  const validationRules = {
    firstName: validators.required,
    lastName: validators.required,
    email: (value: string) => {
      const required = validators.required(value);
      if (required) return required;
      return validators.email(value);
    },
    password: (value: string) => {
      const required = validators.required(value);
      if (required) return required;
      return validators.password(value);
    },
    phoneNumber: (value: string) => {
      if (!value) return null; // Optional field
      return validators.phone(value);
    },
    address: () => null, // Optional field
    dateOfBirth: (value: string) => {
      if (!value) return null; // Optional field
      return validators.dateOfBirth(value);
    },
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate,
  } = useFormValidation(initialValues, validationRules);

  const handleInputChange = (field: keyof CustomerRegistrationRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(field, e.target.value);
  };

  const handleInputBlur = (field: keyof CustomerRegistrationRequest) => () => {
    setTouched(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    try {
      const registrationData = {
        ...values,
        isGoogleSignUp: false,
      };

      const response = await customerAPI.register(registrationData);
      
      if (response.success) {
        toast.success('Account created successfully!');
        navigate('/customer/login');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInSuccess = async (googleData: any) => {
    try {
      setLoading(true);
      
      const googleSignInData = {
        email: googleData.email,
        firstName: googleData.given_name,
        lastName: googleData.family_name,
        googleId: googleData.sub,
        profilePicture: googleData.picture,
      };

      const response = await customerAPI.googleSignIn(googleSignInData);
      
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        
        // Store authentication data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        toast.success('Welcome to GemNet!');
        navigate('/customer/dashboard');
      } else {
        toast.error(response.message || 'Google Sign-In failed');
      }
    } catch (error: any) {
      toast.error('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">GemNet</h1>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Join GemNet Today!</h2>
          <p className="text-gray-600">Create your customer account to start shopping</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Google Sign-In */}
          <div className="mb-6">
            <GoogleSignInButton
              onSuccess={handleGoogleSignInSuccess}
              disabled={loading}
              text="Sign up with Google"
            />
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleInputChange('firstName')}
                  onBlur={handleInputBlur('firstName')}
                  error={touched.firstName ? errors.firstName : undefined}
                  required
                  placeholder="Enter your first name"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleInputChange('lastName')}
                  onBlur={handleInputBlur('lastName')}
                  error={touched.lastName ? errors.lastName : undefined}
                  required
                  placeholder="Enter your last name"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleInputChange('email')}
                onBlur={handleInputBlur('email')}
                error={touched.email ? errors.email : undefined}
                required
                placeholder="Enter your email"
                className="pl-10"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleInputChange('password')}
                onBlur={handleInputBlur('password')}
                error={touched.password ? errors.password : undefined}
                required
                placeholder="Create a password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-medium">Optional Information (can be added later)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={values.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    onBlur={handleInputBlur('phoneNumber')}
                    error={touched.phoneNumber ? errors.phoneNumber : undefined}
                    placeholder="+94701234567"
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={handleInputChange('dateOfBirth')}
                    onBlur={handleInputBlur('dateOfBirth')}
                    error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  label="Address"
                  name="address"
                  value={values.address}
                  onChange={handleInputChange('address')}
                  onBlur={handleInputBlur('address')}
                  error={touched.address ? errors.address : undefined}
                  placeholder="Enter your address"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/customer/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Seller Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>Are you a seller?</span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Seller Registration
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerRegisterPage;

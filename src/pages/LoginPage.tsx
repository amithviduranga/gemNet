import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth, useFormValidation } from '@/hooks';
import { validators } from '@/utils';
import { LoginRequest } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };

  const validationRules = {
    email: (value: string) => {
      const required = validators.required(value);
      if (required) return required;
      return validators.email(value);
    },
    password: validators.required,
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate,
  } = useFormValidation(initialValues, validationRules);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    const success = await login(values);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(field, e.target.value);
  };

  const handleInputBlur = (field: keyof LoginRequest) => () => {
    setTouched(field);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto bg-gradient-primary p-4 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-bold text-gradient"
          >
            Welcome to GemNet
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-secondary-600"
          >
            Secure Identity Verification Platform
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-secondary-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={values.email}
                  onChange={handleInputChange('email')}
                  onBlur={handleInputBlur('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 bg-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleInputBlur('password')}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 bg-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
                {errors.password && touched.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full bg-gradient-primary hover:opacity-90 py-3 text-lg font-semibold"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create your account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Features */}
       
      </motion.div>
    </div>
  );
};

export default LoginPage;

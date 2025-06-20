# GemNet Customer Implementation Guide

## Overview

This implementation adds customer/buyer functionality to the existing GemNet seller platform. Customers can register and sign in using either regular email/password or Google Sign-In, without requiring identity verification.

## Features Added

### Backend Features
- ✅ Customer registration with minimal required fields
- ✅ Google Sign-In integration
- ✅ Customer-specific API endpoints
- ✅ Role-based user management (SELLER vs CUSTOMER)
- ✅ Optional customer profile fields
- ✅ Unified user collection with role differentiation

### Frontend Features
- ✅ Customer login page (`/customer/login`)
- ✅ Customer registration page (`/customer/register`)
- ✅ Customer dashboard (`/customer/dashboard`)
- ✅ Google Sign-In button component
- ✅ Role-based route protection
- ✅ Modern, responsive UI design

## Backend Changes Made

### 1. New DTOs Created
- `CustomerRegistrationRequest.java` - Customer registration data
- `GoogleSignInRequest.java` - Google Sign-In data

### 2. User Model Updated
- Added `googleId`, `profilePicture`, `isGoogleUser` fields
- Made `nicNumber` optional for customers
- Enhanced role-based functionality

### 3. New Controller
- `CustomerController.java` - Customer-specific endpoints
  - `POST /api/customer/register` - Customer registration
  - `POST /api/customer/login` - Customer login
  - `POST /api/customer/google-signin` - Google Sign-In
  - `GET /api/customer/profile/{userId}` - Get customer profile

### 4. UserService Enhanced
- Added `registerCustomer()` method
- Added `googleSignIn()` method
- Role-based user creation (CUSTOMER vs SELLER)

### 5. UserRepository Updated
- Added `findByGoogleId()` method

## Frontend Changes Made

### 1. New Pages
- `CustomerLoginPage.tsx` - Customer login interface
- `CustomerRegisterPage.tsx` - Customer registration interface
- `CustomerDashboardPage.tsx` - Customer dashboard

### 2. New Components
- `GoogleSignInButton.tsx` - Reusable Google Sign-In component

### 3. Updated Core Files
- `App.tsx` - Added customer routes and role-based protection
- `hooks/index.ts` - Added `useCustomerAuth` hook
- `services/api.ts` - Added `customerAPI` endpoints
- `types/index.ts` - Added customer-specific types

### 4. Route Structure
```
/customer/login      - Customer login page
/customer/register   - Customer registration page
/customer/dashboard  - Customer dashboard (protected)
/login              - Seller login page
/register           - Seller registration page (with verification)
/dashboard          - Seller dashboard (protected)
```

## Setup Instructions

### 1. Backend Setup
The backend changes are already implemented. Just rebuild and restart your Spring Boot application:

```bash
cd /path/to/gemnet-backend
./mvnw clean install
./mvnw spring-boot:run
```

### 2. Frontend Setup
Install the new dependencies:

```bash
cd GemNetUI
npm install
```

### 3. Google Sign-In Configuration (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the Client ID and update `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### 4. Start the Application

```bash
npm run dev
```

## API Endpoints

### Customer Authentication
- `POST /api/customer/register` - Register new customer
- `POST /api/customer/login` - Customer login
- `POST /api/customer/google-signin` - Google Sign-In
- `GET /api/customer/profile/{userId}` - Get customer profile
- `GET /api/customer/health` - Health check

### Request/Response Examples

#### Customer Registration
```json
POST /api/customer/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+94701234567", // optional
  "address": "123 Main St, Colombo", // optional
  "dateOfBirth": "1990-01-01" // optional
}
```

#### Google Sign-In
```json
POST /api/customer/google-signin
Content-Type: application/json

{
  "email": "john.doe@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "googleId": "google-user-id",
  "profilePicture": "https://example.com/profile.jpg"
}
```

## User Roles

### SELLER (Existing)
- Requires full identity verification (NIC + Face)
- Access to seller dashboard and features
- Full registration flow with multiple steps

### CUSTOMER (New)
- No identity verification required
- Minimal registration fields
- Google Sign-In support
- Access to customer dashboard and shopping features

## Database Schema

The existing `users` collection now supports both sellers and customers:

```javascript
{
  "_id": "user-id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "hashed-password", // empty for Google users
  "phoneNumber": "+94701234567", // optional for customers
  "address": "123 Main St", // optional for customers
  "dateOfBirth": "1990-01-01", // optional for customers
  "nicNumber": "123456789V", // empty for customers
  "googleId": "google-user-id", // only for Google users
  "profilePicture": "https://...", // Google profile picture
  "isGoogleUser": true, // true for Google Sign-In users
  "roles": ["CUSTOMER"], // or ["SELLER"]
  "isVerified": true, // always true for customers
  "verificationStatus": "VERIFIED", // always VERIFIED for customers
  "isFaceVerified": false, // not applicable for customers
  "isNicVerified": false, // not applicable for customers
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Security Considerations

1. **Authentication**: Both JWT-based authentication is used for both sellers and customers
2. **Role-based Access**: Routes are protected based on user roles
3. **Input Validation**: All inputs are validated on both frontend and backend
4. **Password Hashing**: Passwords are hashed using BCrypt
5. **Google Sign-In**: Secure OAuth 2.0 flow with JWT verification

## Testing

### Manual Testing Steps

1. **Customer Registration**:
   - Go to `/customer/register`
   - Fill in required fields (firstName, lastName, email, password)
   - Optional: Add phone, address, dateOfBirth
   - Submit form
   - Should redirect to login page

2. **Customer Login**:
   - Go to `/customer/login`
   - Enter email and password
   - Should redirect to customer dashboard

3. **Google Sign-In** (requires setup):
   - Go to `/customer/login` or `/customer/register`
   - Click "Continue with Google"
   - Complete Google authentication
   - Should redirect to customer dashboard

4. **Role Separation**:
   - Customers cannot access seller routes (`/dashboard`, `/register`)
   - Sellers cannot access customer routes (`/customer/*`)

## Troubleshooting

### Google Sign-In Not Working
1. Check if `VITE_GOOGLE_CLIENT_ID` is set in `.env`
2. Verify Google Cloud Console configuration
3. Check browser console for errors
4. Ensure domain is added to authorized origins

### Authentication Issues
1. Check if backend is running on port 9091
2. Verify API endpoints are accessible
3. Check browser localStorage for auth tokens
4. Review network tab for API call errors

### Build Errors
1. Run `npm install` to ensure all dependencies are installed
2. Check for TypeScript errors in the terminal
3. Verify all imports are correct

## Future Enhancements

1. **Email Verification**: Add email verification for customer accounts
2. **Password Reset**: Implement forgot password functionality
3. **Social Login**: Add Facebook, Twitter, etc.
4. **Profile Management**: Allow customers to update their profiles
5. **Order Management**: Integrate with e-commerce features
6. **Notifications**: Add email/SMS notifications for customers

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review the backend logs
3. Verify all environment variables are set
4. Ensure the database is running and accessible

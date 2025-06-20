#!/bin/bash

# GemNet Customer Implementation - Development Startup Script

echo "🚀 Starting GemNet Customer Implementation..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update VITE_GOOGLE_CLIENT_ID in .env file for Google Sign-In to work"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🌟 Starting development server..."
echo "🔗 Customer Login: http://localhost:3000/customer/login"
echo "🔗 Seller Login: http://localhost:3000/login"
echo "🔗 Customer Registration: http://localhost:3000/customer/register"
echo ""

npm run dev

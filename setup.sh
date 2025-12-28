#!/bin/bash

# PR Review AI - Quick Setup Script
# This script installs dependencies for both frontend and backend using Yarn

echo "🚀 Setting up PR Review AI..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Installing Yarn..."
    yarn install -g yarn
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Yarn version: $(yarn --version)"
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
yarn install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Created backend/.env - Please add your API keys!"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
yarn install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env"
fi

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to backend/.env:"
echo "   - OPENAI_API_KEY=your_key_here"
echo "   - GITHUB_TOKEN=your_token_here (optional)"
echo ""
echo "2. Start the backend:"
echo "   cd backend && yarn dev"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend && yarn dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""

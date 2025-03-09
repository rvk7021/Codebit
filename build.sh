#!/bin/sh
apt-get update && apt-get install -y g++

# Install dependencies for backend
cd backend_codebit
npm install

# Install dependencies for frontend
cd frontend_codebit
npm install
npm run build

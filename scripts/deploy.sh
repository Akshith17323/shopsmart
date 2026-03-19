#!/bin/bash

echo "Pulling latest code"
git pull origin main

echo "Installing backend dependencies"
cd server
npm install

echo "Restarting backend"
pkill node || true  
nohup node src/index.js > server.log 2>&1 &

cd ..

echo "Installing frontend dependencies"
cd client
npm install

echo "Building frontend"
npm run build

echo "Deployment completed"

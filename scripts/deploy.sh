#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/home/ubuntu/shopsmart"
BACKEND_DIR="$APP_DIR/server"
FRONTEND_DIR="$APP_DIR/client"
BACKEND_LOG="$BACKEND_DIR/server.log"
BACKEND_PIDFILE="$BACKEND_DIR/server.pid"

echo "==> cd $APP_DIR"
cd "$APP_DIR"

echo "==> Pulling latest code"
git fetch origin main
git reset --hard origin/main

# ---- Ensure Node/npm available (via nvm) ----
# Assumes ubuntu user; if nvm isn't installed, install it.
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "==> Installing nvm"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
# shellcheck disable=SC1090
source "$NVM_DIR/nvm.sh"

echo "==> Installing and Using Node from .nvmrc"
nvm install
nvm use

echo "==> Backend deps"
cd "$BACKEND_DIR"
if [ -f package-lock.json ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

echo "==> Restarting backend"
if [ -f "$BACKEND_PIDFILE" ] && kill -0 "$(cat "$BACKEND_PIDFILE")" 2>/dev/null; then
  kill "$(cat "$BACKEND_PIDFILE")" || true
fi

nohup node src/index.js > "$BACKEND_LOG" 2>&1 &
echo $! > "$BACKEND_PIDFILE"

echo "==> Frontend deps"
cd "$FRONTEND_DIR"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> Building frontend"
# Helps avoid OOM on small instances (t3.micro/t2.micro etc.)
export NODE_OPTIONS="--max_old_space_size=2048"
npm run build

echo "==> Deployment completed"

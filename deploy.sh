#!/bin/bash
set -euo pipefail

# Deploy script — valentinaandolfi.it
# Esegui dalla root del progetto: bash /var/www/valentina/deploy.sh

ROOT="/var/www/valentina"
cd "$ROOT"

echo "→ [1/5] Build frontend…"
cd "$ROOT/frontend"
npm ci --no-audit --no-fund
npm run build

echo "→ [2/5] Build admin…"
cd "$ROOT/admin"
npm ci --no-audit --no-fund
npm run build

echo "→ [3/5] Build backend…"
cd "$ROOT/backend"
npm ci --no-audit --no-fund
npm run build

echo "→ [4/5] Riavvio PM2…"
cd "$ROOT"
if pm2 describe valentina-backend >/dev/null 2>&1; then
    pm2 restart valentina-backend --update-env
else
    pm2 start ecosystem.config.js
    pm2 save
fi

echo "→ [5/5] Reload Nginx…"
sudo nginx -t && sudo systemctl reload nginx

echo "✓ Deploy completato"

#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Fabric Referendum bootstrap ==="
bash "$ROOT/scripts/network/network-up.sh"
bash "$ROOT/scripts/network/deploy-chaincode.sh"
bash "$ROOT/scripts/network/import-wallet.sh"

echo ""
echo "Next:"
echo "  cd fabric_service && npm install && npm start"
echo "  cd backend && pip install -r req.txt && python manage.py migrate && python manage.py seed_parties && python manage.py runserver"
echo "  cd frontend && npm install && npm run dev"

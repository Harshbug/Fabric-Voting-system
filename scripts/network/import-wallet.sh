#!/usr/bin/env bash
# Import Org1 Admin identity into the Node.js wallet used by fabric_service.
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

ADMIN_DIR="${TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"
CERT="${ADMIN_DIR}/signcerts"
KEYSTORE="${ADMIN_DIR}/keystore"

if [[ ! -d "${CERT}" ]]; then
  echo "ERROR: Admin certs not found. Start the network first."
  exit 1
fi

cd "${PROJECT_ROOT}/fabric_service"
node importAdmin.js

echo "✔ Wallet ready at ${FABRIC_WALLET_PATH}"

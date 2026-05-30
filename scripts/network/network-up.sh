#!/usr/bin/env bash
# Start the Fabric test network and create the application channel.
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

"$(dirname "$0")/setup-fabric-samples.sh"

if [[ ! -d "${TEST_NETWORK}" ]]; then
  echo "ERROR: test-network not found at ${TEST_NETWORK}"
  exit 1
fi

echo "→ Starting Fabric test network (channel: ${CHANNEL_NAME})..."
cd "${TEST_NETWORK}"
./network.sh up createChannel -c "${CHANNEL_NAME}" -ca

echo "→ Copying Org1 connection profile..."
mkdir -p "${PROJECT_ROOT}/config" "${PROJECT_ROOT}/backend/voting"
cp "${TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/connection-org1.json" \
  "${FABRIC_CCP_PATH}"
cp "${FABRIC_CCP_PATH}" "${PROJECT_ROOT}/backend/voting/connection-org1.json"

echo "✔ Network is up. Connection profile: ${FABRIC_CCP_PATH}"

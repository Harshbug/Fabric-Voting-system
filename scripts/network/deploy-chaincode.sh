#!/usr/bin/env bash
# Package, install, approve, and commit the referendum chaincode.
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

if [[ ! -d "${TEST_NETWORK}" ]]; then
  echo "ERROR: Run scripts/network/network-up.sh first"
  exit 1
fi

echo "→ Deploying chaincode '${CHAINCODE_NAME}' from ${CHAINCODE_PATH}..."
cd "${TEST_NETWORK}"
./network.sh deployCC \
  -ccn "${CHAINCODE_NAME}" \
  -ccp "${CHAINCODE_PATH}" \
  -ccl go \
  -ccv "${CHAINCODE_VERSION}" \
  -ccs "${CHAINCODE_SEQUENCE}" \
  -c "${CHANNEL_NAME}"

echo "✔ Chaincode deployed on channel ${CHANNEL_NAME}"

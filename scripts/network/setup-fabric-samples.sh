#!/usr/bin/env bash
# Clone fabric-samples and install Fabric binaries if missing.
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

if [[ -d "${FABRIC_SAMPLES_DIR}/.git" ]]; then
  echo "✔ fabric-samples already present at ${FABRIC_SAMPLES_DIR}"
  exit 0
fi

echo "→ Cloning fabric-samples (version ${FABRIC_VERSION})..."
git clone --depth 1 --branch "v${FABRIC_VERSION}" https://github.com/hyperledger/fabric-samples.git "${FABRIC_SAMPLES_DIR}"

echo "→ Installing Fabric binaries and Docker images..."
cd "${FABRIC_SAMPLES_DIR}"
./scripts/bootstrap.sh

echo "✔ fabric-samples ready"

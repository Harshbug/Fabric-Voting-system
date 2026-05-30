#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

if [[ ! -d "${TEST_NETWORK}" ]]; then
  echo "Nothing to tear down (test-network missing)."
  exit 0
fi

echo "→ Stopping Fabric test network..."
cd "${TEST_NETWORK}"
./network.sh down

echo "✔ Network stopped"

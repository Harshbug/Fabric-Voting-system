#!/usr/bin/env bash
# Shared paths and Fabric settings for bash scripts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

export PROJECT_ROOT
export FABRIC_SAMPLES_DIR="${FABRIC_SAMPLES_DIR:-${PROJECT_ROOT}/fabric-samples}"
export FABRIC_VERSION="${FABRIC_VERSION:-2.5.12}"
export CHANNEL_NAME="${CHANNEL_NAME:-mychannel}"
export CHAINCODE_NAME="${CHAINCODE_NAME:-referendum}"
export CHAINCODE_VERSION="${CHAINCODE_VERSION:-1.0}"
export CHAINCODE_SEQUENCE="${CHAINCODE_SEQUENCE:-1}"
export CHAINCODE_PATH="${PROJECT_ROOT}/chaincode/referendum/go"
export TEST_NETWORK="${FABRIC_SAMPLES_DIR}/test-network"

export FABRIC_CCP_PATH="${FABRIC_CCP_PATH:-${PROJECT_ROOT}/config/connection-org1.json}"
export FABRIC_WALLET_PATH="${FABRIC_WALLET_PATH:-${PROJECT_ROOT}/fabric_service/wallet}"

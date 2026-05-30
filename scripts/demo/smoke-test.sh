#!/usr/bin/env bash
# End-to-end smoke test: Fabric gateway + Django API.
set -euo pipefail
source "$(dirname "$0")/../lib/env.sh"

FABRIC_URL="${FABRIC_SERVICE_URL:-http://localhost:5000}"
API_URL="${API_BASE_URL:-http://localhost:8000/api}"
VOTER="smoke-voter-$(date +%s)"

fail() { echo "✗ $1"; exit 1; }
ok() { echo "✔ $1"; }

echo "=== Fabric Referendum smoke test ==="

# Fabric service health
curl -sf "${FABRIC_URL}/health" >/dev/null || fail "Fabric service not reachable at ${FABRIC_URL}"
ok "Fabric service health"

# HasVoted (expect false)
RES=$(curl -sf -X POST "${FABRIC_URL}/query" -H "Content-Type: application/json" \
  -d "{\"fcn\":\"HasVoted\",\"args\":[\"${VOTER}\"]}")
echo "$RES" | grep -q '"result":"false"' || fail "HasVoted query"
ok "HasVoted=false for new voter"

# CastVote via gateway
curl -sf -X POST "${FABRIC_URL}/invoke" -H "Content-Type: application/json" \
  -d "{\"fcn\":\"CastVote\",\"args\":[\"${VOTER}\",\"1\"]}" >/dev/null || fail "CastVote invoke"
ok "CastVote submitted"

# HasVoted (expect true)
RES=$(curl -sf -X POST "${FABRIC_URL}/query" -H "Content-Type: application/json" \
  -d "{\"fcn\":\"HasVoted\",\"args\":[\"${VOTER}\"]}")
echo "$RES" | grep -q '"result":"true"' || fail "HasVoted after vote"
ok "HasVoted=true after vote"

# Django health (optional if running)
if curl -sf "${API_URL%/api}/api/health/" >/dev/null 2>&1; then
  ok "Django API health"
else
  echo "⚠ Django not running — skipping API tests"
  exit 0
fi

curl -sf -X POST "${API_URL}/vote/" -H "Content-Type: application/json" \
  -d "{\"voter_id\":\"${VOTER}-api\",\"party_id\":1}" >/dev/null || fail "Django cast vote"
ok "Django /api/vote/"

curl -sf "${API_URL}/results/" >/dev/null || fail "Django results"
ok "Django /api/results/"

echo "=== All smoke checks passed ==="

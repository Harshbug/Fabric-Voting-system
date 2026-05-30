# Demo & Ledger Operations

## Expected bootstrap output

After `network-up`:

- Docker containers: peers, orderer, CAs running  
- `config/connection-org1.json` created  

After `deploy-chaincode`:

- Chaincode `referendum` committed on `mychannel`  

After `import-wallet`:

- `fabric_service/wallet/admin.id` present  

## Manual chaincode test (peer CLI)

From `fabric-samples/test-network`:

```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
peer chaincode invoke -o localhost:7050 -C mychannel -n referendum \
  -c '{"Args":["CastVote","voter1","1"]}' \
  --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

peer chaincode query -C mychannel -n referendum \
  -c '{"Args":["HasVoted","voter1"]}'
# Expect: true

peer chaincode query -C mychannel -n referendum \
  -c '{"Args":["GetResults"]}'
# Expect: {"1":1} or similar JSON
```

## Gateway HTTP test

```bash
curl -s http://localhost:5000/health | jq

curl -s -X POST http://localhost:5000/query \
  -H "Content-Type: application/json" \
  -d '{"fcn":"HasVoted","args":["voter-demo"]}'

curl -s -X POST http://localhost:5000/invoke \
  -H "Content-Type: application/json" \
  -d '{"fcn":"CastVote","args":["voter-demo","1"]}'
```

## Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ENDORSEMENT_POLICY_FAILURE` | Chaincode not committed on channel | Re-run deploy |
| `identity not found` | Empty wallet | `import-wallet` |
| `connection refused :7051` | Network down | `network-up` |
| Duplicate vote error | Same voter_id | Expected behavior |
| Django 502 | Gateway down | `npm start` in fabric_service |

## Full demo script

```bash
./scripts/demo/smoke-test.sh
```

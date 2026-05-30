# System Architecture

## Overview

Fabric Referendum is a **three-tier application** on top of Hyperledger Fabric's test-network:

1. **Presentation** — React SPA  
2. **Application** — Django REST API (business rules, party catalog)  
3. **Blockchain access** — Node.js gateway (wallet, gRPC to peers)  
4. **Ledger** — Fabric peers + `referendum` chaincode  

## Data flow: cast a vote

```
User → React POST /api/vote/
     → Django validates party exists in SQLite
     → Django POST fabric-gateway /query  (HasVoted)
     → Django POST fabric-gateway /invoke (CastVote)
     → Gateway signs tx as Org1 Admin
     → Endorsing peer simulates chaincode
     → Orderer orders block
     → Peers commit → world state key = voter_id
```

## Data flow: read results

```
User → React GET /api/results/
     → Django POST /gateway /query (GetResults)
     → Chaincode scans state range, returns JSON {partyId: count}
     → Django merges with Party rows for names/colors/percentages
```

## Component roles

| Component | Responsibility |
|-----------|----------------|
| **Orderer** | Orders transactions into blocks |
| **Peer (Org1/Org2)** | Endorses, commits, hosts ledger |
| **Channel (`mychannel`)** | Private blockchain scope for this app |
| **Chaincode (`referendum`)** | Vote logic + world state |
| **MSP / CA** | Issues Org1 Admin identity used in wallet |
| **Wallet** | Stores X.509 cert + private key for SDK |
| **Connection profile** | Peer URLs, TLS roots for gRPC |
| **SQLite** | Party metadata only (not votes) |

## Why two backends (Django + Node)?

The **Fabric Node SDK** is mature for gateway-style apps. Django focuses on REST, validation, and admin. This mirrors production patterns where a dedicated integration service talks to Fabric.

## Docker placement

- **In containers (optional):** gateway, Django, nginx/React  
- **On host (typical dev):** Fabric test-network (peers, orderer, CAs)  

Peers use container DNS names; clients on the host use `localhost` ports from the connection profile (`discovery.asLocalhost`).

## Security notes (demo vs production)

Current demo uses a shared Org1 Admin identity for all API votes. Production would use per-user identities, private data collections, or token-based auth before submit.

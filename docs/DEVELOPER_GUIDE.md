# Developer Guide

## Folder structure

| Path | Purpose |
|------|---------|
| `chaincode/referendum/go/` | Ledger logic |
| `scripts/network/` | Fabric lifecycle |
| `fabric_service/` | Node gateway |
| `backend/voting/` | Django app |
| `backend/voting/services/` | Fabric HTTP client |
| `frontend/src/api/` | React API client |
| `config/` | Connection profile (generated) |
| `deploy/` | Docker assets |

## Conventions

- Chaincode functions: PascalCase (`CastVote`)  
- REST: snake_case JSON (`voter_id`)  
- Channel / chaincode names via environment variables  

## Add a new chaincode transaction

1. Add method on `ReferendumContract` in `referendum.go`  
2. Redeploy: increment `CHAINCODE_SEQUENCE`, run `deploy-chaincode`  
3. Expose via `fabric_service` `/invoke` or `/query` (generic)  
4. Add Django view + URL calling `invoke_chaincode` / `query_chaincode`  
5. Add React API method + UI  

## Modify chaincode

```bash
# Edit chaincode/referendum/go/referendum.go
export CHAINCODE_SEQUENCE=2
./scripts/network/deploy-chaincode.sh
```

## Add a Django API route

1. View in `backend/voting/views.py`  
2. URL in `backend/voting/urls.py`  
3. Optional serializer in `serializers.py`  

## Add a frontend page

1. Create `frontend/src/pages/YourPage.tsx`  
2. Route in `App.tsx` + nav link  
3. API calls in `frontend/src/api/client.ts`  

## Run tests

```bash
cd backend && python manage.py test
cd chaincode/referendum/go && go test ./...
```

## Coding comments

Comments focus on **why** (Fabric boundaries, wallet, discovery), not obvious syntax.

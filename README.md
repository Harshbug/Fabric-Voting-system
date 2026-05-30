# Fabric Referendum

A portfolio-ready **Hyperledger Fabric** voting demo: custom chaincode, Node.js Fabric gateway, Django REST API, and React UI.

## Architecture (short)

```
React (5173) → Django API (8000) → Fabric Gateway (5000) → Fabric Peers → Referendum Chaincode
                     ↓
               SQLite (party catalog only)
```

Votes live on the blockchain. Party names/colors are off-chain metadata in Django.

## Tech stack

| Layer | Technology |
|-------|------------|
| Blockchain | Hyperledger Fabric 2.5 (test-network) |
| Chaincode | Go (`CastVote`, `HasVoted`, `GetResults`) |
| Gateway | Node.js + `fabric-network` |
| API | Django 5 + Django REST Framework |
| Frontend | React 18 + TypeScript + Vite |
| Containers | Docker Compose (app tier) |

## Prerequisites

- **Docker Desktop** (running)
- **Git**
- **Node.js 20+**
- **Python 3.11+**
- **Go 1.21+** (chaincode build; Docker deploy uses Fabric's builder if network scripts run)
- **Bash** (Git Bash or WSL on Windows for Fabric scripts)

> **Step-by-step run guide:** See [docs/USAGE.md](docs/USAGE.md) for full copy-paste instructions, browser tests, and troubleshooting.

## Quick start (local)

### 1. Bootstrap Fabric network + chaincode

**Windows (PowerShell):**

```powershell
.\scripts\start-all.ps1
```

**Linux / macOS / Git Bash:**

```bash
chmod +x scripts/**/*.sh
./scripts/start-all.sh
```

This clones `fabric-samples` (first run only), starts test-network, deploys `referendum` chaincode, and imports the Org1 admin wallet.

### 2. Start Fabric gateway

```bash
cd fabric_service
npm install
npm start
```

### 3. Start Django API

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
source venv/bin/activate  # Linux/macOS
pip install -r req.txt
python manage.py migrate
python manage.py seed_parties
python manage.py runserver
```

### 4. Start React UI

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### 5. Smoke test

With gateway + network running:

```bash
./scripts/demo/smoke-test.sh
```

## Demo flow

1. **Dashboard** — API + Fabric gateway health.
2. **Vote** — Submit `CastVote` (one vote per `voter_id` on ledger).
3. **Results** — `GetResults` aggregated from world state.
4. **Voter status** — `HasVoted` query.

Try two different voter IDs; casting twice with the same ID should fail.

## Docker (application tier)

Fabric peers stay on the **host** (test-network). App services run in Compose:

```bash
# After network-up + deploy + import-wallet on host
docker compose -f deploy/docker-compose.yml up --build
```

- Frontend: http://localhost:8080  
- API: http://localhost:8000/api  
- Gateway: http://localhost:5000/health  

Set `FABRIC_DISCOVERY_AS_LOCALHOST=true` and mount `connection-org1.json` + `wallet/` (see `deploy/docker-compose.yml`).

## Configuration

Copy `.env.example` to `.env` at the repo root. Key variables:

| Variable | Default |
|----------|---------|
| `CHAINCODE_NAME` | `referendum` |
| `CHANNEL_NAME` | `mychannel` |
| `FABRIC_SERVICE_URL` | `http://localhost:5000` |
| `VITE_API_BASE_URL` | `http://localhost:8000/api` |

## Project layout

```
chaincode/referendum/go/   # Voting chaincode
scripts/network/           # Network up/down, deploy, wallet
fabric_service/            # Fabric gateway (invoke/query)
backend/                   # Django REST API
frontend/                  # React UI
config/                    # connection-org1.json (generated)
deploy/                    # Docker Compose + Dockerfiles
docs/                      # Deep-dive documentation
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Admin identity not found` | Run `node fabric_service/importAdmin.js` after network up |
| `Connection profile not found` | Run `scripts/network/network-up` |
| `chaincode referendum not found` | Run `scripts/network/deploy-chaincode` |
| Gateway cannot connect from Docker | Use `host.docker.internal`, regenerate CCP after network up |
| `HasVoted` / deploy errors | `./scripts/network/network-down` then start fresh |

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design & data flow  
- [docs/HYPERLEDGER_FABRIC_EXPLAINED.md](docs/HYPERLEDGER_FABRIC_EXPLAINED.md) — Fabric concepts  
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — local, Docker, production notes  
- [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) — extend the project  
- [docs/DEMO.md](docs/DEMO.md) — step-by-step ledger operations  

## License

Educational / portfolio use. Hyperledger Fabric components are subject to their respective licenses.

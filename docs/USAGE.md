# Fabric Referendum — How to Run & Test

This guide walks you through starting and testing the project from zero. No prior Hyperledger Fabric experience required.

---

## What you are running (big picture)

The project has **four layers**. Start them **in order**, each in its own terminal (after the blockchain is up).

| # | Component | Folder | Port | What it does |
|---|-----------|--------|------|----------------|
| 1 | **Fabric network** | Docker (via scripts) | — | The blockchain. Votes are stored here. |
| 2 | **Fabric gateway** | `fabric_service/` | 5000 | Talks to the blockchain for your apps. |
| 3 | **Django API** | `backend/` | 8000 | REST API + party names (SQLite). |
| 4 | **React UI** | `frontend/` | 5173 | Website in your browser. |

**When you vote:**

```
Browser (React) → Django API → Fabric Gateway → Blockchain
```

Party names and colors live in **SQLite** (Django).  
Votes live on the **blockchain** only.

---

## Prerequisites checklist

Before starting, confirm these are installed and working.

Open **PowerShell** and run:

```powershell
docker version          # Docker Desktop must be RUNNING
git --version
node --version          # v18+ recommended (v20+ ideal)
python --version        # 3.11+ recommended
go version              # 1.21+ (optional for first run; Fabric scripts use Docker)
bash --version          # Required: Git Bash or WSL on Windows
```

### Windows note

`scripts/start-all.ps1` uses **bash** to run Hyperledger’s official Fabric scripts.

- Install **Git for Windows** (includes Git Bash): https://git-scm.com/download/win  
- Or use **WSL**

If `bash` is not found, Fabric bootstrap will fail.

---

## Part A — Start the blockchain (do this first)

Use **one** PowerShell window. Go to the project root:

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main"
```

Run the full bootstrap:

```powershell
.\scripts\start-all.ps1
```

### What this script does

1. **Clones `fabric-samples`** (first time only — large download, may take 15–30+ minutes).
2. **Starts Docker containers** — peers, orderer, certificate authorities.
3. **Deploys voting chaincode** named `referendum` on channel `mychannel`.
4. **Imports admin wallet** into `fabric_service/wallet/` for signing transactions.

### How to know it succeeded

- Script finishes **without red errors**.
- Final messages mention wallet ready / chaincode deployed.
- **Docker Desktop** → Containers: several `peer`, `orderer`, `ca` containers are **Running**.

### Optional checks

```powershell
docker ps
```

```powershell
Test-Path ".\config\connection-org1.json"
```

Should return `True`.

### Run individual steps (if needed)

Instead of `start-all.ps1`, you can run:

```powershell
.\scripts\network\network-up.ps1
.\scripts\network\deploy-chaincode.ps1
.\scripts\network\import-wallet.ps1
```

---

## Part B — Start the three applications

After Part A succeeds, open **three separate terminals**. Keep them all running.

---

### Terminal 1 — Fabric gateway (blockchain bridge)

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\fabric_service"
npm install
npm start
```

**Success looks like:**

```
Fabric gateway listening on http://localhost:5000
Channel: mychannel, Chaincode: referendum
```

**Quick test:**

```powershell
curl http://localhost:5000/health
```

Expected JSON includes `"status":"ok"` and `"chaincode":"referendum"`.

---

### Terminal 2 — Django API

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r req.txt
python manage.py migrate
python manage.py seed_parties
python manage.py runserver
```

**Success looks like:**

```
Starting development server at http://127.0.0.1:8000/
```

**Quick test:**

```powershell
curl http://localhost:8000/api/health/
```

Look for:

- `"status": "ok"`
- `"fabric_gateway": "up"`

If `"fabric_gateway": "down"`, Terminal 1 is not running or Fabric is down.

---

### Terminal 3 — React website

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\frontend"
npm install
npm run dev
```

**Success looks like:**

```
Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## Part C — Test in the browser

With **Docker Fabric running** + **all three terminals** running:

### Step 1 — Dashboard

1. Open **http://localhost:5173**
2. Go to **Dashboard**
3. Confirm:
   - **Backend:** ok
   - **Fabric gateway:** up

If gateway shows **down**, fix Terminal 1 or re-run Part A.

---

### Step 2 — Cast a vote

1. Click **Vote**
2. Enter voter ID: `alice-1` (any unique text)
3. Select a party
4. Click **Submit vote to ledger**
5. You should see a success message

---

### Step 3 — Test duplicate vote (blockchain rule)

1. Go to **Vote** again
2. Use the **same** voter ID: `alice-1`
3. Submit again
4. You should get an error like **already voted**

This proves the **ledger** enforces one vote per voter — not just the database.

---

### Step 4 — View results

1. Click **Results**
2. You should see vote counts per party (data from blockchain)

---

### Step 5 — Check voter status

1. Click **Voter status**
2. Enter `alice-1` → should show **has voted**
3. Enter `bob-1` (new ID) → should show **has not voted**

---

## Part D — Test without the website (optional)

With **Fabric network up** and **Terminal 1 (gateway) running**:

### Check if a voter has voted

```powershell
curl -Method POST http://localhost:5000/query `
  -ContentType "application/json" `
  -Body '{"fcn":"HasVoted","args":["alice-1"]}'
```

Expected after alice voted: `"result":"true"`

---

### Cast a vote directly on the chain

```powershell
curl -Method POST http://localhost:5000/invoke `
  -ContentType "application/json" `
  -Body '{"fcn":"CastVote","args":["carol-1","2"]}'
```

---

### Get all results from the chain

```powershell
curl -Method POST http://localhost:5000/query `
  -ContentType "application/json" `
  -Body '{"fcn":"GetResults","args":[]}'
```

---

## What should be running (diagram)

```
[Docker Desktop]
    Fabric peers + orderer + CA     ← Part A (start-all.ps1)
              ↑
[Terminal 1]  fabric_service :5000
              ↑
[Terminal 2]  Django         :8000
              ↑
[Terminal 3]  React          :5173  ← open in browser
```

---

## Minimum “it works” checklist

Use this short path to confirm everything:

- [ ] Docker Desktop is running
- [ ] `.\scripts\start-all.ps1` completed without errors
- [ ] `fabric_service` → `npm start` → health OK at :5000
- [ ] `backend` → migrate, seed_parties, runserver → health OK at :8000
- [ ] `frontend` → `npm run dev` → site opens at :5173
- [ ] Vote as `test-user-1` → success
- [ ] Vote again as `test-user-1` → error (already voted)
- [ ] Results page shows at least 1 vote

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `bash: command not found` | No Git Bash / WSL | Install Git for Windows |
| Docker errors during bootstrap | Docker not running | Start Docker Desktop, wait until ready |
| `Admin identity not found` | Wallet not imported | `.\scripts\network\import-wallet.ps1` |
| `Connection profile not found` | Network not started | `.\scripts\network\network-up.ps1` |
| Vote fails / chaincode errors | Chaincode not deployed | `.\scripts\network\deploy-chaincode.ps1` |
| Django shows `fabric_gateway: down` | Gateway not running | Start Terminal 1 (`npm start`) |
| `ModuleNotFoundError: django` | Virtual env not active | `.\venv\Scripts\activate` then `pip install -r req.txt` |
| Port already in use | Old process on port | Close old terminal or free port 5000 / 8000 / 5173 |

### Full reset (when things are broken)

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main"
.\scripts\network\network-down.ps1
.\scripts\start-all.ps1
```

Then start Terminal 1, 2, and 3 again.

---

## Linux / macOS / Git Bash

From project root:

```bash
chmod +x scripts/**/*.sh
./scripts/start-all.sh
```

Then in separate terminals:

```bash
cd fabric_service && npm install && npm start
```

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r req.txt
python manage.py migrate
python manage.py seed_parties
python manage.py runserver
```

```bash
cd frontend && npm install && npm run dev
```

Smoke test (gateway + network running):

```bash
./scripts/demo/smoke-test.sh
```

---

## What you learn from running this

| Piece | Lesson |
|-------|--------|
| **Fabric network** | Blockchain runs in Docker; stores votes immutably |
| **Gateway** | Only component that speaks Fabric; holds wallet + signs txs |
| **Django** | Normal REST API; validates parties; proxies vote/result calls |
| **React** | UI only; never talks to Fabric directly |
| **Duplicate vote error** | Business rule enforced on **ledger**, not in SQLite |

---

## Related documentation

- [README.md](../README.md) — project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design
- [HYPERLEDGER_FABRIC_EXPLAINED.md](./HYPERLEDGER_FABRIC_EXPLAINED.md) — Fabric concepts
- [DEMO.md](./DEMO.md) — ledger CLI commands
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Docker and production notes
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) — extend the codebase

---

## Quick reference — copy-paste commands (Windows)

**Bootstrap blockchain:**

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main"
.\scripts\start-all.ps1
```

**Terminal 1 — Gateway:**

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\fabric_service"
npm install
npm start
```

**Terminal 2 — API:**

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r req.txt
python manage.py migrate
python manage.py seed_parties
python manage.py runserver
```

**Terminal 3 — UI:**

```powershell
cd "C:\Users\cazeu\OneDrive\Desktop\Fabric_Referendum-main\frontend"
npm install
npm run dev
```

**Open in browser:** http://localhost:5173

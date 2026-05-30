# Full local bootstrap: network → chaincode → wallet (run services separately).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "`n=== Fabric Referendum — full bootstrap ===`n" -ForegroundColor Yellow

& "$PSScriptRoot\network\network-up.ps1"
& "$PSScriptRoot\network\deploy-chaincode.ps1"
& "$PSScriptRoot\network\import-wallet.ps1"

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. cd fabric_service && npm install && npm start"
Write-Host "  2. cd backend && pip install -r req.txt && python manage.py migrate && python manage.py seed_parties && python manage.py runserver"
Write-Host "  3. cd frontend && npm install && npm run dev"
Write-Host ""

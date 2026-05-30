$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\lib\env.ps1"

Push-Location (Join-Path $ProjectRoot "fabric_service")
try {
    node importAdmin.js
    if ($LASTEXITCODE -ne 0) { Write-Err "importAdmin.js failed" }
} finally {
    Pop-Location
}
Write-Ok "Wallet ready at $FabricWalletPath"

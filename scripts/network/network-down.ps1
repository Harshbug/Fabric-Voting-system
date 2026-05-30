$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\lib\env.ps1"

if (-not (Test-Path $TestNetwork)) {
    Write-Host "Nothing to tear down."
    exit 0
}

Write-Step "Stopping Fabric test network..."
Push-Location $TestNetwork
try {
    bash ./network.sh down
} finally {
    Pop-Location
}
Write-Ok "Network stopped"

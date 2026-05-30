$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\lib\env.ps1"

if (Test-Path (Join-Path $FabricSamplesDir ".git")) {
    Write-Ok "fabric-samples already present at $FabricSamplesDir"
    exit 0
}

Write-Step "Cloning fabric-samples v$FabricVersion..."
git clone --depth 1 --branch "v$FabricVersion" https://github.com/hyperledger/fabric-samples.git $FabricSamplesDir

Write-Step "Installing Fabric binaries and Docker images (this may take several minutes)..."
Push-Location $FabricSamplesDir
try {
    bash ./scripts/bootstrap.sh
    if ($LASTEXITCODE -ne 0) { Write-Err "bootstrap.sh failed" }
} finally {
    Pop-Location
}

Write-Ok "fabric-samples ready"

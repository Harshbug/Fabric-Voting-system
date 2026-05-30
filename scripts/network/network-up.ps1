# Start Fabric test network (Windows / PowerShell).
$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\lib\env.ps1"

& "$PSScriptRoot\setup-fabric-samples.ps1"

if (-not (Test-Path $TestNetwork)) {
    Write-Err "test-network not found at $TestNetwork"
}

Write-Step "Starting Fabric test network (channel: $ChannelName)..."
Push-Location $TestNetwork
try {
    bash ./network.sh up createChannel -c $ChannelName -ca
    if ($LASTEXITCODE -ne 0) { Write-Err "network.sh up failed (use WSL/Git Bash if bash is missing)" }
} finally {
    Pop-Location
}

$configDir = Join-Path $ProjectRoot "config"
$votingDir = Join-Path $ProjectRoot "backend\voting"
New-Item -ItemType Directory -Force -Path $configDir, $votingDir | Out-Null

$src = Join-Path $TestNetwork "organizations\peerOrganizations\org1.example.com\connection-org1.json"
Copy-Item $src $FabricCcpPath -Force
Copy-Item $src (Join-Path $votingDir "connection-org1.json") -Force

Write-Ok "Network is up. Connection profile: $FabricCcpPath"

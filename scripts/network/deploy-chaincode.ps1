$ErrorActionPreference = "Stop"
. "$PSScriptRoot\..\lib\env.ps1"

if (-not (Test-Path $TestNetwork)) {
    Write-Err "Run scripts\network\network-up.ps1 first"
}

Write-Step "Deploying chaincode '$ChaincodeName'..."
Push-Location $TestNetwork
try {
    $ccp = $ChaincodePath -replace '\\', '/'
    bash ./network.sh deployCC -ccn $ChaincodeName -ccp "$ccp" -ccl go -ccv $ChaincodeVersion -ccs $ChaincodeSequence -c $ChannelName
    if ($LASTEXITCODE -ne 0) { Write-Err "deployCC failed" }
} finally {
    Pop-Location
}
Write-Ok "Chaincode deployed on $ChannelName"

# Shared paths and Fabric settings for PowerShell scripts.
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$script:ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path

$script:FabricSamplesDir = if ($env:FABRIC_SAMPLES_DIR) { $env:FABRIC_SAMPLES_DIR } else { Join-Path $ProjectRoot "fabric-samples" }
$script:FabricVersion = if ($env:FABRIC_VERSION) { $env:FABRIC_VERSION } else { "2.5.12" }
$script:ChannelName = if ($env:CHANNEL_NAME) { $env:CHANNEL_NAME } else { "mychannel" }
$script:ChaincodeName = if ($env:CHAINCODE_NAME) { $env:CHAINCODE_NAME } else { "referendum" }
$script:ChaincodeVersion = if ($env:CHAINCODE_VERSION) { $env:CHAINCODE_VERSION } else { "1.0" }
$script:ChaincodeSequence = if ($env:CHAINCODE_SEQUENCE) { $env:CHAINCODE_SEQUENCE } else { "1" }
$script:ChaincodePath = Join-Path $ProjectRoot "chaincode\referendum\go"
$script:TestNetwork = Join-Path $FabricSamplesDir "test-network"
$script:FabricCcpPath = if ($env:FABRIC_CCP_PATH) { $env:FABRIC_CCP_PATH } else { Join-Path $ProjectRoot "config\connection-org1.json" }
$script:FabricWalletPath = if ($env:FABRIC_WALLET_PATH) { $env:FABRIC_WALLET_PATH } else { Join-Path $ProjectRoot "fabric_service\wallet" }

function Write-Step($msg) { Write-Host "→ $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "✔ $msg" -ForegroundColor Green }
function Write-Err($msg) { Write-Host "✗ $msg" -ForegroundColor Red; exit 1 }

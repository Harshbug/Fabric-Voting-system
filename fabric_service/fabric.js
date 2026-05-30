const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

// Config from environment (see .env.example)
const CCP_PATH = process.env.FABRIC_CCP_PATH
    || path.resolve(__dirname, "../config/connection-org1.json");
const WALLET_PATH = process.env.FABRIC_WALLET_PATH
    || path.join(__dirname, "wallet");
const IDENTITY = process.env.FABRIC_IDENTITY || "admin";
const CHANNEL = process.env.CHANNEL_NAME || "mychannel";
const CHAINCODE = process.env.CHAINCODE_NAME || "referendum";
const DISCOVERY_AS_LOCALHOST = process.env.FABRIC_DISCOVERY_AS_LOCALHOST !== "false";

let gatewayInstance = null;

async function connectGateway() {
    if (gatewayInstance && gatewayInstance.getNetwork) {
        return gatewayInstance;
    }

    if (!fs.existsSync(CCP_PATH)) {
        throw new Error(
            `Connection profile not found at ${CCP_PATH}. Run scripts/network/network-up first.`
        );
    }

    const ccp = JSON.parse(fs.readFileSync(CCP_PATH, "utf8"));
    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    const identity = await wallet.get(IDENTITY);
    if (!identity) {
        throw new Error(
            `Identity '${IDENTITY}' not in wallet. Run: node importAdmin.js or scripts/network/import-wallet`
        );
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: IDENTITY,
        discovery: { enabled: true, asLocalhost: DISCOVERY_AS_LOCALHOST },
    });

    gatewayInstance = gateway;
    return gateway;
}

/** Run a chaincode transaction and always release the gateway connection. */
async function withContract(fn) {
    const gateway = await connectGateway();
    try {
        const network = await gateway.getNetwork(CHANNEL);
        const contract = network.getContract(CHAINCODE);
        return await fn(contract);
    } finally {
        if (gatewayInstance) {
            gatewayInstance.disconnect();
            gatewayInstance = null;
        }
    }
}

module.exports = { withContract, connectGateway, CHANNEL, CHAINCODE };

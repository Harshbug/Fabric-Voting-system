const { Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const FABRIC_SAMPLES = process.env.FABRIC_SAMPLES_DIR
    || path.join(PROJECT_ROOT, "fabric-samples");
const ADMIN_MSP = path.join(
    FABRIC_SAMPLES,
    "test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"
);

function findFirstFile(dir) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
    return files.length ? path.join(dir, files[0]) : null;
}

async function main() {
    const certPath = findFirstFile(path.join(ADMIN_MSP, "signcerts"));
    const keyPath = findFirstFile(path.join(ADMIN_MSP, "keystore"));

    if (!certPath || !keyPath) {
        console.error("Admin credentials not found. Expected MSP at:");
        console.error(ADMIN_MSP);
        console.error("Start the network first: scripts/network/network-up");
        process.exit(1);
    }

    const walletPath = process.env.FABRIC_WALLET_PATH
        || path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = {
        credentials: {
            certificate: fs.readFileSync(certPath, "utf8"),
            privateKey: fs.readFileSync(keyPath, "utf8"),
        },
        mspId: "Org1MSP",
        type: "X.509",
    };

    await wallet.put(process.env.FABRIC_IDENTITY || "admin", identity);
    console.log(`Admin identity imported into ${walletPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

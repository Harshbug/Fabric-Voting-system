const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { withContract, CHANNEL, CHAINCODE } = require("./fabric");

const PORT = process.env.FABRIC_SERVICE_PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        channel: CHANNEL,
        chaincode: CHAINCODE,
    });
});

app.get("/", (req, res) => {
    res.send("Fabric Referendum Gateway — use /health, /invoke, /query");
});

// Submit a state-changing chaincode transaction
app.post("/invoke", async (req, res) => {
    try {
        const { fcn, args } = req.body;
        if (!fcn || !Array.isArray(args)) {
            return res.status(400).json({ error: "fcn and args[] are required" });
        }

        const result = await withContract((contract) =>
            contract.submitTransaction(fcn, ...args)
        );

        res.json({ success: true, result: result.toString() });
    } catch (err) {
        console.error("invoke error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Read-only chaincode evaluation (no ledger write)
app.post("/query", async (req, res) => {
    try {
        const { fcn, args } = req.body;
        if (!fcn || !Array.isArray(args)) {
            return res.status(400).json({ error: "fcn and args[] are required" });
        }

        const result = await withContract((contract) =>
            contract.evaluateTransaction(fcn, ...(args || []))
        );

        res.json({ success: true, result: result.toString() });
    } catch (err) {
        console.error("query error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Fabric gateway listening on http://localhost:${PORT}`);
    console.log(`Channel: ${CHANNEL}, Chaincode: ${CHAINCODE}`);
});

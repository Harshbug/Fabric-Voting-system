# Hyperledger Fabric Explained (Beginner-Friendly)

## Ledger

Two parts:

- **Blockchain** — immutable ordered log of transactions  
- **World state** — current values (key → value database, CouchDB or LevelDB)  

This app's `voter_id` is the state key; the value is JSON `{voterId, partyId}`.

## Transaction flow (simplified)

1. **Proposal** — client sends transaction to endorsing peers  
2. **Simulation** — peers run chaincode read-only; return read/write set + endorsement signature  
3. **Submission** — client sends endorsed tx to orderer  
4. **Ordering** — orderer batches into blocks  
5. **Validation & commit** — peers validate endorsements and policies, then update ledger  

## Endorsement

Peers execute chaincode and sign the result. The channel's **endorsement policy** defines how many signatures are required (test-network often uses majority of orgs).

## Chaincode lifecycle (this project)

1. **Package** — compile Go chaincode  
2. **Install** — on each peer  
3. **Approve** — org approves definition per channel  
4. **Commit** — definition becomes active on channel  

Scripts: `scripts/network/deploy-chaincode.sh`

## Identities & MSP

- **MSP** — defines who belongs to an organization  
- **Admin@org1** — identity in wallet used by the gateway  
- Certificate + private key prove membership at transaction time  

## Channels

A channel is a subnet: separate ledger and chaincodes. We use `mychannel` from fabric-samples.

## Certificates

TLS secures peer gRPC; enrollment certs identify users. Regenerating the network invalidates old `connection-org1.json` files — re-run `network-up`.

## Docker in Fabric dev

`fabric-samples/test-network` runs peers/orderers/CAs as containers. Your app runs on the host (or separate compose) and connects via published ports `7051`, `7054`, etc.

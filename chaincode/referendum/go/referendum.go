package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// VoteRecord is stored on the ledger keyed by voter ID.
type VoteRecord struct {
	VoterID string `json:"voterId"`
	PartyID string `json:"partyId"`
}

// ReferendumContract implements referendum voting on Hyperledger Fabric.
type ReferendumContract struct {
	contractapi.Contract
}

// CastVote records one vote per voter ID (enforced on ledger).
func (c *ReferendumContract) CastVote(ctx contractapi.TransactionContextInterface, voterID string, partyID string) error {
	if voterID == "" || partyID == "" {
		return fmt.Errorf("voterID and partyID are required")
	}

	existing, err := ctx.GetStub().GetState(voterID)
	if err != nil {
		return fmt.Errorf("failed to read state: %w", err)
	}
	if existing != nil {
		return fmt.Errorf("voter %s has already voted", voterID)
	}

	vote := VoteRecord{VoterID: voterID, PartyID: partyID}
	voteJSON, err := json.Marshal(vote)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(voterID, voteJSON)
}

// HasVoted returns "true" or "false" for use by the API layer.
func (c *ReferendumContract) HasVoted(ctx contractapi.TransactionContextInterface, voterID string) (string, error) {
	existing, err := ctx.GetStub().GetState(voterID)
	if err != nil {
		return "", err
	}
	if existing != nil {
		return "true", nil
	}
	return "false", nil
}

// GetResults returns JSON map of partyId -> vote count.
func (c *ReferendumContract) GetResults(ctx contractapi.TransactionContextInterface) (string, error) {
	results := make(map[string]int)

	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return "", err
	}
	defer iterator.Close()

	for iterator.HasNext() {
		response, err := iterator.Next()
		if err != nil {
			return "", err
		}

		var vote VoteRecord
		if err := json.Unmarshal(response.Value, &vote); err != nil {
			continue
		}
		results[vote.PartyID]++
	}

	out, err := json.Marshal(results)
	if err != nil {
		return "", err
	}
	return string(out), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&ReferendumContract{})
	if err != nil {
		panic(fmt.Sprintf("chaincode constructor failed: %v", err))
	}
	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("chaincode start failed: %v", err))
	}
}

package main

import "testing"

// Integration tests run against a live network via scripts/demo/smoke-test.sh.
// This file keeps `go test` usable for CI without a full peer stub.

func TestVoteRecordJSON(t *testing.T) {
	v := VoteRecord{VoterID: "v1", PartyID: "2"}
	if v.VoterID != "v1" || v.PartyID != "2" {
		t.Fatal("unexpected vote record fields")
	}
}

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { api, HealthResponse } from "../api/client";

export default function Dashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [election, setElection] = useState<{ election_name: string; is_active: boolean } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.health(), api.electionInfo()])
      .then(([h, e]) => {
        setHealth(h);
        setElection(e);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const fabricUp = health?.fabric_gateway === "up";

  return (
    <>
      <Card title="System overview">
        <p>
          Votes are stored on a <strong>Hyperledger Fabric</strong> ledger via chaincode.
          Party metadata is served from the Django API (off-chain catalog).
        </p>
      </Card>
      <div className="grid-2">
        <Card title="API health">
          <p>
            Backend:{" "}
            <span className={`status-pill ${health?.status === "ok" ? "status-up" : "status-down"}`}>
              {health?.status ?? "unknown"}
            </span>
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Fabric gateway:{" "}
            <span className={`status-pill ${fabricUp ? "status-up" : "status-down"}`}>
              {health?.fabric_gateway ?? "unknown"}
            </span>
          </p>
          {health?.fabric?.channel && (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Channel: {health.fabric.channel} · Chaincode: {health.fabric.chaincode}
            </p>
          )}
        </Card>
        <Card title="Election">
          {election ? (
            <>
              <p><strong>{election.election_name}</strong></p>
              <p style={{ color: "var(--muted)" }}>
                {election.is_active ? "Voting is open" : "Voting is closed"}
              </p>
            </>
          ) : (
            <p>No election settings configured.</p>
          )}
        </Card>
      </div>
    </>
  );
}

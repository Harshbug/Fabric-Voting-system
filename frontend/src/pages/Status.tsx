import { FormEvent, useState } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { api } from "../api/client";

export default function Status() {
  const [voterId, setVoterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ voter_id: string; has_voted: boolean } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.voterStatus(voterId.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Check voter status (ledger query)">
      {error && <Alert variant="error">{error}</Alert>}
      <form onSubmit={onSubmit}>
        <label htmlFor="voter-check">Voter ID</label>
        <input
          id="voter-check"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          placeholder="e.g. voter-alice"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Querying…" : "Query ledger"}
        </button>
      </form>
      {loading && <Loading />}
      {result && (
        <Alert variant={result.has_voted ? "info" : "success"}>
          <strong>{result.voter_id}</strong> has{result.has_voted ? "" : " not"} voted yet.
        </Alert>
      )}
    </Card>
  );
}

import { FormEvent, useEffect, useState } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { api, Party } from "../api/client";

export default function Vote() {
  const [parties, setParties] = useState<Party[]>([]);
  const [voterId, setVoterId] = useState("");
  const [partyId, setPartyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .parties()
      .then(setParties)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.castVote(voterId.trim(), Number(partyId));
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Card title="Cast vote (blockchain transaction)">
      {error && <Alert variant="error">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <form onSubmit={onSubmit}>
        <label htmlFor="voter">Voter ID</label>
        <input
          id="voter"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          placeholder="e.g. voter-alice"
          required
        />
        <label htmlFor="party">Party</label>
        <select
          id="party"
          value={partyId}
          onChange={(e) => setPartyId(e.target.value)}
          required
        >
          <option value="">Select a party</option>
          {parties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.short_name})
            </option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit vote to ledger"}
        </button>
      </form>
    </Card>
  );
}

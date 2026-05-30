import { useEffect, useState } from "react";
import Card from "../components/Card";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { api, ResultRow } from "../api/client";

export default function Results() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    setError("");
    api
      .results()
      .then((data) => {
        setResults(data.results);
        setTotal(data.total_votes);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading label="Querying ledger…" />;

  return (
    <Card title="Election results (from blockchain)">
      {error && <Alert variant="error">{error}</Alert>}
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Total votes on ledger: <strong>{total}</strong>
      </p>
      {results.map((row) => (
        <div key={row.id} className="bar-row">
          <div className="bar-label">
            <span>{row.name}</span>
            <span>
              {row.votes} ({row.percentage}%)
            </span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${row.percentage}%`, background: row.color }}
            />
          </div>
        </div>
      ))}
      <button type="button" className="secondary" onClick={load} style={{ marginTop: "1rem" }}>
        Refresh
      </button>
    </Card>
  );
}

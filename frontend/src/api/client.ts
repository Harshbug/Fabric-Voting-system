const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/api";

export type Party = {
  id: number;
  name: string;
  short_name: string;
  description: string;
  color: string;
  leader: string;
  manifesto_list: string[];
  vote_count: number;
};

export type ResultRow = {
  id: number;
  name: string;
  short_name: string;
  color: string;
  votes: number;
  percentage: number;
};

export type HealthResponse = {
  status: string;
  fabric_gateway: string;
  fabric?: { channel?: string; chaincode?: string };
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || res.statusText);
  }
  return data as T;
}

export const api = {
  health: () => request<HealthResponse>("/health/"),
  parties: () => request<Party[]>("/parties/"),
  electionInfo: () =>
    request<{ election_name: string; total_voters: number; is_active: boolean }>(
      "/election-info/"
    ),
  castVote: (voter_id: string, party_id: number) =>
    request<{ message: string }>("/vote/", {
      method: "POST",
      body: JSON.stringify({ voter_id, party_id }),
    }),
  results: () =>
    request<{ results: ResultRow[]; total_votes: number }>("/results/"),
  voterStatus: (voterId: string) =>
    request<{ voter_id: string; has_voted: boolean }>(
      `/voter/${encodeURIComponent(voterId)}/status/`
    ),
};

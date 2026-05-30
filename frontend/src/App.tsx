import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Status from "./pages/Status";

export default function App() {
  return (
    <div className="layout">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <h1>Fabric Referendum</h1>
            <p>Hyperledger Fabric voting demo</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/vote">Vote</NavLink>
          <NavLink to="/results">Results</NavLink>
          <NavLink to="/status">Voter status</NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<Results />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </main>
    </div>
  );
}

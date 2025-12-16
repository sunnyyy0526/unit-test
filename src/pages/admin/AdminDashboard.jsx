import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const REQUESTS_KEY = "myRequests";
const OPERATORS_KEY = "cleanOpsOperators";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    ward: "",
    status: "All",
    wasteType: "All",
  });

  // ----------------------------
  // Summary (MOVED UP ✅)
  // ----------------------------
  const calculateSummary = (requests) => {
    setSummary({
      todayRequests: requests.length,
      pendingRequests: requests.filter(
        (r) => r.status !== "Completed" && r.status !== "Rejected"
      ).length,
      completedToday: requests.filter(
        (r) => r.status === "Completed"
      ).length,
      slaBreaches: requests.filter(
        (r) =>
          r.status === "Open" ||
          r.status === "Assigned" ||
          r.status === "In Progress" ||
          r.status === "Rejected"
      ).length,
    });
  };

  // ----------------------------
  // Selected request (SAFE)
  // ----------------------------
  const selected = useMemo(() => {
    const req = items.find((r) => r._id === selectedId);
    return req ? { ...req, notes: req.notes || [] } : null;
  }, [items, selectedId]);

  // ----------------------------
  // Initial Load
  // ----------------------------
  useEffect(() => {
    setLoading(true);

    const storedRequests = JSON.parse(
      localStorage.getItem(REQUESTS_KEY) || "[]"
    );

    const storedOperators = JSON.parse(
      localStorage.getItem(OPERATORS_KEY) || "[]"
    );

    const normalized = storedRequests.map((r, index) => ({
      ...r,
      _id: r._id || `${Date.now()}-${index}`,
      notes: r.notes || [],
    }));

    setItems(normalized);
    setOperators(storedOperators);

    if (normalized.length > 0) {
      setSelectedId(normalized[0]._id);
    }

    calculateSummary(normalized); // ✅ NOW SAFE
    setLoading(false);
  }, []);

  // ----------------------------
  // Filters
  // ----------------------------
  const filteredItems = useMemo(() => {
    return items.filter((r) => {
      if (filters.ward && String(r.ward) !== filters.ward) return false;
      if (filters.status !== "All" && r.status !== filters.status) return false;
      if (filters.wasteType !== "All" && r.wasteType !== filters.wasteType)
        return false;
      return true;
    });
  }, [items, filters]);

  // ----------------------------
  // Assign operator
  // ----------------------------
  const assignOperator = (requestId, operatorId) => {
    const operator = operators.find((o) => o._id === operatorId);

    const updated = items.map((r) =>
      r._id === requestId
        ? {
            ...r,
            assignedOperator: operator || null,
            status: r.status === "Open" ? "Assigned" : r.status,
            notes: [
              ...(r.notes || []),
              {
                time: new Date().toLocaleString(),
                role: "wardAdmin",
                text: operator
                  ? `Assigned operator ${operator.name}`
                  : "Operator unassigned",
              },
            ],
          }
        : r
    );

    setItems(updated);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    calculateSummary(updated);
  };

  // ----------------------------
  // Update status + NOTES
  // ----------------------------
  const updateStatus = (requestId, status) => {
    const updated = items.map((r) =>
      r._id === requestId
        ? {
            ...r,
            status,
            updatedAt: new Date().toISOString(),
            notes: [
              ...(r.notes || []),
              {
                time: new Date().toLocaleString(),
                role: "wardAdmin",
                text: `Status updated to ${status}`,
              },
            ],
          }
        : r
    );

    setItems(updated);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    calculateSummary(updated);
  };

  if (!summary) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-manage">
      <h2>Admin Workspace</h2>

      {/* ================= SUMMARY ================= */}
      <div className="stats-grid">
        <div className="card stat">
          <div className="stat-label">Today's Requests</div>
          <div className="stat-value">{summary.todayRequests}</div>
        </div>

        <div className="card stat warning-border">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{summary.pendingRequests}</div>
        </div>

        <div className="card stat success-border">
          <div className="stat-label">Completed Today</div>
          <div className="stat-value">{summary.completedToday}</div>
        </div>

        <div className="card stat danger-border">
          <div className="stat-label">SLA Breaches</div>
          <div className="stat-value">{summary.slaBreaches}</div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="filters-row">
        <input
          placeholder="Ward"
          value={filters.ward}
          onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          {[
            "All",
            "Open",
            "Assigned",
            "In Progress",
            "Completed",
            "Rejected",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.wasteType}
          onChange={(e) =>
            setFilters({ ...filters, wasteType: e.target.value })
          }
        >
          {["All", "household", "industrial", "sewage", "Commercial"].map(
            (w) => (
              <option key={w}>{w}</option>
            )
          )}
        </select>
      </div>

      {/* ================= WORKSPACE ================= */}
      <div className="workspace-split">
        {/* ---------- LEFT TABLE ---------- */}
        <div className="requests-list">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Citizen</th>
                <th>Ward</th>
                <th>Waste</th>
                <th>Status</th>
                <th>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">
                    No requests found
                  </td>
                </tr>
              )}

              {filteredItems.map((r) => (
                <tr
                  key={r._id}
                  className={selectedId === r._id ? "active-row" : ""}
                  onClick={() => setSelectedId(r._id)}
                >
                  <td>{r.ticketId}</td>
                  <td>{r.fullName || "—"}</td>
                  <td>{r.ward}</td>
                  <td>{r.wasteType}</td>
                  <td>
                    {/* UPDATED STATUS BADGE LOGIC HERE */}
                    <span
                      className={`status-badge ${r.status
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{r.assignedOperator?.name || "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- RIGHT DETAILS ---------- */}
 {!selected && (
  <div className="card">
    <div className="muted">
      {filters.ward && filteredItems.length === 0
        ? "Select a valid ward number"
        : "Select a request to view details"}
    </div>
  </div>
)}

        <div className="request-details">   


          {selected && (
            <div className="card details">
              <div className="header">
                <div>
                  <div className="ticket">{selected.ticketId}</div>
                  <div className="muted">
                    {/* {new Date(selected.createdAt).toLocaleString()} */}
                  </div>
                </div>

                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                >
                  {[
                    "Open",
                    "Assigned",
                    "In Progress",
                    "Completed",
                    "Rejected",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <div className="field-row">
                    <span className="label">Citizen</span>
                    <span>{selected.fullName}</span>
                  </div>
                  <div className="field-row">
                    <span className="label">Mobile</span>
                    <span>{selected.mobileNumber}</span>
                  </div>
                  <div className="field-row">
                    <span className="label">Ward</span>
                    <span>{selected.ward}</span>
                  </div>
                  <div className="field-row">
                    <span className="label">Waste Type</span>
                    <span>{selected.wasteType}</span>
                  </div>
                </div>

                <div>
                  <div className="field-row">
                    <span className="label">Assign Operator</span>
                    <select
                      value={selected.assignedOperator?._id || ""}
                      onChange={(e) =>
                        assignOperator(selected._id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {operators.map((o) => (
                        <option key={o._id} value={o._id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">Description</div>
                <div className="description-text">
                  {selected.description || "—"}
                </div>
              </div>

              {/* ================= NOTES ================= */}
              <div className="section">
                <div className="section-title">Notes</div>
                <ul className="notes">
                  {selected.notes.length === 0 && (
                    <li className="muted">No notes yet</li>
                  )}
                  {selected.notes.map((n, i) => (
                    <li key={i}>
                      <span className="muted">
                        [{n.time}] {n.role}:
                      </span>{" "}
                      {n.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
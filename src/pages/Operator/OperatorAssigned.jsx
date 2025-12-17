import React, { useEffect, useState } from "react";
import "./OperatorAssigned.css";

const REQUESTS_KEY = "myRequests";

export default function OperatorAssigned() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");

  // ---------------- Load assigned requests ----------------
  const load = () => {
    const all =
      JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];

    // Only requests assigned to operators
    let assigned = all.filter(
      (r) => r.assignedOperator
    );

    // Filter by status
    if (status) {
      assigned = assigned.filter(
        (r) => r.status === status
      );
    }

    setItems(assigned);
  };

  // Reload when filter changes
  useEffect(() => {
    load();
  }, [status]);

  // ---------------- Update Status ----------------
  const updateStatus = (id, newStatus) => {
    const all =
      JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];

    const updated = all.map((r) =>
      r._id === id
        ? {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    localStorage.setItem(
      REQUESTS_KEY,
      JSON.stringify(updated)
    );

    load();
  };

  return (
    <div className="operator-assigned">
      <h2>Assigned Requests</h2>

      {/* -------- Filter -------- */}
      <div className="filters">
        <label>Filter Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          {[
            "Assigned",
            "On the Way",
            "In Progress",
            "Completed",
            "Rejected",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* -------- Table -------- */}
      <table className="table striped hover assignments">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No assigned requests
              </td>
            </tr>
          ) : (
            items.map((r) => (
              <tr key={r._id}>
                <td>{r.ticketId}</td>
                <td>{r.ward}</td>
                <td>
                  <span
                    className={`badge ${String(r.status)
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {[
                    "On the Way",
                    "In Progress",
                    "Completed",
                    "Rejected",
                  ].map((s) => (
                    <button
                      key={s}
                      className="btn small"
                      disabled={r.status === s}
                      onClick={() =>
                        updateStatus(r._id, s)
                      }
                    >
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

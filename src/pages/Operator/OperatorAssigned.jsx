import React, { useState } from "react";
import "./OperatorAssigned.css";

export default function OperatorAssigned() {
  const [filterStatus, setFilterStatus] = useState("All");

  return (
    <div className="assigned-container">
      <h2>Assigned Requests</h2>

      <div className="filter-section">
        <label htmlFor="status-filter">Filter Status</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Open">Assigned</option>
          <option value="In Progress">On the Way</option>
          <option value="Resolved">In Progess</option>
          <option value="Resolved">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="assigned-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Ward</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

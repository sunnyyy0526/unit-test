import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyRequests.css";

export default function MyRequests() {
  const navigate = useNavigate();

  // DIRECT READ: We read data immediately when the component renders.
  const requests = JSON.parse(localStorage.getItem("myRequests") || "[]");

  return (
    <div className="my-requests-container">
      <div className="my-requests-header">
        <h2>My Requests</h2>
        <button
          className="raise-btn"
          onClick={() => navigate("/raise-request")}
        >
          Raise Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No requests found.</p>
          <p style={{ fontSize: "14px" }}>Click "Raise Request" to create your first ticket.</p>
        </div>
      ) : (
        <div className="requests-table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Ward</th>
                <th>Waste</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req, index) => (
                <tr key={index}>
                  <td className="ticket-id">{req.ticketId}</td>
                  <td>{req.ward}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {req.wasteType || "Household"}
                  </td>
                  <td>
                    <span className={`status-badge ${(req.status || "open").toLowerCase()}`}>
                      {req.status || "Open"}
                    </span>
                  </td>
                  <td>
                    {/* UPDATED BUTTON: Navigates to the details page */}
                    <button
                      className="view-link"
                      onClick={() => navigate(`/view-request/${req.ticketId}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
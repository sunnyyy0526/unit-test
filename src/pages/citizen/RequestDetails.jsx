import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RequestDetails.css";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allRequests = JSON.parse(localStorage.getItem("myRequests") || "[]");
  const request = allRequests.find((req) => req.ticketId === id);

  if (!request) {
    alert("Request not found!");
    navigate("/my-requests");
    return null;
  }

  return (
    <div className="details-container">
      
      {/* Header */}
      <div className="details-header">
        <div className="header-left">
          <h1>
            Ticket <br /> {request.ticketId}
          </h1>

          <div className="badges">
            <span className="badge status-open">{request.status || "Open"}</span>
            <span className="badge ward">Ward {request.ward}</span>
            <span className="badge waste">{request.wasteType}</span>
          </div>
        </div>

        <div className="header-right">
          <p>
            Raised on {request.date}
            {request.time && (
              <span className="time"> • {request.time}</span>
            )}
          </p>
          <p className="sub-text">
            Last update {request.date}
            {request.time && (
              <span className="time"> • {request.time}</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="details-grid">
        
        <div className="card details-card">
          <h3>Details</h3>

          <div className="detail-row">
            <span className="detail-label">Citizen</span>
            <span className="value">{request.fullName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Mobile</span>
            <span className="value">{request.mobile}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="value">{request.address}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Coordinates</span>
            <span className="value">
              {request.latitude}, {request.longitude}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Preferred Slot</span>
            <span className="value">{request.timeSlot}</span>
          </div>
        </div>

        <div className="card operator-card">
          <h3>Assigned Operator</h3>
          <p className="not-assigned">Not assigned yet</p>
        </div>
      </div>

      <div className="card full-width-card">
        <h3>Description</h3>
        <div className="description-box">{request.description}</div>
      </div>

      <div className="card full-width-card">
        <h3>Updates</h3>
        <ul className="updates-list">
          <li>No updates yet</li>
        </ul>
      </div>

      <button className="back-btn" onClick={() => navigate("/my-requests")}>
        ← Back to My Requests
      </button>
    </div>
  );
}

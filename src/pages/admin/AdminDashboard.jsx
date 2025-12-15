import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [filterWard, setFilterWard] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterWaste, setFilterWaste] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [requests, setRequests] = useState([]);

  // Mock Operators
  const operators = ["Ajay Singhaniya", "Ramesh Kumar", "Suresh Reddy", "Not Assigned"];

  // 1. Load Data
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("myRequests") || "[]");
    setRequests(data);
  }, []);

  // 2. Filter Logic
  const filteredRequests = requests.filter(req => {
    const wardOk = filterWard ? req.ward.includes(filterWard) : true;
    const statusOk = filterStatus === "All" ? true : (req.status || "Open") === filterStatus;
    const wasteOk = filterWaste === "All" ? true : (req.wasteType || "Household") === filterWaste;
    return wardOk && statusOk && wasteOk;
  });

  // --- UPDATED AUTO-SELECT LOGIC ---
  useEffect(() => {
    // Case 1: Filtered list is empty (e.g., Ward 999) -> Clear Selection
    if (filteredRequests.length === 0) {
      if (selectedId !== null) setSelectedId(null);
      return;
    }

    // Case 2: We have a list, check if current selection is still visible
    const isSelectedVisible = filteredRequests.some(r => r.ticketId === selectedId);

    // If nothing selected OR current selection was filtered out -> Select 1st item
    if (!selectedId || !isSelectedVisible) {
      setSelectedId(filteredRequests[0].ticketId);
    }
  }, [filteredRequests, selectedId]); 
  // ---------------------------------

  const selectedRequest = requests.find(r => r.ticketId === selectedId) || null;

  // 3. Stats Logic
  const todayDate = new Date().toLocaleDateString();
  const stats = {
    today: requests.filter(r => r.date === todayDate).length,
    pending: requests.filter(r => r.status === "Open" || r.status === "In Progress" || r.status === "On the Way").length,
    completed: requests.filter(r => r.status === "Completed" || r.status === "Resolved").length,
    breaches: requests.filter(r => r.status === "Open" || r.status === "Rejected").length 
  };

  // 4. Update Logic
  const updateRequest = (ticketId, field, value) => {
    const updatedList = requests.map(req => {
      if (req.ticketId === ticketId) {
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
        
        let message = "";
        if (field === "assignedTo") message = `Assigned to operator ${value}`;
        else if (field === "status") message = `Status updated to ${value}`;
        else message = `${field} updated to ${value}`;

        const note = `[${timestamp}] wardAdmin: ${message}`;
        
        return { 
          ...req, 
          [field]: value, 
          notes: [...(req.notes || []), note] 
        };
      }
      return req;
    });

    setRequests(updatedList);
    localStorage.setItem("myRequests", JSON.stringify(updatedList));
  };

  // 5. DEMO DATA LOADER (Uncommented lines so button works)
  const handleLoadDemoData = () => {
    const demoData = [
      { ticketId: "REQ-2025-001", fullName: "Rajesh K", mobile: "9876543210", ward: "5", wasteType: "Household", status: "Open", assignedTo: "No", date: new Date().toLocaleDateString(), time: "10:30 AM", description: "Overflowing tank", address: "12/B MG Road", latitude: "17.4", longitude: "78.4", notes: [] },
      { ticketId: "REQ-2025-002", fullName: "Priya S", mobile: "9123456789", ward: "5", wasteType: "Sewage", status: "In Progress", assignedTo: "Ramesh Kumar", date: new Date().toLocaleDateString(), time: "02:15 PM", description: "Blocked line", address: "Apt 4B", latitude: "17.5", longitude: "78.5", notes: [] }
    ];
    localStorage.setItem("myRequests", JSON.stringify(demoData));
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <div className="header-row">
        <h2 className="page-title">Admin Workspace</h2>
        {requests.length === 0 && <button className="demo-btn" onClick={handleLoadDemoData}>Load Demo Data</button>}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue"><p>Today's Requests</p><h3>{stats.today}</h3></div>
        <div className="stat-card orange"><p>Pending</p><h3>{stats.pending}</h3></div>
        <div className="stat-card green"><p>Completed Today</p><h3>{stats.completed}</h3></div>
        <div className="stat-card red"><p>SLA Breaches</p><h3>{stats.breaches}</h3></div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="filter-group"><label>Ward</label><input value={filterWard} onChange={(e)=>setFilterWard(e.target.value)} placeholder="e.g. 5"/></div>
        <div className="filter-group"><label>Status</label><select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}><option>All</option><option>Open</option><option>In Progress</option><option>Completed</option></select></div>
        <div className="filter-group"><label>Waste Type</label><select value={filterWaste} onChange={(e)=>setFilterWaste(e.target.value)}><option>All</option><option>Household</option><option>Sewage</option></select></div>
      </div>

      <div className="workspace-split">
        {/* Left: List Panel */}
        <div className="request-list-panel">
          <table className="admin-table">
            <thead>
              <tr><th>Ticket</th><th>Citizen</th><th>Ward</th><th>Waste</th><th>Status</th><th>Assigned</th></tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-requests-found">No requests found</td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.ticketId} onClick={() => setSelectedId(req.ticketId)} className={selectedId === req.ticketId ? "active-row" : ""}>
                    <td style={{fontWeight:'500'}}>{req.ticketId}</td>
                    <td>{req.fullName}</td>
                    <td>{req.ward}</td>
                    <td style={{textTransform:'capitalize'}}>{req.wasteType}</td>
                    <td><span className={`status-pill ${req.status?.toLowerCase().replace(/\s/g, '-')}`}>{req.status || "Open"}</span></td>
                    <td>{req.assignedTo || "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Details Panel */}
        {selectedRequest ? (
          <div className="request-details-panel">
            <div className="panel-header">
              <h3>{selectedRequest.ticketId}</h3>
              <select className="status-dropdown" value={selectedRequest.status || "Open"} onChange={(e)=>updateRequest(selectedRequest.ticketId, "status", e.target.value)}>
                <option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Rejected">Rejected</option>
              </select>
            </div>
            <p className="timestamp">Created {selectedRequest.date}, {selectedRequest.time}</p>
            
            <div className="details-grid-admin">
              <div><label>Citizen</label><span>{selectedRequest.fullName}</span></div>
              <div><label>Address</label><span>{selectedRequest.address || '-'}</span></div>
              <div><label>Mobile</label><span>{selectedRequest.mobile}</span></div>
              <div><label>Coordinates</label><span>{selectedRequest.latitude}, {selectedRequest.longitude}</span></div>
              <div><label>Ward</label><span>{selectedRequest.ward}</span></div>
              <div>
                <label>Assign Operator</label>
                <select className="assign-select" value={selectedRequest.assignedTo || "No"} onChange={(e)=>updateRequest(selectedRequest.ticketId, "assignedTo", e.target.value)}>
                  <option value="No">Select</option>{operators.map(op=><option key={op} value={op}>{op}</option>)}
                </select>
              </div>
              <div><label>Waste Type</label><span>{selectedRequest.wasteType}</span></div>
              <div><label>Preferred Slot</label><span>{selectedRequest.timeSlot}</span></div>
            </div>

            <div className="section"><label className="section-label">Description</label><div className="desc-box">{selectedRequest.description}</div></div>

            <div className="section">
              <label className="section-label">Notes</label>
              <ul className="notes-list">
                {selectedRequest.notes && selectedRequest.notes.length > 0 ? selectedRequest.notes.map((n, i) => <li key={i}>{n}</li>) : <li className="empty-note">No updates yet.</li>}
              </ul>
            </div>
          </div>
        ) : (
          /* THIS SHOWS WHEN LIST IS EMPTY */
          <div className="request-details-panel empty-state">
            Select a request to view details
          </div>
        )}
      </div>
    </div>
  );
}
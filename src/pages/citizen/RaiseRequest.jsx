import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RaiseRequest.css";

export default function RaiseRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    ward: "",
    wasteType: "Household",
    timeSlot: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    // We save the file name since we can't easily save real files to LocalStorage
    setFormData({ ...formData, photo: e.target.files[0] ? e.target.files[0].name : null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- VALIDATION CHECK ---
    if (!formData.fullName || !formData.mobile || !formData.ward || !formData.address) {
      alert("Please fill out all required fields.");
      return;
    }

    // --- GENERATE TICKET ID ---
    const ticketId = "REQ-2025-" + Math.floor(100000 + Math.random() * 900000);

    // --- CAPTURE DATE AND TIME ---
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    // Get time in readable format (e.g., "10:30 AM")
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // --- CREATE REQUEST OBJECT ---
    const newRequest = {
      ticketId: ticketId,
      ...formData,
      status: "Open", // Default status
      date: currentDate,
      time: currentTime, // <--- ADDED TIME HERE
    };

    // --- SAVE TO LOCAL STORAGE ---
    const existingRequests = JSON.parse(localStorage.getItem("myRequests") || "[]");
    const updatedRequests = [newRequest, ...existingRequests];
    localStorage.setItem("myRequests", JSON.stringify(updatedRequests));

    // --- SUCCESS & REDIRECT ---
    alert(`Request Submitted Successfully!\nYour Ticket ID is: ${ticketId}`);
    navigate("/my-requests");
  };

  return (
    <div className="raise-request-container">
      <div className="request-header">
        <h2>Raise Desludging <br /> Request</h2>
        <p>Fill in the details below. Accurate address and short description helps us <br /> serve you faster.</p>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          
          {/* Row 1 */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Deepak Giri"
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="10-digit number"
              onChange={handleChange} 
              required
            />
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label>Ward</label>
            <input
              type="text"
              name="ward"
              placeholder="e.g. 5"
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Waste Type</label>
            <select name="wasteType" onChange={handleChange} value={formData.wasteType}>
              <option value="Household">Household</option>
              <option value="Sewage">Sewage</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label>Preferred Time Slot</label>
            <input
              type="text"
              name="timeSlot"
              placeholder="e.g. 9:00 AM - 12:00 PM"
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="House No, Street, Area"
              onChange={handleChange} 
              required
            />
          </div>

          {/* Row 4 */}
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="text"
              name="latitude"
              placeholder="e.g. 19.0760"
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input
              type="text"
              name="longitude"
              placeholder="e.g. 72.8777"
              onChange={handleChange} 
              required
            />
          </div>

          {/* Row 5: Description (Full Width) */}
          <div className="form-group full-width">
            <div className="desc-header">
                <label>Description</label>
                <span className="char-count">{formData.description.length}/600</span>
            </div>
            <textarea
              name="description"
              placeholder="Briefly describe the issue..."
              rows="4"
              onChange={handleChange} 
              required
            ></textarea>
          </div>
          
          <p className="note full-width">Avoid personal information. You can attach images below.</p>

          {/* Row 6: Photos (Full Width) */}
          <div className="form-group full-width">
            <label>Photos</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFileChange} />
            </div>
          </div>

        </div>

        <button type="submit" className="submit-request-btn">
          Submit Request
        </button>
      </form>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityCreate.css";

export default function CommunityCreate({ user }) {
  const navigate = useNavigate();

  // 🔐 Protect page (NO white screen)
  useEffect(() => {
    if (!user) {
      alert("Please login to create a community project");
      navigate("/login");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    ward: "",
    wasteType: "Household",
    address: "",
    latitude: "",
    longitude: "",
    targetDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.ward) {
      alert("Please fill required fields");
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      ...form,
      creator: user.name,
      creatorId: user.id,
      status: "Planning",
      participants: [],
      notes: [],
      createdAt: new Date().toISOString()
    };

    const existing =
      JSON.parse(localStorage.getItem("communityProjects")) || [];

    localStorage.setItem(
      "communityProjects",
      JSON.stringify([newProject, ...existing])
    );

    alert("Project Created Successfully!");
    navigate("/community");
  };

  return (
    <div className="create-wrapper">
      <div className="create-header-text">
        <h2>Create Community Project</h2>
        <p>
          Organize a neighborhood clean-up or desludging drive. Share clear
          details to get more citizens involved.
        </p>
      </div>

      <div className="create-card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              placeholder="e.g. Ward 5 Desludging Drive"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <div className="label-row">
              <label>Description</label>
              <span className="count">
                {form.description.length}/800
              </span>
            </div>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the project goals, meeting point, and any coordination details"
              value={form.description}
              onChange={handleChange}
              maxLength={800}
            />
          </div>

          {/* Row 1 */}
          <div className="form-row">
            <div className="col">
              <label>Ward</label>
              <input
                name="ward"
                placeholder="e.g. 5"
                value={form.ward}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Waste Type</label>
              <select
                name="wasteType"
                value={form.wasteType}
                onChange={handleChange}
              >
                <option value="Household">Household</option>
                <option value="Sewage">Sewage</option>
                <option value="Industrial">Industrial</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="col">
              <label>Address</label>
              <input
                name="address"
                placeholder="Meeting point or project address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Latitude</label>
              <input
                name="latitude"
                placeholder="e.g. 19.0760"
                value={form.latitude}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="col">
              <label>Longitude</label>
              <input
                name="longitude"
                placeholder="e.g. 72.8777"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label>Target Date</label>
              <input
                type="date"
                name="targetDate"
                value={form.targetDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Photos (UI only) */}
         <input id="photos" className="file-input" accept="image/*" multiple="" type="file" />

          <button type="submit" className="submit-btn">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

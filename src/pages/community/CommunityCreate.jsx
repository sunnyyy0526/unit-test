// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./CommunityCreate.css";

// export default function CommunityCreate({ user }) {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     ward: "",
//     address: "",
//     targetDate: "",
//   });

//   if (!user) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px" }}>
//         <h2>Please Login</h2>
//         <p>You need to be logged in to create a community drive.</p>
//         <button onClick={() => navigate("/login")}>Go to Login</button>
//       </div>
//     );
//   }

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newProject = {
//       id: Date.now().toString(),
//       creator: user.name,
//       participants: [{ name: user.name, role: "Organizer" }], // Creator auto-joins
//       notes: [], // For chat/updates
//       ...form,
//     };

//     const existing = JSON.parse(localStorage.getItem("communityProjects") || "[]");
//     localStorage.setItem("communityProjects", JSON.stringify([newProject, ...existing]));

//     alert("Project Created Successfully!");
//     navigate("/community");
//   };

//   return (
//     <div className="create-project-container">
//       <h2>Organize a Clean-up Drive</h2>
//       <form onSubmit={handleSubmit} className="project-form">
//         <div className="form-group">
//           <label>Project Title</label>
//           <input name="title" placeholder="e.g. Ward 5 Sunday Clean-up" required onChange={handleChange} />
//         </div>

//         <div className="form-group">
//           <label>Description & Goals</label>
//           <textarea name="description" rows="4" placeholder="What will we do?" required onChange={handleChange} />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Ward</label>
//             <input name="ward" placeholder="e.g. 5" required onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Date</label>
//             <input type="date" name="targetDate" required onChange={handleChange} />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Meeting Point Address</label>
//           <input name="address" placeholder="e.g. Near Gandhi Statue, Main Park" required onChange={handleChange} />
//         </div>

//         <button type="submit" className="submit-project-btn">Create Project</button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityCreate.css";

export default function CommunityCreate({ user }) {
  const navigate = useNavigate();

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
    
    // Simple validation
    if (!form.title || !form.ward) {
      alert("Please fill in the required fields.");
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      creator: user ? user.name : "Anonymous",
      status: "Planning",
      participants: [], 
      notes: [],
      ...form,
    };

    const existing = JSON.parse(localStorage.getItem("communityProjects") || "[]");
    localStorage.setItem("communityProjects", JSON.stringify([newProject, ...existing]));

    alert("Project Created Successfully!");
    navigate("/community");
  };

  return (
    <div className="create-wrapper">
      <div className="create-header-text">
        <h2>Create Community Project</h2>
        <p>Organize a neighborhood clean-up or desludging drive. Share clear details to get more citizens involved.</p>
      </div>

      <div className="create-card">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Title</label>
            <input 
              name="title" 
              placeholder="e.g. Ward 5 Desludging Drive" 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Description</label>
              <span className="count">0/800</span>
            </div>
            <textarea 
              name="description" 
              rows="4" 
              placeholder="Describe the project goals, meeting point, and any coordination details" 
              onChange={handleChange} 
            />
          </div>

          {/* Row 1 */}
          <div className="form-row">
            <div className="col">
              <label>Ward</label>
              <input name="ward" placeholder="e.g. 5" onChange={handleChange} />
            </div>
            <div className="col">
              <label>Waste Type</label>
              <select name="wasteType" onChange={handleChange}>
                <option value="Household">Household</option>
                <option value="Sewage">Sewage</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="col">
              <label>Address</label>
              <input name="address" placeholder="Meeting point or project address" onChange={handleChange} />
            </div>
            <div className="col">
              <label>Latitude</label>
              <input name="latitude" placeholder="e.g. 19.0760" onChange={handleChange} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="col">
              <label>Longitude</label>
              <input name="longitude" placeholder="e.g. 72.8777" onChange={handleChange} />
            </div>
            <div className="col">
              <label>Target Date</label>
              <input type="date" name="targetDate" onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Photos</label>
            <div className="file-input-box">
               <button type="button">Browse...</button> <span>No files selected.</span>
            </div>
          </div>

          <button type="submit" className="submit-btn">Create Project</button>
        </form>
      </div>
    </div>
  );
}
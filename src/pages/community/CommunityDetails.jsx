import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CommunityDetails.css";

export default function CommunityDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("communityProjects") || "[]");
    const found = projects.find((p) => p.id === id);
    if (found) setProject(found);
  }, [id]);

  const updateLocalStorage = (updatedProject) => {
    const projects = JSON.parse(localStorage.getItem("communityProjects") || "[]");
    const updatedList = projects.map((p) => (p.id === id ? updatedProject : p));
    localStorage.setItem("communityProjects", JSON.stringify(updatedList));
    setProject(updatedProject);
  };

  const handleJoin = () => {
    if (!user) return navigate("/login");
    const updatedProject = {
      ...project,
      participants: [...project.participants, { name: user.name, role: "Volunteer" }],
    };
    updateLocalStorage(updatedProject);
  };

  const handleLeave = () => {
    const updatedProject = {
      ...project,
      participants: project.participants.filter((p) => p.name !== user.name),
    };
    updateLocalStorage(updatedProject);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    const newNote = {
      user: user.name,
      text: note,
      time: new Date().toLocaleString(),
    };
    const updatedProject = {
      ...project,
      notes: [...(project.notes || []), newNote],
    };
    updateLocalStorage(updatedProject);
    setNote("");
  };

  if (!project) return <div className="loading">Loading Project...</div>;

  const isJoined = user && project.participants.some((p) => p.name === user.name);

  return (
    <div className="details-page-container">
      <button className="back-link" onClick={() => navigate("/community")}>← Back to Projects</button>
      
      <div className="project-banner">
        <div>
          <h1>{project.title}</h1>
          <p className="banner-meta">Ward {project.ward} • {project.targetDate}</p>
        </div>
        
        {/* Action Buttons */}
        {user ? (
          isJoined ? (
            <button className="btn-leave" onClick={handleLeave}>Leave Project</button>
          ) : (
            <button className="btn-join" onClick={handleJoin}>Join as Volunteer</button>
          )
        ) : (
          <button className="btn-join" onClick={() => navigate("/login")}>Login to Join</button>
        )}
      </div>

      <div className="details-content-grid">
        <div className="left-col">
          <div className="section card">
            <h3>About the Drive</h3>
            <p>{project.description}</p>
            <div className="address-box">
              <strong>📍 Meeting Point:</strong> {project.address}
            </div>
          </div>

          <div className="section card">
            <h3>Discussion & Updates</h3>
            <div className="notes-list">
              {(project.notes || []).length === 0 && <p className="muted">No updates yet.</p>}
              {project.notes?.map((n, idx) => (
                <div key={idx} className="note-item">
                  <strong>{n.user}</strong> <span className="note-time">{n.time}</span>
                  <p>{n.text}</p>
                </div>
              ))}
            </div>
            
            {isJoined && (
              <div className="add-note">
                <input 
                  type="text" 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Ask a question or post an update..."
                />
                <button onClick={handleAddNote}>Post</button>
              </div>
            )}
          </div>
        </div>

        <div className="right-col">
          <div className="section card">
            <h3>Participants ({project.participants.length})</h3>
            <ul className="participants-list">
              {project.participants.map((p, idx) => (
                <li key={idx}>
                  {p.name} <span className="role-tag">{p.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CommunityDetails.css";

export default function CommunityDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [request, setRequest] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  // ---------------- Load project ----------------
  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("communityProjects") || "[]"
    );

    const found = data.find((p) => p.id === id);

    if (!found) {
      navigate("/community"); // ✅ FIXED
      return;
    }

    setProject({
      ...found,
      status: found.status || "Planning", // ✅ ensure status
    });
  }, [id, navigate]);

  if (!project) return null;

  // ---------------- Helpers ----------------
  const isJoined =
    user &&
    project.participants?.some((p) => p.name === user.name);

  const saveProject = (updated) => {
    const all = JSON.parse(
      localStorage.getItem("communityProjects") || "[]"
    );

    const newData = all.map((p) =>
      p.id === updated.id ? updated : p
    );

    localStorage.setItem("communityProjects", JSON.stringify(newData));
    setProject(updated);
  };

  // ---------------- Join / Leave ----------------
  const toggleJoin = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    let updated;

    if (isJoined) {
      updated = {
        ...project,
        participants: project.participants.filter(
          (p) => p.name !== user.name
        ),
      };
    } else {
      updated = {
        ...project,
        participants: [
          ...(project.participants || []),
          { name: user.name },
        ],
      };
    }

    setNote("");
    setSuccess(false);
    saveProject(updated);
  };

  // ---------------- Add note ----------------
  const addNote = () => {
    if (!isJoined) return;
    if (!note.trim()) return;

    const updated = {
      ...project,
      notes: [...(project.notes || []), note], // string only
    };

    setNote("");
    setSuccess(true);
    saveProject(updated);

    setTimeout(() => setSuccess(false), 2000);
  };

  // ---------------- Render ----------------
  return (
    <div className="community-details">
      {/* ✅ BACK TO COMMUNITY LIST */}
      <Link to="/community" className="back-link">
        ← Back to Projects
      </Link>

      <h1 className="title">{project.title}</h1>

      <div className="badges">
        <span className="badge">
          Status: {project.status || "Planning"}
        </span>
        <span className="badge">Ward: {project.ward}</span>
      </div>

      {user && (
  <button className="join-btn" onClick={toggleJoin}>
    {isJoined ? "Leave" : "Join"}
  </button>
  
)}
<div className="project-description">
          {/* <h4>About this project</h4> */}
          <p>{project.description}</p>
        </div>


      <h3 className="notes-title">Notes</h3>

      <ul className="notes-list">
        {(project.notes || []).length === 0 ? (
          <li className="empty">No notes</li>
        ) : (
          project.notes.map((n, i) => (
            <li key={i}>
              • {typeof n === "string" ? n : n.text}
            </li>
          ))
        )}
      </ul>

      {/* ✅ SHOW ADD NOTE ONLY WHEN JOINED */}
      {isJoined && (
        <>
          {success && <div className="success-box">Note added</div>}

          <textarea
            className="note-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button className="add-note-btn" onClick={addNote}>
            Add Note
          </button>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CommunityList.css";

export default function CommunityList({ user }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("communityProjects") || "[]"
    );
    setProjects(stored);
  }, []);

  const handleCreate = () => {
    if (!user) {
      alert("Please login to create a project");
      navigate("/login");
      return;
    }
    navigate("/community/create");
  };

  return (
    <div className="community-list-container">
      <div className="list-header">
        <h2>Community Projects</h2>

        {/* ✅ Button visible for all, but protected */}
       {user && (
          <button
            className="create-btn"
            onClick={() => navigate("/community/create")}
          >
            Create Project
          </button>
        )}
      </div>

      <ul className="project-list">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((p) => (
            <li key={p.id}>
              <Link to={`/community/${p.id}`}>
                {p.title} – {p.status} – Ward {p.ward}
              </Link>
              
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

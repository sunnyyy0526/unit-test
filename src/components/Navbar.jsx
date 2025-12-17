import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <span className="brand">CleanOps</span>
          <span className="emoji"> 🚛♻️</span>
        </div>

        {/* Left Navigation */}
        <nav className="nav-btn1">
          <button className="home" onClick={() => navigate("/")}>
            Home
          </button>

          <button className="community" onClick={() => navigate("/community")}>
            Community
          </button>

          {/* ================= CITIZEN ================= */}
          {user && user.role === "citizen" && (
            <>
              <button
                className="nav-link"
                onClick={() => navigate("/raise-request")}
              >
                Raise Request
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/my-requests")}
              >
                My Requests
              </button>
            </>
          )}

          {/* ================= OPERATOR ================= */}
          {user && user.role === "operator" && (
            <button
              className="nav-link"
              onClick={() => navigate("/assigned")}
            >
              Assigned
            </button>
          )}

          {/* ================= WARD ADMIN ================= */}
          {user && (user.role === "ward admin" || user.role === "wardAdmin") && (
            <>
              <button
                className="nav-link"
                onClick={() => navigate("/admin-dashboard")}
              >
                Dashboard
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/admin-analytics")}
              >
                Analytics
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/admin-operators")}
              >
                Operators
              </button>
            </>
          )}
            {user && (user.role === "super admin" || user.role === "superAdmin") && (
            <>
              <button
                className="nav-link"
                onClick={() => navigate("/admin-dashboard")}
              >
                Dashboard
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/admin-analytics")}
              >
                Analytics
              </button>

              <button
                className="nav-link"
                onClick={() => navigate("/admin-operators")}
              >
                Operators
              </button>
            </>
          )}
        </nav>

        {/* Right Navigation */}
        <div className="nav-btn2">
          {user ? (
            <div className="user-menu">
              <span className="user-info">
                {user.name}{" "}
                <span className="user-role">({user.role})</span>
              </span>

              <button
                className="logout-btn"
                onClick={() => {
                  onLogout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

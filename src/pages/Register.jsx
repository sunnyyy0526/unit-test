import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register({ setUser }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen" // 1. Default to lowercase to match Navbar logic
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Save to Local Storage
    localStorage.setItem("registeredUser", JSON.stringify(formData));

    // 2. AUTO-LOGIN: Update App state
    if (setUser) {
      setUser({ name: formData.name, role: formData.role });
    }

    // 3. Redirect based on Role
    // If Operator, go to /assigned (or Home), if Citizen go to /
    if (formData.role === "operator") {
      navigate("/home"); 
    } else {
      navigate("/");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create your account</h2>

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input 
            type="text" name="name" placeholder="Your full name" required onChange={handleChange} 
          />

          <label>Email</label>
          <input 
            type="email" name="email" placeholder="you@example.com" required onChange={handleChange} 
          />

          <label>Password</label>
          <input 
            type="password" name="password" placeholder="Minimum 6 characters" required onChange={handleChange} 
          />

          <label>Role</label>
          {/* CRITICAL UPDATE: Values must be lowercase to match Navbar checks */}
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="citizen">Citizen</option>
            <option value="operator">Operator</option>
            <option value="ward admin">Ward Admin</option>
            <option value="super admin">Super Admin</option>
          </select>
          
          <label>Phone</label>
          <input type="text" placeholder="Optional" />
          
          <label>Ward (optional)</label>
          <input type="text" placeholder="Ward name/number" />

          <button type="submit" className="register-btn2">
            Register & Login
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
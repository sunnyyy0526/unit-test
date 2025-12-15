import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Citizen Pages
import RaiseRequest from "./pages/citizen/RaiseRequest";
import MyRequests from "./pages/citizen/MyRequests"; 
import RequestDetails from "./pages/citizen/RequestDetails"; 

// Operator Pages
import OperatorAssigned from "./pages/Operator/OperatorAssigned";
import AdminDashboard from "./pages/admin/AdminDashboard";
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        
        {/* Citizen Routes */}
        <Route path="/raise-request" element={<RaiseRequest />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/view-request/:id" element={<RequestDetails />} />
        
        {/* Operator Routes */}
        <Route path="/assigned" element={<OperatorAssigned />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>

  );
}
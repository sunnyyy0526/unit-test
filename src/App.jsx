// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import { NavLink } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import RaiseRequest from "./pages/citizen/RaiseRequest";
// import MyRequests from "./pages/citizen/MyRequests";
// import RequestDetails from "./pages/citizen/RequestDetails";

// import OperatorAssigned from "./pages/Operator/OperatorAssigned";

// import AdminOperators from "./pages/admin/AdminOperators";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminAnalytics from "./pages/admin/AdminAnalytics";

// import CommunityList from "./pages/community/CommunityList";
// import CommunityCreate from "./pages/community/CommunityCreate";
// import CommunityDetails from "./pages/community/CommunityDetails";

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("loggedInUser");
//     if (storedUser) {
//       // setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("loggedInUser");
//   };

//   return (
//     <Router>
//       <Navbar user={user} onLogout={handleLogout} />

//       <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/home" element={<Home user={user} />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register setUser={setUser} />} />

//         <Route path="/raise-request" element={<RaiseRequest />} />
//         <Route path="/my-requests" element={<MyRequests />} />
//         <Route path="/view-request/:id" element={<RequestDetails />} />

//         <Route path="/community" element={<CommunityList user={user} />} />
//         <Route
//           path="/community/create"
//           element={<CommunityCreate user={user} />}
//         />
//         <Route
//           path="/community/:id"
//           element={<CommunityDetails user={user} />}
//         />

//         <Route path="/assigned" element={<OperatorAssigned />} />

//         <Route path="/admin-operators" element={<AdminOperators />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         <Route path="/admin-analytics" element={<AdminAnalytics />} />
//       </Routes>
//     </Router>
//   );
// }

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import RaiseRequest from "./pages/citizen/RaiseRequest";
import MyRequests from "./pages/citizen/MyRequests";
import RequestDetails from "./pages/citizen/RequestDetails";

import OperatorAssigned from "./pages/Operator/OperatorAssigned";

import AdminOperators from "./pages/admin/AdminOperators";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import CommunityList from "./pages/community/CommunityList";
import CommunityCreate from "./pages/community/CommunityCreate";
import CommunityDetails from "./pages/community/CommunityDetails";

export default function App() {
  const [user, setUser] = useState(null);

  // ✅ Restore login on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        <Route path="/raise-request" element={<RaiseRequest />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/view-request/:id" element={<RequestDetails />} />

        <Route path="/community" element={<CommunityList user={user} />} />
        <Route path="/community/create" element={<CommunityCreate user={user} />} />
        <Route path="/community/:id" element={<CommunityDetails user={user} />} />

        <Route path="/assigned" element={<OperatorAssigned />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-operators" element={<AdminOperators />} />
      </Routes>
    </Router>
  );
}

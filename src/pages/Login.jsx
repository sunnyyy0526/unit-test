// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "./Login.css";

// export default function Login({ setUser }) {
//   const navigate = useNavigate();
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(""); 

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 1. Check Local Storage
//     const storedUser = localStorage.getItem("registeredUser");

//     // 2. Logic: If no user found, show Invalid User error
//     if (!storedUser) {
//       setError("Invalid User. Please Register first.");
//       return;
//     }

//     const userData = JSON.parse(storedUser);

//     // 3. Validate Credentials
//     if (email !== userData.email) {
//       setError("Invalid User. Email not found.");
//     } else if (password !== userData.password) {
//       setError("Incorrect password.");
//     } else {
//       // Success!
//       setError("");
      
//       // Update Global State
//       if (setUser) {
//         setUser({ name: userData.name, role: userData.role });
//       }
      
//       navigate("/");
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-card" onSubmit={handleSubmit}>
//         <h1 className="login-title">Welcome back</h1>

//         {/* ERROR MESSAGE POPUP */}
//         {error && (
//           <div style={{ backgroundColor: "#ffdddd", color: "red", padding: "10px", borderRadius: "5px", marginBottom: "10px", fontSize: "14px", textAlign: "center"}}>
//             {error}
//           </div>
//         )}

//         <label className="label">
//           Email
//           <input className="input" type="email" placeholder="Enter your email" required 
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>

//         <label className="label">
//           Password
//           <input className="input" type="password" placeholder="Enter your password" required 
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </label>

//         <button type="submit" className="login-btnn">Login</button>

//         <div className="divider" />
//         <p className="register-text">
//           Don't have an account?{" "}
//           <Link to="/register" className="register-link">Register here</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("registeredUser");

    if (!storedUser) {
      setError("Invalid User. Please Register first.");
      return;
    }

    const userData = JSON.parse(storedUser);

    if (email !== userData.email) {
      setError("Invalid User. Email not found.");
      return;
    }

    if (password !== userData.password) {
      setError("Incorrect password.");
      return;
    }

    // ✅ SUCCESS
    const loggedInUser = {
      name: userData.name,
      role: userData.role,
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    setError("");

    // ✅ Go back to previous page (stay on refresh location)
navigate("/");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Welcome back</h1>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <label className="label">
          Email
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="login-btnn">
          Login
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">Register</Link>
        </p>
      </form>
    </div>
  );
}

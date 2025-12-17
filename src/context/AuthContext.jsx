// import { createContext, useContext, useEffect, useState } from "react";

// // 1. Create the Context
// const AuthContext = createContext(null);

// // 2. Create the Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check localStorage on initial load to keep user logged in
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // Login Function (Mock Logic)
//   const login = async (email, password) => {
//     // In a real app, you would fetch from a backend here.
//     // For now, we mock the role based on the email for testing.
//     let role = "citizen";
//     if (email.includes("admin")) role = "wardAdmin";
//     if (email.includes("super")) role = "superAdmin";
//     if (email.includes("operator")) role = "operator";

//     const mockUser = {
//       id: Date.now(),
//       name: email.split("@")[0],
//       email,
//       role: role, 
//     };

//     localStorage.setItem("user", JSON.stringify(mockUser));
//     setUser(mockUser);
//     return mockUser;
//   };

//   // Register Function
//   const register = async (formData) => {
//     const mockUser = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email,
//       role: formData.role, // Use the role selected in the Register form
//     };

//     localStorage.setItem("user", JSON.stringify(mockUser));
//     setUser(mockUser);
//     return mockUser;
//   };

//   // Logout Function
//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// // 3. Create the Hook for easy access
// export const useAuth = () => useContext(AuthContext);

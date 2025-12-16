import React, { useEffect, useMemo, useState } from "react";
import "./AdminOperators.css";

const STORAGE_KEY = "cleanOpsOperators";

export default function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    ward: "",
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // Load operators
  // ----------------------------
  useEffect(() => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setOperators(stored);
      setError("");
    } catch {
      setError("Failed to load operators");
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  // Handle input
  // ----------------------------
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // Create operator
  // ----------------------------
  const create = (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      ward: form.ward.trim(),
    };

    if (!cleanedForm.name || !cleanedForm.email || !cleanedForm.password) {
      setError("Name, Email, and Password are required");
      return;
    }

    const exists = operators.some(
      (o) => o.email.toLowerCase() === cleanedForm.email.toLowerCase()
    );

    if (exists) {
      setError("Operator with this email already exists");
      return;
    }

    setLoading(true);

    // --- CHANGE 1: Generate the current date string ---
    const today = new Date().toLocaleDateString(); 

    const newOperator = {
      _id: Date.now().toString(),
      created: today, // Save the date here
      ...cleanedForm,
    };

    const updated = [...operators, newOperator];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOperators(updated);

    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      ward: "",
    });

    setMsg("Operator created successfully");
    setLoading(false);
  };

  // ----------------------------
  // Search filter
  // ----------------------------
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return operators;

    return operators.filter((o) =>
      [o.name, o.email, o.phone, o.ward].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [operators, search]);

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="admin-operators">
      <div className="header">
        <h2>Operators</h2>
        <p className="muted">
          Create and manage field operators assigned to wards.
        </p>
      </div>

      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="split">
        {/* Create Operator */}
        <div className="left">
          <div className="panel">
            <h3>Create Operator</h3>

            <form className="form" onSubmit={create}>
              <div className="grid-2">
                <div className="field">
                  <label>Name</label>
                  <input name="name" placeholder="e.g:sunny" value={form.name} onChange={onChange} />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="set a password"
                    value={form.password}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Phone</label>
                  <input name="phone" placeholder="optional" value={form.phone} onChange={onChange} />
                </div>

                <div className="field">
                  <label>Ward</label>
                  <input name="ward" placeholder="e.g:5" value={form.ward} onChange={onChange} required />
                </div>
              </div>

              <div className="actions">
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Create Operator"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Operators List */}
        <div className="right">
          <div className="panel">
            <div className="list-header">
              <h3>All Operators</h3>
              <input
                className="search"
                placeholder="Search name, email, ward"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-wrapper">
              <table className="operators-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Ward</th>
                    {/* --- CHANGE 2: Add Header --- */}
                    <th>Created</th> 
                  </tr>
                </thead>
                <tbody>
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted">
                        No operators found
                      </td>
                    </tr>
                  )}

                  {filtered.map((o) => (
                    <tr key={o._id}>
                      <td>{o.name}</td>
                      <td>{o.email}</td>
                      <td>{o.phone || "-"}</td>
                      <td>{o.ward}</td>
                      {/* --- CHANGE 3: Display Date --- */}
                      {/* Fallback to formatting ID if 'created' doesn't exist yet */}
                      <td>{o.created || new Date(parseInt(o._id)).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
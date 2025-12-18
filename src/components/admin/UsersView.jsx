import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api";

export default function UsersView({ users, load, page, setPage, totalPages }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [edit, setEdit] = useState(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    load(page);
   
  }, [page]);

  useEffect(() => {
    if (!query) {
      setFiltered(users || []);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        (users || []).filter((u) =>
          JSON.stringify(u).toLowerCase().includes(q)
        )
      );
    }
  }, [query, users]);

  const searchUser = async () => {
    if (!searchId) return;
    try {
      const r = await API.get(`/admin/user/${searchId}`);
      setEdit(r.data);
    } catch (e) {
      console.error("User search failed", e);
      alert("User not found");
    }
  };

  const save = async () => {
    if (!edit || !edit.id) return;
    try {
      await API.put(`/admin/user/${edit.id}`, edit);
      await load(page);
      setEdit(null);
    } catch (e) {
      console.error("Save failed", e);
      alert("Failed to update user");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this user (and their bank account)?")) return;
    try {
      await API.delete(`/admin/user/${id}`);
      await load(page);
      if (edit && edit.id === id) setEdit(null);
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete user");
    }
  };

 
  const getEditableFields = (obj) => {
    if (!obj) return [];
    const excluded = ["password", "createdAt", "updatedAt"];
    return Object.keys(obj).filter(
      (key) =>
        !excluded.includes(key) &&
        obj[key] !== null &&
        typeof obj[key] !== "object"
    );
  };

 
  const getTableKeys = () => {
    if (!users || !users[0]) return [];
    return Object.keys(users[0]).filter((k) => k !== "password");
  };

  const tableKeys = getTableKeys();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container-fluid"
      style={{ margin: "0 auto" }}  
    >
      
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">User Management</h4>
          <div className="text-muted small">
            Search, edit and remove registered users.
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control form-control-sm"
            style={{
              maxWidth: 220,
              borderRadius: 999,
              borderColor: "#e5e7eb",
            }}
            placeholder="Search by any field..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="input-group input-group-sm" style={{ maxWidth: 220 }}>
            <input
              type="text"
              className="form-control"
              style={{
                borderRadius: "999px 0 0 999px",
                borderColor: "#e5e7eb",
              }}
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUser()}
            />
            <button
              className="btn btn-outline-secondary"
              style={{ borderRadius: "0 999px 999px 0" }}
              onClick={searchUser}
            >
              Go
            </button>
          </div>
        </div>
      </div>

      
      {edit && (
        <motion.div
          className="card shadow-sm border-0 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: 18,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            className="px-4 py-3 border-bottom"
            style={{ backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Edit User</h5>
                <div className="text-muted small">
                  ID: <span className="fw-semibold">{edit.id}</span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setEdit(null)}
              >
                Close
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="row g-3">
              {getEditableFields(edit).map((key) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label small fw-semibold text-capitalize">
                    {key}
                  </label>
                  <input
                    className="form-control form-control-sm"
                    style={{ borderRadius: 10 }}
                    value={edit[key] ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 d-flex justify-content-between">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => del(edit.id)}
              >
                Delete User
              </button>
              <button className="btn btn-primary btn-sm" onClick={save}>
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}

     
      <div
        className="card shadow-sm border-0"
        style={{
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          className="px-4 py-3 border-bottom"
          style={{ backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}
        >
          <h6 className="mb-0 fw-semibold">All Users</h6>
        </div>

        <div className="table-responsive">
          <table
            className="table table-hover align-middle mb-0"
            style={{ marginBottom: 0 }}
          >
            <thead>
              <tr
                className="text-muted small"
                style={{ backgroundColor: "#f9fafb" }}
              >
                {tableKeys.map((k) => (
                  <th key={k}>{k}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={tableKeys.length + 1 || 1}
                    className="text-center text-muted py-4"
                  >
                    No users found.
                  </td>
                </tr>
              )}

              {filtered.map((u) => (
                <tr key={u.id}>
                  {tableKeys.map((k) => (
                    <td key={k} className="small">
                      {String(u[k])}
                    </td>
                  ))}
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => del(u.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        <div
          className="card-body d-flex justify-content-between align-items-center"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          <span className="small text-muted">
            Page {page + 1} of {Math.max(totalPages || 1, 1)}
          </span>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: "999px 0 0 999px" }}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: "0 999px 999px 0" }}
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api";

export default function UsersView({ users, load, page, setPage, totalPages }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [edit, setEdit] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [historyUser, setHistoryUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const viewHistory = async (user) => {
    setHistoryUser(user);
    setLoadingHistory(true);
    setHistory([]);
    try {
      const r = await API.get(`/admin/loans/search?username=${user.username}`);
      setHistory(r.data.content || []);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoadingHistory(false);
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
    // Define explicit order and selection
    return [
      "id", "username", "email", "role", "creditScore",
      "hasLoan", "loanAmount", "remaining", "dueDate"
    ];
  };

  const tableKeys = getTableKeys();
  const displayNames = {
    id: "ID",
    username: "Username",
    email: "Email",
    role: "Role",
    creditScore: "Credit",
    hasLoan: "Has Loan",
    loanAmount: "Amount",
    remaining: "Balance",
    dueDate: "Due Date"
  };

  return (
    <>
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

        <AnimatePresence>
          {edit && (
            <motion.div
              className="card shadow-sm border-0 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
        </AnimatePresence>

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
                    <th key={k}>{displayNames[k] || k}</th>
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
                  <motion.tr
                    key={u.id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    transition={{ duration: 0.1 }}
                  >
                    {tableKeys.map((k) => (
                      <td key={k} className="small">
                        {k === "hasLoan" ? (
                          <span className={`badge ${u[k] ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
                            {u[k] ? "YES" : "NO"}
                          </span>
                        ) : k === "loanAmount" || k === "remaining" ? (
                          `₹${u[k]?.toLocaleString() || 0}`
                        ) : k === "dueDate" ? (
                          u[k] ? new Date(u[k]).toLocaleDateString() : "-"
                        ) : (
                          String(u[k] ?? "-")
                        )}
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
                          className="btn btn-outline-dark"
                          onClick={() => viewHistory(u)}
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </motion.tr>
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

      <AnimatePresence>
        {historyUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setHistoryUser(null)}
          >
            <motion.div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 24 }}>
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">Loan History: {historyUser.username}</h5>
                  <button type="button" className="btn-close" onClick={() => setHistoryUser(null)}></button>
                </div>
                <div className="modal-body p-4">
                  {loadingHistory ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <p className="mt-2 text-muted small">Fetching history...</p>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-folder-x text-muted" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-2 text-muted">No loan applications found for this user.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: 0.5 }}>
                            <th className="px-3">ID</th>
                            <th className="px-3">Amount</th>
                            <th className="px-3">Status</th>
                            <th className="px-3">Monthly EMI</th>
                            <th className="px-3">Remaining</th>
                            <th className="px-3">Next Due</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map(h => (
                            <tr key={h.id}>
                              <td className="small px-3 text-muted">#{h.id}</td>
                              <td className="small fw-bold px-3">₹{h.amount?.toLocaleString()}</td>
                              <td className="px-3">
                                <span className={`badge rounded-pill ${h.status === 'APPROVED' ? 'bg-success-subtle text-success' :
                                  h.status === 'REJECTED' ? 'bg-danger-subtle text-danger' :
                                    'bg-warning-subtle text-warning'
                                  }`} style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                  {h.status}
                                </span>
                              </td>
                              <td className="small px-3">₹{h.monthlyEmi?.toLocaleString()}</td>
                              <td className="small px-3 fw-semibold text-success">₹{h.due_amount?.toLocaleString()}</td>
                              <td className="small px-3 text-muted">{h.nextDueDate ? new Date(h.nextDueDate).toLocaleDateString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top-0 pb-4 px-4">
                  <button type="button" className="btn btn-dark w-100 rounded-pill fw-bold" onClick={() => setHistoryUser(null)}>Close Window</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

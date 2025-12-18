
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api";

export default function AccountsView({
  accounts,
  load,
  page,
  setPage,
  totalPages,
}) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    load(page);
  
  }, [page]);

  useEffect(() => {
    if (!query) {
      setFiltered(accounts || []);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        (accounts || []).filter((a) =>
          JSON.stringify(a).toLowerCase().includes(q)
        )
      );
    }
  }, [query, accounts]);

  const getBlockedFlag = (acc) => {
    if (acc.blocked !== undefined) return acc.blocked;
    if (acc.isBlocked !== undefined) return acc.isBlocked;
    return false;
  };

  const getStatusBadgeStyle = (blocked) => {
    if (blocked) {
      return {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontWeight: "600",
        borderRadius: "999px",
        padding: "0.25rem 0.75rem",
        border: "1px solid #fecaca"
      };
    }
    return {
      backgroundColor: "#f0fdf4",
      color: "#166534",
      fontWeight: "600",
      borderRadius: "999px",
      padding: "0.25rem 0.75rem",
      border: "1px solid #bbf7d0"
    };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;
    
    setLoading(true);
    setActionError("");
    try {
      await API.delete(`/admin/accounts/${id}`);
      await load(page);
    } catch (e) {
      console.error("Failed to delete account", e);
      setActionError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentBlocked) => {
    if (!window.confirm(`Toggle block status for this account? ${currentBlocked ? "(Will activate)" : "(Will block)"}`)) return;
    
    setLoading(true);
    setActionError("");
    try {
      await API.patch(`/admin/block/${id}`);
      await load(page);
    } catch (e) {
      console.error("Failed to toggle block", e);
      setActionError("Failed to toggle block status");
    } finally {
      setLoading(false);
    }
  };

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
          <h4 className="fw-bold mb-1" style={{ color: "#111827" }}>
            Accounts Overview
          </h4>
          <div className="text-muted small">
            View, search, block/unblock, and delete bank accounts.
          </div>
        </div>

        <input
          className="form-control form-control-sm"
          style={{
            maxWidth: 260,
            borderRadius: 999,
            borderColor: "#e5e7eb",
          }}
          placeholder="Search by any field..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

     
      {actionError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {actionError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionError("")}
          ></button>
        </div>
      )}

      {loading && (
        <div className="alert alert-info" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Processing action...
        </div>
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
          style={{
            backgroundColor: "#f9fafb",
            borderColor: "#f3f4f6",
          }}
        >
          <h6 className="mb-0 fw-semibold" style={{ color: "#111827" }}>
            Bank Accounts
          </h6>
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
                <th>ID</th>
                <th>Account Number</th>
                <th>Balance</th>
                <th>Type</th>
                <th>User Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No accounts found.
                  </td>
                </tr>
              )}

              {filtered.map((a) => {
                const blocked = getBlockedFlag(a);

                return (
                  <tr
                    key={a.id}
                    style={
                      blocked
                        ? {
                            backgroundColor: "#fef2f2",
                            borderLeft: "4px solid #dc2626"
                          }
                        : {}
                    }
                  >
                    <td className="small">{a.id}</td>
                    <td className="small fw-semibold">{a.accountNumber}</td>
                    <td className="small fw-semibold">
                      ₹{Number(a.balance || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="small">{a.type || "—"}</td>
                    <td className="small">
                      {a.username || a.userName || "—"}
                    </td>

                   
                    <td className="small">
                      <span style={getStatusBadgeStyle(blocked)}>
                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className={
                            blocked
                              ? "btn btn-outline-success btn-sm"
                              : "btn btn-outline-warning btn-sm"
                          }
                          onClick={() => handleToggleBlock(a.id, blocked)}
                          disabled={loading}
                          title={blocked ? "Set Active" : "Block Account"}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : blocked ? (
                            <i className="bi bi-unlock-fill me-1"></i>
                          ) : (
                            <i className="bi bi-lock-fill me-1"></i>
                          )}
                          {blocked ? "Active" : "Block"}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(a.id)}
                          disabled={loading}
                          title="Delete Account"
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="bi bi-trash me-1"></i>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
              disabled={page === 0 || loading}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: "0 999px 999px 0" }}
              disabled={page + 1 >= totalPages || loading}
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

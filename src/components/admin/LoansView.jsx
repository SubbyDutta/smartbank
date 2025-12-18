
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api";

export default function LoansView({ loans, load, page, setPage, totalPages }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    load(page);
   
  }, [page]);

  useEffect(() => {
    if (!query) setFiltered(loans || []);
    else {
      const q = query.toLowerCase();
      setFiltered(
        (loans || []).filter((l) =>
          JSON.stringify(l).toLowerCase().includes(q)
        )
      );
    }
  }, [query, loans]);

  const approve = async (id) => {
    if (!window.confirm("Approve this loan request?")) return;
    try {
      await API.post(`/loan/approve/${id}`);
      await load(page);
    } catch (e) {
      console.error("Approve failed", e);
      alert("Failed to approve loan");
    }
  };

 
  const getTableKeys = () => {
    if (!loans || !loans[0]) return [];
    return Object.keys(loans[0]);
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
          <h4 className="fw-bold mb-1">Loan Requests</h4>
          <div className="text-muted small">
            Review and approve pending loan applications.
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
          <h6 className="mb-0 fw-semibold">Pending Loan Applications</h6>
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
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={tableKeys.length + 1 || 1}
                    className="text-center text-muted py-4"
                  >
                    No loan requests found.
                  </td>
                </tr>
              )}

              {filtered.map((l) => (
                <tr key={l.id}>
                  {tableKeys.map((k) => (
                    <td key={k} className="small">
                      {String(l[k])}
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      style={{ borderRadius: 999 }}
                      onClick={() => approve(l.id)}
                    >
                      Approve
                    </button>
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

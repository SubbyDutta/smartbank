
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminRepaymentTable({
  repayments,
  load,
  page,
  setPage,
  totalPages,
}) {
  const [q, setQ] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    load(page);
   
  }, [page]);

  useEffect(() => {
    if (!q) setFiltered(repayments || []);
    else {
      const lower = q.toLowerCase();
      setFiltered(
        (repayments || []).filter((r) =>
          JSON.stringify(r).toLowerCase().includes(lower)
        )
      );
    }
  }, [q, repayments]);

  const tableKeys =
    repayments && repayments[0] ? Object.keys(repayments[0]) : [];

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
          <h4 className="fw-bold mb-1">Loan Repayments</h4>
          <div className="text-muted small">
            Track repayment history across all approved loans.
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
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
          <h6 className="mb-0 fw-semibold">Repayment History</h6>
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
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={tableKeys.length || 1}
                    className="text-center text-muted py-4"
                  >
                    No repayments found.
                  </td>
                </tr>
              )}

              {filtered.map((r) => (
                <tr key={r.id}>
                  {tableKeys.map((k) => (
                    <td key={k} className="small">
                      {String(r[k])}
                    </td>
                  ))}
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

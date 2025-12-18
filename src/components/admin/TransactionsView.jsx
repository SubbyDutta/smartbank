import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TransactionsView({ data, load, page, setPage, totalPages }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    load(page);
  }, [page]);

  useEffect(() => {
    if (!query) {
      setFiltered(data || []);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        (data || []).filter((t) =>
          JSON.stringify(t).toLowerCase().includes(q)
        )
      );
    }
  }, [query, data]);

  const formatFraudFlag = (val) => {
    if (val === true || val === "true" || val === 1) return "Yes";
    if (val === false || val === "false" || val === 0) return "No";
    if (val === undefined || val === null) return "—";
    return String(val);
  };

  const formatProb = (p) => {
    if (p === undefined || p === null) return "—";
    const num = Number(p);
    if (Number.isNaN(num)) return String(p);
    return (num * 100).toFixed(1) + "%";
  };

  const isFraudTransaction = (t) => {
    const fraudFlag = t.isFraud ?? t.fraud;
    const fraudProb = Number(t.fraudProbability ?? t.probability ?? 0);
    return (
      fraudFlag === true ||
      fraudFlag === 1 ||
      fraudFlag === "true" ||
      fraudProb > 0.9
    );
  };

  const getFraudRowStyle = (t) => {
    if (isFraudTransaction(t)) {
      return {
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #dc2626"
      };
    }
    return {};
  };

  const getFraudBadgeStyle = (isFraud) => {
    if (isFraud) {
      return {
        backgroundColor: "#dc2626",
        color: "white",
        fontWeight: "600",
        borderRadius: "999px",
        padding: "0.25rem 0.75rem"
      };
    }
    return {
      backgroundColor: "#f0fdf4",
      color: "#166534",
      fontWeight: "500",
      borderRadius: "999px",
      padding: "0.25rem 0.75rem"
    };
  };

  
  const getTypeBadgeStyle = (isForeign) => {
    if (isForeign) {
      return {
        backgroundColor: "#fff3cd",
        color: "#854d0e",
        fontWeight: "600",
        borderRadius: "999px",
        padding: "0.25rem 0.75rem",
        border: "1px solid #ffeaa7"
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

  const getTypeLabel = (value) => {
    return value === 0 ? "Domestic" : "Foreign";
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
            Transactions
          </h4>
          <div className="text-muted small">
            Review all transactions, including fraud predictions.
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
          style={{
            backgroundColor: "#f9fafb",
            borderColor: "#f3f4f6",
          }}
        >
          <h6 className="mb-0 fw-semibold" style={{ color: "#111827" }}>
            All Transactions
          </h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ marginBottom: 0 }}>
            <thead>
              <tr className="text-muted small" style={{ backgroundColor: "#f9fafb" }}>
                <th>Timestamp</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Is Fraud</th>
                <th>Fraud Probability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No transactions found.
                  </td>
                </tr>
              )}

              {filtered.map((t) => {
                const isFraud = isFraudTransaction(t);

                
                const isForeignValue = t.isFraud;
                const isForeign = isForeignValue !== 0;

                return (
                  <tr
                    key={t.id}
                    style={getFraudRowStyle(t)}
                    className={isFraud ? "table-danger" : ""}
                  >
                    <td className="small text-muted">{t.timestamp}</td>
                    <td className="small fw-semibold">{t.senderAccount}</td>
                    <td className="small fw-semibold">{t.receiverAccount}</td>
                    <td className="small fw-semibold">₹{t.amount}</td>

                   
                    <td className="small">
                      <span style={getTypeBadgeStyle(isForeign)}>
                        {getTypeLabel(isForeignValue)}
                      </span>
                    </td>

                    <td className="small">
                      <span style={getFraudBadgeStyle(isFraud)}>
                        {formatFraudFlag(t.isFraud ?? t.fraud)}
                      </span>
                    </td>

                    <td className="small">
                      <span
                        style={{
                          color: isFraud ? "#dc2626" : "#059669",
                          fontWeight: isFraud ? "600" : "500",
                        }}
                      >
                        {formatProb(t.fraudProbability ?? t.probability)}
                      </span>
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

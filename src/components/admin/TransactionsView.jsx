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
    if (val === 1 || val === "1" || val === true) return "Yes";
    if (val === 0 || val === "0" || val === false) return "No";
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
    return t.isFraud === 1 || Number(t.fraudProbability ?? 0) > 0.9;
  };

  const isLateHour = (hour) => {
    const h = Number(hour);
    return h >= 22 || h <= 5; // 10 PM to 4 AM
  };

  const isForeignTransaction = (t) => {
    return t.isForeign === 1;
  };

  const getRowStyle = (t) => {
    const styles = { transition: "all 0.2s ease" };
    
    if (isFraudTransaction(t)) {
      return {
        ...styles,
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #dc2626"
      };
    }
    
    if (isLateHour(t.hour)) {
      return {
        ...styles,
        backgroundColor: "#fffbeb",
        borderLeft: "4px solid #f59e0b"
      };
    }
    
    if (isForeignTransaction(t)) {
      return {
        ...styles,
        backgroundColor: "#f0f9ff",
        borderLeft: "4px solid #3b82f6"
      };
    }
    
    return styles;
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
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        fontWeight: "600",
        borderRadius: "999px",
        padding: "0.25rem 0.75rem",
        border: "1px solid #93c5fd"
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

  const getHourBadgeStyle = (hour) => {
    if (isLateHour(hour)) {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        fontWeight: "600",
        borderRadius: "999px",
        padding: "0.25rem 0.75rem",
        border: "1px solid #fed7aa"
      };
    }
    return {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      fontWeight: "500",
      borderRadius: "999px",
      padding: "0.25rem 0.75rem"
    };
  };

  const getTypeLabel = (value) => {
    return value === 1 ? "Foreign" : "Domestic";
  };

  const getHourLabel = (hour) => {
    const h = Number(hour);
    if (isLateHour(hour)) {
      return `${h % 24}:00 (Late Night)`;
    }
    return `${h % 24}:00`;
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
            Review all transactions with fraud, foreign & late-night alerts.
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
                <th>Hour</th>
                <th>Type</th>
                <th>Is Fraud</th>
                <th>Fraud Probability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No transactions found.
                  </td>
                </tr>
              )}

              {filtered.map((t) => {
                const isFraud = isFraudTransaction(t);
                const isForeign = isForeignTransaction(t);
                const isLate = isLateHour(t.hour);

                return (
                  <tr
                    key={t.id}
                    style={getRowStyle(t)}
                    className={
                      isFraud 
                        ? "table-danger" 
                        : isLate 
                        ? "table-warning" 
                        : isForeign 
                        ? "table-info" 
                        : ""
                    }
                  >
                    <td className="small text-muted">{t.timestamp}</td>
                    <td className="small fw-semibold">{t.senderAccount}</td>
                    <td className="small fw-semibold">{t.receiverAccount}</td>
                    <td className="small fw-semibold">₹{t.amount}</td>

                    <td className="small">
                      <span style={getHourBadgeStyle(t.hour)}>
                        {getHourLabel(t.hour)}
                      </span>
                    </td>

                    <td className="small">
                      <span style={getTypeBadgeStyle(isForeign)}>
                        {getTypeLabel(t.isForeign)}
                      </span>
                    </td>

                    <td className="small">
                      <span style={getFraudBadgeStyle(isFraud)}>
                        {formatFraudFlag(t.isFraud)}
                      </span>
                    </td>

                    <td className="small">
                      <span
                        style={{
                          color: isFraud ? "#dc2626" : "#059669",
                          fontWeight: isFraud ? "600" : "500",
                        }}
                      >
                        {formatProb(t.fraudProbability)}
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

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, FileText, Calendar, User, DollarSign, AlertCircle } from "lucide-react";
import API from "../../api";

export default function AdminRepaymentTable() {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const ACCENT_COLOR = "#e63946";
  const BG_COLOR = "#f8f9fa";
  const CARD_BG = "#ffffff";
  const TEXT_COLOR = "#1f2937";
  const BORDER_COLOR = "#e5e7eb";

  const fetchRepayments = async (username = "") => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = username
        ? `/repay/admin/repayments?username=${encodeURIComponent(username)}`
        : "/repay/admin/repayments";
      const res = await API.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      setRepayments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch repayments", err);
      setError("Could not load repayments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepayments();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRepayments(searchUsername.trim());
  };

  const totalPaid = repayments.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const totalRemaining = repayments.reduce((sum, r) => sum + (r.remainingBalance || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
         width: '100%',
        minWidth: 1200,
        maxWidth: '100%',
        top: -40,
        height: 'calc(100vh - 40px)',
        background: CARD_BG,
        padding: 28,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `1px solid ${BORDER_COLOR}`,
        color: TEXT_COLOR,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: `1px solid ${BORDER_COLOR}`,
        }}
      >
        <motion.div
          style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          whileHover={{ scale: 1.05 }}
        >
          <FileText size={24} color="#fff" strokeWidth={2} />
        </motion.div>
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              color: TEXT_COLOR,
            }}
          >
            Loan Repayments
          </h4>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {repayments.length} total repayments tracked
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            background: BG_COLOR,
            padding: 20,
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Total Paid
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10b981" }}>
            ₹{totalPaid.toLocaleString("en-IN")}
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            background: BG_COLOR,
            padding: 20,
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Total Remaining
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: ACCENT_COLOR }}>
            ₹{totalRemaining.toLocaleString("en-IN")}
          </div>
        </motion.div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search by username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              borderRadius: 4,
              border: `1px solid ${BORDER_COLOR}`,
              background: CARD_BG,
              color: TEXT_COLOR,
              fontSize: "0.85rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT_COLOR;
              e.target.style.boxShadow = `0 0 0 2px ${ACCENT_COLOR}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = BORDER_COLOR;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 4,
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Search size={16} />
          Search
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSearchUsername("");
            fetchRepayments();
          }}
          style={{
            background: "transparent",
            border: `1px solid ${BORDER_COLOR}`,
            color: TEXT_COLOR,
            fontWeight: 600,
            borderRadius: 4,
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RefreshCw size={16} />
          Show All
        </motion.button>
      </form>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: 60,
            background: BG_COLOR,
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <motion.div
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 16px",
              border: `4px solid ${ACCENT_COLOR}20`,
              borderTopColor: ACCENT_COLOR,
              borderRadius: "50%",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ color: "#6b7280", fontWeight: 600 }}>
            Loading repayments...
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: "center",
            padding: 40,
            background: BG_COLOR,
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <AlertCircle size={48} style={{ color: ACCENT_COLOR, marginBottom: 16 }} />
          <div style={{ color: ACCENT_COLOR, fontWeight: 600, fontSize: "1.1rem" }}>
            {error}
          </div>
        </motion.div>
      ) : repayments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: "center",
            padding: 60,
            background: BG_COLOR,
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <FileText size={48} style={{ color: "#9ca3af", marginBottom: 16 }} />
          <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "1.1rem" }}>
            No repayments found
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: 8 }}>
            Try adjusting your search criteria
          </div>
        </motion.div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 4,
            border: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: CARD_BG,
              fontSize: "0.8rem",
            }}
          >
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Repayment ID
                </th>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Username
                </th>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Loan ID
                </th>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Amount Paid
                </th>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Remaining Balance
                </th>
                <th
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    padding: 8,
                    textAlign: "left",
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {repayments.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    style={{
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <td style={{ padding: 8, color: TEXT_COLOR, fontSize: "0.8rem", fontWeight: 600 }}>
                      #{r.id}
                    </td>
                    <td style={{ padding: 8, fontSize: "0.8rem" }}>
                      <span style={{ color: TEXT_COLOR, fontWeight: 600 }}>
                        {r.username}
                      </span>
                    </td>
                    <td style={{ padding: 8, color: TEXT_COLOR, fontSize: "0.8rem" }}>
                      {r.loanId}
                    </td>
                    <td style={{ padding: 8, fontSize: "0.8rem" }}>
                      <strong style={{ color: "#10b981", fontWeight: 700 }}>
                        ₹{r.amountPaid?.toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td style={{ padding: 8, fontSize: "0.8rem" }}>
                      <strong style={{ color: ACCENT_COLOR, fontWeight: 700 }}>
                        ₹{r.remainingBalance?.toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td style={{ padding: 8, color: "#6b7280", fontSize: "0.8rem" }}>
                      {new Date(r.paymentDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
      </div>
    </motion.div>
  );
}

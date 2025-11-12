import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Search, XCircle, RefreshCw, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function LoansView({
  loans, onRefresh, query, setQuery, page, setPage, pageSize, onApprove, popup
}) {
  const ACCENT_COLOR = "#e63946";
  const BG_COLOR = "#f8f9fa";
  const CARD_BG = "#ffffff";
  const TEXT_COLOR = "#1f2937";
  const BORDER_COLOR = "#e5e7eb";

  const filtered = loans.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(l.id).includes(q) ||
      String(l.username ?? "").toLowerCase().includes(q) ||
      String(l.amount ?? "").includes(q)
    );
  });

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderRow = (loan, i) => {
    const approved = loan.approved === true || loan.approved === "true" || (loan.status && String(loan.status).toUpperCase()==="APPROVED");
    return (
      <motion.tr
        key={loan.id ?? i}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02, duration: 0.25 }}
        whileHover={{ backgroundColor: "#f9fafb" }}
        style={{
          color: TEXT_COLOR,
          borderBottom: `1px solid ${BORDER_COLOR}`,
          transition: "all 0.2s ease",
        }}
      >
        <td style={{ padding: "8px", fontWeight: 600, fontSize: "0.8rem" }}>
          {loan.id ?? "-"}
        </td>
        <td style={{ padding: "8px", fontSize: "0.8rem" }}>
          {loan.username ?? "—"}
        </td>
        <td style={{ padding: "8px" }}>
          <strong style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700 }}>
            ₹ {Number(loan.amount ?? 0).toLocaleString("en-IN")}
          </strong>
        </td>
        <td style={{ padding: "8px" }}>
          {approved ? (
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 2,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.3px",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CheckCircle size={10} />
              Approved
            </motion.span>
          ) : (
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 2,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.3px",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={10} />
              Pending
            </motion.span>
          )}
        </td>
        <td style={{ padding: "8px", textAlign: "center" }}>
          {!approved && (
            <motion.button
              onClick={() => onApprove(loan.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 10px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.7rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.2s",
              }}
            >
              <CheckCircle size={12} /> Approve
            </motion.button>
          )}
        </td>
      </motion.tr>
    );
  };

  const pendingCount = loans.filter(l => {
    const approved = l.approved === true || l.approved === "true" || (l.status && String(l.status).toUpperCase()==="APPROVED");
    return !approved;
  }).length;

  const approvedCount = loans.length - pendingCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
         width: '100%',
        minWidth: 1200,
        maxWidth: '100%',
        top: -40,
        background: CARD_BG,
        borderRadius: 4,
        color: TEXT_COLOR,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: `1px solid ${BORDER_COLOR}`,
        height: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: popup.type === "success"
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#fff",
              padding: "14px 20px",
              borderRadius: 4,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.9rem",
            }}
          >
            {popup.type === "success" ? <CheckCircle size={18}/> : <AlertTriangle size={18}/>}
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div
        style={{
          padding: 20,
          borderBottom: `1px solid ${BORDER_COLOR}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <DollarSign size={24} color="#fff" strokeWidth={2} />
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
              Loan Applications
            </h4>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {loans.length} total applications
              {pendingCount > 0 && (
                <span
                  style={{
                    color: "#f59e0b",
                    fontWeight: 700,
                    marginLeft: 8,
                  }}
                >
                  • {pendingCount} pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <motion.div
            whileHover={{ y: -2 }}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              padding: "8px 12px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fff",
            }}
          >
            <CheckCircle size={14} />
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Approved</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{approvedCount}</div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            style={{
              background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
              padding: "8px 12px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fff",
            }}
          >
            <Clock size={14} />
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Pending</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{pendingCount}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <div
        style={{
          padding: "0 20px 20px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              placeholder="Search loans..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              style={{
                padding: "8px 10px 8px 32px",
                borderRadius: 4,
                border: `1px solid ${BORDER_COLOR}`,
                background: CARD_BG,
                color: TEXT_COLOR,
                fontSize: "0.8rem",
                outline: "none",
                width: 200,
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
            onClick={() => {
              setQuery("");
              setPage(1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "transparent",
              color: "#6b7280",
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 4,
              padding: "8px 12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.8rem",
              transition: "all 0.2s",
            }}
          >
            <XCircle size={14} /> Clear
          </motion.button>
        </div>

        <motion.button
          onClick={onRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.8rem",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      {/* Scrollable Table Section */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px 20px" }}>
      {loans.length === 0 ? (
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
          <DollarSign
            size={48}
            style={{ color: "#9ca3af", marginBottom: 12 }}
          />
          <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "1rem" }}>
            No loan applications
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: 6 }}>
            All loan applications will appear here
          </div>
        </motion.div>
      ) : (
        <>
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
              <thead>
                <tr>
                  <th
                    style={{
                      color: TEXT_COLOR,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      padding: "8px",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      background: "#f9fafb",
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
                      padding: "8px",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      background: "#f9fafb",
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
                      padding: "8px",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      background: "#f9fafb",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      color: TEXT_COLOR,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      padding: "8px",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      background: "#f9fafb",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      color: TEXT_COLOR,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      padding: "8px",
                      borderBottom: `1px solid ${BORDER_COLOR}`,
                      background: "#f9fafb",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{paged.map((l, i) => renderRow(l, i))}</tbody>
            </table>
          </div>
        </>
      )}
      </div>

      {/* Fixed Footer */}
      {loans.length > 0 && (
          <div
            style={{
              padding: 20,
              borderTop: `1px solid ${BORDER_COLOR}`,
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#6b7280",
              fontSize: "0.8rem",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              Showing{" "}
              <span style={{ color: TEXT_COLOR }}>
                {(page - 1) * pageSize + 1}
              </span>
              –
              <span style={{ color: TEXT_COLOR }}>
                {Math.min(page * pageSize, filtered.length)}
              </span>{" "}
              of <span style={{ color: TEXT_COLOR }}>{filtered.length}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <motion.button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                whileHover={{ scale: page === 1 ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: `1px solid ${BORDER_COLOR}`,
                  color: page === 1 ? "#9ca3af" : TEXT_COLOR,
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                }}
              >
                ‹ Previous
              </motion.button>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
                  padding: "6px 12px",
                  borderRadius: 4,
                  minWidth: 60,
                  textAlign: "center",
                  fontSize: "0.8rem",
                }}
              >
                Page {page}
              </div>
              <motion.button
                onClick={() =>
                  setPage((p) =>
                    p * pageSize < filtered.length ? p + 1 : p
                  )
                }
                disabled={page * pageSize >= filtered.length}
                whileHover={{
                  scale: page * pageSize >= filtered.length ? 1 : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: `1px solid ${BORDER_COLOR}`,
                  color:
                    page * pageSize >= filtered.length
                      ? "#9ca3af"
                      : TEXT_COLOR,
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor:
                    page * pageSize >= filtered.length
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                }}
              >
                Next ›
              </motion.button>
            </div>
          </div>
      )}
    </motion.div>
  );
}

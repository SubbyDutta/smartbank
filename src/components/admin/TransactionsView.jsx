import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Search, XCircle, Download, AlertCircle, TrendingUp } from "lucide-react";

export default function TransactionsView({
  data,
  paged,
  totalFiltered,
  query,
  setQuery,
  page,
  setPage,
  pageSize,
}) {
  const ACCENT_COLOR = "#e63946";
  const BG_COLOR = "#f8f9fa";
  const CARD_BG = "#ffffff";
  const TEXT_COLOR = "#1f2937";
  const BORDER_COLOR = "#e5e7eb";

  const scalarize = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join("-");
    if (typeof v === "object") {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
    return String(v);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(date.getDate()).padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const rows = data.map((t) => {
      const copy = { ...t };
      delete copy.password;
      return copy;
    });
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(",")]
      .concat(rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderHeader = () => {
    if (!data?.length) return null;
    const keys = Object.keys(data[0]).filter((k) => k !== "password");
    return (
      <tr>
        {keys.map((k) => (
          <th
            key={k}
            style={{
              color: TEXT_COLOR,
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              padding: "8px",
              borderBottom: `1px solid ${BORDER_COLOR}`,
              background: "#fff",
              whiteSpace: "nowrap",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {k.replace(/_/g, " ")}
          </th>
        ))}
      </tr>
    );
  };

  const renderRow = (t, i) => {
    const keys = Object.keys(t).filter((k) => k !== "password");
    const isFraud = t?.is_fraud === 1 || t?.isFraud === 1 || t?.fraud === true;

    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02, duration: 0.25 }}
        whileHover={{ backgroundColor: "#f9fafb" }}
        style={{
          color: TEXT_COLOR,
          background: isFraud ? "#fee2e2" : "transparent",
          borderBottom: `1px solid ${BORDER_COLOR}`,
          transition: "all 0.2s ease",
        }}
      >
        {keys.map((k) => {
          if (k === "is_fraud" || k === "isFraud") {
            return (
              <td key={k} style={{ fontWeight: 600, padding: "8px" }}>
                {isFraud ? (
                  <motion.span
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AlertCircle size={10} />
                    Fraud
                  </motion.span>
                ) : (
                  <motion.span
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Safe
                  </motion.span>
                )}
              </td>
            );
          }

          if (k === "fraud_probability") {
            const prob = parseFloat(t[k]);
            return (
              <td key={k} style={{ padding: "8px", fontSize: "0.8rem" }}>
                {!isNaN(prob) ? prob.toFixed(2) : scalarize(t[k])}
              </td>
            );
          }

          if (k === "amount" || k === "balance") {
            const val = parseFloat(t[k]);
            return (
              <td key={k} style={{ padding: "8px", fontSize: "0.8rem" }}>
                {!isNaN(val)
                  ? val.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : scalarize(t[k])}
              </td>
            );
          }

          if (k === "timestamp" || k === "date" || k === "created_at") {
            return (
              <td key={k} style={{ padding: "8px", fontSize: "0.8rem" }}>
                {formatDate(t[k])}
              </td>
            );
          }

          return (
            <td
              key={k}
              style={{
                padding: "8px",
                fontSize: "0.8rem",
                maxWidth: 150,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {scalarize(t[k])}
            </td>
          );
        })}
      </motion.tr>
    );
  };

  const fraudCount =
    data?.filter((t) => t?.is_fraud === 1 || t?.isFraud === 1 || t?.fraud === true)
      .length || 0;
  const safeCount = (data?.length || 0) - fraudCount;
  const fraudPercentage = data?.length
    ? ((fraudCount / data.length) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "100%",
        minWidth: 1250,
        maxWidth: 1250,
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
      }}
    >
      {/* Header */}
      <div style={{ padding: 20, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <div
          style={{
            marginBottom: 20,
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
              <CreditCard size={24} color="#fff" strokeWidth={2} />
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
                Transactions
              </h4>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  marginTop: 2,
                  fontWeight: 500,
                }}
              >
                {totalFiltered.toLocaleString()} records
                {fraudCount > 0 && (
                  <span
                    style={{
                      color: "#ef4444",
                      fontWeight: 700,
                      marginLeft: 8,
                    }}
                  >
                    • {fraudCount} fraud ({fraudPercentage}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
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
              <TrendingUp size={14} />
              <div>
                <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Safe</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {safeCount}
                </div>
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
              <AlertCircle size={14} />
              <div>
                <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Fraud</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {fraudCount}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search + Buttons */}
        <div
          style={{
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
                placeholder="Search transactions..."
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
            onClick={exportCSV}
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
            <Download size={14} /> Export CSV
          </motion.button>
        </div>
      </div>

      {/* Table */}
      {!data?.length ? (
        <div style={{ padding: 20 }}>
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
            <CreditCard size={48} style={{ color: "#9ca3af", marginBottom: 12 }} />
            <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "1rem" }}>
              No transactions found
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: 6 }}>
              Try adjusting your search filters
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: CARD_BG,
                fontSize: "0.8rem",
              }}
            >
              <thead>{renderHeader()}</thead>
              <tbody>{paged.map((t, i) => renderRow(t, i))}</tbody>
            </table>
          </div>

          {/* Footer */}
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
              –{" "}
              <span style={{ color: TEXT_COLOR }}>
                {Math.min(page * pageSize, totalFiltered)}
              </span>{" "}
              of <span style={{ color: TEXT_COLOR }}>{totalFiltered}</span>
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
                Prev
              </motion.button>
              <div
                style={{
                  fontWeight: 700,
                  color: TEXT_COLOR,
                  padding: "6px 12px",
                }}
              >
                {page}
              </div>
              <motion.button
                onClick={() => setPage((p) => p + 1)}
                disabled={paged.length < pageSize}
                whileHover={{ scale: paged.length < pageSize ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: `1px solid ${BORDER_COLOR}`,
                  color: paged.length < pageSize ? "#9ca3af" : TEXT_COLOR,
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor: paged.length < pageSize ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                }}
              >
                Next
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Search,
  XCircle,
  RefreshCw,
  Shield,
  Trash2,
  CheckCircle,
  XCircle as XIcon,
} from "lucide-react";
import API from "../../api";

export default function AccountsView({
  accounts = [],
  filtered = [],
  paged = [],
  query,
  setQuery,
  page,
  setPage,
  pageSize,
  showAlert,
  refresh,
}) {
  const [loading, setLoading] = useState(false);

  const ACCENT_COLOR = "#e63946";
  const BG_COLOR = "#f8f9fa";
  const CARD_BG = "#ffffff";
  const TEXT_COLOR = "#1f2937";
  const BORDER_COLOR = "#e5e7eb";

  const scalarize = (v) => {
    if (v == null) return "";
    if (typeof v === "object") {
      if (v.username || v.email || v.mobile || v.creditScore)
        return [
          v.username && `User: ${v.username}`,
          v.email && `Email: ${v.email}`,
          v.mobile && `Mobile: ${v.mobile}`,
          v.creditScore != null && `Score: ${v.creditScore}`,
        ]
          .filter(Boolean)
          .join(" | ");
      return Object.values(v).join(" | ");
    }
    return String(v);
  };

  const resolveId = (obj) =>
    String(obj?.id ?? obj?.accountId ?? obj?.userId ?? obj ?? "");

  const deleteAccount = async (id) => {
    const resolved = resolveId(id);
    if (!resolved) return;
    if (!window.confirm(`Are you sure you want to delete account #${resolved}?`))
      return;
    try {
      setLoading(true);
      await API.delete(`/admin/accounts/${resolved}`);
      showAlert("success", "Bank account deleted");
      await refresh();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockAccount = async (userId) => {
    const resolvedUserId = resolveId(userId);
    if (!resolvedUserId) return;
    try {
      setLoading(true);
      const res = await API.patch(`/admin/block/${resolvedUserId}`);
      showAlert("success", res.data || "Toggled block state");
      await refresh();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to toggle block");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = (obj, includeActions = false) =>
    obj ? (
      <tr>
        {Object.keys(obj).map((key) => (
          <th
            key={key}
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
            {key.replace(/_/g, " ")}
          </th>
        ))}
        {includeActions && (
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
            Actions
          </th>
        )}
      </tr>
    ) : null;

  const renderRow = (a, i) => (
    <motion.tr
      key={i}
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
      {Object.entries(a).map(([k, v]) => {
        if (k === "blocked" || k === "isBlocked") {
          const blocked = !!v;
          return (
            <td key={k} style={{ padding: "8px" }}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                style={{
                  background: blocked
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "linear-gradient(135deg, #10b981, #059669)",
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
                {blocked ? <XIcon size={10} /> : <CheckCircle size={10} />}
                {blocked ? "Blocked" : "Active"}
              </motion.span>
            </td>
          );
        }
        return (
          <td
            key={k}
            title={scalarize(v)}
            style={{
              padding: "8px",
              fontSize: "0.8rem",
              maxWidth: 200,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {scalarize(v)}
          </td>
        );
      })}
      <td style={{ padding: "8px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <motion.button
            disabled={loading}
            onClick={() => toggleBlockAccount(a.userId ?? a.id ?? a.user_id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "transparent",
              border: `1px solid ${ACCENT_COLOR}`,
              color: ACCENT_COLOR,
              borderRadius: 4,
              padding: "4px 8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            <Shield size={12} /> Toggle
          </motion.button>
          <motion.button
            disabled={loading}
            onClick={() => deleteAccount(a)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "transparent",
              border: `1px solid ${BORDER_COLOR}`,
              color: "#6b7280",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            <Trash2 size={12} /> Delete
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );

  const blockedCount = accounts.filter(a => a.blocked || a.isBlocked).length;
  const activeCount = accounts.length - blockedCount;

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
      }}
    >
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
            <Wallet size={24} color="#fff" strokeWidth={2} />
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
              Bank Accounts
            </h4>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {filtered.length} total records
              {blockedCount > 0 && (
                <span
                  style={{
                    color: "#ef4444",
                    fontWeight: 700,
                    marginLeft: 8,
                  }}
                >
                  • {blockedCount} blocked
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
              <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Active</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{activeCount}</div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              padding: "8px 12px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fff",
            }}
          >
            <Shield size={14} />
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.9 }}>Blocked</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{blockedCount}</div>
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
              placeholder="Search accounts..."
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
          onClick={refresh}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, #1e40af)`,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 14px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.8rem",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <RefreshCw size={14} className={loading ? "spinner-rotate" : ""} /> 
          {loading ? "Loading..." : "Refresh"}
        </motion.button>
      </div>

      {/*  Table Section */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px 20px" }}>
      {accounts.length === 0 ? (
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
          <Wallet
            size={48}
            style={{ color: "#9ca3af", marginBottom: 12 }}
          />
          <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "1rem" }}>
            No accounts found
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: 6 }}>
            Try adjusting your search filters
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
                {renderHeader(accounts[0], true)}
              </thead>
              <tbody>{paged.map((a, i) => renderRow(a, i))}</tbody>
            </table>
          </div>
        </>
      )}
      </div>

      {/* Fixed Footer */}
      {accounts.length > 0 && (
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

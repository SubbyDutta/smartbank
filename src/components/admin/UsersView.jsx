import React from "react";
import { motion } from "framer-motion";
import { Users, Search, XCircle, DollarSign, RefreshCw, Trash2, UserCog, CheckCircle, User } from "lucide-react";
import API from "../../api";

export default function UsersView({
  users, filtered, paged,
  query, setQuery, page, setPage, pageSize,
  editForm, setEditForm,
  searchId, setSearchId, onSearchUser,
  showAlert
}) {
  const ACCENT_COLOR = "#e63946";
  const BG_COLOR = "#f8f9fa";
  const CARD_BG = "#ffffff";
  const TEXT_COLOR = "#1f2937";
  const BORDER_COLOR = "#e5e7eb";

  const scalarize = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join("-");
    if (typeof v === "object") { try { return JSON.stringify(v); } catch { return String(v); } }
    return String(v);
  };

  const resolveId = (obj) => String(obj?.id ?? obj?.userId ?? obj?.user_id ?? obj ?? "");

  const saveUserDetails = async () => {
    if (!editForm || !editForm.id) return;
    try {
      const payload = {
        username: editForm.username,
        email: editForm.email,
        mobile: editForm.mobile,
        role: editForm.role,
      };
      await API.put(`/admin/user/${resolveId(editForm.id)}`, payload);
      showAlert("success", "User details updated");
      
      // ✅ Re-fetch user data (refresh table)
      await onSearchUser(editForm.id);

      // ✅ Close edit form after short delay (simulate redirect)
      setTimeout(() => {
        setEditForm(null); // hides form
      }, 500);

    } catch (e) {
      console.error(e);
      showAlert("danger", "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    const resolved = resolveId(id);
    if (!resolved) return;
    if (!window.confirm(`Delete user with ID ${resolved}? This is irreversible.`)) return;
    try {
      await API.delete(`admin/user/${resolved}`);
      showAlert("success", "User deleted");
      setEditForm(null);
      setSearchId("");
    } catch (e) {
      console.error(e);
      showAlert("danger", "Failed to delete user");
    }
  };

  const renderHeader = (obj, extra) => {
    if (!obj) return null;
    return (
      <tr>
        {Object.keys(obj)
          .filter((k) => k !== "password")
          .map((k) => (
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
                background: "#f9fafb",
              }}
            >
              {k.replace(/_/g, " ")}
            </th>
          ))}
        {extra && (
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
        )}
      </tr>
    );
  };

  const renderUserRow = (u, i) => {
    return (
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
        {Object.entries(u)
          .filter(([k]) => k !== "password")
          .map(([k, v]) => {
            if (k === "balance") {
              return (
                <td key={k} style={{ padding: "8px" }}>
                  <strong style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700 }}>
                    ₹ {Number(v ?? 0).toLocaleString("en-IN")}
                  </strong>
                </td>
              );
            }
            return (
              <td key={k} style={{ padding: "8px", fontSize: "0.8rem" }}>
                {k === "password" ? "••••••••" : scalarize(v)}
              </td>
            );
          })}
        <td style={{ padding: "8px", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <motion.button
              onClick={() => setEditForm(u)} // ✅ show edit form
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 10px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <UserCog size={12} /> Edit
            </motion.button>
            <motion.button
              onClick={() => deleteUser(u)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "transparent",
                border: `1px solid ${BORDER_COLOR}`,
                color: "#6b7280",
                borderRadius: 4,
                padding: "6px 10px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.2s",
              }}
            >
              <Trash2 size={12} />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "100%",
        minWidth: 1200,
        maxWidth: "100%",
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
            <Users size={24} color="#fff" strokeWidth={2} />
          </motion.div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: TEXT_COLOR }}>
              All Users
            </h4>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {filtered.length} total users
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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
              placeholder="Search users..."
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
            <XCircle size={14} />
          </motion.button>
        </div>
      </div>

      {/* ✅ Edit form appears conditionally, table reappears after save */}
      {editForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: BG_COLOR,
            padding: 16,
            borderRadius: 4,
            marginBottom: 60,
            border: `1px solid ${BORDER_COLOR}`,
            overflowY: "auto",
          }}
        >
          {/* Edit form content same as before */}
          {/* ... (keep your existing edit form code here unchanged) ... */}
        </motion.div>
      ) : (
        // ✅ Show table when edit form closed
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {users.length === 0 ? (
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
              <Users size={48} style={{ color: "#9ca3af", marginBottom: 12 }} />
              <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "1rem" }}>
                No users found
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
                <thead>{renderHeader(users[0], true)}</thead>
                <tbody>{paged.map((u, i) => renderUserRow(u, i))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

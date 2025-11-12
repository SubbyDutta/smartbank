import React from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut } from "lucide-react";

export default function AdminHeader({ sidebarOpen, toggleSidebar, onLogout }) {
  const ACCENT_COLOR = "#e63946"; 

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        backdropFilter: "blur(10px)",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: "transparent",
            border: "none",
            color: ACCENT_COLOR,
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>

        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${ACCENT_COLOR}, #ff7a85)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: `0 4px 12px ${ACCENT_COLOR}70`,
            }}
          >
            <Shield size={20} />
          </div>
          <div>
            <h5
              style={{
                color: "#f1f5f9",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Subby Admin
            </h5>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Control Panel
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT */}
      <motion.button
        onClick={onLogout}
        whileHover={{
          scale: 1.05,
          boxShadow: `0 6px 15px ${ACCENT_COLOR}70`,
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(135deg, ${ACCENT_COLOR}, #ff7a85)`,
          border: "none",
          color: "#fff",
          fontWeight: 600,
          padding: "8px 18px",
          borderRadius: 10,
          boxShadow: `0 4px 10px ${ACCENT_COLOR}40`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <LogOut size={16} />
        Logout
      </motion.button>
    </motion.header>
  );
}

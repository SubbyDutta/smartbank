
import React from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut } from "lucide-react";

const SIDEBAR_WIDTH = 280;

export default function AdminHeader({ sidebarOpen, toggleSidebar, onLogout }) {
  const ACCENT_COLOR = "var(--color-black)";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: sidebarOpen ? SIDEBAR_WIDTH : 0,
        right: 0,
        zIndex: 1500,
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-light)",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "var(--shadow-sm)",
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "8px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>

        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--color-black)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "var(--shadow-primary)",
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <h5
              style={{
                color: "var(--text-primary)",
                fontWeight: 800,
                margin: 0,
                fontSize: "1.1rem",
                letterSpacing: '-0.5px'
              }}
            >
              SECUREBANK
            </h5>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
              Banking Management
            </div>
          </div>
        </motion.div>
      </div>


    </motion.header>
  );
}

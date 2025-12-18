
import React from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut } from "lucide-react";

const SIDEBAR_WIDTH = 280;

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
        left: sidebarOpen ? SIDEBAR_WIDTH : 0,
        right: 0,
        zIndex: 1500,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
            color: "#6b7280",
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
              background: `linear-gradient(135deg, ${ACCENT_COLOR}, #f87171)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: `0 4px 12px rgba(230, 57, 70, 0.3)`,
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <h5
              style={{
                color: "#1f2937",
                fontWeight: 600,
                margin: 0,
                fontSize: "1.1rem",
              }}
            >
             SMARTBANK
            </h5>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>
              Banking Management
            </div>
          </div>
        </motion.div>
      </div>

  
    </motion.header>
  );
}

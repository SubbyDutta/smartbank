import React from "react";
import { motion } from "framer-motion";

export default function Sidebar({ user, active, setActive, logout, hasAccount }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-house-door-fill" },
    { key: "transfer", label: "Transfer Money", icon: "bi-arrow-left-right" },
    { key: "addMoney", label: "Add Money", icon: "bi-wallet2" },
    { key: "tx", label: "Transactions", icon: "bi-clock-history" },
    { key: "chatbot", label: "AI Chatbot", icon: "bi-chat-dots-fill" },
    { key: "loan", label: "Apply for Loan", icon: "bi-file-earmark-text-fill" },
    { key: "myloan", label: "My Loans", icon: "bi-credit-card-2-front-fill" },
  ];

 
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.05 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "calc(100vh - 40px)",
    padding: "24px",
    width: 260,
    position: "fixed",
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
    borderRadius: "0 24px 24px 0",
    position: "sticky",
    top: 20,
    alignSelf: "flex-start",
   
    
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <motion.aside
      className="up-sidebar "
      style={sidebarStyle}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
     
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        
          borderRadius: "24px 0 0 0",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* User Info Section */}
        <motion.div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: "1px solid rgba(220,53,69,0.1)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <motion.div
            className="up-avatar"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
              fontSize: 22,
              boxShadow: "0 6px 16px rgba(230,57,70,0.25)",
              border: "3px solid rgba(255,255,255,0.9)",
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {user.username?.charAt(0)?.toUpperCase() || "U"}
          </motion.div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div 
              className="up-username" 
              style={{ 
                fontWeight: 700, 
                fontSize: 17,
                color: "#212529",
                marginBottom: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.username || "User"}
            </div>
            <div 
              className="up-role" 
              style={{ 
                fontSize: 12, 
                color: "#6c757d",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="bi bi-patch-check-fill me-1 text-danger"></i>
              {String(user.role || "USER").toUpperCase()}
            </div>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="up-nav" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {navItems.map((item, index) => (
            <motion.button
              key={item.key}
              className={`up-btn ${active === item.key ? "active" : ""}`}
              onClick={() => hasAccount && setActive(item.key)}
              disabled={!hasAccount}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: active === item.key 
                  ? "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)" 
                  : "transparent",
                color: active === item.key ? "#fff" : "#495057",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: hasAccount ? "pointer" : "not-allowed",
                opacity: hasAccount ? 1 : 0.5,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                position: "relative",
              }}
              variants={itemVariants}
              whileHover={hasAccount && active !== item.key ? {
                x: 4,
                backgroundColor: "rgba(230,57,70,0.08)",
              } : {}}
              whileTap={hasAccount ? { scale: 0.98 } : {}}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <i 
                className={`bi ${item.icon}`} 
                style={{ 
                  fontSize: 18,
                  minWidth: 20,
                }} 
              />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active === item.key && (
                <motion.div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 4,
                    height: "70%",
                   
                    borderRadius: "0 4px 4px 0",
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <motion.div 
        className="up-logout" 
        style={{ marginTop: "auto", paddingTop: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
      >
        <motion.button
          className="ghost"
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 12,
            border: "2px solid rgba(230,57,70,0.2)",
            background: "transparent",
            color: "#e63946",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.3s ease",
          }}
          whileHover={{
            backgroundColor: "#e63946",
            color: "#fff",
            borderColor: "#e63946",
          }}
          whileTap={{ scale: 0.96 }}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
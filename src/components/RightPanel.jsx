import React from "react";
import { motion } from "framer-motion";

export default function RightPanel({ balance, accountNumber, onSendClick }) {
  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 },
    position:"absolute",
      right:30

    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2 }
    },
  };

  const formatBalance = (bal) => {
    if (typeof bal === "number") {
      return bal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    }
    return bal;
  };

  return (
    <motion.aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: 300,
        position: "fixed",
        top: 20,
        alignSelf: "flex-start",
      }}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      {/* Account Summary Card */}
      <motion.div
        className="card shadow-lg border-0"
        style={{
          borderRadius: 20,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 24,
          border: "1px solid rgba(220,53,69,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
        variants={cardVariants}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 15px 40px rgba(220,53,69,0.15)",
        }}
      >
        {/* Decorative gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
           
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <h5 style={{ fontWeight: 700, color: "#e63946", fontSize: "1.1rem", margin: 0 }}>
            <i className="bi bi-wallet2 me-2"></i>
            Account Summary
          </h5>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
          }}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(40,167,69,0.08) 0%, rgba(40,167,69,0.04) 100%)",
          borderRadius: 12,
          padding: "16px",
          border: "1px solid rgba(40,167,69,0.2)",
        }}>
          <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: 4 }}>
            Available Balance
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#28a745",
            fontFamily: "system-ui, -apple-system",
          }}>
            {formatBalance(balance)}
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px",
          background: "#f8f9fa",
          borderRadius: 10,
          fontSize: "0.9rem",
        }}>
          <i className="bi bi-credit-card-fill" style={{ color: "#6c757d" }}></i>
          <span style={{ color: "#6c757d" }}>Account:</span>
          <span style={{ fontWeight: 700, color: "#212529" }}>
            {accountNumber || "Not created"}
          </span>
        </div>

        <motion.button
          className="btn btn-danger w-100"
          onClick={onSendClick}
          style={{
            marginTop: 4,
            fontWeight: 600,
            borderRadius: 12,
            padding: "12px",
            border: "none",
            fontSize: "1rem",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="bi bi-send-fill me-2"></i>
          Send Money
        </motion.button>
      </motion.div>

      {/* Security Panel */}
      <motion.div
        className="card shadow-lg border-0"
        style={{
          borderRadius: 20,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 24,
          border: "1px solid rgba(220,53,69,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
        variants={cardVariants}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Decorative gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}>
              <i className="bi bi-shield-check-fill"></i>
            </div>
            <h5 style={{ fontWeight: 700, color: "#212529", fontSize: "1.1rem", margin: 0 }}>
              Security
            </h5>
          </div>
          <span style={{
            fontSize: "0.75rem",
            color: "#10b981",
            fontWeight: 600,
            background: "rgba(16,185,129,0.1)",
            padding: "4px 10px",
            borderRadius: 12,
          }}>
            <i className="bi bi-check-circle-fill me-1"></i>
            Active
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px",
          background: "#f8f9fa",
          borderRadius: 10,
          fontSize: "0.9rem",
        }}>
          <i className="bi bi-clock-history" style={{ color: "#6c757d" }}></i>
          <span style={{ color: "#6c757d" }}>Last login:</span>
          <span style={{ fontWeight: 600, color: "#212529" }}>
            {new Date().toLocaleString()}
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px",
          background: "rgba(239,68,68,0.05)",
          borderRadius: 10,
          fontSize: "0.85rem",
          border: "1px solid rgba(239,68,68,0.1)",
        }}>
          <i className="bi bi-info-circle-fill" style={{ color: "#ef4444" }}></i>
          <span style={{ color: "#6c757d" }}>
            2FA recommended for enhanced security
          </span>
        </div>

        <motion.button
          className="btn btn-outline-primary w-100"
          onClick={() => alert("2FA setup flow not implemented")}
          style={{
            fontWeight: 600,
            borderRadius: 12,
            padding: "12px",
            borderWidth: 2,
            fontSize: "0.95rem",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="bi bi-key-fill me-2"></i>
          Setup 2FA
        </motion.button>
      </motion.div>

   
    </motion.aside>
  );
}
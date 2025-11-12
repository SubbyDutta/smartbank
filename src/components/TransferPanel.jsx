import React, { useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function TransferPanel({ onComplete }) {
  const [form, setForm] = useState({
    senderAccount: "",
    receiverAccount: "",
    amount: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);


  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.senderAccount || !form.receiverAccount || !form.amount) {
      setMsg({ type: "error", text: "Please fill all fields." });
      return;
    }

    if (Number(form.amount) <= 0) {
      setMsg({ type: "error", text: "Amount must be greater than 0." });
      return;
    }

    setShowPasswordPopup(true);
  };

 
  const handleTransfer = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await API.post("/transfer/transfer", {
        senderAccount: form.senderAccount,
        receiverAccount: form.receiverAccount,
        amount: Number(form.amount),
        password: password,
      });

      // ✅ Success
      setMsg({ type: "success", text: "Transfer completed successfully!" });
      setForm({ senderAccount: "", receiverAccount: "", amount: "" });
      setPassword("");
      setShowPasswordPopup(false);
      onComplete?.();
    } catch (err) {
      console.error(err);

      const errorMsg = err?.response?.data || err?.data || "Transfer failed";

      if (errorMsg.toLowerCase().includes("password")) {
        // ❌ Wrong password → keep popup open
        setMsg({ type: "error", text: "Incorrect password. Please try again." });
      } else {
        // ❌ Other errors → close popup and show error in main form
        setMsg({ type: "error", text: errorMsg });
        setShowPasswordPopup(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = {
    width: "100%",
    maxWidth: 800,
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
     top:-30,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
     
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
         
          opacity: 0.8,
        }}
      />

     
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(230,57,70,0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 250,
          height: 250,
          background: "radial-gradient(circle, rgba(255,107,129,0.02) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 24,
                  boxShadow: "0 6px 16px rgba(230,57,70,0.25)",
                }}
              >
                <i className="bi bi-arrow-left-right"></i>
              </div>
              <div>
                <h4
                  className="fw-bold mb-0"
                  style={{
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Transfer Funds
                </h4>
                <p className="small text-muted mb-0">Send money securely between accounts</p>
              </div>
            </div>
          </div>
          <motion.button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              setForm({ senderAccount: "", receiverAccount: "", amount: "" });
              setMsg(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ borderRadius: 12 }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Reset
          </motion.button>
        </div>

        {/* Main Transfer Form */}
        <form onSubmit={handleInitialSubmit}>
          <div className="row g-4">
            {[
              { 
                label: "Sender Account", 
                key: "senderAccount", 
                type: "text", 
                placeholder: "Enter sender account number",
                icon: "bi-person-fill",
                color: "#ff6b81",
              },
              { 
                label: "Receiver Account", 
                key: "receiverAccount", 
                type: "text", 
                placeholder: "Enter receiver account number",
                icon: "bi-person-plus-fill",
                color: "#10b981",
              },
              { 
                label: "Amount (₹)", 
                key: "amount", 
                type: "number", 
                placeholder: "Enter amount",
                icon: "bi-currency-rupee",
                color: "#f59e0b",
              },
            ].map((field, idx) => (
              <motion.div
                className="col-md-6"
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
              >
                <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.9rem" }}>
                  <i className={`bi ${field.icon} me-2`} style={{ color: field.color }}></i>
                  {field.label}
                </label>
                <div className="position-relative">
                  <input
                    type={field.type}
                    className="form-control"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      borderColor: "rgba(220,53,69,0.2)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: "1rem",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = field.color}
                    onBlur={(e) => e.target.style.borderColor = "rgba(220,53,69,0.2)"}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                      opacity: 0.3,
                    }}
                  >
                    {field.key === "amount" ? "₹" : ""}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Buttons */}
            <div className="col-12 mt-2">
              <div className="d-flex gap-3">
                <motion.button
                  type="submit"
                  className="btn btn-danger px-5 py-2"
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    fontSize: "1rem",
                    flex: 1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-send-fill me-2"></i>
                  Continue Transfer
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => {
                    setForm({ senderAccount: "", receiverAccount: "", amount: "" });
                    setMsg(null);
                  }}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear
                </motion.button>
              </div>
            </div>

            {/* Message */}
            <AnimatePresence>
              {msg && (
                <motion.div
                  className="col-12"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div
                    className={`alert mb-0 d-flex align-items-center gap-2`}
                    style={{
                      background: msg.type === "error" 
                        ? "rgba(239,68,68,0.1)" 
                        : "rgba(16,185,129,0.1)",
                      border: msg.type === "error" 
                        ? "1px solid rgba(239,68,68,0.3)" 
                        : "1px solid rgba(16,185,129,0.3)",
                      borderRadius: 12,
                      padding: "12px 16px",
                    }}
                  >
                    <i 
                      className={`bi ${msg.type === "error" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`}
                      style={{ 
                        fontSize: 20,
                        color: msg.type === "error" ? "#ef4444" : "#10b981",
                      }}
                    ></i>
                    <span style={{ fontWeight: 600, color: msg.type === "error" ? "#ef4444" : "#10b981" }}>
                      {msg.text}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Security Footer */}
        <motion.div 
          className="mt-4 pt-4 border-top border-light d-flex align-items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <i className="bi bi-shield-check-fill text-success" style={{ fontSize: 24 }}></i>
          <div>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>100% Secure</span>
            <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
              End-to-End Encrypted Transfers
            </span>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Password Popup */}
      <AnimatePresence>
        {showPasswordPopup && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 2000,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setShowPasswordPopup(false)}
          >
            <motion.div
              className="bg-white shadow-lg p-4 rounded-4"
              style={{
                width: "100%",
                maxWidth: 420,
                border: "1px solid rgba(220,53,69,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient border */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, #ff6b81, #e63946)",
                }}
              />

              {/* Icon */}
              <div className="text-center mb-4">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto",
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 36,
                    boxShadow: "0 8px 20px rgba(230,57,70,0.3)",
                  }}
                >
                  <i className="bi bi-lock-fill"></i>
                </div>
                <h5 className="fw-bold mt-3 text-danger">Confirm Transfer</h5>
                <p className="text-muted small mb-0">Enter your password to authorize this transaction</p>
              </div>

              {/* Password Input */}
              <div className="position-relative">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    borderColor: "rgba(220,53,69,0.3)",
                    borderRadius: 12,
                    padding: "14px 50px 14px 16px",
                    fontSize: "1.1rem",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && !loading && password && handleTransfer()}
                  autoFocus
                />
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#6c757d",
                  }}
                >
                  <i className="bi bi-key-fill"></i>
                </div>
              </div>

              {msg && msg.type === "error" && (
                <motion.div
                  className="alert alert-danger mt-3 mb-0 d-flex align-items-center gap-2"
                  style={{ borderRadius: 10 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span className="small">{msg.text}</span>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="d-flex gap-3 mt-4">
                <motion.button
                  className="btn btn-danger px-4 flex-1"
                  onClick={handleTransfer}
                  disabled={loading || !password}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: "12px",
                  }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Confirm Transfer
                    </>
                  )}
                </motion.button>
                <motion.button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => {
                    setPassword("");
                    setShowPasswordPopup(false);
                    setMsg(null);
                  }}
                  disabled={loading}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: "12px",
                  }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

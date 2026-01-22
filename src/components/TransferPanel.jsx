import React, { useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

export default function TransferPanel({ onComplete, accountNumber }) {
  const [activeTab, setActiveTab] = useState("transfer"); // "transfer" or "addMoney"
  const [form, setForm] = useState({
    senderAccount: accountNumber || "",
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


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      setMsg({ type: "error", text: "Enter a valid amount" });
      return;
    }
    setLoading(true);
    setMsg(null);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await API.post("/payment/create-order", {
        amount: Number(form.amount),
      });
      const order = orderRes.data;

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");
            let username = null;
            if (token) {
              const decoded = jwtDecode(token);
              username = decoded.sub;
            }
            const key = uuidv4();
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(form.amount),
              username,
              key
            });

            if (verifyRes.data.success) {
              setMsg({ type: "success", text: "✅ Money added successfully!" });
              setForm(prev => ({ ...prev, amount: "" }));
              onComplete?.();
            } else {
              setMsg({ type: "error", text: "❌ Payment verification failed." });
            }
          } catch (err) {
            console.error(err);
            setMsg({ type: "error", text: "❌ Error verifying payment." });
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#000000" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Error initiating payment" });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await API.post("/transfer/transfer", {
        key: uuidv4(),
        senderAccount: accountNumber,
        receiverAccount: form.receiverAccount,
        amount: Number(form.amount),
        password: password,
      });

      setMsg({ type: "success", text: "Transfer completed successfully!" });
      setForm({ senderAccount: accountNumber, receiverAccount: "", amount: "" });
      setPassword("");
      setShowPasswordPopup(false);
      onComplete?.();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Something went wrong";
      setMsg({ type: "error", text: errorMsg });
      setShowPasswordPopup(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={{
        width: "100%",
        borderRadius: 24,
        background: "var(--bg-primary)",
        overflow: "visible",
        boxShadow: "var(--shadow-xl)",
        border: '1px solid var(--border-light)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
          borderRadius: "50%",
          background: "var(--bg-tertiary)",
          opacity: 0.05,
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
          borderRadius: "50%",
          background: "var(--bg-secondary)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />


      <div style={{ position: "relative", zIndex: 2 }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "var(--color-black)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-inverse)",
                  fontSize: 24,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <i className="bi bi-arrow-left-right"></i>
              </div>
              <div>
                <h4
                  className="fw-bold mb-0"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Wallet Actions
                </h4>
                <p className="small text-muted mb-0">Securely transfer or add money</p>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 p-1" style={{ background: 'var(--bg-secondary)', borderRadius: 14 }}>
            <button
              className={`btn btn-sm ${activeTab === 'transfer' ? 'btn-dark' : ''}`}
              onClick={() => setActiveTab('transfer')}
              style={{ borderRadius: 10, fontWeight: 600, border: 'none' }}
            >
              Transfer
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'addMoney' ? 'btn-dark' : ''}`}
              onClick={() => setActiveTab('addMoney')}
              style={{ borderRadius: 10, fontWeight: 600, border: 'none' }}
            >
              Add Money
            </button>
          </div>
        </div>


        <form onSubmit={activeTab === 'transfer' ? handleInitialSubmit : handleAddMoney}>
          <div className="row g-4">
            {activeTab === 'transfer' ? (
              <>
                <div className="col-12">
                  <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.9rem", color: 'var(--text-secondary)' }}>
                    <i className="bi bi-person-fill me-2" style={{ color: 'var(--color-black)' }}></i>
                    Sender Account (Auto-detected)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountNumber}
                    readOnly
                    style={{
                      borderColor: "var(--border-light)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: "1rem",
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.9rem", color: 'var(--text-secondary)' }}>
                    <i className="bi bi-person-plus-fill me-2" style={{ color: 'var(--color-black)' }}></i>
                    Receiver Account
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter receiver account number"
                    value={form.receiverAccount}
                    onChange={(e) => setForm({ ...form, receiverAccount: e.target.value })}
                    style={{
                      borderColor: "var(--border-light)",
                      borderRadius: 12,
                      padding: "12px 16px",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.9rem", color: 'var(--text-secondary)' }}>
                    <i className="bi bi-currency-rupee me-2" style={{ color: 'var(--color-black)' }}></i>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    style={{
                      borderColor: "var(--border-light)",
                      borderRadius: 12,
                      padding: "12px 16px",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="col-12">
                <div className="d-flex justify-content-center mb-4">
                  <div style={{
                    background: "#fff",
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <img
                      style={{ width: 100, height: "auto" }}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQQm61y_1zYU15YuP51hPr52IgbM35xwCc3YOyl0L4Jw5xkdHeWQ1If78_nF1l6_pUIDI&usqp=CAU"
                      alt="Razorpay"
                    />
                    <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>Powered by Razorpay</div>
                  </div>
                </div>
                <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.9rem", color: 'var(--text-secondary)' }}>
                  <i className="bi bi-currency-rupee me-2" style={{ color: 'var(--color-black)' }}></i>
                  Amount to Add (₹)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  style={{
                    borderColor: "var(--border-light)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: "1.2rem",
                    fontWeight: 700
                  }}
                />
              </div>
            )}


            <div className="col-12 mt-2">
              <div className="d-flex gap-3">
                <motion.button
                  type="submit"
                  className="btn btn-dark px-5 py-2"
                  disabled={loading}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    fontSize: "1rem",
                    flex: 1,
                    background: 'var(--color-black)',
                    border: 'none',
                    height: 52
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className={`bi ${activeTab === 'transfer' ? 'bi-send-fill' : 'bi-plus-circle-fill'} me-2`}></i>
                  )}
                  {activeTab === 'transfer' ? 'Continue Transfer' : 'Add Funds'}
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
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
                </motion.button>
              </div>
            </div>


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


        <motion.div
          className="mt-4 pt-4 border-top border-light d-flex align-items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <i className="bi bi-shield-check-fill text-success" style={{ fontSize: 24 }}></i>
          <div>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: 'var(--text-primary)' }}>100% Secure</span>
            <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
              End-to-End Encrypted Transfers
            </span>
          </div>
        </motion.div>
      </div>


      <AnimatePresence>
        {showPasswordPopup && (
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "var(--bg-backdrop)",
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
                border: "1px solid var(--border-light)",
                position: "relative",
                overflow: "hidden",
                background: "var(--bg-primary)",
              }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "var(--border-light)",
                }}
              />


              <div className="text-center mb-4">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto",
                    background: "var(--color-black)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-inverse)",
                    fontSize: 36,
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <i className="bi bi-lock-fill"></i>
                </div>
                <h5 className="fw-bold mt-3" style={{ color: 'var(--text-primary)' }}>Confirm Transfer</h5>
                <p className="text-muted small mb-0">Enter your password to authorize this transaction</p>
              </div>


              <div className="position-relative">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    borderColor: "var(--border-light)",
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
                    color: "var(--text-tertiary)",
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
                  className="btn btn-dark px-4 flex-1"
                  onClick={handleTransfer}
                  disabled={loading || !password}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: "12px",
                    marginLeft: "25px",
                    background: 'var(--color-black)',
                    border: 'none',
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
                  whileHover={!loading ? { scale: 1.01 } : {}}
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

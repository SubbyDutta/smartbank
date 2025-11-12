import React, { useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

export default function AddMoney({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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

  async function handleAddMoney(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setMsg({ type: "error", text: "Enter a valid amount" });
      return;
    }
    setLoading(true);
    setMsg("");
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await API.post("/payment/create-order", {
        amount: Number(amount),
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

            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: Number(amount),
              username,
            });

            if (verifyRes.data.success) {
              setMsg({ type: "success", text: "✅ Money added successfully!" });
              setAmount("");
              if (onSuccess) onSuccess();
            } else {
              setMsg({ type: "error", text: "❌ Payment verification failed." });
            }
          } catch (err) {
            console.error(err);
            setMsg({ type: "error", text: "❌ Error verifying payment." });
          }
        },
        prefill: {
          name: "Demo User",
          email: "demo@example.com",
          contact: "9999999999",
        },
        theme: { color: "#e63946" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Error initiating payment" });
    } finally {
      setLoading(false);
    }
  }


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const panelStyle = {
    width: 800,
    top:-30,
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
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

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-inline-block mb-3">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 28,
                margin: "0 auto",
                boxShadow: "0 8px 20px rgba(230,57,70,0.3)",
              }}
            >
              <i className="bi bi-wallet2"></i>
            </div>
          </div>
          <h4
            className="fw-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Add Money to Wallet
          </h4>
          <p className="text-muted mb-0">
            <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>
            Instantly add funds using secure payment gateway
          </p>
        </div>

        {/* Payment Gateway Badge */}
        <div className="d-flex justify-content-center mb-4">
          <div style={{
            background: "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid rgba(220,53,69,0.1)",
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
            <div style={{
              fontSize: "0.8rem",
              color: "#6c757d",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <i className="bi bi-shield-check-fill text-success"></i>
              <span>Powered by Razorpay</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleAddMoney}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
        >
          <div className="mb-4">
            <label className="form-label fw-semibold mb-3" style={{ fontSize: "0.95rem" }}>
              <i className="bi bi-currency-rupee me-2 text-warning"></i>
              Enter Amount (INR)
            </label>
            <div className="position-relative">
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  borderColor: "rgba(220,53,69,0.3)",
                  borderRadius: 12,
                  padding: "16px 50px 16px 20px",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e63946";
                  e.target.style.boxShadow = "0 0 0 3px rgba(230,57,70,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(220,53,69,0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#e63946",
                  opacity: 0.5,
                }}
              >
                ₹
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
              Quick Amount:
            </label>
            <div className="d-flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000].map((amt) => (
                <motion.button
                  key={amt}
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setAmount(amt.toString())}
                  style={{
                    borderRadius: 10,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    padding: "8px 16px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ₹{amt.toLocaleString()}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <motion.button
              className="btn btn-danger w-100"
              type="submit"
              disabled={loading}
              style={{
                fontWeight: 600,
                borderRadius: 12,
                padding: "14px",
                fontSize: "1rem",
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-down-circle-fill me-2"></i>
                  Add Money
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setAmount("");
                setMsg("");
              }}
              style={{
                fontWeight: 600,
                borderRadius: 12,
                padding: "14px 24px",
                fontSize: "1rem",
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <i className="bi bi-x-circle me-2"></i>
              Clear
            </motion.button>
          </div>

          {/* Message */}
          {msg && typeof msg === 'object' && msg.text && (
            <motion.div
              className="mt-3 alert d-flex align-items-center gap-2 mb-0"
              style={{
                borderRadius: 12,
                border: "none",
                background: msg.type === "success" 
                  ? "rgba(16,185,129,0.1)" 
                  : "rgba(239,68,68,0.1)",
                color: msg.type === "success" ? "#10b981" : "#ef4444",
                fontWeight: 600,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <i className={`bi ${msg.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} style={{ fontSize: 20 }}></i>
              <span>{msg.text}</span>
            </motion.div>
          )}
        </motion.form>

        {/* Security Footer */}
        <motion.div
          className="mt-4 pt-3 border-top border-light d-flex align-items-center justify-content-center gap-3 flex-wrap text-muted small"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <i className="bi bi-shield-check-fill text-success"></i>
          <span>Secure Payment</span>
          <span className="mx-2">•</span>
          <i className="bi bi-lock-fill text-info"></i>
          <span>Encrypted</span>
          <span className="mx-2">•</span>
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          <span>Instant Processing</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
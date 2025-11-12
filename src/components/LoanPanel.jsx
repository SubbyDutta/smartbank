import React, { useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

export default function Loan() {
  const token = localStorage.getItem("token");
  const username = token ? jwtDecode(token).sub : null;

  const [income, setIncome] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [creditScore, setCreditScore] = useState(null);
  const [interestRate, setInterestRate] = useState(null);
  const [totalDue, setTotalDue] = useState(null);
  const [monthlyEMI, setMonthlyEMI] = useState(null);

  const handleCheckEligibility = async () => {
    if (!income || !requestedAmount) {
      setError({ type: "error", text: "Please fill all fields." });
      return;
    }

    if (Number(requestedAmount) > Number(income) * 2) {
      setError({ type: "error", text: "Requested amount cannot exceed 2× your monthly income." });
      return;
    }

    if (!username) {
      setError({ type: "error", text: "Please log in first" });
      return;
    }

    setLoading(true);
    setError("");
    setCreditScore(null);
    setInterestRate(null);
    setTotalDue(null);
    setMonthlyEMI(null);

    try {
      const res = await API.post("/loan/check", {
        username,
        income,
        requestedAmount,
      });
      setEligibility(res.data);

    
      if (res.data.eligible) {
        const scoreRes = await API.get("/user/creditscore", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const score = scoreRes.data.creditScore;
        setCreditScore(score);

        
       let rate;

        if (score >= 850) {
          rate = 7; // Exceptional credit — best possible rate
        } else if (score >= 800) {
          rate = 10; // Excellent credit
        } else if (score >= 750) {
          rate = 14; // Very good credit
        } else if (score >= 700) {
          rate = 17; // Good but slightly risky
        } else if (score >= 650) {
          rate = 20; // Fair credit — higher risk
        } else if (score >= 600) {
          rate = 23; // Poor credit — borderline approval
        } else {
          rate = 28; // Very poor credit — near rejection zone
        }

        setInterestRate(rate);

       
        const principal = Number(requestedAmount);
        const total = principal + (principal*rate/100);
        const emi = total / 6;

        setTotalDue(total.toFixed(2));
        setMonthlyEMI(emi.toFixed(2));
      }
    } catch (err) {
      setError({ type: "error", text: err.response?.data?.message || "Error checking eligibility" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    if (!eligibility || !eligibility.id) {
      setError({ type: "error", text: "Please check eligibility first" });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await API.post(`/loan/apply/${eligibility.id}`);
      setEligibility(res.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    } catch (err) {
      setError({ type: "error", text: err.response?.data || "Error applying for loan" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Monthly Income",
      value: income,
      set: setIncome,
      type: "number",
      placeholder: "Enter monthly income",
      icon: "bi-cash-coin",
      color: "#10b981",
    },
    {
      label: "Requested Loan Amount (₹)",
      value: requestedAmount,
      set: setRequestedAmount,
      type: "number",
      placeholder: "Enter loan amount",
      icon: "bi-bank",
      color: "#f59e0b",
    },
  ];

  const panelStyle = {
    width: "100%",
    maxWidth: 800,
    borderRadius: 24,
    top: -30,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <>
      <motion.div
        className="card border-0 shadow-lg p-4 p-md-5"
        style={panelStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="mb-4 text-center">
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
                <i className="bi bi-bank"></i>
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
              Loan Application
            </h4>
            <p className="text-muted small mb-0">
              <i className="bi bi-shield-check-fill me-1 text-success"></i>
              Check your eligibility & apply instantly
            </p>
          </div>

          <div className="row g-4">
            {fields.map((field, idx) => (
              <motion.div
                className="col-md-6"
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
              >
                <label className="form-label fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
                  <i className={`bi ${field.icon} me-2`} style={{ color: field.color }}></i>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="form-control"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  style={{
                    borderColor: "rgba(220,53,69,0.2)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = field.color)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(220,53,69,0.2)")}
                />
              </motion.div>
            ))}

            <div className="col-12 mt-2">
              <div className="d-flex gap-3">
                <motion.button
                  onClick={handleCheckEligibility}
                  className="btn btn-danger px-5 py-2"
                  disabled={loading}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    fontSize: "1rem",
                    flex: 1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Checking...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clipboard-check-fill me-2"></i>
                      Check Eligibility
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => {
                    setIncome("");
                    setRequestedAmount("");
                    setEligibility(null);
                    setError("");
                    setCreditScore(null);
                    setInterestRate(null);
                    setTotalDue(null);
                    setMonthlyEMI(null);
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

            {error && typeof error === "object" && error.text && (
              <motion.div
                className="col-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="alert d-flex align-items-center gap-2"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 12,
                    color: "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: 20 }}></i>
                  <span>{error.text}</span>
                </div>
              </motion.div>
            )}

            {eligibility && (
              <motion.div
                className="col-12 mt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className="card border-0 p-4"
                  style={{
                    borderRadius: 16,
                    background: eligibility.eligible
                      ? "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.02) 100%)"
                      : "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(239,68,68,0.02) 100%)",
                    border: eligibility.eligible
                      ? "2px solid rgba(16,185,129,0.2)"
                      : "2px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: eligibility.eligible
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 24,
                        boxShadow: eligibility.eligible
                          ? "0 6px 16px rgba(16,185,129,0.3)"
                          : "0 6px 16px rgba(239,68,68,0.3)",
                      }}
                    >
                      <i
                        className={`bi ${
                          eligibility.eligible
                            ? "bi-check-circle-fill"
                            : "bi-x-circle-fill"
                        }`}
                      ></i>
                    </div>
                    <div className="ms-3">
                      <h5 className="fw-bold mb-1">
                        Status: {eligibility.eligible ? "✅ Eligible" : "❌ Not Eligible"}
                      </h5>
                      <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                        Probability: {(eligibility.probability * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {eligibility.eligible && (
                    <>
                      {creditScore && (
                        <div className="mt-3 text-center">
                          <h6 className="fw-semibold mb-2">
                            <i className="bi bi-bar-chart-fill text-info me-2"></i>
                            Credit Score: <span className="text-dark">{creditScore}</span>
                          </h6>
                          <p className="text-muted small mb-1">
                            Interest Rate: <strong>{interestRate}% p.a.</strong>
                          </p>
                          <p className="text-muted small mb-1">
                            Total Due: <strong>₹{totalDue}</strong>
                          </p>
                          <p className="text-muted small">
                            Monthly EMI (6 months): <strong>₹{monthlyEMI}</strong>
                          </p>
                        </div>
                      )}

                      <motion.button
                        onClick={handleApplyLoan}
                        className="btn btn-success w-100 mt-3"
                        disabled={loading}
                        style={{
                          fontWeight: 600,
                          borderRadius: 12,
                          padding: "14px",
                          fontSize: "1rem",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>
                            Apply for Loan
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3000,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              style={{
                background: "#fff",
                padding: "2.5rem 3rem",
                borderRadius: 24,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                maxWidth: 450,
                border: "3px solid rgba(16,185,129,0.2)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                style={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 1.5rem",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 40,
                  boxShadow: "0 12px 30px rgba(16,185,129,0.4)",
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
              </motion.div>

              <h4 className="fw-bold mb-2" style={{ color: "#1a1a1a", fontSize: "1.5rem" }}>
                Loan Application Submitted!
              </h4>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                Your application is being processed and reviewed by our team.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

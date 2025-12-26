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
      setError("Please fill all fields.");
      return;
    }

    if (Number(requestedAmount) > Number(income) * 2) {
      setError("Requested amount cannot exceed 2× your monthly income.");
      return;
    }

    if (!username) {
      setError("Please log in first.");
      return;
    }

    setLoading(true);
    setError("");
    setEligibility(null);

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
        if (score >= 850) rate = 7;
        else if (score >= 800) rate = 10;
        else if (score >= 750) rate = 14;
        else if (score >= 700) rate = 17;
        else if (score >= 650) rate = 20;
        else if (score >= 600) rate = 23;
        else rate = 28;

        setInterestRate(rate);

        const principal = Number(requestedAmount);
        const total = principal + (principal * rate) / 100;
        const emi = total / 6;

        setTotalDue(total.toFixed(2));
        setMonthlyEMI(emi.toFixed(2));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error checking eligibility"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    if (!eligibility?.id) {
      setError("Please check eligibility first.");
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
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error applying for loan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="card border-0 shadow-lg p-4 p-md-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          borderRadius: 24,
          background: "#fff",
          overflow: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
            {/* Header */}
            <div className="d-flex flex-column align-items-center mb-4">
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background:
                    "linear-gradient(180deg, #ff8b94 0%, #ff5a6a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 28,
                  marginBottom: 16,
                  boxShadow: "0 10px 20px rgba(255,90,106,0.3)",
                }}
              >
                <i className="bi bi-wallet2" />
              </div>
              <h3
                className="fw-semibold mb-1"
                style={{ fontWeight: 10, letterSpacing: 0.2,color:" #ff5a6a" }}
              >
                Loan Eligibility
              </h3>
              <p
                className="text-muted mb-0"
                style={{ fontSize: 14, maxWidth: 420, textAlign: "center" }}
              >
                Enter your monthly income and requested amount to see if you are
                eligible and preview the repayment schedule.
              </p>
            </div>

            {/* Inputs and summary */}
            <div className="row g-4">
              {/* Left: form */}
              <div className="col-lg-7">
                <div
                  className="mb-3 fw-semibold"
                  style={{ fontSize: 14, color: "#9093a8" }}
                >
                  Loan Details
                </div>

                <div className="mb-3">
                  <label
                    className="form-label mb-2"
                    style={{ fontSize: 13, fontWeight: 600, color: "#555" }}
                  >
                    Monthly Income
                  </label>
                  <div className="input-group input-group-lg">
                    <span
                      className="input-group-text border-0"
                      style={{
                        borderRadius: "16px 0 0 16px",
                        background: "#f4f5fb",
                        fontSize: 14,
                        color: "#777",
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      className="form-control border-0"
                      style={{
                        borderRadius: "0 16px 16px 0",
                        background: "#f4f5fb",
                        fontSize: 14,
                        padding: "10px 14px",
                      }}
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="e.g. 50,000"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    className="form-label mb-2"
                    style={{ fontSize: 13, fontWeight: 600, color: "#555" }}
                  >
                    Requested Loan Amount
                  </label>
                  <div className="input-group input-group-lg">
                    <span
                      className="input-group-text border-0"
                      style={{
                        borderRadius: "16px 0 0 16px",
                        background: "#f4f5fb",
                        fontSize: 14,
                        color: "#777",
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      className="form-control border-0"
                      style={{
                        borderRadius: "0 16px 16px 0",
                        background: "#f4f5fb",
                        fontSize: 14,
                        padding: "10px 14px",
                      }}
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      placeholder="e.g. 1,00,000"
                    />
                  </div>
                  <div
                    className="text-muted mt-1"
                    style={{ fontSize: 11 }}
                  >
                    Max allowed: 2× your monthly income.
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 0.99 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-danger flex-grow-1"
                    style={{
                      borderRadius: 16,
                      fontSize: 14,
                      fontWeight: 600,
                     
                      border: "none",
                    }}
                    disabled={loading}
                    onClick={handleCheckEligibility}
                  >
                    {loading ? "Checking..." : "Check Eligibility"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 0.99 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-outline-secondary"
                    style={{
                      borderRadius: 16,
                      fontSize: 13,
                      paddingInline: 18,
                    }}
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
                  >
                    Clear
                  </motion.button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-3"
                    >
                      <div
                        className="w-100"
                        style={{
                          background: "#ffe9ea",
                          borderRadius: 14,
                          padding: "10px 14px",
                          fontSize: 12,
                          color: "#c0392b",
                        }}
                      >
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: summary card (similar to “Account Summary”) */}
              <div className="col-lg-5">
                <div
                  className="shadow-sm h-100"
                  style={{
                    borderRadius: 24,
                    background: "#ffffff",
                    border: "1px solid #f1f2f7",
                    padding: "18px 18px 20px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#444",
                      }}
                    >
                      Eligibility Summary
                    </span>
                    {eligibility && (
                      <span
                        className="px-2 py-1"
                        style={{
                          fontSize: 11,
                          borderRadius: 999,
                          background: eligibility.eligible
                            ? "#e9f9f1"
                            : "#ffe9ea",
                          color: eligibility.eligible ? "#1e9e5b" : "#d63031",
                          fontWeight: 600,
                        }}
                      >
                        {eligibility.eligible ? "Approved" : "Rejected"}
                      </span>
                    )}
                  </div>

                  {!eligibility && (
                    <div
                      className="mt-3"
                      style={{ fontSize: 12, color: "#8b8fa4" }}
                    >
                      Run a check to see if this loan request can be approved
                      based on your income and credit score.
                    </div>
                  )}

                  {eligibility && (
                    <>
                      <hr className="mt-3 mb-3" />

                      <div className="mb-3">
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9397b3",
                            marginBottom: 4,
                          }}
                        >
                          Status
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: eligibility.eligible ? "#1e9e5b" : "#e74c3c",
                          }}
                        >
                          {eligibility.eligible ? "You are eligible" : "Not eligible"}
                        </div>
                      </div>

                      {eligibility.eligible && (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9a9fb5",
                                }}
                              >
                                Credit Score
                              </div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                {creditScore ?? "--"}
                              </div>
                            </div>
                            <div className="text-end">
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9a9fb5",
                                }}
                              >
                                Interest Rate
                              </div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                {interestRate != null ? `${interestRate}%` : "--"}
                              </div>
                            </div>
                          </div>

                          <div
                            className="p-3 mb-2"
                            style={{
                              borderRadius: 16,
                              background: "#f8fafc",
                            }}
                          >
                            <div className="d-flex justify-content-between mb-1">
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#9a9fb5",
                                }}
                              >
                                Total Due
                              </span>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#2f3542",
                                }}
                              >
                                {totalDue ? `₹${totalDue}` : "--"}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#9a9fb5",
                                }}
                              >
                                Monthly EMI (6 months)
                              </span>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#ff4757",
                                }}
                              >
                                {monthlyEMI ? `₹${monthlyEMI}` : "--"}
                              </span>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 0.99 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn btn-danger w-100 mt-2"
                            style={{
                              borderRadius: 16,
                              fontSize: 14,
                              fontWeight: 600,
                              background:
                                "linear-gradient(180deg,#ff6b81 0%,#ff4757 100%)",
                              border: "none",
                            }}
                            disabled={loading}
                            onClick={handleApplyLoan}
                          >
                            {loading ? "Submitting..." : "Apply for Loan"}
                          </motion.button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              background: "rgba(15,23,42,0.12)",
              backdropFilter: "blur(4px)",
              zIndex: 1050,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="shadow-sm"
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: "20px 22px 22px",
                minWidth: 320,
                maxWidth: 380,
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "#eafaf2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <i
                    className="bi bi-check-lg"
                    style={{ color: "#1e9e5b", fontSize: 20 }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#222",
                    }}
                  >
                    Loan Application Submitted
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8b8fa4",
                    }}
                  >
                    Your request is being processed.
                  </div>
                </div>
              </div>

              <button
                className="btn btn-sm btn-danger w-100 mt-2"
                style={{
                  borderRadius: 12,
                  fontSize: 13,
                  background:
                    "linear-gradient(180deg,#ff6b81 0%,#ff4757 100%)",
                  border: "none",
                }}
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

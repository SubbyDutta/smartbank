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
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto"
        style={{ maxWidth: 850 }}
      >
        <div
          className="p-5 shadow-lg"
          style={{
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="fw-bold mb-4 text-center">Loan Eligibility Checker</h3>

          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Monthly Income</label>
              <input
                type="number"
                className="form-control form-control-lg"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter monthly income"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Requested Loan Amount
              </label>
              <input
                type="number"
                className="form-control form-control-lg"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="Enter loan amount"
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-danger btn-lg flex-fill"
                onClick={handleCheckEligibility}
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Eligibility"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-outline-secondary btn-lg"
                onClick={() => {
                  setIncome("");
                  setRequestedAmount("");
                  setEligibility(null);
                  setError("");
                }}
              >
                Clear
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="col-12"
                >
                  <div className="alert alert-danger rounded-4">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {eligibility && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-12"
                >
                  <div
                    className="p-4 mt-3"
                    style={{
                      borderRadius: 24,
                      background: "#ffffff",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                  >
                    <h5 className="fw-bold">
                      Status:{" "}
                      <span
                        className={
                          eligibility.eligible
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {eligibility.eligible
                          ? "Eligible"
                          : "Not Eligible"}
                      </span>
                    </h5>

                    {eligibility.eligible && (
                      <>
                        <hr />
                        <p>Credit Score: <b>{creditScore}</b></p>
                        <p>Interest Rate: <b>{interestRate}%</b></p>
                        <p>Total Due: <b>₹{totalDue}</b></p>
                        <p>Monthly EMI: <b>₹{monthlyEMI}</b></p>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="btn btn-success btn-lg w-100 mt-3"
                          onClick={handleApplyLoan}
                          disabled={loading}
                        >
                          Apply for Loan
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ background: "rgba(0,0,0,0.7)", zIndex: 3000 }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="bg-white p-5 rounded-5 shadow-lg text-center"
            >
              <h4 className="fw-bold text-success">
                Loan Application Submitted 🎉
              </h4>
              <p className="mb-0">Your request is being processed.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

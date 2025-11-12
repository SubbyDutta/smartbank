import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import API from "../api"; 

const fmtINR = (v) =>
  typeof v === "number"
    ? v.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : v;

export default function LoanRepaymentPanel() {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [summary, setSummary] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [btnBusy, setBtnBusy] = useState(false);
  const [message, setMessage] = useState(null); 

  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get("/repay/user/approved");
        if (!mounted) return;
        setLoans(res.data || []);
       
        if ((res.data || []).length && !selectedLoanId) {
          setSelectedLoanId(String(res.data[0].id));
        }
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setMessage({ type: "error", text: "Failed to load your loans (403?)." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

 
  useEffect(() => {
    if (!selectedLoanId) {
      setSummary(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await API.get(`/repay/summary/${selectedLoanId}`);
        if (!mounted) return;
        setSummary(res.data);
        setMessage(null);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setMessage({ type: "error", text: "Failed to load loan summary." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [selectedLoanId]);

  const canPay = useMemo(() => {
    if (!summary) return false;
    return summary.remainingBalance > 0 && summary.monthsRemaining >= 0;
  }, [summary]);

  const payEmiAmount = useMemo(() => {
    if (!summary) return 0;
  
    return Math.min(summary.monthlyEmi, summary.remainingBalance);
  }, [summary]);

  const payFullAmount = summary?.remainingBalance ?? 0;

  const confirmAndPay = async (amount, label) => {
    if (!summary?.loanId) return;
    const human = fmtINR(amount);
    const ok = window.confirm(`Confirm ${label} of ${human}?`);
    if (!ok) return;

    try {
      setBtnBusy(true);
      const res = await API.post(`/repay/repay/${summary.loanId}`, { amount });
      
      const [sumRes, loansRes] = await Promise.all([
        API.get(`/repay/summary/${summary.loanId}`),
        API.get("/repay/user/approved"),
      ]);
      setSummary(sumRes.data);
      setLoans(loansRes.data || []);
      setMessage({
        type: "success",
        text: `Payment successful. Remaining: ${fmtINR(sumRes.data.remainingBalance)}.`,
      });
    } catch (err) {
      console.error(err);
      const apiMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Payment failed.";
      setMessage({ type: "error", text: apiMsg });
    } finally {
      setBtnBusy(false);
    }
  };

  const handlePayEmi = () => {
    if (!summary) return;
    confirmAndPay(payEmiAmount, "EMI payment");
  };

  const handlePayFull = () => {
    if (!summary) return;
    confirmAndPay(payFullAmount, "FULL payment");
  };

  
  const panelStyle = {
    width: 800,
    borderRadius: 24,
    top: -30,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
        
        }}
      />

      {/* header */}
      <div className="mb-4 text-center">
        <div className="d-inline-block mb-3">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              boxShadow: "0 8px 20px rgba(230,57,70,0.3)",
            }}
          >
            <i className="bi bi-cash-stack" />
          </div>
        </div>
        <h4
          className="fw-bold mb-2"
          style={{
            background:
              "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Loan Repayment
        </h4>
        <p className="text-muted small mb-0">
          Pick a loan, review its schedule, and pay either **EMI** or **FULL**.
        </p>
      </div>

      {/* loan selector */}
      <div
        className="card border-0 mb-4 p-3"
        style={{
          borderRadius: 16,
          background: "#ffffff",
          border: "1px solid rgba(220,53,69,0.12)",
        }}
      >
        <label className="form-label fw-semibold mb-2">
          Choose Loan
        </label>
        <select
          className="form-select"
          value={selectedLoanId}
          onChange={(e) => setSelectedLoanId(e.target.value)}
          style={{ borderRadius: 12 }}
          disabled={loading || loans.length === 0}
        >
          {loans.length === 0 && <option value="">No approved loans</option>}
          {loans.map((ln) => (
            <option key={ln.id} value={ln.id}>
              {`Loan #${ln.id} — ${fmtINR(ln.amount)} — ${ln.status}`}
            </option>
          ))}
        </select>
      </div>

      {/* summary */}
      <div
        className="card border-0 mb-4"
        style={{
          borderRadius: 20,
          background: "#ffffff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          border: "1px solid rgba(220,53,69,0.1)",
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-receipt-cutoff me-2 text-danger" style={{ fontSize: 20 }} />
            <h5 className="fw-bold mb-0">Repayment Summary</h5>
          </div>

          {!summary ? (
            <div className="text-muted">Select a loan to view details.</div>
          ) : (
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="small text-muted">Total Amount</div>
                <div className="fw-bold">{fmtINR(summary.totalAmount)}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="small text-muted">Remaining</div>
                <div className="fw-bold text-success">{fmtINR(summary.remainingBalance)}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="small text-muted">Monthly EMI</div>
                <div className="fw-bold">{fmtINR(summary.monthlyEmi)}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="small text-muted">Next Due</div>
                <div className="fw-bold">
                  {summary.nextDueDate
                    ? new Date(summary.nextDueDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="small text-muted">Months Remaining</div>
                <div className="fw-bold">
                  {summary.monthsRemaining}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* pay actions */}
        <div
          className="p-3 d-flex flex-column flex-md-row gap-2 border-top"
          style={{ background: "#fff6f6", borderRadius: "0 0 20px 20px" }}
        >
          <button
            className="btn btn-danger flex-fill"
            disabled={!canPay || btnBusy || !summary}
            onClick={handlePayEmi}
            style={{ borderRadius: 12, fontWeight: 600 }}
            title="Pay this month's EMI"
          >
            <i className="bi bi-calendar2-check me-2" />
            Pay EMI {summary ? `(${fmtINR(payEmiAmount)})` : ""}
          </button>

          <button
            className="btn btn-outline-danger flex-fill"
            disabled={!canPay || btnBusy || !summary}
            onClick={handlePayFull}
            style={{ borderRadius: 12, fontWeight: 600, borderWidth: 2 }}
            title="Close this loan now"
          >
            <i className="bi bi-check2-circle me-2" />
            Pay Full {summary ? `(${fmtINR(payFullAmount)})` : ""}
          </button>
        </div>
      </div>

      {/* feedback */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert mt-2"
          style={{
            borderRadius: 12,
            border: "none",
            background:
              message.type === "success"
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
            color: message.type === "success" ? "#0f766e" : "#b91c1c",
            fontWeight: 600,
          }}
        >
          {message.text}
        </motion.div>
      )}
    </motion.div>
  );
}

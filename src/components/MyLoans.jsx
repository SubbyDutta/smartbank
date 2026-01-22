import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { v4 as uuidv4 } from "uuid";

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
  const [history, setHistory] = useState([]);

  // 🔒 PAYMENT LOCK — prevents double deduction
  const payLock = useRef(false);

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

    // Fetch History
    (async () => {
      try {
        const hRes = await API.get("/loan/loans/myuserloan");
        if (mounted) setHistory(hRes.data || []);
      } catch (e) {
        console.error("Failed to load loan history", e);
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

    // 🔒 BLOCK DUPLICATE EXECUTION
    if (payLock.current) return;
    payLock.current = true;

    const human = fmtINR(amount);
    const ok = window.confirm(`Confirm ${label} of ${human}?`);
    if (!ok) {
      payLock.current = false;
      return;
    }

    try {
      setBtnBusy(true);

      const idempotencyKey = uuidv4();

      await API.post(
        `/repay/repay/${summary.loanId}`,
        { amount },
        {
          headers: {
            "idempotency-Key": idempotencyKey,
          },
        }
      );

      const [sumRes, loansRes] = await Promise.all([
        API.get(`/repay/summary/${summary.loanId}`),
        API.get("/repay/user/approved"),
      ]);

      setSummary(sumRes.data);
      setLoans(loansRes.data || []);
      setMessage({
        type: "success",
        text: `Payment successful. Remaining: ${fmtINR(
          sumRes.data.remainingBalance
        )}.`,
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
      payLock.current = false; // 🔓 unlock
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
    width: "100%",
    borderRadius: 20,
    background: "var(--bg-primary)",
    overflow: "auto",
    boxShadow: "var(--shadow-xl)",
    minHeight: 600,
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* 🔹 EVERYTHING BELOW IS 100% UNCHANGED 🔹 */}

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

      <div className="mb-4 text-center">
        <div className="d-inline-block mb-3">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--color-black)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-inverse)",
              fontSize: 28,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <i className="bi bi-cash-stack" />
          </div>
        </div>
        <h4 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Loan Repayment
        </h4>
        <p className="text-muted small mb-0">
          Pick a loan, review its schedule, and pay either **EMI** or **FULL**.
        </p>
      </div>


      <div
        className="card border-0 mb-4 p-3"
        style={{
          borderRadius: 16,
          background: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
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


      <div
        className="card border-0 mb-4"
        style={{
          borderRadius: 20,
          background: "var(--bg-primary)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-receipt-cutoff me-2" style={{ fontSize: 20, color: "var(--text-primary)" }} />
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


        <div
          className="p-3 d-flex flex-column flex-md-row gap-2 border-top"
          style={{ background: "var(--bg-secondary)", borderRadius: "0 0 20px 20px" }}
        >
          <button
            className="btn btn-dark flex-fill"
            disabled={!canPay || btnBusy || !summary}
            onClick={handlePayEmi}
            style={{ borderRadius: 12, fontWeight: 600, background: 'var(--color-black)' }}
            title="Pay this month's EMI"
          >
            <i className="bi bi-calendar2-check me-2" />
            Pay EMI {summary ? `(${fmtINR(payEmiAmount)})` : ""}
          </button>

          <button
            className="btn btn-outline-dark flex-fill"
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


      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert"
          style={{
            borderRadius: 12,
            border: "none",
            background:
              message.type === "success"
                ? "var(--bg-success-light)"
                : "var(--bg-error-light)",
            color: message.type === "success" ? "var(--color-success)" : "var(--color-error)",
            fontWeight: 600,
          }}
        >
          {message.text}
        </motion.div>
      )}

      {/* Loan History Section */}
      <div
        className="mt-5 pt-4"
        style={{ borderTop: "1px solid var(--border-light)" }}
      >
        <div className="d-flex align-items-center mb-4">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <i className="bi bi-clock-history" style={{ color: "var(--text-primary)" }} />
          </div>
          <h5 className="fw-bold mb-0">My Loan History</h5>
        </div>

        {history.length === 0 ? (
          <div
            className="p-5 text-center text-muted"
            style={{
              background: "var(--bg-secondary)",
              borderRadius: 20,
              border: "2px dashed var(--border-light)",
            }}
          >
            No loan history found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ minWidth: 600 }}>
              <thead>
                <tr className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: 0.5 }}>
                  <th className="pb-3">Loan ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">EMI</th>
                  <th className="pb-3">Remaining</th>
                  <th className="pb-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <motion.tr
                    key={h.id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    transition={{ duration: 0.1 }}
                  >
                    <td className="py-3 fw-semibold text-muted">#{h.id}</td>
                    <td className="py-3 fw-bold">{fmtINR(h.amount)}</td>
                    <td className="py-3">
                      <span
                        className={`badge rounded-pill px-3 py-2 ${h.status === "APPROVED"
                          ? "bg-success-subtle text-success"
                          : h.status === "REJECTED"
                            ? "bg-danger-subtle text-danger"
                            : "bg-warning-subtle text-warning"
                          }`}
                        style={{ fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3">{fmtINR(h.monthlyEmi)}</td>
                    <td className="py-3 fw-bold text-success">{fmtINR(h.due_amount)}</td>
                    <td className="py-3 small text-muted">
                      {h.nextDueDate ? new Date(h.nextDueDate).toLocaleDateString() : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
import React, { useEffect, useState } from "react";
import LoadingInline from "./LoadingInLine";
import { motion } from "framer-motion";

const PAGE_SIZE = 20;
const VISIBLE_ROWS = 4;

export default function TransactionsPanel({ transactions, loading, onReload }) {
  const [page, setPage] = useState(0);
  const [lastFetchedCount, setLastFetchedCount] = useState(0);

  
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  
  useEffect(() => {
    if (onReload) {
      onReload({
        page,
        size: PAGE_SIZE,
        from: from || undefined,
        to: to || undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      });
    }
  }, [page]);

  
  useEffect(() => {
    setLastFetchedCount(transactions?.length || 0);
  }, [transactions]);

  const hasPrev = page > 0;
  const hasNext = lastFetchedCount === PAGE_SIZE;

  
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.06, boxShadow: "0 8px 20px rgba(230,57,70,0.35)" },
    tap: { scale: 0.95 },
  };

  const panelStyle = {
    width: "100%",
    maxWidth: 850,
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fb 100%)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    position: "relative",
    overflow: "hidden",
     top: 10,
    position: "fixed",
    height:700,
  };

  const handleReloadClick = () => {
    if (onReload) {
      setPage(0);
      onReload({
        page: 0,
        size: PAGE_SIZE,
        from: from || undefined,
        to: to || undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      });
    }
  };

  const applyFilters = () => {
    setPage(0);
    onReload({
      page: 0,
      size: 20,
      from: from || undefined,
      to: to || undefined,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
    });
  };

  const showAll = () => {
    setFrom("");
    setTo("");
    setMinAmount("");
    setMaxAmount("");
    setPage(0);
    onReload({ page: 0, size: PAGE_SIZE });
  };

  const handlePrev = () => {
    if (hasPrev && !loading) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasNext && !loading) setPage((p) => p + 1);
  };

  return (
    <motion.div
      className="p-4 p-md-5"
      style={panelStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <div
        className="mb-4 p-3"
        style={{
          borderRadius: 16,
          background: "rgba(230,57,70,0.05)",
          border: "1px solid rgba(230,57,70,0.15)",
        }}
      >
        <div className="d-flex flex-wrap gap-3">

          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ maxWidth: 180 }}
          />

          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ maxWidth: 180 }}
          />

          <input
            type="number"
            className="form-control"
            placeholder="Min ₹"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            style={{ maxWidth: 120 }}
          />

          <input
            type="number"
            className="form-control"
            placeholder="Max ₹"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            style={{ maxWidth: 120 }}
          />

         
          <motion.button
            className="btn text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #ff4d6d, #e63946)",
              borderRadius: 12,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={applyFilters}
          >
            <i className="bi bi-search me-1"></i>
            Filter
          </motion.button>

         
          <motion.button
            className="btn fw-bold"
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(230,57,70,0.25)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showAll}
          >
            Show All
          </motion.button>
        </div>
      </div>

      
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #ff4d6d, #e63946)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              boxShadow: "0 6px 14px rgba(230,57,70,0.3)",
            }}
          >
            <i className="bi bi-clock-history"></i>
          </div>
          <div>
            <h4
              className="fw-bold mb-1"
              style={{
                background: "linear-gradient(135deg, #ff4d6d, #e63946)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Transaction History
            </h4>
            <p className="text-muted small mb-0">
              <i className="bi bi-activity me-1"></i>
              View your transaction records
            </p>
          </div>
        </div>

        <motion.button
          className="btn fw-bold text-white border-0 px-4 py-2"
          onClick={handleReloadClick}
          style={{
            borderRadius: 12,
            fontSize: "0.9rem",
            background: "linear-gradient(135deg, #ff4d6d, #e63946)",
            boxShadow: "0 4px 12px rgba(230,57,70,0.3)",
          }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Reloading..." : "Reload"}
        </motion.button>
      </div>

     
      {loading ? (
        <div className="text-center py-5">
          <LoadingInline text="Loading transactions..." />
        </div>
      ) : transactions && transactions.length ? (
       <div
  style={{
    maxHeight: VISIBLE_ROWS * 60 + 60,
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'block',
    borderRadius: 16,
    border: '1px solid rgba(230,57,70,0.1)',
    background: '#fff',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)',
  }}
>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #ff4d6d, #e63946)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                }}
              >
                {[
                  { label: "Timestamp", icon: "bi-clock-fill" },
                  { label: "From", icon: "bi-person-fill" },
                  { label: "To", icon: "bi-person-plus-fill" },
                  { label: "Amount", icon: "bi-currency-rupee" },
                  { label: "Type", icon: "bi-globe" },
                ].map((h) => (
                  <th
                    key={h.label}
                  style={{
                    padding: '14px 16px',
                    fontWeight: 600,
                    textAlign: 'left',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                    letterSpacing: '0.4px',
                    background: 'linear-gradient(135deg, #ff4d6d, #e63946)',
                  }}
                  >
                    <i className={`bi ${h.icon} me-1`}></i>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <motion.tr
                  key={i}
                  variants={rowVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    background: "rgba(255,77,109,0.05)",
                    transition: { duration: 0.2 },
                  }}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                >
                 
                  <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
                    <div className="d-flex align-items-center gap-2 text-dark">
                      <i className="bi bi-calendar3 text-muted"></i>
                      {t.timestamp
                        ? new Date(t.timestamp).toLocaleString()
                        : "—"}
                    </div>
                  </td>

                  
                  <td style={{ padding: "12px 16px" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background:
                            "linear-gradient(135deg, #ff4d6d, #e63946)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {String(t.senderAccount || t.from || "—")[0]}
                      </span>
                      <span className="text-muted">
                        {t.senderAccount || t.from || "—"}
                      </span>
                    </div>
                  </td>

                 
                  <td style={{ padding: "12px 16px" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background:
                            "linear-gradient(135deg, #10b981, #059669)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {String(t.receiverAccount || t.to || "—")[0]}
                      </span>
                      <span className="text-muted">
                        {t.receiverAccount || t.to || "—"}
                      </span>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    <span
                      style={{
                        color: "#28a745",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <i className="bi bi-currency-rupee"></i>
                      {typeof t.amount === "number"
                        ? t.amount.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })
                        : t.amount}
                    </span>
                  </td>

                  {/* TYPE */}
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: t.isForeign
                          ? "rgba(59,130,246,0.1)"
                          : "rgba(16,185,129,0.1)",
                        color: t.isForeign ? "#3b82f6" : "#10b981",
                      }}
                    >
                      <i
                        className={`bi ${
                          t.isForeign ? "bi-globe" : "bi-house-fill"
                        }`}
                      ></i>
                      {t.isForeign ? "Foreign" : "Domestic"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          className="text-center py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            borderRadius: 16,
            background: "#f8f9fa",
            border: "2px dashed rgba(230,57,70,0.2)",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "rgba(230,57,70,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#e63946",
            }}
          >
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="fw-bold text-muted mb-2">No Transactions Found</h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Your transaction history will appear here
          </p>
        </motion.div>
      )}

     
      {transactions && transactions.length > 0 && (
        <motion.div
          className="mt-4 pt-3 border-top border-light text-muted small"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-info-circle-fill text-danger"></i>
              <span>
                Total Records on this page:{" "}
                <strong>{transactions.length}</strong>
              </span>
              <span className="mx-2">•</span>
              <i className="bi bi-shield-check-fill text-success"></i>
              <span>All transactions verified</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span>
                Page <strong>{page + 1}</strong>
              </span>

              {/* Prev */}
              <motion.button
                className="btn btn-sm px-3 py-1 text-white border-0"
                style={{
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #ff4d6d, #e63946)",
                  opacity: hasPrev ? 1 : 0.5,
                }}
                variants={buttonVariants}
                whileHover={hasPrev ? "hover" : undefined}
                whileTap={hasPrev ? "tap" : undefined}
                onClick={handlePrev}
                disabled={!hasPrev}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Prev
              </motion.button>

              
              <motion.button
                className="btn btn-sm px-3 py-1 text-white border-0"
                style={{
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #ff4d6d, #e63946)",
                  opacity: hasNext ? 1 : 0.5,
                }}
                variants={buttonVariants}
                whileHover={hasNext ? "hover" : undefined}
                whileTap={hasNext ? "tap" : undefined}
                onClick={handleNext}
                disabled={!hasNext}
              >
                Next <i className="bi bi-chevron-right ms-1"></i>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

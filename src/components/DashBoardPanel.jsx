import React, { useState } from "react";
import AddMoney from "./AddMoney";
import { motion } from "framer-motion";

export default function DashboardPanel({ active, setActive, onAddMoneySuccess }) {
  const [stats] = useState([
    { label: "Active Users", value: "5.2M+", icon: "bi-people-fill", color: "#3b82f6" },
    { label: "Transactions/Day", value: "12.5M+", icon: "bi-graph-up-arrow", color: "#10b981" },
    { label: "Security Score", value: "99.9%", icon: "bi-shield-check", color: "#ef4444" },
  ]);

  const [features] = useState([
    {
      title: "Instant Transfers",
      desc: "Send money securely and instantly to any account in our network.",
      icon: "bi-lightning-charge-fill",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    },
    {
      title: "Add Funds",
      desc: "Top up your account in seconds with Razorpay or UPI.",
      icon: "bi-wallet2",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    },
    {
      title: "Loan Management",
      desc: "Check eligibility, apply for loans, and manage repayments easily.",
      icon: "bi-file-earmark-text-fill",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    },
    {
      title: "Transaction History",
      desc: "View all your deposits, withdrawals, and transfers in one place.",
      icon: "bi-clock-history",
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    },
    {
      title: "Security & Fraud Detection",
      desc: "Your safety is our priority — advanced monitoring for every transaction.",
      icon: "bi-shield-check-fill",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
    },
    {
      title: "Bill Payments",
      desc: "Pay utilities, subscriptions, and bills with seamless integration.",
      icon: "bi-receipt-cutoff",
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
    },
  ]);

  
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const serviceCardStyle = {
    minWidth: 220,
    maxWidth: 220,
    scrollSnapAlign: "start",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    borderRadius: 16,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(220,53,69,0.08)",
    overflow: "hidden",
  };

  const panelStyle = {
   width: 900,
    borderRadius: 24,
    top:-30,
    
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="panel card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
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
          inset: 0,
          opacity: 0.03,
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom border-light">
          <div className="mb-3 mb-md-0">
            <h4
              className="fw-bold mb-2"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Quick Actions
            </h4>
            <p className="text-muted small mb-0" style={{ fontSize: "0.9rem" }}>
              <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>
              Common tasks at a glance
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 flex-wrap">
            <motion.button
              className="btn btn-danger px-4 py-2"
              onClick={() => setActive("transfer")}
              style={{ 
                fontWeight: 600,
                borderRadius: 12,
                letterSpacing: "0.3px",
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <i className="bi bi-arrow-left-right me-2"></i>
              Transfer
            </motion.button>

            <motion.button
              className="btn btn-outline-danger px-4 py-2"
              onClick={() => setActive("addMoney")}
              style={{ 
                fontWeight: 600,
                borderRadius: 12,
                letterSpacing: "0.3px",
                borderWidth: 2,
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <i className="bi bi-wallet2 me-2"></i>
              Add Money
            </motion.button>
          </div>
        </div>

        {/* Add Money Panel */}
        {active === "addMoney" && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: { duration: 0.4, ease: "easeOut" } 
            }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AddMoney onSuccess={onAddMoneySuccess} />
          </motion.div>
        )}

     
        <motion.div
          className="mb-5 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } }}
        >
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              >
                <div className="mb-3">
                  <span
                    className="badge px-3 py-2"
                    style={{
                      background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-star-fill me-1"></i>
                    Trusted by 5M+ Users
                  </span>
                </div>
                
                <h2
                  className="fw-bold mb-3"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  All-in-One Digital Banking
                </h2>
                
                <p
                  className="text-muted"
                  style={{ 
                    maxWidth: "500px",
                    fontSize: "1.15rem",
                    lineHeight: 1.7,
                  }}
                >
                  Manage your finances with ease — from deposits and transfers to loans and repayments, 
                  all in one seamless dashboard.
                </p>

                <div className="mt-4 d-flex gap-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: "50%", 
                      background: "#10b981",
                      animation: "pulse 2s infinite"
                    }}></div>
                    <small className="text-muted">Live System</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check-fill text-success"></i>
                    <small className="text-muted">Bank-Grade Security</small>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.4 } }}
                className="position-relative"
                style={{
                  background: "linear-gradient(135deg, rgba(255,107,129,0.05) 0%, rgba(230,57,70,0.05) 100%)",
                  borderRadius: 24,
                  padding: "2rem",
                  border: "1px solid rgba(220,53,69,0.1)",
                }}
              >
                {/* Banking Features Mockup */}
                <div className="d-flex gap-3 justify-content-center align-items-center flex-wrap">
                  {[
                    { icon: "bi-wallet2", label: "Digital Wallet", color: "#ff6b81" },
                    { icon: "bi-credit-card-2-front-fill", label: "Card", color: "#3b82f6" },
                    { icon: "bi-graph-up-arrow", label: "Analytics", color: "#10b981" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="card border-0 shadow-sm"
                      style={{
                        width: 120,
                        height: 70,
                        background: i === 1 ? "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)" : "#fff",
                        borderRadius: 14,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: "pointer",
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: i === 1 ? 5 : -5,
                        zIndex: 10,
                        boxShadow: `0 8px 20px ${item.color}40`,
                      }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <i 
                        className={`bi ${item.icon}`}
                        style={{ 
                          fontSize: 24,
                          color: i === 1 ? "#fff" : item.color,
                        }}
                      />
                      <span 
                        style={{ 
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: i === 1 ? "#fff" : "#212529",
                        }}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Floating transaction icons */}
                <motion.div
                  className="position-absolute"
                  style={{ top: 20, right: 20 }}
                  animate={{ 
                    y: [0, -10, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <div style={{
                    background: "rgba(245,158,11,0.1)",
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <i className="bi bi-lightning-charge-fill" style={{ fontSize: 28, color: "#f59e0b" }}></i>
                  </div>
                </motion.div>
                
                <motion.div
                  className="position-absolute"
                  style={{ bottom: 20, left: 20 }}
                  animate={{ 
                    y: [0, 10, 0],
                    transition: { duration: 2, repeat: Infinity, delay: 0.5 }
                  }}
                >
                  <div style={{
                    background: "rgba(16,185,129,0.1)",
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <i className="bi bi-graph-up-arrow" style={{ fontSize: 28, color: "#10b981" }}></i>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}
        >
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="card border-0 p-3"
                style={{
                  flex: "1",
                  minWidth: "150px",
                  maxWidth: "250px",
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: `1px solid ${stat.color}20`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 8px 20px ${stat.color}30`,
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 20,
                    }}
                  >
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#212529" }}>
                      {stat.value}
                    </div>
                    <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Section */}
        <div className="mt-5 pt-3">
          <div className="d-flex align-items-center mb-4">
            <h5 className="fw-bold mb-0 me-3">
              <span
                style={{
                  background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Our Services
              </span>
            </h5>
            <div 
              style={{ 
                flex: 1, 
                height: 2, 
                background: "linear-gradient(90deg, #ff6b81, transparent)",
                borderRadius: 2 
              }} 
            />
          </div>
          
          <div
            className="d-flex flex-row overflow-auto pb-3"
            style={{
              gap: "1.5rem",
              scrollSnapType: "x mandatory",
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="card flex-shrink-0 text-center p-4 border-0"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={serviceCardStyle}
                whileHover={{
                  translateY: -8,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  borderColor: feature.color,
                }}
              >
                {/* Icon Background with Gradient */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 1rem",
                    background: feature.gradient,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${feature.color}40`,
                  }}
                >
                  <i 
                    className={`bi ${feature.icon}`}
                    style={{ 
                      fontSize: 32,
                      color: "#fff",
                    }} 
                  />
                </div>
                
                <h6 
                  className="fw-bold mb-2"
                  style={{
                    color: "#212529",
                    fontSize: "1rem",
                  }}
                >
                  {feature.title}
                </h6>
                <p 
                  className="text-muted"
                  style={{ 
                    fontSize: "0.85rem", 
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-arrows-horizontal me-1"></i>
              Scroll to view all services
            </small>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-5 pt-4 border-top border-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.3 } }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
            <i className="bi bi-shield-check-fill text-danger"></i>
            <span>Secure & Protected</span>
            <span className="mx-2">•</span>
            <i className="bi bi-clock-fill"></i>
            <span>24/7 Available</span>
            <span className="mx-2">•</span>
            <i className="bi bi-headset"></i>
            <span>Expert Support</span>
          </div>
          <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.8rem" }}>
            © 2025 SecureBank — Empowering Your Digital Finance Journey
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
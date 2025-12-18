import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle } from "lucide-react";
import API from "../api";
import "../styles/auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
    creditScore: "",
  });
  const [noCredit, setNoCredit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!noCredit && !form.creditScore) {
      setError("Please enter your credit score or check 'No credit score'");
      return;
    }

    try {
      const payload = { ...form };
      if (noCredit) payload.creditScore = "0";

      const res = await API.post("/auth/signup", payload);

      if (typeof res.data === "string" && res.data.includes("already exists")) {
        setError(res.data);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false); 
          navigate("/login"); 
        }, 2000); 
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="auth-container"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        gridTemplateColumns: "1.1fr 0.9fr",
        overflow: "hidden",
      }}
    >
      
      <motion.div
        className="auth-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div className="auth-left-content" style={{ maxWidth: 280 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <UserPlus size={32} />
          </motion.div>

          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Join SecureBank</h1>
          <p style={{ fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.3 }}>
            Secure banking with fraud protection.
          </p>

          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/2436/2436826.png"
            alt="Banking"
            style={{ width: 140, height: 140 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          />
        </div>
      </motion.div>

     
      <motion.div
        className="auth-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <div
          className="auth-card"
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "1.25rem",
            borderRadius: 14,
            maxHeight: "95vh",
            overflow: "hidden",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.4rem" }}>Create Account</h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", opacity: 0.75 }}>
              Quick signup
            </p>
          </div>

          {error && (
            <motion.div
              className="alert alert-error"
              style={{ marginBottom: "0.75rem", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => updateForm("username", e.target.value)}
                  required
                  style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="email@ex.com"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  required
                  style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
                />
              </div>
            </div>

            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Mobile</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="1234567890"
                  value={form.mobile}
                  onChange={(e) => updateForm("mobile", e.target.value)}
                  required
                  style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Credit Score</label>
                <input
                  type="number"
                  className="form-input"
                 
                  value={form.creditScore}
                  onChange={(e) => updateForm("creditScore", e.target.value)}
                  disabled={noCredit}
                  style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
                />
              </div>
            </div>

           
            <div>
              <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                value={form.password}
                onChange={(e) => updateForm("password", e.target.value)}
                required
                style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" }}>Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={(e) => updateForm("confirmPassword", e.target.value)}
                required
                style={{ padding: "0.5rem 0.6rem", fontSize: "0.88rem" }}
              />
            </div>

           
            <label style={{ 
              fontSize: "0.8rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.4rem",
              opacity: noCredit ? 0.6 : 1,
              marginBottom: "0.75rem"
            }}>
              <input
                type="checkbox"
                checked={noCredit}
                onChange={(e) => setNoCredit(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              No credit score yet
            </label>

            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: "0.65rem", 
                fontSize: "0.95rem",
                borderRadius: 10,
              
              }}
            >
              Create Account
            </motion.button>
          </form>

          <div  className="auth-footer">
            Already have account? <a href="/login" style={{ color: "#f63b3bff" }}>Sign In</a>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div
            className="success-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle size={36} />
              </motion.div>
              <h4 style={{ margin: "0.5rem 0" }}>Success!</h4>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Redirecting to login...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

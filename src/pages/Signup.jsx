
import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [creditScore, setCreditScore] = useState("");
const [noCredit, setNoCredit] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
    creditScore: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .signup-container {
        display: flex;
        height: 100vh;
        overflow: hidden;
        font-family: "Poppins", sans-serif;
      }

      /* LEFT SIDE */
      .signup-left {
        flex: 1;
        background: linear-gradient(135deg, #eb2525ff, #ff6b81);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2rem;
      }

      .signup-left h1 {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .signup-left p {
        max-width: 420px;
        font-size: 1rem;
        opacity: 0.9;
      }

      .signup-left img {
        width: 280px;
        margin-top: 2rem;
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      /* RIGHT SIDE */
      .signup-right {
        flex: 1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .signup-card {
        width: 400px;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.15);
        animation: fadeUp 0.6s ease-in-out;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .signup-card h3 {
        text-align: center;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .signup-card p {
        text-align: center;
        color: #888;
        margin-bottom: 1.5rem;
      }

      .input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid #ddd;
        outline: none;
        transition: 0.2s ease;
      }

      .input:focus {
        border-color: #eb2525ff;
        box-shadow: 0 0 0 0.15rem rgba(235, 37, 37, 0.25);
      }

      .primary {
        background: linear-gradient(90deg, #ff6b81, #e63946);
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        transition: 0.3s ease;
      }

      .primary:hover {
        transform: translateY(-2px);
        filter: brightness(1.05);
      }

      .error-text {
        color: #e63946;
        text-align: center;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .small-muted {
        text-align: center;
        font-size: 0.9rem;
        margin-top: 10px;
      }

      .small-muted a {
        color: #e63946;
        font-weight: 600;
        text-decoration: none;
      }

      /* RESPONSIVE */
      @media (max-width: 850px) {
        .signup-container {
          flex-direction: column;
        }

        .signup-left {
          height: 40vh;
        }

        .signup-left img {
          width: 200px;
        }

        .signup-right {
          height: 60vh;
        }

        .signup-card {
          width: 90%;
          margin: 0 auto;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        username: form.username,
        password: form.password,
        email: form.email,
        mobile: form.mobile,
        creditScore: noCredit ? null : creditScore,
        
      });

      const message = res.data;
      if (message.includes("already exists")) {
        setError(message);
      } else {
        setSuccessMsg("🎉 Signup Successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT SIDE */}
      <div className="signup-left">
        <h1>Join Smart Bank Today</h1>
        <p>
          Take control of your finances with Smart Bank’s smart banking.  
          Create your account and start your digital journey today.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2436/2436826.png"
          alt="Bank illustration"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="signup-right">
        <motion.div
          className="signup-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Create Account</h3>
          <p>Sign up to access your Smart Bank dashboard</p>

          {error && <div className="error-text">{error}</div>}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              className="input"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="input"
              type="tel"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
         

              {/* ⭐ Credit Score Section */}
              <div className="d-flex flex-column gap-2 mt-2">
                <input
                  className="input"
                  type="number"
                  placeholder="Credit Score (300 - 900)"
                  value={creditScore}
                  disabled={noCredit}
                  min="300"
                  max="900"
                  onChange={(e) => setCreditScore(e.target.value)}
                />

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#444" }}>
                  <input
                    type="checkbox"
                    checked={noCredit}
                    onChange={() => {
                      setNoCredit(!noCredit);
                      if (!noCredit) setCreditScore(""); // clear when checked
                    }}
                  />
                  I don’t have a credit score yet
                </label>
              </div>


            <motion.button
              type="submit"
              className="primary mt-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </form>

          <div className="small-muted">
            Already have an account? <a href="/login">Login</a>
          </div>
        </motion.div>
      </div>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255, 200, 200, 0.5)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                background: "white",
                borderRadius: "18px",
                border: "2px solid #ffb3b3",
                boxShadow: "0 12px 30px rgba(255, 0, 0, 0.25)",
                padding: "30px 50px",
                textAlign: "center",
                color: "#a60000",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 120, damping: 8 }}
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  background: "#ffcccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 0 25px rgba(255,0,0,0.3)",
                  margin: "0 auto 12px",
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: "28px" }}
                >
                  ✅
                </motion.span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontWeight: 600, fontSize: "16px", color: "#a60000" }}
              >
                {successMsg}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;

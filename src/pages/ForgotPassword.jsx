
import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .login-bg {
        background: linear-gradient(135deg, #ffe5e5, #ffb3b3);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        animation: fadeInBg 1s ease-in-out;
      }

      @keyframes fadeInBg {
        from { opacity: 0; transform: scale(1.02); }
        to { opacity: 1; transform: scale(1); }
      }

      .card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        border: none;
        border-radius: 18px;
        box-shadow: 0 8px 30px rgba(255, 0, 0, 0.15);
        animation: fadeUp 0.5s ease-in-out;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(25px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .btn-primary {
        background: linear-gradient(90deg, #ff4d4d, #d90429);
        border: none;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        background: linear-gradient(90deg, #d90429, #ff4d4d);
        transform: translateY(-2px);
      }

      .btn-outline-light {
        border: 1.5px solid #ff4d4d;
        color: #d90429;
        background: white;
        transition: all 0.3s ease;
      }

      .btn-outline-light:hover {
        background: linear-gradient(90deg, #ff4d4d, #d90429);
        color: white;
      }

      .form-control {
        border-radius: 10px;
        border: 1px solid #ddd;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        border-color: #d90429;
        box-shadow: 0 0 0 0.2rem rgba(217, 4, 41, 0.2);
      }

      .alert {
        border-radius: 10px;
        font-size: 0.9rem;
      }

      @media (max-width: 500px) {
        .card {
          width: 90% !important;
          padding: 20px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!email || !validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setSending(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setMessage({
        type: "success",
        text: "✅ OTP sent! Check your inbox.",
      });
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1800);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to send OTP. Try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="card p-4" style={{ width: 420 }}>
        <h4 className="mb-3 text-center fw-semibold text-danger">
          Forgot Password
        </h4>

        {message && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-danger" : "alert-success"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">
              Registered Email
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending OTP..." : "Send OTP"}
            </button>
            <button
              type="button"
              className="btn btn-outline-light w-100"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-decoration-none fw-semibold text-danger"
            >
              Log in
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

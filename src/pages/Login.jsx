import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        margin: 0;
        font-family: "Poppins", sans-serif;
      }

      .login-container {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }

      /* Left Section */
      .login-left {
        flex: 1;
        background: linear-gradient(135deg, #eb2525ff, #ff6b81);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: center;
      }

      .login-left h1 {
        font-size: 2.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .login-left p {
        font-size: 1rem;
        opacity: 0.9;
        max-width: 420px;
      }

      .login-left img {
        width: 280px;
        margin-top: 2rem;
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      /* Right Section */
      .login-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
      }

      .card {
        width: 380px;
        background: rgba(255, 255, 255, 0.95);
        border: none;
        border-radius: 16px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        animation: fadeUp 0.6s ease-in-out;
      }

      @keyframes fadeUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .btn-primary {
        background: linear-gradient(90deg, #ff6b81, #e63946);
        border: none;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        filter: brightness(1.05);
      }

      .btn-outline-light {
        background: white;
        border: 1px solid #eb2525ff;
      }

      .btn-outline-light:hover {
        background: linear-gradient(90deg, #ff6b81, #e63946);
        color: white;
      }

      .form-control {
        border-radius: 10px;
        border: 1px solid #d1d5db;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        border-color: #eb2525ff;
        box-shadow: 0 0 0 0.2rem rgba(235,37,37,0.25);
      }

      .alert {
        border-radius: 10px;
        font-size: 0.9rem;
      }

      /* Mobile Responsive */
      @media (max-width: 850px) {
        .login-container {
          flex-direction: column;
        }

        .login-left {
          height: 40vh;
          padding: 1rem;
        }

        .login-left img {
          width: 200px;
        }

        .login-right {
          height: 60vh;
        }

        .card {
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
    setMessage(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const token = res.data.token ?? res.data?.accessToken ?? null;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      const payload = jwtDecode(token);
      const role =
        payload.role || payload?.authorities || payload?.roles || payload?.roleName;
      if (String(role ?? "").toUpperCase().includes("ADMIN")) navigate("/admin");
      else navigate("/user");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Login failed. Check username/password or server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Welcome to SmartBank</h1>
        <p>
          Experience smart, secure, and seamless digital banking.  
          Manage your money, loans, and transactions all in one place.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
          alt="Bank Illustration"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="card">
          <h4 className="mb-3 text-center fw-semibold">Sign In</h4>
          <p className="text-center text-muted mb-3">Access your Smart Bank account</p>

          {message && (
            <div
              className={`alert ${
                message.type === "error" ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <button
                type="button"
                className="btn btn-outline-light text-danger"
                onClick={() => navigate("/forgot-password")}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Don't have an account?{" "}
              <a href="/" className="text-decoration-none fw-semibold text-danger">
                Sign Up
              </a>{" "}
              |{" "}
              <a
                href="/forgot-password"
                className="text-decoration-none fw-semibold text-black"
              >
                Forgot Password?
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

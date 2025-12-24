import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Zap,
  Lock,
  CreditCard,
  Users,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Wallet,
  Globe,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "./LandingPage.css";

const features = [
  { icon: Shield, title: "Advanced Fraud Detection", desc: "AI-powered security monitors every transaction in real-time.", color: "#ef4444" },
  { icon: Zap, title: "Instant Transfers", desc: "Send money instantly to anyone, anywhere with zero delays.", color: "#f59e0b" },
  { icon: CreditCard, title: "Smart Loan Management", desc: "Apply for loans and manage repayments seamlessly.", color: "#8b5cf6" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track spending patterns with detailed insights.", color: "#3b82f6" },
  { icon: Wallet, title: "Digital Wallet", desc: "Store and manage your money securely.", color: "#10b981" },
  { icon: Lock, title: "Bank-Grade Security", desc: "Military-grade encryption protects your data.", color: "#ec4899" },
];

const stats = [
  { label: "Active Users", value: "5.2M+", icon: Users },
  { label: "Daily Transactions", value: "12.5M+", icon: TrendingUp },
  { label: "Security Score", value: "99.9%", icon: Shield },
  { label: "Countries", value: "150+", icon: Globe },
];

const benefits = [
  "Zero hidden fees", "24/7 customer support", "Instant account setup",
  "Multi-currency support", "Mobile & web access", "Automated bill payments"
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { username }

  // Just read token if present, do NOT redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = jwtDecode(token);
      const username =
        payload?.sub ||
        payload?.username ||
        payload?.user ||
        payload?.name ||
        "User";

      setUser({ username });
    } catch (e) {
      console.error("Invalid token on landing:", e);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleUserAction = () => {
    if (user?.username?.toUpperCase() === "ADMIN123") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const handleCreateAccount = () => {
    if (user) {
      handleUserAction();
    } else {
      navigate("/signup");
    }
  };

  const Section = ({ children, className = "", ...props }) => (
    <section className={`landing-section ${className}`} {...props}>{children}</section>
  );

  const GradientText = ({ children }) => (
    <span style={{
      background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>{children}</span>
  );

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav
        className="landing-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-brand">
          <div className="brand-icon">S</div>
          <GradientText><strong>SecureBank</strong></GradientText>
        </div>

        <div className="nav-actions">
          {!user ? (
            <>
              {/* ORIGINAL: Login + Get Started */}
              <motion.button
                className="btn-outline"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                className="btn-gradient"
                onClick={handleCreateAccount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </>
          ) : (
            <>
              {/* Username in same style as Login - redirects to /user or /admin */}
              <motion.button
                className="btn-outline"
                onClick={handleUserAction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.username}
              </motion.button>
              {/* Logout button (styled like Get Started) */}
              <motion.button
                className="btn-gradient"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <Section className="hero-section">
        <div className="hero-grid">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Shield size={18} />
              Trusted by 5M+ Users Worldwide
            </motion.div>

            <h1><GradientText>Banking Made Simple, Secure & Smart</GradientText></h1>

            <p className="hero-description">
              Experience the future of digital banking with advanced fraud detection, 
              instant transfers, and complete financial control at your fingertips.
            </p>

            <div className="hero-buttons">
              <motion.button
                className="btn-gradient btn-large"
                onClick={handleCreateAccount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Open Free Account <ArrowRight size={20} />
              </motion.button>

              <motion.button
                className="btn-outline btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>

            <div className="trust-indicators">
              {[
                { icon: Shield, text: "Bank-Grade Security" },
                { icon: Zap, text: "Instant Processing" },
                { icon: CheckCircle, text: "99.9% Uptime" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="trust-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <item.icon size={20} color="#10b981" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="hero-card"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="card-balance">
                <div className="balance-label">Total Balance</div>
                <div className="balance-amount">₹1,24,567.89</div>
              </div>
              
              <div className="card-stats">
                <div className="stat-box">
                  <div>Income</div>
                  <strong>₹45,890</strong>
                </div>
                <div className="stat-box">
                  <div>Expenses</div>
                  <strong>₹23,450</strong>
                </div>
              </div>

              <div className="card-account">
                <div>
                  <div>Account Number</div>
                  <strong>•••• •••• 4567</strong>
                </div>
                <CreditCard size={32} style={{ opacity: 0.8 }} />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <FloatingCard delay={0.5} position="top-right">
              <div className="floating-icon" style={{ background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)" }}>
                <TrendingUp size={24} color="#fff" />
              </div>
              <div>
                <div className="floating-label">Growth</div>
                <div className="floating-value" style={{ color: "#10b981" }}>+24.5%</div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1} position="bottom-left">
              <div className="floating-icon" style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" }}>
                <Zap size={24} color="#fff" />
              </div>
              <div>
                <div className="floating-label">Instant</div>
                <div className="floating-value">Transfer</div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <stat.icon size={40} color="#e63946" />
              <div className="stat-value"><GradientText>{stat.value}</GradientText></div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features Section */}
      <Section>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2><GradientText>Everything You Need</GradientText></h2>
          <p>Powerful features designed to give you complete control over your finances</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, boxShadow: `0 20px 40px ${feature.color}30` }}
              style={{ borderColor: `${feature.color}20` }}
            >
              <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}80, ${feature.color})` }}>
                <feature.icon size={32} color="#fff" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="benefits-section">
        <div className="benefits-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose SecureBank?</h2>
            <p>Join millions of users who trust us with their financial future. 
            Experience banking that's built for the modern world.</p>
          </motion.div>

          <motion.div
            className="benefits-list"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="benefit-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CheckCircle size={24} />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

     
      <Section className="cta-section">
       
      </Section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon">S</div>
            <span><strong>SecureBank</strong></span>
            <p>The future of digital banking with advanced fraud detection.</p>
          </div>

          {["Product", "Company", "Support"].map((section, i) => (
            <div key={i} className="footer-section">
              <h4>{section}</h4>
              {["Features", "Security", "Pricing", "API"].map(item => (
                <a key={item} href="#">{item}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2025 SecureBank. All rights reserved.</p>
          <div className="footer-social">
            {["Twitter", "LinkedIn", "Facebook"].map(social => (
              <a key={social} href="#">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function FloatingCard({ children, delay, position }) {
  const positions = {
    "top-right": { top: "10%", right: "-10%" },
    "bottom-left": { bottom: "5%", left: "-10%" }
  };

  return (
    <motion.div
      className="floating-card"
      style={positions[position]}
      animate={{ 
        y: position === "top-right" ? [0, -20, 0] : [0, 20, 0],
        rotate: position === "top-right" ? [0, 5, 0] : [0, -5, 0]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

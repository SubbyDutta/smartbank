// src/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "./api";
import { jwtDecode } from "jwt-decode";

import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader";

import TransactionsView from "./components/admin/TransactionsView";
import UsersView from "./components/admin/UsersView";
import AccountsView from "./components/admin/AccountsView";
import LoansView from "./components/admin/LoansView";
import AdminRepaymentTable from "./components/admin/AdminRepaymentTable";
import AuditLogs from "./components/admin/AuditLogs";
import { TransactionChart, LoanStatusChart } from "./components/admin/AdminCharts";

const PAGE = 0;
const SIZE = 10;
const SIDEBAR_WIDTH = 280;

// Premium Bento Card Component
const BentoCard = ({ children, className = "", delay = 0, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={onClick ? { scale: 1.02, cursor: "pointer", borderColor: 'var(--color-black)' } : { scale: 1.01, borderColor: 'rgba(0,0,0,0.1)' }}
    className={`render-card ${className}`}
    onClick={onClick}
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      padding: '24px', // Handled by render-card class usually, but let's be explicit
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.04)",
      borderRadius: '24px'
    }}
  >
    {children}
  </motion.div>
);

export default function AdminDashboard() {
  const [view, setView] = useState("home");

  const [transactions, setTransactions] = useState([]);
  const [transPage, setTransPage] = useState(PAGE);
  const [transTotalPages, setTransTotalPages] = useState(0);

  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(PAGE);
  const [userTotalPages, setUserTotalPages] = useState(0);

  const [accounts, setAccounts] = useState([]);
  const [accPage, setAccPage] = useState(PAGE);
  const [accTotalPages, setAccTotalPages] = useState(0);

  const [loans, setLoans] = useState([]);
  const [loanPage, setLoanPage] = useState(PAGE);
  const [loanTotalPages, setLoanTotalPages] = useState(0);

  const [repayments, setRepayments] = useState([]);
  const [repayPage, setRepayPage] = useState(PAGE);
  const [repayTotalPages, setRepayTotalPages] = useState(0);


  const [bankPoolBalance, setBankPoolBalance] = useState(0);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0
  });

  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setAdminUser(decoded);
      const r = (decoded.role || decoded.roles || "").toString().toUpperCase();
      if (!r.includes("ADMIN")) {
        alert("You are not authorized to access the admin panel.");
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }, [token]);


  const extractPageData = (r) => ({
    content: r?.data?.content || [],
    totalPages: r?.data?.totalPages || 0,
  });


  const loadTransactions = async (p = 0) => {
    const r = await API.get(`/transactions/transactions?page=${p}&size=${SIZE}`);
    const { content, totalPages } = extractPageData(r);
    setTransactions(content);
    setTransTotalPages(totalPages);
  };

  const loadUsers = async (p = 0) => {
    const r = await API.get(`/admin/users?page=${p}&size=${SIZE}`);
    const { content, totalPages } = extractPageData(r);
    setUsers(content);
    setUserTotalPages(totalPages);
  };

  const loadAccounts = async (p = 0) => {
    const r = await API.get(`/admin/bankaccounts?page=${p}&size=${SIZE}`);
    const { content, totalPages } = extractPageData(r);
    setAccounts(content);
    setAccTotalPages(totalPages);
  };

  const loadLoans = async (p = 0) => {
    const r = await API.get(`/loan/pending?page=${p}&size=${SIZE}`);
    const { content, totalPages } = extractPageData(r);
    setLoans(content);
    setLoanTotalPages(totalPages);
  };

  const loadRepayments = async (p = 0) => {
    const r = await API.get(`/repay?page=${p}&size=${SIZE}`);
    const { content, totalPages } = extractPageData(r);
    setRepayments(content);
    setRepayTotalPages(totalPages);
  };

  const loadBankPool = async () => {
    try {
      const res = await API.get("/pool");
      setBankPoolBalance(res.data || 0);
    } catch (err) {
      console.error("Failed to load bank pool:", err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await API.get("/admin/analytics/stats");
      setStats(res.data);
    } catch (err) {
      console.warn("Analytics stats not available, using fallbacks:", err.message);
      setStats({
        totalUsers: users.length || 0,
        totalAccounts: accounts.length || 0,
        totalTransactions: transactions.length || 0
      });
    }
  };


  useEffect(() => {
    loadTransactions(0);
    loadUsers(0);
    loadLoans(0);
    loadAccounts(0);
    loadBankPool();
    loadStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await API.post("/pool/topup", null, { params: { amount } });
      setBankPoolBalance((prev) => prev + amount);
      setShowTopupModal(false);
      setTopupAmount("");
    } catch (err) {
      alert("Failed to top up bank pool");
    }
  };


  const getTypeLabel = (isForeign) => {
    return isForeign === 0 ? "Domestic" : "Foreign";
  };

  const getTypeBadgeClass = (isForeign) => {
    return isForeign === 0
      ? "badge bg-success-subtle text-success"
      : "badge bg-warning-subtle text-warning";
  };


  const HomeDashboard = () => {
    const totalTransactionsEstimate = transTotalPages
      ? transTotalPages * SIZE
      : transactions.length;
    const totalUsersEstimate = userTotalPages
      ? userTotalPages * SIZE
      : users.length;
    const totalLoansEstimate = loanTotalPages
      ? loanTotalPages * SIZE
      : loans.length;
    const totalAccountsEstimate = accTotalPages
      ? accTotalPages * SIZE
      : accounts.length;

    const cards = [
      {
        label: "Total Users",
        value: stats.totalUsers,
        badge: "Registered",
        color: "var(--color-black)",
        icon: "bi-people"
      },
      {
        label: "Total Accounts",
        value: stats.totalAccounts,
        badge: "Bank Profiles",
        color: "#3b82f6",
        icon: "bi-person-badge"
      },
      {
        label: "Total Transactions",
        value: stats.totalTransactions,
        badge: "Processed",
        color: "#10b981",
        icon: "bi-arrow-left-right"
      },
      {
        label: "Pool Balance",
        value: bankPoolBalance,
        badge: "Tap to Top-up",
        isBankPool: true,
        color: "#000000",
        icon: "bi-bank"
      },
    ];

    return (
      <div style={{ padding: 24, maxWidth: 1600, margin: '0 auto' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          marginBottom: 32
        }}>
          {cards.map((c, i) => (
            <BentoCard key={c.label} delay={i * 0.1} onClick={c.isBankPool ? () => setShowTopupModal(true) : undefined}>
              <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>{c.label}</div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                    {c.value?.toLocaleString("en-IN") || 0}
                  </h3>
                </div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${c.color}15`,
                  color: c.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  <i className={`bi ${c.icon}`}></i>
                </div>
              </div>
              {c.badge && (
                <div style={{ padding: '0 24px 24px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: '#f3f4f6',
                    color: '#4b5563',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {c.badge}
                  </span>
                </div>
              )}
            </BentoCard>
          ))}
        </div>

        {/* Bento Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, minmax(300px, auto))',
          gap: 24,
        }}>

          {/* Chart Area - Span 2 Cols */}
          <div style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
            <BentoCard delay={0.4}>
              <div style={{ padding: 24 }}>
                <h5 style={{ fontWeight: 700 }}>Transaction Velocity</h5>
              </div>
              <div style={{ flex: 1, padding: '0 24px 24px' }}>
                <TransactionChart data={transactions} />
              </div>
            </BentoCard>
          </div>

          {/* System Health */}
          <div style={{ gridColumn: 'span 1' }}>
            <BentoCard delay={0.5}>
              <div style={{ padding: 24, borderBottom: '1px solid #f0f0f0' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>System Health</h5>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'API Latency', status: 'Optimal', color: '#10b981' },
                  { label: 'Fraud Detection', status: 'Active', color: '#3b82f6' },
                  { label: 'Database', status: 'Healthy', color: '#10b981' },
                  { label: 'Server CPU', status: '24%', color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#444' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: item.color }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Recent Transactions List - Span 2 Cols */}
          <div style={{ gridColumn: 'span 2' }}>
            <BentoCard delay={0.6}>
              <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <h5 style={{ fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Recent Activity</h5>
                <button onClick={() => setView("transactions")} style={{ border: 'none', background: 'none', color: 'var(--color-render-purple)', fontWeight: 700, cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {transactions.slice(0, 5).map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#666' }}>{new Date(t.timestamp).toLocaleTimeString()}</td>
                        <td style={{ padding: '16px 24px', fontWeight: 500 }}>{t.senderAccount}</td>
                        <td style={{ padding: '16px 24px', fontWeight: 500 }}>{t.receiverAccount}</td>
                        <td style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'right' }}>₹{t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </div>

          {/* Loan Approval Pie Chart */}
          <div style={{ gridColumn: 'span 1' }}>
            <BentoCard delay={0.7}>
              <div style={{ padding: 24 }}>
                <h5 style={{ fontWeight: 700 }}>Loan Distribution</h5>
              </div>
              <div style={{ flex: 1, padding: 24 }}>
                <LoanStatusChart loans={loans} />
              </div>
            </BentoCard>
          </div>

        </div>
      </div>
    );
  };

  return (
    <>
      {/* Global Background */}
      <div className="bg-grid" />

      <div
        className="admin-root"
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 1
        }}
      >

        <motion.div
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -SIDEBAR_WIDTH }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}
        >
          <AdminSidebar
            active={view}
            setActive={setView}
            onTransactions={() => setView("transactions")}
            onLoans={() => setView("loans")}
            onUsers={() => setView("users")}
            onAccounts={() => setView("accounts")}
            searchId=""
            setSearchId={() => { }}
            onSearchUser={() => { }}
            adminUser={adminUser}
            onLogout={handleLogout}
          />
        </motion.div>


        <div
          style={{
            marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
            transition: "margin-left 0.25s ease-in-out",
          }}
        >
          <AdminHeader
            sidebarOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((o) => !o)}
            onLogout={handleLogout}
          />

          <main
            className="container-fluid"
            style={{ paddingTop: 96, paddingBottom: 24 }}
          >
            <AnimatePresence mode="wait">
              {view === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <HomeDashboard />
                </motion.div>
              )}

              {view === "transactions" && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TransactionsView
                    data={transactions}
                    load={loadTransactions}
                    page={transPage}
                    setPage={setTransPage}
                    totalPages={transTotalPages}
                  />
                </motion.div>
              )}

              {view === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <UsersView
                    users={users}
                    load={loadUsers}
                    page={userPage}
                    setPage={setUserPage}
                    totalPages={userTotalPages}
                  />
                </motion.div>
              )}

              {view === "accounts" && (
                <motion.div
                  key="accounts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AccountsView
                    accounts={accounts}
                    load={loadAccounts}
                    page={accPage}
                    setPage={setAccPage}
                    totalPages={accTotalPages}
                  />
                </motion.div>
              )}

              {view === "loans" && (
                <motion.div
                  key="loans"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LoansView
                    loans={loans}
                    load={loadLoans}
                    page={loanPage}
                    setPage={setLoanPage}
                    totalPages={loanTotalPages}
                  />
                </motion.div>
              )}

              {view === "repayments" && (
                <motion.div
                  key="repayments"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AdminRepaymentTable
                    repayments={repayments}
                    load={loadRepayments}
                    page={repayPage}
                    setPage={setRepayPage}
                    totalPages={repayTotalPages}
                  />
                </motion.div>
              )}

              {view === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AuditLogs />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>


      <AnimatePresence>
        {showTopupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5000,
              padding: "2rem",
            }}
            onClick={() => setShowTopupModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "white",
                borderRadius: 24,
                width: "100%",
                maxWidth: 400,
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                overflow: "hidden"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-bottom bg-light">
                <h5 className="mb-1 fw-bold">Bank Pool Top-up</h5>
                <p className="text-muted small mb-0">
                  Current: ₹{bankPoolBalance?.toLocaleString("en-IN") || 0}
                </p>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase text-muted">Amount to Add</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">₹</span>
                    <input
                      type="number"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter amount"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      min="0"
                      style={{ fontSize: '1.2rem', fontWeight: 600 }}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-light flex-grow-1 fw-bold"
                    onClick={() => setShowTopupModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark flex-grow-1 fw-bold"
                    onClick={handleTopup}
                    disabled={!topupAmount || parseFloat(topupAmount) <= 0}
                    style={{ background: 'var(--color-render-purple)', border: 'none' }}
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

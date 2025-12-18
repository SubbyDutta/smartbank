// src/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "./api";
import { jwtDecode } from "jwt-decode";

import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader";

import TransactionsView from "./components/admin/TransactionsView";
import UsersView from "./components/admin/UsersView";
import AccountsView from "./components/admin/AccountsView";
import LoansView from "./components/admin/LoansView";
import AdminRepaymentTable from "./components/admin/AdminRepaymentTable";

const PAGE = 0;
const SIZE = 10;
const SIDEBAR_WIDTH = 280;

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

 
  useEffect(() => {
    loadTransactions(0);
    loadUsers(0);
    loadLoans(0);
    loadAccounts(0);
    loadBankPool();
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
        label: "Active Accounts",
        value: totalAccountsEstimate,
        badge: "Stable",
      },
      {
        label: "Pending Loans",
        value: totalLoansEstimate,
        badge: "Review required",
      },
      {
        label: "Transactions (est.)",
        value: totalTransactionsEstimate,
        badge: "Live activity",
      },
      {
        label: "Bank Pool",
        value: bankPoolBalance,
        badge: "Top-up",
        isBankPool: true,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        
        <div className="row g-3 mb-3">
          {cards.map((c) => (
            <div className="col-md-3 col-sm-6" key={c.label}>
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 16,
                  backgroundColor: "#ffffff",
                  cursor: c.isBankPool ? "pointer" : "default",
                }}
                onClick={c.isBankPool ? () => setShowTopupModal(true) : undefined}
              >
                <div className="card-body py-3 px-3 d-flex flex-column justify-content-between">
                  <div>
                    <div className="text-muted small mb-1">{c.label}</div>
                    <h5 className="fw-bold mb-1">
                      {c.value?.toLocaleString("en-IN") || 0}
                    </h5>
                  </div>
                  <span className="badge bg-light text-muted small">
                    {c.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        <div className="row g-3">
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 16, backgroundColor: "#ffffff" }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Recent Transactions</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setView("transactions")}
                  >
                    View all
                  </button>
                </div>
                <p className="text-muted small mb-3">
                  Snapshot of the latest activity in the system.
                </p>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th>Time</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 9).map((t) => {
                        const isForeign = t.isForeign; 
                        return (
                          <tr key={t.id}>
                            <td className="small">
                              {t.timestamp}
                            </td>
                            <td className="small">{t.senderAccount}</td>
                            <td className="small">{t.receiverAccount}</td>
                            <td className="small fw-semibold">₹{t.amount}</td>
                            <td className="small">
                              <span className={getTypeBadgeClass(isForeign)}>
                                {getTypeLabel(isForeign)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {transactions.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-muted small"
                          >
                            No transactions loaded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm mb-3"
              style={{ borderRadius: 16, backgroundColor: "#ffffff", height: 200 }}
            >
              <div className="card-body">
                <h6 className="card-title mb-2">Loan Approval Progress</h6>
                <p className="text-muted small mb-3">
                  Pending loans cleared in this cycle.
                </p>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-2 small text-muted">
                  <span>Completed</span>
                  <span>75%</span>
                </div>
              </div>
            </div>

            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: 16,
                backgroundColor: "#ffffff",
                height: 200,
                marginTop: 10,
              }}
            >
              <div className="card-body">
                <h6 className="card-title mb-2">System Health</h6>
                <ul className="list-unstyled small mb-0">
                  <li className="d-flex justify-content-between mb-1">
                    <span>API Latency</span>
                    <span className="text-success fw-semibold">Normal</span>
                  </li>
                  <li className="d-flex justify-content-between mb-1">
                    <span>Fraud Engine</span>
                    <span className="text-success fw-semibold">Online</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Disbursement Queue</span>
                    <span className="text-warning fw-semibold">Moderate</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
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
            setSearchId={() => {}}
            onSearchUser={() => {}}
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
            {view === "home" && <HomeDashboard />}

            {view === "transactions" && (
              <TransactionsView
                data={transactions}
                load={loadTransactions}
                page={transPage}
                setPage={setTransPage}
                totalPages={transTotalPages}
              />
            )}

            {view === "users" && (
              <UsersView
                users={users}
                load={loadUsers}
                page={userPage}
                setPage={setUserPage}
                totalPages={userTotalPages}
              />
            )}

            {view === "accounts" && (
              <AccountsView
                accounts={accounts}
                load={loadAccounts}
                page={accPage}
                setPage={setAccPage}
                totalPages={accTotalPages}
              />
            )}

            {view === "loans" && (
              <LoansView
                loans={loans}
                load={loadLoans}
                page={loanPage}
                setPage={setLoanPage}
                totalPages={loanTotalPages}
              />
            )}

            {view === "repayments" && (
              <AdminRepaymentTable
                repayments={repayments}
                load={loadRepayments}
                page={repayPage}
                setPage={setRepayPage}
                totalPages={repayTotalPages}
              />
            )}
          </main>
        </div>
      </div>

      
      {showTopupModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5000,
            padding: "2rem",
          }}
          onClick={() => setShowTopupModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-bottom">
              <h5 className="mb-1">Bank Pool Top-up</h5>
              <p className="text-muted small mb-0">
                Current: ₹{bankPoolBalance?.toLocaleString("en-IN") || 0}
              </p>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="form-label small">Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  min="0"
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => setShowTopupModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={handleTopup}
                  disabled={!topupAmount || parseFloat(topupAmount) <= 0}
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

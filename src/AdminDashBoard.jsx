import React, { useEffect, useMemo, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, RefreshCw, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./components/admin/styles/premium-fintech.css";

// Views
import AdminHeader from "./components/admin/AdminHeader";
import AdminSidebar from "./components/admin/AdminSidebar";
import StatTiles from "./components/admin/StatTiles";
import TransactionsView from "./components/admin/TransactionsView";
import UsersView from "./components/admin/UsersView";
import AccountsView from "./components/admin/AccountsView";
import LoansView from "./components/admin/LoansView";
import AdminRepaymentTable from "./components/admin/AdminRepaymentTable";
import BankFundView from "./components/admin/BankFundView"; 

const PAGE_SIZE = 12;
const ALERT_TIMEOUT = 5000;
const POPUP_TIMEOUT = 3000;

export default function AdminDashboard() {
    const navigate = useNavigate();

    // view selection
    const [view, setView] = useState("home");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [popup, setPopup] = useState(null);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // data
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loans, setLoans] = useState([]);

    // edit form (users)
    const [editForm, setEditForm] = useState(null);

    // queries & pages
    const [transQuery, setTransQuery] = useState("");
    const [transPage, setTransPage] = useState(1);
    const [userQuery, setUserQuery] = useState("");
    const [userPage, setUserPage] = useState(1);
    const [accQuery, setAccQuery] = useState("");
    const [accPage, setAccPage] = useState(1);
    const [loanQuery, setLoanQuery] = useState("");
    const [loanPage, setLoanPage] = useState(1);

    // id search box
    const [searchId, setSearchId] = useState("");

    // Authentication guard
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const payload = jwtDecode(token);
            const role = (payload.role || payload?.roles || "").toString().toUpperCase();
            if (!role.includes("ADMIN")) {
                showAlert("danger", "Access denied. Admin privileges required.");
                setTimeout(() => navigate("/user"), 2000);
            }
        } catch (err) {
            console.error("Authentication error:", err);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    // Alert helpers
    const showAlert = useCallback((type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), ALERT_TIMEOUT);
    }, []);

    const showPopup = useCallback((type, message) => {
        setPopup({ type, message });
        setTimeout(() => setPopup(null), POPUP_TIMEOUT);
    }, []);

    // Error handler
    const handleError = useCallback(
        (error, context = "Operation") => {
            console.error(`${context} error:`, error);
            const message =
                error?.response?.data?.message || error?.message || `${context} failed`;
            showAlert("danger", message);
            setError({ context, message, timestamp: Date.now() });
        },
        [showAlert]
    );

    const scalarize = (v) => {
        if (v == null) return "";
        if (Array.isArray(v)) return v.join("-");
        if (typeof v === "object") {
            if ("id" in v) return String(v.id);
            if ("userId" in v) return String(v.userId);
            if ("user_id" in v) return String(v.user_id);
            if ("accountId" in v) return String(v.accountId);
            try {
                return JSON.stringify(v);
            } catch {
                return String(v);
            }
        }
        return String(v);
    };

    const isFraudFlag = (t) =>
        t?.is_fraud === 1 || t?.isFraud === 1 || t?.fraud === true;

    // derived stats
    const stats = useMemo(() => {
        const fraudCount = transactions.filter(isFraudFlag).length;
        const totalBalance = users.reduce(
            (sum, u) => sum + (Number(u.balance) || 0),
            0
        );
        return {
            totalUsers: users.length,
            totalTransactions: transactions.length,
            fraudCount,
            totalBalance,
        };
    }, [transactions, users]);

    // ========= LOADERS =========

    const fetchTransactions = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/transactions/check");
        setTransactions(res.data || []);
        setView("transactions");
      } catch (e) {
        handleError(e, "Loading transactions");
      } finally {
        setLoading(false);
      }
    }, [handleError]);

    const fetchUsers = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data || []);
        setView("users");
      } catch (e) {
        handleError(e, "Loading users");
      } finally {
        setLoading(false);
      }
    }, [handleError]);

    const fetchAccounts = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/admin/accounts");
        setAccounts(res.data || []);
        setView("accounts");
      } catch (e) {
        handleError(e, "Loading accounts");
      } finally {
        setLoading(false);
      }
    }, [handleError]);

    const fetchPendingLoans = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/loan/pending");
        setLoans(res.data || []);
        setView("loans");
      } catch (e) {
        handleError(e, "Loading loan applications");
      } finally {
        setLoading(false);
      }
    }, [handleError]);

    const approveLoan = useCallback(
        async (loanId) => {
            if (
                !window.confirm(
                    `Are you sure you want to approve loan #${loanId}? This action cannot be undone.`
                )
            ) {
                return;
            }

            setLoading(true);
            try {
                await API.post(`/loan/approve/${loanId}`);
                showPopup("success", `Loan #${loanId} approved successfully`);
                await fetchPendingLoans();
            } catch (e) {
                handleError(e, `Approving loan #${loanId}`);
            } finally {
                setLoading(false);
            }
        },
        [fetchPendingLoans, handleError, showPopup]
    );

    // User search helpers
    const resolveId = (maybe) => {
        if (maybe == null) return null;
        return String(maybe?.id ?? maybe?.userId ?? maybe?.user_id ?? maybe);
    };

    const searchUser = useCallback(
        async (idOverride) => {
            const id = resolveId(idOverride ?? searchId);
            if (!id || id.trim() === "") {
                showAlert("warning", "Please enter a valid user ID");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const userRes = await API.get(`/admin/user/${id}`);
                const user = userRes.data;

                // Fetch balance separately with fallback
                let balance = null;
                try {
                    const balRes = await API.get(`/admin/balance/${id}`);
                    const b = balRes.data;
                    balance =
                        typeof b === "number" ? b : b?.balance ?? b?.amount ?? null;
                } catch (balErr) {
                    console.warn("Balance fetch failed, using user balance:", balErr);
                    balance = user.balance ?? null;
                }

                setEditForm({
                    id: user.id ?? user.userId ?? user.user_id ?? "",
                    username: user.username ?? "",
                    email: user.email ?? "",
                    mobile: user.mobile ?? "",
                    role: user.role ?? "",
                    balance: balance ?? "",
                    ...user,
                });
                setView("editUser");
            } catch (e) {
                setEditForm(null);
                handleError(e, "Searching for user");
            } finally {
                setLoading(false);
            }
        },
        [searchId, handleError, showAlert]
    );

    const logout = useCallback(() => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    // filtered + paged
    const filteredTrans = useMemo(() => {
        if (!transQuery) return transactions;
        const q = transQuery.toLowerCase();
        return transactions.filter((t) =>
            Object.entries(t).some(
                ([k, v]) => k !== "password" && scalarize(v).toLowerCase().includes(q)
            )
        );
    }, [transactions, transQuery]);

    const pagedTrans = useMemo(
        () => filteredTrans.slice((transPage - 1) * PAGE_SIZE, transPage * PAGE_SIZE),
        [filteredTrans, transPage]
    );

    const filteredUsers = useMemo(() => {
        if (!userQuery) return users;
        const q = userQuery.toLowerCase();
        return users.filter((u) =>
            Object.entries(u).some(
                ([k, v]) => k !== "password" && scalarize(v).toLowerCase().includes(q)
            )
        );
    }, [users, userQuery]);

    const pagedUsers = useMemo(
        () => filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE),
        [filteredUsers, userPage]
    );

    const filteredAccounts = useMemo(() => {
        if (!accQuery) return accounts;
        const q = accQuery.toLowerCase();
        return accounts.filter((a) =>
            Object.entries(a).some(
                ([k, v]) => scalarize(v).toLowerCase().includes(q)
            )
        );
    }, [accounts, accQuery]);

    const pagedAccounts = useMemo(
        () => filteredAccounts.slice((accPage - 1) * PAGE_SIZE, accPage * PAGE_SIZE),
        [filteredAccounts, accPage]
    );

    return (
        <div className="admin-root">


            <div className="admin-body">
                <AdminSidebar
                    active={view}
                    setActive={setView}
                    onTransactions={fetchTransactions}
                    onLoans={fetchPendingLoans}
                    onUsers={fetchUsers}
                    onAccounts={fetchAccounts}
                    searchId={searchId}
                    setSearchId={setSearchId}
                    onSearchUser={() => searchUser()}
                    onLogout={logout}
                    isOpen={sidebarOpen}
                />

                <main
                    className={`content ${!sidebarOpen ? "expanded" : ""}`}
                    style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                    {/* Global Alert */}
                    <AnimatePresence>
                        {alert && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`alert ${alert.type === "success" ? "alert-success" : "alert-danger"
                                    }`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    fontWeight: 600,
                                }}
                            >
                                {alert.type === "success" ? (
                                    <CheckCircle size={18} />
                                ) : (
                                    <AlertTriangle size={18} />
                                )}
                                {alert.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error State */}
                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-card"
                            style={{
                                background: "var(--danger-100)",
                                borderColor: "var(--danger-200)",
                                padding: 24,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <AlertTriangle
                                    size={24}
                                    style={{ color: "var(--danger-600)", flexShrink: 0 }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            color: "var(--danger-900)",
                                            marginBottom: 4,
                                        }}
                                    >
                                        {error.context} Error
                                    </div>
                                    <div style={{ color: "var(--danger-700)", fontSize: "0.9375rem" }}>
                                        {error.message}
                                    </div>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => setError(null)}
                                        style={{ marginTop: 12, padding: "6px 12px", fontSize: "0.875rem" }}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Views */}
                    {!loading && view === "home" && <StatTiles stats={stats} setView={setView} />}

                    {!loading && view === "transactions" && (
                        <TransactionsView
                            data={transactions}
                            paged={pagedTrans}
                            totalFiltered={filteredTrans.length}
                            query={transQuery}
                            setQuery={setTransQuery}
                            page={transPage}
                            setPage={setTransPage}
                            pageSize={PAGE_SIZE}
                        />
                    )}

                    {!loading && view === "loans" && (
                        <LoansView
                            loans={loans}
                            onRefresh={fetchPendingLoans}
                            query={loanQuery}
                            setQuery={setLoanQuery}
                            page={loanPage}
                            setPage={setLoanPage}
                            pageSize={PAGE_SIZE}
                            onApprove={approveLoan}
                            popup={popup}
                        />
                    )}

                    {!loading && view === "repayments" && <AdminRepaymentTable />}

                    {!loading && view === "users" && (
                        <UsersView
                            users={users}
                            filtered={filteredUsers}
                            paged={pagedUsers}
                            query={userQuery}
                            setQuery={setUserQuery}
                            page={userPage}
                            setPage={setUserPage}
                            pageSize={PAGE_SIZE}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            searchId={searchId}
                            setSearchId={setSearchId}
                            onSearchUser={searchUser}
                            showAlert={showAlert}
                        />
                    )}

                    {!loading && view === "accounts" && (
                        <AccountsView
                            accounts={accounts}
                            filtered={filteredAccounts}
                            paged={pagedAccounts}
                            query={accQuery}
                            setQuery={setAccQuery}
                            page={accPage}
                            setPage={setAccPage}
                            pageSize={PAGE_SIZE}
                            showAlert={showAlert}
                            refresh={fetchAccounts}
                        />
                    )}

                    {/* ✅ NEW VIEW */}
                    {!loading && view === "bankfund" && (
                        <BankFundView showAlert={showAlert} showPopup={showPopup} />
                    )}
                </main>
            </div>

            {/* Quick util styles */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-spinner {
          border: 3px solid rgba(230,57,70,0.15);
          border-top-color: #e63946;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
      `}</style>
        </div>
    );
}

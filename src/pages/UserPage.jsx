import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import Sidebar from '../components/Sidebar';
import DashboardPanel from '../components/DashBoardPanel';
import TransferPanel from '../components/TransferPanel';
import TransactionsPanel from '../components/TransactionPanel';
import ChatbotPanel from '../components/ChatbotPanel';
import LoanPanel from '../components/LoanPanel';
import RightPanel from '../components/RightPanel';
import AddMoney from '../components/AddMoney';
import LoanRepaymentPanel from '../components/MyLoans';
import { formatCurrencyINR } from '../utils/format';
import '../UserPage.css';

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'User', role: '' });
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const [hasAccount, setHasAccount] = useState(true);
  const [accountNumber, setAccountNumber] = useState('');
  const [balanceRaw, setBalanceRaw] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const [formAdhar, setFormAdhar] = useState('');
  const [formPAN, setFormPAN] = useState('');
  const [formType, setFormType] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [createError, setCreateError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const payload = jwtDecode(token);
      const usernameFromToken =
        payload?.sub ||
        payload?.username ||
        payload?.user ||
        payload?.name ||
        'User';

      setUser({
        username: usernameFromToken,
        role: payload?.role || '',
      });

      checkAccountAndLoad(usernameFromToken);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, []);

  const balance = formatCurrencyINR(balanceRaw);

  async function checkAccountAndLoad(username) {
    setLoading(true);
    try {
      const res = await API.get('/user/me/account');
      const acct =
        res.data?.accountNumber ??
        res.data?.account_number ??
        (typeof res.data === 'string' ? res.data : null);

      if (acct) {
        setHasAccount(true);
        setAccountNumber(acct);
        await fetchBalance();
        await fetchTransactions({ username, page: 0, size: 3 });
      } else {
        setHasAccount(false);
        setAccountNumber('');
        setActive('createAccount');
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setHasAccount(false);
        setAccountNumber('');
        setActive('createAccount');
        return;
      } else {
        console.error('Error checking account:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchBalance() {
    setLoading(true);
    try {
      const res = await API.get('/user/balance');
      const raw = res.data;
      const match = String(raw).match(/₹\s?([0-9,.]+)/);
      if (match) setBalanceRaw(parseFloat(match[1].replace(/,/g, "")));
      else if (typeof raw === "number") setBalanceRaw(raw);
      else if (raw?.balance != null) setBalanceRaw(raw.balance);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactions(options = {}) {
    const {
      username = user.username,
      page = 0,
      size = 3,
      from,
      to,
      minAmount,
      maxAmount,
    } = options;

    if (!username) return;

    setTxLoading(true);
    try {
      const token = localStorage.getItem("token");

      const params = { page, size };

      if (from) params.from = from;
      if (to) params.to = to;
      if (minAmount !== "" && minAmount != null) params.minAmount = minAmount;
      if (maxAmount !== "" && maxAmount != null) params.maxAmount = maxAmount;

      const res = await API.get(
        `/user/${encodeURIComponent(username)}/transactions`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = res.data?.content || [];
      setTransactions(list);
    } finally {
      setTxLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const guardedSetActive = (view) => {
    const requiresAccount = [
      'dashboard',
      'transfer',
      'tx',
      'addMoney',
      'loan',
      'myloan',
    ];

    if (!hasAccount && requiresAccount.includes(view)) {
      return;
    }
    setActive(view);
  };

  const handleAdharChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) value = value.slice(0, 12);
    setFormAdhar(value);
  };

  const handlePanChange = (e) => {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setFormPAN(value);
  };

  const validateCreateAccount = () => {
    if (formAdhar.length !== 12) {
      setCreateError('Aadhaar must be exactly 12 digits.');
      return false;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(formPAN)) {
      setCreateError('Enter a valid PAN (e.g. ABCDE1234F).');
      return false;
    }

    if (!formType) {
      setCreateError('Please select an account type.');
      return false;
    }

    setCreateError('');
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateCreateAccount()) return;
    if (!user.username) {
      setCreateError('User not found. Please login again.');
      return;
    }

    setCreatingAccount(true);
    setCreateError('');
    try {
      await API.post('/user/create-account', {
        username: user.username,
        adhar: formAdhar,
        pan: formPAN,
        type: formType,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      await checkAccountAndLoad(user.username);
      setActive('dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        'Failed to create account. Please try again.';
      setCreateError(String(msg));
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className="up-root">
      <Sidebar
        user={user}
        active={active}
        setActive={guardedSetActive}
        logout={logout}
        hasAccount={hasAccount}
      />

      <main className="up-main">
        <div className="up-grid">
          <div className="up-left">
            {active === 'dashboard' && hasAccount && (
              <DashboardPanel
                setActive={guardedSetActive}
                onAddMoneySuccess={() => {
                  fetchBalance();
                  fetchTransactions({ username: user.username, page: 0 });
                }}
              />
            )}

            {active === 'transfer' && hasAccount && (
              <TransferPanel
                onComplete={() => {
                  fetchBalance();
                  fetchTransactions({ username: user.username, page: 0 });
                  guardedSetActive("tx");
                }}
              />
            )}

            {active === 'tx' && hasAccount && (
              <TransactionsPanel
                transactions={transactions}
                loading={txLoading}
                onReload={(params) =>
                  fetchTransactions({ username: user.username, ...params })
                }
              />
            )}

            {active === 'addMoney' && hasAccount && (
              <AddMoney
                onSuccess={() => {
                  fetchBalance();
                  fetchTransactions({ username: user.username });
                  guardedSetActive("dashboard");
                }}
              />
            )}

            {active === 'loan' && hasAccount && (
              <LoanPanel
                onLoanApplied={() => {
                  fetchBalance();
                  fetchTransactions({ username: user.username });
                }}
              />
            )}

            {active === 'myloan' && hasAccount && <LoanRepaymentPanel />}

            {active === 'chatbot' && <ChatbotPanel />}
          </div>

          <RightPanel
            balance={balance}
            accountNumber={accountNumber}
            onSendClick={() =>
              hasAccount
                ? guardedSetActive("transfer")
                : guardedSetActive("createAccount")
            }
          />
        </div>
      </main>

      <AnimatePresence>
        {!hasAccount && (
          <motion.div
            key="create-account-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 4000,
                backdropFilter: 'blur(6px)',
                padding: '1.5rem',
              }}
          >
            <motion.div
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="card shadow-lg"
              style={{
                width: '100%',
                maxWidth: 560,
                borderRadius: 20,
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '0.9rem 1.25rem',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h5 className="mb-0 fw-semibold">Create your SecureBank account</h5>
                  <div className="text-muted small">
                    Unlock transfers, loans, and more in a few quick steps.
                  </div>
                </div>
                <span className="badge bg-primary-subtle text-primary small">
                  Step 1 of 1
                </span>
              </div>

              <div className="card-body" style={{ padding: '1.25rem 1.5rem 1.4rem' }}>
                <AnimatePresence mode="wait">
                  {showSuccess && (
                    <motion.div
                      key="create-success"
                      className="alert alert-success py-2 small mb-2"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      Bank account created successfully.
                    </motion.div>
                  )}

                  {createError && (
                    <motion.div
                      key="create-error"
                      className="alert alert-danger py-2 small mb-2"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      {createError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formAdhar}
                      onChange={handleAdharChange}
                      placeholder="12-digit Aadhaar"
                      maxLength={12}
                    />
                    <div className="form-text small">
                      Only digits, exactly 12 characters.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formPAN}
                      onChange={handlePanChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                    <div className="form-text small">
                      5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      Account Type
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                      <option value="salary">Salary Account</option>
                    </select>
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div
                      className="w-100 small text-muted"
                      style={{
                        background: '#f9fafb',
                        borderRadius: 10,
                        padding: '0.6rem 0.8rem',
                        border: '1px dashed #e5e7eb',
                      }}
                    >
                      <div className="fw-semibold mb-1" style={{ fontSize: '0.76rem' }}>
                        Why we ask for this
                      </div>
                      <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                        Aadhaar and PAN help us verify your identity and keep your
                        account secure as per KYC guidelines.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="small text-muted">
                    Logged in as{' '}
                    <span className="fw-semibold">{user.username}</span>
                  </div>

                  <button
                    className="btn btn-danger rounded-3 px-4"
                    disabled={creatingAccount}
                    onClick={handleCreateAccount}
                  >
                    {creatingAccount ? 'Creating...' : 'Create account'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

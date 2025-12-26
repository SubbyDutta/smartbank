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
import AddMoney from '../components/AddMoney';
import LoanRepaymentPanel from '../components/MyLoans';
import { formatCurrencyINR } from '../utils/format';
import '../UserPage.css';

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'User', role: '' });
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const usernameFromToken = payload?.sub || payload?.username || payload?.user || payload?.name || 'User';

      setUser({ username: usernameFromToken, role: payload?.role || '' });
      checkAccountAndLoad(usernameFromToken);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const balance = formatCurrencyINR(balanceRaw);

  async function checkAccountAndLoad(username) {
    setLoading(true);
    try {
      const res = await API.get('/user/me/account');
      const acct = res.data?.accountNumber ?? res.data?.account_number ?? (typeof res.data === 'string' ? res.data : null);

      if (acct) {
        setHasAccount(true);
        setAccountNumber(acct);
        await fetchBalance();
        await fetchTransactions({ username, page: 0, size: 20 });
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
      } else {
        console.error('Error checking account:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchBalance() {
    try {
      const res = await API.get('/user/balance');
      const raw = res.data;
      const match = String(raw).match(/₹\s?([0-9,.]+)/);
      if (match) {
        setBalanceRaw(parseFloat(match[1].replace(/,/g, '')));
      } else if (typeof raw === 'number') {
        setBalanceRaw(raw);
      } else if (raw?.balance != null) {
        setBalanceRaw(raw.balance);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }

  async function fetchTransactions(options = {}) {
    const {
      username = user.username,
      page = 0,
      size = 20,
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
    } catch (err) {
      console.error('Error fetching transactions:', err);
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
      'balance',
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
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    setFormAdhar(value);
  };

  const handlePanChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
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
      const msg = err?.response?.data?.error || err?.response?.data || 'Failed to create account. Please try again.';
      setCreateError(String(msg));
    } finally {
      setCreatingAccount(false);
    }
  };


  return (
    <div className="up-root">
      <button
        className="mobile-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        active={active}
        setActive={(view) => {
          guardedSetActive(view);
          setSidebarOpen(false);
        }}
        logout={logout}
        hasAccount={hasAccount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="up-main">
        <div className="up-panels">
            {active === 'dashboard' && hasAccount && (
              <DashboardPanel
                setActive={guardedSetActive}
                transactions={transactions}
                balance={balanceRaw}
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
                balance={balanceRaw}
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
              background: 'rgba(15, 23, 42, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4000,
              backdropFilter: 'blur(8px)',
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: 'spring' }}
              className="card shadow-lg"
              style={{
                width: '100%',
                maxWidth: 560,
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h5 className="mb-1 fw-bold">Create Your Account</h5>
                  <div style={{ fontSize: 13, opacity: 0.95 }}>
                    Get started with SecureBank in minutes
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  <i className="bi bi-bank"></i>
                </div>
              </div>

              <div className="card-body" style={{ padding: '1.5rem' }}>
                <AnimatePresence mode="wait">
                  {showSuccess && (
                    <motion.div
                      key="create-success"
                      className="alert alert-success d-flex align-items-center py-2 mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ borderRadius: 12 }}
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <span className="small">Account created successfully!</span>
                    </motion.div>
                  )}

                  {createError && (
                    <motion.div
                      key="create-error"
                      className="alert alert-danger d-flex align-items-center py-2 mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ borderRadius: 12 }}
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <span className="small">{createError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold mb-1">
                      <i className="bi bi-person-badge me-1 text-danger"></i>
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAdhar}
                      onChange={handleAdharChange}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      style={{ borderRadius: 10 }}
                    />
                    <div className="form-text small">12 digits required</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold mb-1">
                      <i className="bi bi-credit-card me-1 text-danger"></i>
                      PAN Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formPAN}
                      onChange={handlePanChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      style={{ borderRadius: 10, textTransform: 'uppercase' }}
                    />
                    <div className="form-text small">Format: ABCDE1234F</div>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold mb-1">
                      <i className="bi bi-bank me-1 text-danger"></i>
                      Account Type
                    </label>
                    <select
                      className="form-select"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      style={{ borderRadius: 10 }}
                    >
                      <option value="">Choose account type...</option>
                      <option value="savings">💰 Savings Account</option>
                      <option value="current">💼 Current Account</option>
                      <option value="salary">💵 Salary Account</option>
                    </select>
                  </div>
                </div>

                <div
                  className="p-3 mb-3"
                  style={{
                    background: 'rgba(230,57,70,0.05)',
                    borderRadius: 12,
                    border: '1px solid rgba(230,57,70,0.1)',
                  }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-shield-check-fill text-danger mt-1"></i>
                    <div className="small text-muted">
                      <strong className="d-block mb-1">Secure KYC Process</strong>
                      Your Aadhaar and PAN details are encrypted and verified as per RBI guidelines to ensure maximum security.
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                  </div>

                  <button
                    className="btn btn-danger px-4 py-2"
                    disabled={creatingAccount}
                    onClick={handleCreateAccount}
                    style={{ borderRadius: 12, fontWeight: 600 }}
                  >
                    {creatingAccount ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Account
                      </>
                    )}
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
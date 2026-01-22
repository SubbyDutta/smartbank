import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 10;

export default function TransactionsPanel({ transactions, loading, balance, onReload }) {
  const [page, setPage] = useState(0);
  const [lastFetchedCount, setLastFetchedCount] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (onReload) {
      onReload({
        page,
        size: PAGE_SIZE,
        from: from || undefined,
        to: to || undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      });
    }
  }, [page]);

  useEffect(() => {
    setLastFetchedCount(transactions?.length || 0);
  }, [transactions]);

  const hasPrev = page > 0;
  const hasNext = lastFetchedCount === PAGE_SIZE;

  const formatBalance = (bal) => {
    if (typeof bal === 'number') {
      return bal.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
    }
    return '₹0.00';
  };

  const formatAmount = (amt) => {
    if (typeof amt === 'number') {
      return amt.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }
    return amt;
  };

  const handleReloadClick = () => {
    if (onReload) {
      setPage(0);
      onReload({
        page: 0,
        size: PAGE_SIZE,
        from: from || undefined,
        to: to || undefined,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
      });
    }
  };

  const applyFilters = () => {
    setPage(0);
    onReload({
      page: 0,
      size: PAGE_SIZE,
      from: from || undefined,
      to: to || undefined,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
    });
  };

  const clearFilters = () => {
    setFrom('');
    setTo('');
    setMinAmount('');
    setMaxAmount('');
    setShowFilters(false);
    setPage(0);
    onReload({ page: 0, size: PAGE_SIZE });
  };

  const getTransactionIcon = (transaction) => {
    const amount = transaction.amount || 0;
    if (amount > 100000) return 'bi-stars';
    if (amount > 50000) return 'bi-lightning-charge-fill';
    if (amount > 10000) return 'bi-arrow-up-circle-fill';
    return 'bi-arrow-right-circle-fill';
  };

  const getTransactionColor = (transaction) => {
    const amount = transaction.amount || 0;
    if (amount > 100000) return '#FFD700'; // Gold
    if (amount > 50000) return 'var(--color-black)';
    if (amount > 10000) return 'var(--color-render-purple)';
    return 'var(--text-secondary)';
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      fontFamily: '"Inter", sans-serif',
    }}>

      {/* Hero Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          borderRadius: 24,
          padding: '40px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)',
          animation: 'pulse-slow 8s infinite ease-in-out',
        }} />

        <div className='d-flex justify-content-between align-items-start position-relative' style={{ zIndex: 2 }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: 8, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Total Balance
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1.5px', background: 'linear-gradient(to right, #fff, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {formatBalance(balance)}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.8 }}>
                <i className="bi bi-shield-check-fill text-success"></i>
                <span style={{ fontSize: '0.9rem' }}>Secure & Encrypted</span>
              </div>
            </motion.div>
          </div>

          <div className='d-flex gap-3'>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '12px 24px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                background: showFilters ? '#fff' : 'rgba(255, 255, 255, 0.1)',
                color: showFilters ? '#000' : '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className={`bi ${showFilters ? 'bi-x-lg' : 'bi-funnel'}`}></i>
              {showFilters ? 'Close' : 'Filter'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180, transition: { duration: 0.5 } }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReloadClick}
              disabled={loading}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm' : ''}`} style={{ fontSize: '1.2rem' }}></i>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: '#fff',
              borderRadius: 20,
              padding: 30,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h6 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Refine Transactions</h6>
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#e63946', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Reset All</button>
              </div>
              <div className='row g-4'>
                {[
                  { label: 'From Date', value: from, onChange: setFrom, type: 'date' },
                  { label: 'To Date', value: to, onChange: setTo, type: 'date' },
                  { label: 'Min Amount', value: minAmount, onChange: setMinAmount, type: 'number', placeholder: '₹ 0' },
                  { label: 'Max Amount', value: maxAmount, onChange: setMaxAmount, type: 'number', placeholder: '₹ ∞' },
                ].map((input, idx) => (
                  <div className='col-md-3' key={idx}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>{input.label}</label>
                      <input
                        type={input.type}
                        value={input.value}
                        onChange={(e) => input.onChange(e.target.value)}
                        placeholder={input.placeholder}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 12,
                          border: '1px solid #e0e0e0',
                          background: '#f8f9fa',
                          fontSize: '0.95rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#000'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={applyFilters}
                style={{
                  marginTop: 24,
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: '#000',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        padding: 32,
        minHeight: 400,
      }}>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h4 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Transaction History</h4>
          <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500 }}>
            {transactions?.length || 0} Records Found
          </div>
        </div>

        {!loading && (!transactions || transactions.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.6 }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', marginBottom: 16, display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No transactions found.</p>
          </div>
        ) : (
          <motion.table
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}
          >
            <thead>
              <tr>
                {['Date', 'From', 'To', 'Amount', 'Status'].map((h, i) => (
                  <th key={i} style={{
                    textAlign: h === 'Amount' ? 'right' : 'left',
                    padding: '0 24px 16px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: '#999',
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions?.map((t, i) => (
                <motion.tr
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', backgroundColor: '#fff' }}
                  style={{
                    background: '#fdfdfd',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    borderRadius: 16,
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                  }}
                >
                  <td style={{ padding: '20px 24px', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: getTransactionColor(t),
                      }}>
                        <i className={`bi ${getTransactionIcon(t)}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111' }}>
                          {t.timestamp ? new Date(t.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                          {t.timestamp ? new Date(t.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', fontWeight: 500, color: '#444' }}>
                    {t.senderAccount || t.from || '—'}
                  </td>
                  <td style={{ padding: '20px 24px', fontWeight: 500, color: '#444' }}>
                    {t.receiverAccount || t.to || '—'}
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#111',
                      letterSpacing: '-0.5px'
                    }}>
                      {formatAmount(t.amount)}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#999', marginLeft: 4 }}>INR</span>
                  </td>
                  <td style={{ padding: '20px 24px', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)', padding: '6px 12px', borderRadius: 20, width: 'fit-content' }}>
                      <i className="bi bi-check-circle-fill"></i> Success
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-4 pt-4 border-top'>
          <button
            disabled={!hasPrev || loading}
            onClick={() => setPage(p => p - 1)}
            style={{
              background: 'none',
              border: 'none',
              color: hasPrev ? '#000' : '#ccc',
              fontWeight: 600,
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="bi bi-arrow-left"></i> Previous
          </button>
          <div style={{ fontSize: '0.9rem', color: '#888' }}>Page {page + 1}</div>
          <button
            disabled={!hasNext || loading}
            onClick={() => setPage(p => p + 1)}
            style={{
              background: 'none',
              border: 'none',
              color: hasNext ? '#000' : '#ccc',
              fontWeight: 600,
              cursor: hasNext ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Next <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
          100% { opacity: 0.1; transform: scale(1); }
        }
      `}</style>
    </div >
  );
}
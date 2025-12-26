import React, { useEffect, useState } from "react";
import LoadingInline from "./LoadingInLine";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 20;

export default function TransactionsPanel({ transactions, loading, balance, onReload }) {
  const [page, setPage] = useState(0);
  const [lastFetchedCount, setLastFetchedCount] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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
    setSearchQuery('');
    setSelectedType('all');
    setPage(0);
    onReload({ page: 0, size: PAGE_SIZE });
  };

  const getTransactionIcon = (transaction) => {
    const amount = transaction.amount || 0;
    if (amount > 50000) return 'bi-lightning-charge-fill';
    if (amount > 10000) return 'bi-arrow-up-circle-fill';
    return 'bi-arrow-right-circle-fill';
  };

  const getTransactionColor = (transaction) => {
    const amount = transaction.amount || 0;
    if (amount > 50000) return '#f59e0b';
    if (amount > 10000) return '#8b5cf6';
    return '#e63946';
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)',
          borderRadius: 24,
          padding: 32,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(230, 57, 70, 0.3)',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
        }} />

        <div className='d-flex justify-content-between align-items-start position-relative'>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: 8, fontWeight: 500 }}>
                Account Balance
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
                {formatBalance(balance)}
              </h2>
              <p style={{ fontSize: '0.9375rem', opacity: 0.95, marginBottom: 0 }}>
                Complete transaction history and analytics
              </p>
            </motion.div>
          </div>
          
          <div className='d-flex gap-2'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: 'none',
                background: showFilters ? '#fff' : 'rgba(255, 255, 255, 0.2)',
                color: showFilters ? '#e63946' : '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className='bi bi-funnel-fill me-2'></i>
              Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReloadClick}
              disabled={loading}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                backdropFilter: 'blur(10px)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'spinner-border spinner-border-sm' : ''}`}></i>
              {loading ? 'Loading...' : 'Refresh'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 24,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h6 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 0 }}>
                <i className='bi bi-sliders text-danger me-2'></i>
                Advanced Filters
              </h6>
              <button
                onClick={clearFilters}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#6b7280',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <i className='bi bi-x-circle me-1'></i>
                Clear All
              </button>
            </div>

            <div className='row g-3'>
              <div className='col-md-3'>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>
                  From Date
                </label>
                <input
                  type='date'
                  className='form-control'
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    padding: '10px 12px',
                  }}
                />
              </div>
              <div className='col-md-3'>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>
                  To Date
                </label>
                <input
                  type='date'
                  className='form-control'
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    padding: '10px 12px',
                  }}
                />
              </div>
              <div className='col-md-3'>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>
                  Min Amount (₹)
                </label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='0'
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    padding: '10px 12px',
                  }}
                />
              </div>
              <div className='col-md-3'>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>
                  Max Amount (₹)
                </label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='∞'
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    padding: '10px 12px',
                  }}
                />
              </div>
            </div>

            <div className='mt-3'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={applyFilters}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(230, 57, 70, 0.25)',
                }}
              >
                <i className='bi bi-search me-2'></i>
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.03) 0%, rgba(255, 107, 129, 0.03) 100%)',
        }}>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h5 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                Transaction History
              </h5>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 0 }}>
                {transactions && transactions.length > 0 
                  ? `Showing ${transactions.length} of many transactions` 
                  : 'No transactions to display'}
              </p>
            </div>
            {transactions && transactions.length > 0 && (
              <div style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(230, 57, 70, 0.1)',
                color: '#e63946',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}>
                Page {page + 1}
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className='text-center py-5'>
              <div style={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                borderRadius: '50%',
                border: '4px solid #f3f4f6',
                borderTopColor: '#e63946',
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 600 }}>
                Loading transactions...
              </div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{
                    padding: '16px 28px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <i className='bi bi-calendar3 me-2'></i>
                    Date & Time
                  </th>
                  <th style={{
                    padding: '16px 28px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <i className='bi bi-person me-2'></i>
                    From Account
                  </th>
                  <th style={{
                    padding: '16px 28px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <i className='bi bi-person-check me-2'></i>
                    To Account
                  </th>
                  <th style={{
                    padding: '16px 28px',
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e5e7eb',
                  }}>
                    <i className='bi bi-currency-rupee me-2'></i>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '18px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: `${getTransactionColor(t)}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <i className={`bi ${getTransactionIcon(t)}`} style={{
                            fontSize: 16,
                            color: getTransactionColor(t),
                          }}></i>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                            {t.timestamp ? new Date(t.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : '—'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            {t.timestamp ? new Date(t.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: '#f9fafb',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#4b5563',
                        fontFamily: 'monospace',
                      }}>
                        {t.senderAccount || t.from || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '18px 28px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: '#f9fafb',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#4b5563',
                        fontFamily: 'monospace',
                      }}>
                        {t.receiverAccount || t.to || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '18px 28px', textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 14px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(255, 107, 129, 0.05) 100%)',
                        border: '1px solid rgba(230, 57, 70, 0.1)',
                      }}>
                        <i className='bi bi-currency-rupee' style={{ fontSize: '0.875rem', color: '#e63946' }}></i>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#e63946' }}>
                          {formatAmount(t.amount)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='text-center py-5'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 107, 129, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className='bi bi-inbox' style={{ fontSize: 48, color: '#e63946' }}></i>
              </motion.div>
              <h6 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                No Transactions Found
              </h6>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 0, maxWidth: 400, margin: '0 auto' }}>
                Your transaction history will appear here once you start making transfers
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {transactions && transactions.length > 0 && (
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid #f3f4f6',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
              <i className='bi bi-list-ul me-2'></i>
              Showing {transactions.length} transactions on page {page + 1}
            </div>
            <div className='d-flex gap-2'>
              <motion.button
                whileHover={hasPrev ? { scale: 1.05 } : {}}
                whileTap={hasPrev ? { scale: 0.95 } : {}}
                onClick={() => hasPrev && !loading && setPage((p) => p - 1)}
                disabled={!hasPrev}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  background: hasPrev ? '#fff' : '#f9fafb',
                  color: hasPrev ? '#111827' : '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: hasPrev ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className='bi bi-chevron-left me-1'></i>
                Previous
              </motion.button>
              <motion.button
                whileHover={hasNext ? { scale: 1.05 } : {}}
                whileTap={hasNext ? { scale: 0.95 } : {}}
                onClick={() => hasNext && !loading && setPage((p) => p + 1)}
                disabled={!hasNext}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: hasNext ? 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)' : '#f9fafb',
                  color: hasNext ? '#fff' : '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: hasNext ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: hasNext ? '0 4px 12px rgba(230, 57, 70, 0.25)' : 'none',
                }}
              >
                Next
                <i className='bi bi-chevron-right ms-1'></i>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
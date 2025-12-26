import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickActions = [
  { 
    title: 'Send Money', 
    icon: 'bi-send-fill', 
    action: 'transfer', 
    gradient: 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)', 
    desc: 'Instant transfers',
    iconBg: '#fee2e2',
    iconColor: '#e63946'
  },
  { 
    title: 'Add Funds', 
    icon: 'bi-wallet2', 
    action: 'addMoney', 
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
    desc: 'Top up account',
    iconBg: '#d1fae5',
    iconColor: '#059669'
  },
  { 
    title: 'View History', 
    icon: 'bi-clock-history', 
    action: 'tx', 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
    desc: 'All transactions',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed'
  },
  { 
    title: 'Quick Loan', 
    icon: 'bi-lightning-charge-fill', 
    action: 'loan', 
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
    desc: 'Fast approval',
    iconBg: '#fef3c7',
    iconColor: '#d97706'
  },
];

export default function DashboardPanel({ setActive, transactions = [], balance = 0 }) {
  const [hoveredAction, setHoveredAction] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Process transactions for chart - memoized for performance
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Group transactions by date
    const groupedByDate = {};
    
    transactions.forEach((tx) => {
      if (!tx.timestamp) return;
      
      const date = new Date(tx.timestamp);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          amount: 0,
          count: 0,
        };
      }
      
      groupedByDate[dateKey].amount += Number(tx.amount) || 0;
      groupedByDate[dateKey].count += 1;
    });

    // Convert to array and get last 7 days
    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  }, [transactions]);

  // Get recent 5 transactions - memoized
  const recentTransactions = useMemo(() => {
    return (transactions || []).slice(0, 5);
  }, [transactions]);

  // Calculate transaction stats - memoized
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        avgTransaction: 0,
      };
    }

    const totalVolume = transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    
    return {
      totalTransactions: transactions.length,
      totalVolume,
      avgTransaction: totalVolume / transactions.length,
    };
  }, [transactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid rgba(230, 57, 70, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
            {payload[0].payload.date}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e63946' }} />
            <span style={{ fontSize: '0.8125rem', color: '#111827', fontWeight: 600 }}>
              ₹{payload[0].value.toLocaleString()}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
            {payload[0].payload.count} transaction{payload[0].payload.count !== 1 ? 's' : ''}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (transaction) => {
    const amount = transaction.amount || 0;
    if (amount > 50000) return { icon: 'bi-lightning-charge-fill', color: '#f59e0b' };
    if (amount > 10000) return { icon: 'bi-arrow-up-circle-fill', color: '#8b5cf6' };
    return { icon: 'bi-arrow-right-circle-fill', color: '#e63946' };
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>
      {/* Hero Section */}
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
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(80px)',
        }} />
        
        <div className='position-relative'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: 8, fontWeight: 500 }}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
              Dashboard
            </h2>
            <p style={{ fontSize: '0.9375rem', opacity: 0.95, marginBottom: 0 }}>
              Overview of your last 20 transactions • For more history, visit{' '}
              <span 
                onClick={() => setActive('tx')}
                style={{ 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Transactions
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 0 }}>
            <i className='bi bi-lightning-fill text-danger me-2'></i>
            Quick Actions
          </h5>
        </div>
        
        <div className='row g-3'>
          {quickActions.map((action, idx) => (
            <div key={idx} className='col-lg-3 col-md-6'>
              <motion.div
                onClick={() => setActive(action.action)}
                onHoverStart={() => setHoveredAction(idx)}
                onHoverEnd={() => setHoveredAction(null)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: 24,
                  cursor: 'pointer',
                  border: hoveredAction === idx ? '2px solid #e63946' : '2px solid transparent',
                  boxShadow: hoveredAction === idx 
                    ? '0 12px 40px rgba(230, 57, 70, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {hoveredAction === idx && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.1 }}
                    style={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: action.iconColor,
                    }}
                  />
                )}
                
                <div className='text-center position-relative'>
                  <motion.div
                    animate={{ rotate: hoveredAction === idx ? [0, -10, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: action.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <i className={`bi ${action.icon}`} style={{ fontSize: 28, color: action.iconColor }}></i>
                  </motion.div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                    {action.desc}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transaction Activity Chart & Stats */}
      <div className='row g-3'>
        {/* Transaction Chart */}
        <div className='col-lg-8'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 28,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              height: '100%',
            }}
          >
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <div>
                <h5 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                  Transaction Activity
                </h5>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 0 }}>
                  {chartData.length > 0 ? 'Last 7 days overview' : 'No transaction data available'}
                </p>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width='100%' height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id='colorAmount' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#e63946' stopOpacity={0.3}/>
                      <stop offset='95%' stopColor='#e63946' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
                  <XAxis 
                    dataKey='date' 
                    stroke='#9ca3af' 
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
                  />
                  <YAxis 
                    stroke='#9ca3af' 
                    style={{ fontSize: '0.75rem', fontWeight: 600 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type='monotone'
                    dataKey='amount'
                    stroke='#e63946'
                    strokeWidth={3}
                    fill='url(#colorAmount)'
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className='text-center py-5'>
                <div style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  background: 'rgba(230, 57, 70, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <i className='bi bi-graph-up' style={{ fontSize: 32, color: '#e63946' }}></i>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Start making transactions to see your activity chart
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Transaction Stats */}
        <div className='col-lg-4'>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 28,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              height: '100%',
            }}
          >
            <h5 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 20 }}>
              Statistics
            </h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: 16,
                borderRadius: 14,
                background: 'rgba(230, 57, 70, 0.05)',
                border: '1px solid rgba(230, 57, 70, 0.1)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>
                  Total Transactions
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e63946' }}>
                  {stats.totalTransactions}
                </div>
              </div>

              <div style={{
                padding: 16,
                borderRadius: 14,
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>
                  Total Volume
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                  {formatCurrency(stats.totalVolume)}
                </div>
              </div>

              <div style={{
                padding: 16,
                borderRadius: 14,
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>
                  Avg. Transaction
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>
                  {formatCurrency(stats.avgTransaction)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 28,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <h5 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              Recent Activity
            </h5>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: 0 }}>
              Latest 5 transactions
            </p>
          </div>
          <button
            onClick={() => setActive('tx')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e63946';
              e.currentTarget.style.color = '#e63946';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
          >
            View All <i className='bi bi-arrow-right ms-1'></i>
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentTransactions.map((activity, idx) => {
              const iconData = getTransactionIcon(activity);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: '#fafafa' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 14,
                    border: '1px solid #f3f4f6',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${iconData.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                    }}
                  >
                    <i className={`bi ${iconData.icon}`} style={{ fontSize: 20, color: iconData.color }}></i>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                      {activity.senderAccount || 'N/A'} → {activity.receiverAccount || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </div>
                  
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#e63946',
                    }}
                  >
                    ₹{(activity.amount || 0).toLocaleString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-4'>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'rgba(230, 57, 70, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className='bi bi-clock-history' style={{ fontSize: 32, color: '#e63946' }}></i>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 0 }}>
              No recent transactions to display
            </p>
          </div>
        )}
      </motion.div>

      {/* Security Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(255, 107, 129, 0.05) 100%)',
          borderRadius: 16,
          padding: 20,
          border: '1px solid rgba(230, 57, 70, 0.1)',
        }}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center gap-3'>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(230, 57, 70, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className='bi bi-shield-check-fill' style={{ fontSize: 22, color: '#e63946' }}></i>
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                Bank-grade Security
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Your transactions are encrypted and protected 24/7
              </div>
            </div>
          </div>
          <div className='d-flex align-items-center gap-2'>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#059669' }}>
              All Systems Operational
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
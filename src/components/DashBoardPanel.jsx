import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Users', value: '5.2M+', icon: 'bi-people-fill', color: '#3b82f6' },
  { label: 'Transactions/Day', value: '12.5M+', icon: 'bi-graph-up-arrow', color: '#10b981' },
  { label: 'Security Score', value: '99.9%', icon: 'bi-shield-check', color: '#ef4444' },
];

const features = [
  { title: 'Instant Transfers', desc: 'Send money securely and instantly.', icon: 'bi-lightning-charge-fill', color: '#f59e0b' },
  { title: 'Add Funds', desc: 'Top up your account in seconds.', icon: 'bi-wallet2', color: '#10b981' },
  { title: 'Loan Management', desc: 'Apply for loans and manage repayments.', icon: 'bi-file-earmark-text-fill', color: '#8b5cf6' },
  { title: 'Transaction History', desc: 'View all your transactions in one place.', icon: 'bi-clock-history', color: '#3b82f6' },
  { title: 'Fraud Detection', desc: 'Advanced monitoring for every transaction.', icon: 'bi-shield-check-fill', color: '#ef4444' },
  { title: 'Bill Payments', desc: 'Pay utilities and bills seamlessly.', icon: 'bi-receipt-cutoff', color: '#ec4899' },
];

export default function DashboardPanel({ setActive }) {
  const panelStyle = {
    width: '100%',
    maxWidth: 850,
    borderRadius: 20,
    height:700,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    top: 10,
    position: "fixed"
  };

  return (
    <motion.div
      className='panel card border-0 shadow-lg p-3 p-md-4'
      style={panelStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 pb-2 border-bottom border-light'>
          <div className='mb-2 mb-md-0'>
            <h4 className='fw-bold mb-1' style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quick Actions
            </h4>
            <p className='text-muted small mb-0' style={{ fontSize: '0.85rem' }}>
              <i className='bi bi-lightning-charge-fill me-1 text-warning'></i>
              Common tasks at a glance
            </p>
          </div>

          <div className='d-flex gap-2'>
            <motion.button
              className='btn btn-danger px-3 py-2'
              onClick={() => setActive('transfer')}
              style={{ fontWeight: 600, borderRadius: 10, fontSize: '0.9rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className='bi bi-arrow-left-right me-2'></i>Transfer
            </motion.button>

            <motion.button
              className='btn btn-outline-danger px-3 py-2'
              onClick={() => setActive('addMoney')}
              style={{ fontWeight: 600, borderRadius: 10, fontSize: '0.9rem', borderWidth: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className='bi bi-wallet2 me-2'></i>Add Money
            </motion.button>
          </div>
        </div>

        <motion.div className='mb-4 pb-3' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className='row g-3 align-items-center'>
            <div className='col-md-6 text-center text-md-start'>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className='mb-2'>
                  <span className='badge px-2 py-1' style={{ background: 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                    <i className='bi bi-star-fill me-1'></i>Trusted by 5M+ Users
                  </span>
                </div>
                
                <h2 className='fw-bold mb-2' style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', background: 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                  All-in-One Digital Banking
                </h2>
                
                <p className='text-muted' style={{ maxWidth: '480px', fontSize: '1rem', lineHeight: 1.6 }}>
                  Manage your finances with ease — from deposits and transfers to loans and repayments.
                </p>

                <div className='mt-3 d-flex gap-2 flex-wrap'>
                  <div className='d-flex align-items-center gap-1'>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></div>
                    <small className='text-muted' style={{ fontSize: '0.8rem' }}>Live System</small>
                  </div>
                  <div className='d-flex align-items-center gap-1'>
                    <i className='bi bi-shield-check-fill text-success' style={{ fontSize: '0.9rem' }}></i>
                    <small className='text-muted' style={{ fontSize: '0.8rem' }}>Bank-Grade Security</small>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className='col-md-6'>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ background: 'linear-gradient(135deg, rgba(255,107,129,0.05) 0%, rgba(230,57,70,0.05) 100%)', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(220,53,69,0.1)' }}>
                <div className='d-flex gap-2 justify-content-center flex-wrap'>
                  {[
                    { icon: 'bi-wallet2', label: 'Wallet', color: '#ff6b81' },
                    { icon: 'bi-credit-card-2-front-fill', label: 'Card', color: '#3b82f6' },
                    { icon: 'bi-graph-up-arrow', label: 'Analytics', color: '#10b981' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className='card border-0 shadow-sm'
                      style={{ width: 100, height: 60, background: i === 1 ? 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)' : '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}
                      whileHover={{ scale: 1.1, rotate: i === 1 ? 5 : -5, zIndex: 10, boxShadow: `0 6px 16px ${item.color}40` }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <i className={`bi ${item.icon}`} style={{ fontSize: 20, color: i === 1 ? '#fff' : item.color }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: i === 1 ? '#fff' : '#212529' }}>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div className='mb-4' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className='d-flex flex-wrap justify-content-center gap-3'>
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className='card border-0 p-2'
                style={{ flex: '1', minWidth: '130px', maxWidth: '220px', background: '#fff', borderRadius: 14, boxShadow: '0 3px 10px rgba(0,0,0,0.05)', border: `1px solid ${stat.color}20` }}
                whileHover={{ scale: 1.05, boxShadow: `0 6px 16px ${stat.color}30` }}
              >
                <div className='d-flex align-items-center gap-2'>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div>
                    <div className='fw-bold' style={{ fontSize: '1.25rem', color: '#212529' }}>{stat.value}</div>
                    <div className='text-muted small' style={{ fontSize: '0.7rem' }}>{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className='mt-4 pt-2'>
          <div className='d-flex align-items-center mb-3'>
            <h5 className='fw-bold mb-0 me-2' style={{ background: 'linear-gradient(135deg, #ff6b81 0%, #e63946 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.1rem' }}>
              Our Services
            </h5>
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #ff6b81, transparent)', borderRadius: 2 }} />
          </div>
          
          <div className='d-flex overflow-auto pb-2' style={{ gap: '1rem', scrollSnapType: 'x mandatory' }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className='card flex-shrink-0 text-center p-3 border-0'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ minWidth: 180, maxWidth: 180, scrollSnapAlign: 'start', background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', borderRadius: 14, cursor: 'pointer', border: '1px solid rgba(220,53,69,0.08)' }}
                whileHover={{ translateY: -6, boxShadow: '0 10px 20px rgba(0,0,0,0.12)', borderColor: feature.color }}
              >
                <div style={{ width: 60, height: 60, margin: '0 auto 0.75rem', background: `linear-gradient(135deg, ${feature.color}80, ${feature.color})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${feature.color}40` }}>
                  <i className={`bi ${feature.icon}`} style={{ fontSize: 24, color: '#fff' }} />
                </div>
                
                <h6 className='fw-bold mb-1' style={{ color: '#212529', fontSize: '0.9rem' }}>{feature.title}</h6>
                <p className='text-muted' style={{ fontSize: '0.75rem', lineHeight: 1.4, margin: 0 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div className='text-center mt-4 pt-3 border-top border-light' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className='d-flex align-items-center justify-content-center gap-2 text-muted small' style={{ fontSize: '0.8rem' }}>
            <i className='bi bi-shield-check-fill text-danger'></i>
            <span>Secure & Protected</span>
            <span className='mx-1'>•</span>
            <i className='bi bi-clock-fill'></i>
            <span>24/7 Available</span>
            <span className='mx-1'>•</span>
            <i className='bi bi-headset'></i>
            <span>Expert Support</span>
          </div>
          <p className='text-muted mt-1 mb-0' style={{ fontSize: '0.75rem' }}>
            © 2025 SecureBank — Empowering Your Digital Finance Journey
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
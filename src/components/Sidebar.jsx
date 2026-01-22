import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';

export default function Sidebar({ user, active, setActive, logout, hasAccount, isOpen, onClose, accountNumber }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-house-door-fill' },
    { key: 'transfer', label: 'Wallet Actions', icon: 'bi-arrow-left-right' },
    { key: 'tx', label: 'Transactions', icon: 'bi-clock-history' },
    { key: 'chatbot', label: 'AI Chatbot', icon: 'bi-chat-dots-fill' },
    { key: 'loan', label: 'Apply for Loan', icon: 'bi-file-earmark-text-fill' },
    { key: 'myloan', label: 'My Loans', icon: 'bi-credit-card-2-front-fill' },
  ];

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.05, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    padding: '24px',
    width: 280,
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : -280,
    background: 'var(--bg-primary)',
    boxShadow: isOpen ? 'var(--shadow-xl)' : 'none',
    transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    zIndex: 1000,
    borderRight: '1px solid var(--border-light)',
    color: 'var(--text-secondary)',
  };

  return (
    <motion.aside
      className={`up-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      style={sidebarStyle}
      initial='hidden'
      animate='visible'
      variants={sidebarVariants}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* User Profile Section */}
        <motion.div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            marginBottom: 36,
            paddingBottom: 28,
            borderBottom: '1px solid var(--border-light)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
        >
          <motion.div
            className='up-avatar'
            style={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'var(--color-primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: 20,
              boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {user.username?.charAt(0)?.toUpperCase() || 'U'}
          </motion.div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className='up-username'
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--text-primary)',
                marginBottom: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.username || 'User'}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12
            }}>
              <div className='up-role' style={{
                color: 'var(--text-tertiary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: 10,
                letterSpacing: '0.8px',
              }}>
                {String(user.role || 'USER').toUpperCase()}
              </div>
              {hasAccount && accountNumber && (
                <div style={{
                  color: 'var(--color-black)',
                  fontWeight: 700,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--bg-secondary)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  marginTop: 4,
                  width: 'fit-content',
                  border: '1px solid var(--border-light)'
                }}>
                  #{accountNumber}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <LayoutGroup>
          <nav className='up-nav' style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map((item, index) => {
              const isActive = active === item.key;

              return (
                <motion.button
                  key={item.key}
                  className={`up-btn ${isActive ? 'active' : ''}`}
                  onClick={() => hasAccount && setActive(item.key)}
                  disabled={!hasAccount}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    border: 'none',
                    cursor: hasAccount ? 'pointer' : 'not-allowed',
                    opacity: hasAccount ? 1 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  variants={itemVariants}
                  whileHover={hasAccount && !isActive ? {
                    x: 4,
                    color: 'var(--text-primary)',
                  } : {}}
                  whileTap={hasAccount ? { scale: 0.97 } : {}}
                  initial='hidden'
                  animate='visible'
                  custom={index}
                >
                  {/* Sliding Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--color-black)',
                        borderRadius: 'var(--radius-md)',
                        zIndex: -1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover background for non-active items */}
                  {!isActive && hasAccount && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        zIndex: -1,
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 1 }}
                    />
                  )}

                  <i
                    className={`bi ${item.icon}`}
                    style={{
                      fontSize: 18,
                      minWidth: 20,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                  <span style={{ flex: 1, position: 'relative', zIndex: 1 }}>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>

      <motion.div
        className='up-logout'
        style={{ marginTop: 'auto', paddingTop: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
      >
        <motion.button
          className='ghost'
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          whileHover={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--color-black)',
            borderColor: 'var(--color-black)',
            scale: 1.02,
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <i className='bi bi-box-arrow-right'></i>
          Logout
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BalanceHeader({ 
  balance, 
  accountNumber, 
  loading,
  onTransferClick,
  onAddMoneyClick 
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div 
      className="balance-compact-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="balance-compact-content">
        {/* Left - Subtle Balance Indicator */}
        <motion.div 
          className="balance-indicator"
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="bi bi-wallet2 me-2"></i>
          <span className="balance-text">
            {loading ? (
              <span className="text-muted small">Loading...</span>
            ) : showDetails ? (
              balance || '₹0.00'
            ) : (
              '••••••'
            )}
          </span>
          <i className={`bi bi-eye${showDetails ? '-slash' : ''} ms-2 toggle-icon`}></i>
        </motion.div>

        {/* Right - Quick Actions */}
        <div className="balance-quick-actions">
          <motion.button
            className="btn btn-sm btn-danger"
            onClick={onTransferClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-send me-1"></i>
            <span className="d-none d-sm-inline">Send</span>
          </motion.button>
          
          <motion.button
            className="btn btn-sm btn-outline-danger"
            onClick={onAddMoneyClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            <span className="d-none d-sm-inline">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && accountNumber && (
          <motion.div
            className="balance-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="account-info">
              <i className="bi bi-credit-card me-2"></i>
              <span className="text-muted small">Account: </span>
              <span className="fw-semibold">{accountNumber}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
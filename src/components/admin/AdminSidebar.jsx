import React from "react";
import { motion } from "framer-motion";
import {
    Home,
    CreditCard,
    Users,
    Wallet,
    FileText,
    DollarSign,
    Search,
    LogOut,
    User,
} from "lucide-react";

const SIDEBAR_WIDTH = 280;

export default function AdminSidebar({
    active,
    setActive,
    onTransactions,
    onLoans,
    onUsers,
    onAccounts,
    searchId,
    setSearchId,
    onSearchUser,
    adminUser,
    onLogout,
}) {
    const handleKeyPress = (e) => e.key === "Enter" && onSearchUser();

    const ACCENT_COLOR = "#e63946"; 
    const sidebarBg = "#ffffff"; 
    const itemBg = "#f8f9fa";
    const inactiveTextColor = "#1f2937"; 

    const navItems = [
        { key: "home", label: "Dashboard", icon: Home, onClick: () => setActive("home") },
        { key: "transactions", label: "Transactions", icon: CreditCard, onClick: onTransactions },
        { key: "loans", label: "Loan Requests", icon: DollarSign, onClick: onLoans },
        { key: "users", label: "User Management", icon: Users, onClick: onUsers },
        { key: "accounts", label: "Accounts Overview", icon: Wallet, onClick: onAccounts },
        { key: "repayments", label: "Loan Repayments", icon: FileText, onClick: () => setActive("repayments") },
    ];

    const sidebarVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    };

    const sidebarStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        padding: "24px",
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        background: sidebarBg,
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        borderRadius: 0,
        borderRight: "1px solid #e5e7eb",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 2000,
        color: inactiveTextColor,
    };

    const NavItem = ({ item }) => {
        const isActive = active === item.key;

        return (
            <motion.button
                key={item.key}
                className={`up-btn ${isActive ? "active" : ""}`}
                onClick={item.onClick}
                style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: isActive ? ACCENT_COLOR : "transparent",
                    color: isActive ? "#fff" : inactiveTextColor,
                    fontWeight: 600,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                    
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    position: "relative",
                }}
               whileHover={
  isActive
    ? {}
    : {
        x: 6,
        backgroundColor: ACCENT_COLOR,
        color: "#fff",
        boxShadow: `0 6px 12px ${ACCENT_COLOR}70`,
        transition: {
          duration: 0.45, 
          ease: "easeInOut",
        },
      }
}transition={{
  type: "tween",
  duration: 0.45,
  ease: "easeInOut",
}}
whileTap={{ scale: 0.97 }}
            >
                <item.icon size={18} style={{ minWidth: 20 }} />
                <span style={{ flex: 1 }}>{item.label}</span>

                {isActive && (
                    <motion.div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 4,
                            height: "70%",
                            background: "#fff",
                            borderRadius: "0 4px 4px 0",
                        }}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </motion.button>
        );
    };

    return (
        <motion.aside
            style={sidebarStyle}
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            <div>
                
                <motion.div
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 32,
                        paddingBottom: 24,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                >
                    <motion.div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: ACCENT_COLOR,
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: 22,
                        boxShadow: `0 4px 12px ${ACCENT_COLOR}40`,
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <User size={24} />
                    </motion.div>
                    <div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 17,
                                color: inactiveTextColor,
                            }}
                        >
                            {adminUser?.username || "Admin Portal"}
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: ACCENT_COLOR,
                                fontWeight: 600,
                                textTransform: "uppercase",
                            }}
                        >
                            Administrator
                        </div>
                    </div>
                </motion.div>

               
                <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {navItems.map((item) => (
                        <NavItem key={item.key} item={item} />
                    ))}
                </nav>

             
            </div>

           
            <motion.div style={{ marginTop: "auto", paddingTop: 24 }}>
                <motion.button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 12,
                        border: `2px solid ${ACCENT_COLOR}40`,
                        background: "transparent",
                        color: ACCENT_COLOR,
                        fontWeight: 600,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    whileHover={{
                        backgroundColor: ACCENT_COLOR,
                        color: "#fff",
                        borderColor: ACCENT_COLOR,
                    }}
                >
                    <LogOut size={16} />
                    Logout
                </motion.button>
            </motion.div>
        </motion.aside>
    );
}

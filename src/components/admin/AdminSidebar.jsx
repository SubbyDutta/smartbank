import React from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
    Home,
    CreditCard,
    Users,
    Wallet,
    FileText,
    DollarSign,
    LogOut,
    User,
    ScrollText,
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

    // Refactored to use Design Tokens
    const isActive = (key) => active === key;

    const navItems = [
        { key: "home", label: "Dashboard", icon: Home, onClick: () => setActive("home") },
        { key: "transactions", label: "Transactions", icon: CreditCard, onClick: onTransactions },
        { key: "loans", label: "Loan Requests", icon: DollarSign, onClick: onLoans },
        { key: "users", label: "User Management", icon: Users, onClick: onUsers },
        { key: "accounts", label: "Accounts Overview", icon: Wallet, onClick: onAccounts },
        { key: "repayments", label: "Loan Repayments", icon: FileText, onClick: () => setActive("repayments") },
        { key: "audit", label: "Audit Logs", icon: ScrollText, onClick: () => setActive("audit") },
    ];

    const sidebarVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, staggerChildren: 0.05, ease: [0.22, 1, 0.36, 1] },
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
        background: "var(--bg-primary)",
        boxShadow: "var(--shadow-xl)",
        borderRadius: 0,
        borderRight: "1px solid var(--border-light)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 2000,
        color: "var(--text-secondary)",
    };

    return (
        <motion.aside
            style={sidebarStyle}
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            <div>
                {/* Admin Profile */}
                <motion.div
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 36,
                        paddingBottom: 28,
                        borderBottom: "1px solid rgba(0,0,0,0.06)", // Subtle divider
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } }}
                >
                    <motion.div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: "16px",
                            background: "var(--color-black)",
                            color: "var(--text-inverse)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 700,
                            fontSize: 22,
                            boxShadow: "0 8px 20px -4px rgba(0,0,0,0.2)",
                        }}
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <User size={24} />
                    </motion.div>
                    <div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: "var(--text-primary)",
                            }}
                        >
                            {adminUser?.username || "Admin Portal"}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--text-tertiary)",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                            }}
                        >
                            Administrator
                        </div>
                    </div>
                </motion.div>

                {/* Navigation */}
                <LayoutGroup id="admin-nav">
                    <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {navItems.map((item) => {
                            const activeItem = isActive(item.key);
                            return (
                                <motion.button
                                    key={item.key}
                                    className={`up-btn`}
                                    onClick={item.onClick}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "var(--radius-md)",
                                        background: "transparent",
                                        color: activeItem ? "var(--text-inverse)" : "var(--text-secondary)",
                                        fontWeight: activeItem ? 600 : 500,
                                        fontSize: 14,
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        textAlign: "left",
                                        position: "relative",
                                        overflow: "hidden", // Contain inner overflow
                                    }}
                                    whileHover={!activeItem ? { x: 4, color: "var(--text-primary)" } : {}}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {/* Sliding Active Pill */}
                                    {activeItem && (
                                        <motion.div
                                            layoutId="admin-active-pill"
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "var(--color-black)",
                                                borderRadius: "var(--radius-md)",
                                                zIndex: -1,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                            }}
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}

                                    {/* Hover Pill for non-active */}
                                    {!activeItem && (
                                        <motion.div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "var(--bg-tertiary)",
                                                borderRadius: "var(--radius-md)",
                                                zIndex: -1,
                                                opacity: 0,
                                            }}
                                            whileHover={{ opacity: 1 }}
                                        />
                                    )}

                                    <item.icon size={18} style={{ minWidth: 20, position: 'relative', zIndex: 1 }} />
                                    <span style={{ flex: 1, position: 'relative', zIndex: 1 }}>{item.label}</span>
                                </motion.button>
                            );
                        })}
                    </nav>
                </LayoutGroup>
            </div>

            {/* Logout */}
            <motion.div style={{ marginTop: "auto", paddingTop: 24 }}>
                <motion.button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    whileHover={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--color-black)",
                        borderColor: "var(--color-black)",
                        scale: 1.02,
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <LogOut size={16} />
                    Logout
                </motion.button>
            </motion.div>
        </motion.aside>
    );
}

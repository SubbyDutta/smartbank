import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    CreditCard,
    AlertTriangle,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    CheckCircle,
    Shield,
    Zap,
} from "lucide-react";

export default function StatTiles({ stats, setView }) {
    const ACCENT_COLOR = "#e63946";
    const BG_COLOR = "#ffffff";
    const CARD_BG = "#ffffff";
    const TEXT_COLOR = "#1f2937";
    const BORDER_COLOR = "#e5e7eb";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const fraudRate =
        stats.totalTransactions > 0
            ? ((stats.fraudCount / stats.totalTransactions) * 100).toFixed(1)
            : 0;

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: ACCENT_COLOR,
            gradient: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
            bg: `${ACCENT_COLOR}15`,
            change: "+12%",
            changePositive: true,
        },
        {
            label: "Transactions",
            value: stats.totalTransactions.toLocaleString(),
            icon: CreditCard,
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981, #059669)",
            bg: "rgba(16, 185, 129, 0.05)",
            change: "+8%",
            changePositive: true,
        },
        {
            label: "Fraud Detected",
            value: stats.fraudCount.toLocaleString(),
            icon: AlertTriangle,
            color: "#ef4444",
            gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
            bg: "rgba(239, 68, 68, 0.05)",
            change: `${fraudRate}%`,
            changePositive: false,
        },
        {
            label: "Total Balance",
            value: "CLICK TO VIEW",
            icon: DollarSign,
            color: "#f59e0b",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            bg: "rgba(245, 158, 11, 0.05)",
            change: "+15%",
            changePositive: true,
            clickable: true,
        },
    ];

    const recentActivity = [
        {
            type: "user",
            message: "New user registration",
            time: "2 min ago",
            icon: Users,
            color: ACCENT_COLOR,
        },
        {
            type: "transaction",
            message: "Large transaction detected",
            time: "5 min ago",
            icon: CreditCard,
            color: "#10b981",
        },
        {
            type: "fraud",
            message: "Fraud alert triggered",
            time: "12 min ago",
            icon: AlertTriangle,
            color: "#ef4444",
        },
        {
            type: "system",
            message: "System backup completed",
            time: "1 hour ago",
            icon: CheckCircle,
            color: "#64748b",
        },
    ];

    const quickStats = [
        { label: "Active Sessions", value: "1,234", icon: Activity, color: "#8b5cf6" },
        { label: "Pending Approvals", value: "23", icon: Clock, color: "#f59e0b" },
        { label: "Success Rate", value: "99.2%", icon: CheckCircle, color: "#10b981" },
    ];

    return (
        <div style={{ 
            width: '100%',
        minWidth: 1200,
        maxWidth: '100%',
        top: -40,
            height: 'calc(100vh - 40px)',
            pointerEvents: "auto", 
            overflowY: "auto", 
            padding: 20, 
            background: BG_COLOR 
        }}>
            {/* Top Stats Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 16,
                    marginBottom: 20,
                }}
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{
                            y: -2,
                            boxShadow: `0 4px 12px ${ACCENT_COLOR}40`,
                        }}
                        onClick={() => stat.clickable && setView?.("bankfund")}
                        style={{
                            background: CARD_BG,
                            borderRadius: 4,
                            padding: 20,
                            border: `1px solid ${BORDER_COLOR}`,
                            cursor: stat.clickable ? "pointer" : "default",
                            transition: "all 0.3s ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        textTransform: "uppercase",
                                        color: "#6b7280",
                                        fontWeight: 600,
                                        letterSpacing: "0.5px",
                                        marginBottom: 8,
                                    }}
                                >
                                    {stat.label}
                                </div>

                                <div
                                    style={{
                                        fontSize: "1.75rem",
                                        fontWeight: 700,
                                        color: TEXT_COLOR,
                                        lineHeight: 1,
                                        marginBottom: 8,
                                    }}
                                >
                                    {stat.value}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {stat.changePositive ? (
                                        <TrendingUp size={12} style={{ color: "#10b981" }} />
                                    ) : (
                                        <TrendingDown size={12} style={{ color: "#ef4444" }} />
                                    )}
                                    <span
                                        style={{
                                            color: stat.changePositive ? "#10b981" : "#ef4444",
                                        }}
                                    >
                                        {stat.change}
                                    </span>
                                    <span style={{ color: "#9ca3af" }}>vs last month</span>
                                </div>

                                {stat.clickable && (
                                    <div
                                        style={{
                                            fontSize: "0.7rem",
                                            color: "#9ca3af",
                                            marginTop: 6,
                                        }}
                                    >
                                        Click to manage funds
                                    </div>
                                )}
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 4,
                                    background: stat.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <stat.icon size={24} color="#fff" strokeWidth={2} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Overview & Activity Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 350px",
                    gap: 16,
                    marginBottom: 20,
                }}
            >
                {/* Quick Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        background: CARD_BG,
                        borderRadius: 4,
                        padding: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: `1px solid ${BORDER_COLOR}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 4,
                                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Zap size={16} color="#fff" strokeWidth={2} />
                        </div>
                        <h5
                            style={{
                                margin: 0,
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: TEXT_COLOR,
                            }}
                        >
                            Quick Overview
                        </h5>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 12,
                        }}
                    >
                        {quickStats.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -2 }}
                                style={{
                                    background: BG_COLOR,
                                    padding: 14,
                                    borderRadius: 4,
                                    border: `1px solid ${BORDER_COLOR}`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 4,
                                        background: `${item.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <item.icon size={14} color={item.color} strokeWidth={2} />
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.7rem",
                                        color: "#6b7280",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.3px",
                                        marginBottom: 4,
                                    }}
                                >
                                    {item.label}
                                </div>
                                <div
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: 700,
                                        color: TEXT_COLOR,
                                    }}
                                >
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        background: CARD_BG,
                        borderRadius: 4,
                        padding: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: `1px solid ${BORDER_COLOR}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${ACCENT_COLOR}, #b91c28)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Activity size={16} color="#fff" strokeWidth={2} />
                        </div>
                        <h5
                            style={{
                                margin: 0,
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: TEXT_COLOR,
                            }}
                        >
                            Recent Activity
                        </h5>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {recentActivity.map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                                whileHover={{ x: 2, backgroundColor: BG_COLOR }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: 10,
                                    borderRadius: 4,
                                    background: "transparent",
                                    border: `1px solid ${BORDER_COLOR}`,
                                    transition: "all 0.2s",
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 4,
                                        background: `${activity.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <activity.icon size={14} color={activity.color} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            color: TEXT_COLOR,
                                            marginBottom: 2,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {activity.message}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "0.7rem",
                                            color: "#9ca3af",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {activity.time}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* System Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                    background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #b91c28 100%)`,
                    borderRadius: 4,
                    padding: 20,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    border: "none",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 6,
                            }}
                        >
                            <Shield size={20} color="#fff" strokeWidth={2} />
                            <h5
                                style={{
                                    margin: 0,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                }}
                            >
                                System Status: All Systems Operational
                            </h5>
                        </div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.75rem",
                                opacity: 0.9,
                                color: "#fff",
                                fontWeight: 500,
                            }}
                        >
                            Last updated: {new Date().toLocaleString()} • Uptime: 99.9%
                        </p>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 4,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.3)",
                        }}
                    >
                        <CheckCircle size={24} color="#fff" strokeWidth={2} />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

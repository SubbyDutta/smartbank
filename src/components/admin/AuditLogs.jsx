import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../api";
import { Search, Filter, Calendar, User, Activity } from "lucide-react";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [actionFilter, setActionFilter] = useState("");
    const [error, setError] = useState(null);

    const fetchLogs = async (p = 0, action = "") => {
        setLoading(true);
        setError(null);
        try {
            let res;
            if (action) {
                res = await API.get(`/admin/logs/action?value=${action}&page=${p}&size=10`);
            } else {
                res = await API.get(`/admin/alllogs?page=${p}&size=10`);
            }
            setLogs(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setError("Failed to load audit logs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(page, actionFilter);
    }, [page]);

    const handleFilterChange = (e) => {
        setActionFilter(e.target.value);
    };

    const applyFilter = () => {
        setPage(0);
        fetchLogs(0, actionFilter);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            applyFilter();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container-fluid"
        >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h4 className="fw-bold mb-1">Audit Logging</h4>
                    <p className="text-muted small mb-0">Monitor all administrative and system actions.</p>
                </div>

                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm" style={{ maxWidth: 300 }}>
                        <span className="input-group-text bg-white border-end-0">
                            <Filter size={14} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Filter by action (e.g. LOGIN, UPDATE)"
                            value={actionFilter}
                            onChange={handleFilterChange}
                            onKeyDown={handleKeyPress}
                        />
                        <button className="btn btn-dark btn-sm" onClick={applyFilter}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div
                className="card shadow-sm border-0"
                style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                }}
            >
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr className="text-muted small" style={{ backgroundColor: "#f9fafb" }}>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                        <span className="text-muted">Loading logs...</span>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        No audit logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <td className="px-4 py-3 small">
                                            <div className="d-flex align-items-center gap-2">
                                                <Calendar size={14} className="text-muted" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 fw-semibold small text-primary">
                                            <div className="d-flex align-items-center gap-2">
                                                <User size={14} className="text-muted" />
                                                {log.username}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge rounded-pill ${log.action.includes('ERROR') ? 'bg-danger-subtle text-danger' :
                                                log.action.includes('UPDATE') || log.action.includes('DELETE') ? 'bg-warning-subtle text-warning' :
                                                    'bg-success-subtle text-success'
                                                }`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 small text-muted" style={{ maxWidth: 400 }}>
                                            <div className="text-truncate" title={log.details}>
                                                {log.details}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer bg-white border-top-0 px-4 py-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">
                        Page {page + 1} of {Math.max(totalPages, 1)}
                    </span>
                    <div className="btn-group">
                        <button
                            className="btn btn-outline-secondary btn-sm px-3"
                            disabled={page === 0 || loading}
                            onClick={() => setPage(page - 1)}
                            style={{ borderRadius: "8px 0 0 8px" }}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm px-3"
                            disabled={page + 1 >= totalPages || loading}
                            onClick={() => setPage(page + 1)}
                            style={{ borderRadius: "0 8px 8px 0" }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

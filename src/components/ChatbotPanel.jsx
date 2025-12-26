import React, { useState, useRef, useEffect } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input, time: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot", { query: userMsg.text });
      const botText = res.data || "No response";
      setMessages((m) => [
        ...m,
        { role: "bot", text: String(botText), time: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Chatbot unavailable. Please try again later.",
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Show my recent transactions",
    "What is my balance?",
    "How do I add money?",
    "Tell me about my loan repayments",
  ];

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.15 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={{
        width: "100%",
        borderRadius: 24,
        background: "#fff",
        overflow: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: '1px solid rgba(0, 0, 0, 0.06)',
        minHeight: 500,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ position: "relative", zIndex: 2 }}>
        
        <div className="mb-4 pb-3 border-bottom border-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 24,
                  boxShadow: "0 6px 16px rgba(230,57,70,0.25)",
                }}
              >
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <h4
                  className="fw-bold mb-1"
                  style={{
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  AI Assistant
                </h4>
                <p className="text-muted small mb-0">
                  <i className="bi bi-sparkles me-1 text-warning"></i>
                  Ask about transfers, balance, loans, or account help.
                </p>
              </div>
            </div>
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                padding: "8px 16px",
                borderRadius: 20,
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <span
                style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600 }}
              >
                <i
                  className="bi bi-circle-fill me-1"
                  style={{ fontSize: 8 }}
                ></i>
                Online
              </span>
            </div>
          </div>
        </div>

        
        <div className="row g-4">
         
          <div className="col-lg-8">
            <div
              className="card border-0"
              style={{
                height: 500,
                background: "#ffffff",
                borderRadius: 16,
                border: "1px solid rgba(220,53,69,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
             
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        width: 100,
                        height: 100,
                        margin: "0 auto 1.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(230,57,70,0.1) 0%, rgba(255,107,129,0.1) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 44,
                        color: "#e63946",
                        border: '3px solid rgba(230,57,70,0.2)',
                      }}
                    >
                      <i className="bi bi-robot"></i>
                    </motion.div>
                    <h5 className="fw-bold mb-2" style={{ color: '#111827' }}>Start a Conversation</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
                      Ask me anything about your account, balance or recent activity.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        variants={messageVariants}
                        className="mb-3"
                        style={{
                          display: "flex",
                          justifyContent:
                            m.role === "user" ? "flex-end" : "flex-start",
                          alignItems: 'flex-start',
                          gap: 8,
                        }}
                      >
                        {m.role === "bot" && (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 14,
                              flexShrink: 0,
                            }}
                          >
                            <i className="bi bi-robot"></i>
                          </div>
                        )}
                        <div
                          style={{
                            maxWidth: "70%",
                            padding: "14px 18px",
                            borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            background:
                              m.role === "user"
                                ? "linear-gradient(135deg, #e63946 0%, #ff6b81 100%)"
                                : "#ffffff",
                            color: m.role === "user" ? "#fff" : "#1f2937",
                            boxShadow:
                              m.role === "user"
                                ? "0 4px 12px rgba(230,57,70,0.25)"
                                : "0 2px 12px rgba(0,0,0,0.08)",
                            fontSize: "0.9375rem",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            border: m.role === "bot" ? '1px solid #f3f4f6' : 'none',
                          }}
                        >
                          {m.text}
                        </div>
                        {m.role === "user" && (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'rgba(230,57,70,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#e63946',
                              fontSize: 14,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {loading && (
                  <motion.div
                    className="d-flex align-items-center gap-2 mb-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e63946 0%, #ff6b81 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                      }}
                    >
                      <i className="bi bi-robot"></i>
                    </div>
                    <div
                      style={{
                        padding: "14px 18px",
                        background: "#ffffff",
                        borderRadius: "18px 18px 18px 4px",
                        maxWidth: "70%",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        border: '1px solid #f3f4f6',
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div className="spinner-border spinner-border-sm text-danger" style={{ width: 16, height: 16 }}></div>
                        <span style={{ fontSize: '0.9375rem', color: '#6b7280' }}>AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              
              <div
                style={{
                  padding: "16px",
                  background: "#ffffff",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <form onSubmit={send} className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                      borderColor: "rgba(220,53,69,0.3)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: "0.95rem",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(e);
                      }
                    }}
                  />
                  <motion.button
                    className="btn btn-danger"
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                      borderRadius: 12,
                      padding: "12px 20px",
                      minWidth: 100,
                      fontWeight: 600,
                    }}
                    variants={buttonVariants}
                    
                    whileTap="tap"
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Send
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>

         
          <div className="col-lg-4">
            <div
              className="card border-0"
              style={{
                height: 500,
                background:
                  "linear-gradient(135deg, rgba(255,107,129,0.05) 0%, rgba(230,57,70,0.05) 100%)",
                borderRadius: 16,
                border: "1px solid rgba(220,53,69,0.1)",
                padding: "20px",
              }}
            >
              <div className="mb-3">
                <i
                  className="bi bi-lightbulb-fill text-warning me-2"
                  style={{ fontSize: 20 }}
                ></i>
                <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
                  Quick Tips
                </span>
              </div>

              <p className="text-muted small mb-3">Try asking about:</p>

              <div className="d-flex flex-column gap-3">
                {sampleQueries.map((query, idx) => (
                  <motion.button
                    key={idx}
                    className="btn btn-outline-danger text-start"
                    style={{
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      whiteSpace: "normal",
                      textAlign: "left",
                    }}
                    onClick={() => setInput(query)}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(230,57,70,0.05)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bi bi-arrow-right-circle-fill me-2"></i>
                    {query}
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top border-light">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-shield-check-fill text-success"></i>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

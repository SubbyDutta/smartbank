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
    if (!input.trim()) return;
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
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Chatbot unavailable", time: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Show my recent transactions",
    "How to transfer to another bank",
    "What is my balance?",
    "How do I add money?",
  ];

  // Framer Motion variants
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    position: "fixed"
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const panelStyle = {
    width: "100%",
    maxWidth: 800,
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "fixed",
    bottom:20,
    left:330,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
     
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
         
          opacity: 0.8,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
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
                  Ask about transfers, balance or account help
                </p>
              </div>
            </div>
            <div style={{
              background: "rgba(16,185,129,0.1)",
              padding: "8px 16px",
              borderRadius: 20,
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
              <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600 }}>
                <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="row g-4">
          {/* Chat Window */}
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
              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  background: "#f8f9fa",
                }}
                className="services-container"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{
                      width: 80,
                      height: 80,
                      margin: "0 auto 1.5rem",
                      borderRadius: "50%",
                      background: "rgba(230,57,70,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      color: "#e63946",
                    }}>
                      <i className="bi bi-chat-dots"></i>
                    </div>
                    <h5 className="text-muted fw-bold mb-2">Start a Conversation</h5>
                    <p className="text-muted small mb-0">
                      Ask me anything about your account or transactions
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
                          justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            padding: "12px 16px",
                            borderRadius: 16,
                            background: m.role === "user" 
                              ? "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)"
                              : "#ffffff",
                            color: m.role === "user" ? "#fff" : "#212529",
                            boxShadow: m.role === "user" 
                              ? "0 4px 12px rgba(230,57,70,0.25)"
                              : "0 2px 8px rgba(0,0,0,0.1)",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {m.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                {loading && (
                  <motion.div
                    className="d-flex align-items-center gap-2 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      padding: "12px 16px",
                      background: "#ffffff",
                      borderRadius: 16,
                      maxWidth: "70%",
                    }}
                  >
                    <span className="spinner-border spinner-border-sm text-danger"></span>
                    <span className="text-muted small">AI is thinking...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{
                padding: "16px",
                background: "#ffffff",
                borderTop: "1px solid rgba(0,0,0,0.05)",
              }}>
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
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && send(e)}
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
                    whileHover="hover"
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

          {/* Tips Sidebar */}
          <div className="col-lg-4">
            <div
              className="card border-0"
              style={{
                height: 500,
                background: "linear-gradient(135deg, rgba(255,107,129,0.05) 0%, rgba(230,57,70,0.05) 100%)",
                borderRadius: 16,
                border: "1px solid rgba(220,53,69,0.1)",
                padding: "20px",
              }}
            >
              <div className="mb-3">
                <i className="bi bi-lightbulb-fill text-warning me-2" style={{ fontSize: 20 }}></i>
                <span className="fw-bold" style={{ fontSize: "1.1rem" }}>Quick Tips</span>
              </div>
              
              <p className="text-muted small mb-3">
                Try asking about:
              </p>

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
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(230,57,70,0.05)" }}
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

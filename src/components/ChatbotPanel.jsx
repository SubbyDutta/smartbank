import React, { useState, useRef, useEffect } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatbotPanel.module.css";
import { parseMarkdown } from "../utils/markdownParser";

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

    const userMsg = {
      role: "user",
      text: input,
      time: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot", { query: userMsg.text });

      const { type, message } = res.data || {};

      let finalText = message || "No response received.";

      if (type === "BLOCKED") {
        finalText = "❌ This query is not allowed for security reasons.";
      }

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: String(finalText),
          meta: type,
          time: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "⚠️ Chatbot unavailable. Please try again later.",
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "What is my account balance?",
    "Show my recent transactions",
    "Show my latest transaction",
    "What is my loan status?",
    "Show my account summary",
    "Show my bank account details",
    "Show my profile details",
    "Explain my loan summary",
    "How do I transfer money?",
    "How to apply for a loan?",
    "Why was my loan rejected?"
  ];

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      className={styles.chatContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.chatHeader}>
        <h5 className={styles.chatTitle}>
          <i className="bi bi-chat-dots-fill" style={{ color: 'var(--color-black)' }}></i>
          AI Assistant
        </h5>
        <p className={styles.chatSubtitle}>
          Ask me about your balance, transactions, loans, or transfers
        </p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <i className="bi bi-robot"></i>
            </div>
            <p className={styles.emptyStateText}>
              Start a conversation! I can help you with account information, transaction history, and more.
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
                className={`${styles.messageWrapper} ${m.role === "user" ? styles.user : styles.bot}`}
              >
                <div className={`${styles.messageBubble} ${m.role === "user" ? styles.user : styles.bot}`}>
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }} />

                  {m.meta && (
                    <div className={styles.messageMeta}>
                      {m.meta === "DIRECT" && (
                        <>
                          <i className="bi bi-shield-lock-fill"></i>
                          Secure Data
                        </>
                      )}
                      {m.meta === "RAG" && (
                        <>
                          <i className="bi bi-bar-chart-fill"></i>
                          AI Summary
                        </>
                      )}
                      {m.meta === "GEN" && (
                        <>
                          <i className="bi bi-stars"></i>
                          AI Generated
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {loading && (
          <div className={styles.loadingIndicator}>
            <i className="bi bi-robot"></i>
            <span>AI is thinking</span>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={send} className={styles.inputForm}>
        <input
          className={styles.chatInput}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(e);
            }
          }}
        />
        <button
          className={styles.sendButton}
          type="submit"
          disabled={loading || !input.trim()}
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </form>

      <div className={styles.sampleQueries}>
        {sampleQueries.map((q, i) => (
          <button
            key={i}
            className={styles.sampleQueryButton}
            onClick={() => setInput(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

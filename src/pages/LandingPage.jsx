import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  CreditCard,
  BarChart3,
  Wallet,
  Lock,
  ArrowRight,
  ChevronRight,
  Globe,
  Smartphone,
  CheckCircle2,
  Activity
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "./LandingPage.css";


const PixelGrid = React.memo(() => {
  const [activeDots, setActiveDots] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDots = Array.from({ length: 6 }, () => ({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
        id: Math.random()
      }));
      setActiveDots(newDots);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gridTemplateRows: 'repeat(20, 1fr)',
      gap: '4px', padding: '20px', background: 'rgba(139, 92, 246, 0.03)',
      borderRadius: '32px', border: '1px solid rgba(139, 92, 246, 0.1)', overflow: 'hidden'
    }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', top: `${(i + 1) * 5}%`, left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.03)' }} />
          <div style={{ position: 'absolute', left: `${(i + 1) * 5}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.03)' }} />
        </React.Fragment>
      ))}
      {activeDots.map(dot => (
        <motion.div
          key={dot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 1.2 }}
          style={{ gridColumn: dot.x + 1, gridRow: dot.y + 1, background: 'var(--color-render-purple)', borderRadius: '2px', boxShadow: '0 0 10px var(--color-render-purple)', zIndex: 1 }}
        />
      ))}
      {Array.from({ length: 400 }).map((_, i) => (
        <div key={i} style={{ width: '2px', height: '2px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%' }} />
      ))}
    </div>
  );
});


const LiveFeed = () => {
  const [items, setItems] = useState([
    { id: 1, type: 'Transfer', amount: '+$540.00', status: 'Success', user: 'Jane D.' },
    { id: 2, type: 'Security', amount: 'Blocked', status: 'Threat', user: 'Unknown IP' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['Transfer', 'Security', 'Payment', 'Login'];
      const type = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: Date.now(),
        type,
        amount: type === 'Security' ? 'Secured' : `+$${(Math.random() * 1000).toFixed(2)}`,
        status: type === 'Security' ? 'Protected' : 'Success',
        user: type === 'Security' ? 'System Audit' : 'User Auth'
      };
      setItems(prev => [newItem, ...prev.slice(0, 2)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AnimatePresence initial={false}>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              padding: '16px 20px', borderRadius: 16, background: '#fff',
              border: item.type === 'Security' ? '1px solid #fee2e2' : '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 10px 20px -10px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', gap: 16
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: item.type === 'Security' ? '#fef2f2' : 'var(--color-render-purple-soft)',
              color: item.type === 'Security' ? '#ef4444' : 'var(--color-render-purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.type === 'Security' ? <Shield size={18} /> : <Activity size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.type}</div>
              <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600 }}>{item.user}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: item.type === 'Security' ? '#ef4444' : '#10b981' }}>{item.amount}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.5 }}>{item.status}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay, tag }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    style={{
      background: '#fff', padding: '40px', borderRadius: '32px',
      border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', height: '100%'
    }}
    whileHover={{ y: -10, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.1)', borderColor: 'var(--color-render-purple)' }}
  >
    <div style={{
      width: 56, height: 56, borderRadius: '16px',
      background: 'var(--color-render-purple-soft)', color: 'var(--color-render-purple)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28
    }}>
      <Icon size={28} />
    </div>
    {tag && (
      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-render-purple)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>{tag}</span>
    )}
    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16, color: '#000' }}>{title}</h3>
    <p style={{ color: '#666', lineHeight: 1.6, fontSize: '1.05rem' }}>{desc}</p>
  </motion.div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { scrollY } = useScroll();

  
  const scrollSpring = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroScale = useTransform(scrollSpring, [0, 500], [1, 0.94]);
  const heroOpacity = useTransform(scrollSpring, [0, 300], [1, 0]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = jwtDecode(token);
      setUser({ username: payload?.sub || payload?.username || "User" });
    } catch (e) {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const handleAction = () => {
    if (user) {
      navigate(user.username.toUpperCase() === "ADMIN123" ? "/admin" : "/user");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="landing-page" style={{ background: '#fff', minHeight: '100vh', color: '#000', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      <div className="bg-grid" style={{ opacity: 0.3 }} />

     
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(32px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{ width: '100%', maxWidth: 1200, padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>S</div>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.8px' }}>SecureBank(DEMO)</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {!user ? (
              <>
                <button onClick={() => navigate("/login")} style={{ background: 'transparent', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer', padding: '10px 20px', fontSize: '0.95rem' }}>Log In</button>
                <button onClick={handleAction} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Get Started</button>
              </>
            ) : (
              <button onClick={handleAction} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>Dashboard <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8 }} /></button>
            )}
          </div>
        </div>
      </nav>

     
      <section style={{
        paddingTop: 180, paddingBottom: 100, paddingLeft: 24, paddingRight: 24,
        maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 480px)', gap: 80, alignItems: 'center'
      }}>
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 99,
            background: 'var(--color-render-purple-soft)', color: 'var(--color-render-purple)',
            fontSize: '0.9rem', fontWeight: 800, marginBottom: 32, border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <Smartphone size={16} /> NEW:P2P MOBILE FRIEDLY
          </div>
          <h1 style={{ fontSize: '5.5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-4px', marginBottom: 32, color: '#000' }}>
            Banking.<br />
            Built for<br />
            <span style={{ color: 'var(--color-render-purple)' }}>Tomorrow.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#555', lineHeight: 1.4, marginBottom: 48, maxWidth: 540, fontWeight: 500 }}>
            The fastest, most secure way to manage your financial infrastructure. Experience instant global settlements and AI-driven protection.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={handleAction} style={{ height: 64, padding: '0 40px', fontSize: '1.15rem', background: '#000', color: '#fff', borderRadius: 50, border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
              Open Account <ArrowRight size={22} />
            </button>
          </div>
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: 560, position: 'relative' }}
        >
          <PixelGrid />

          <div style={{ position: 'absolute', inset: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, zIndex: 2 }}>
            <LiveFeed />

           
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', padding: 32, borderRadius: 24, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: 12 }}>SYSTEM INTEGRITY</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>100% SECURE</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <div style={{ flex: 1, height: 4, background: '#10b981', borderRadius: 2 }} />
                <div style={{ flex: 1, height: 4, background: '#10b981', borderRadius: 2 }} />
                <div style={{ flex: 1, height: 4, background: '#10b981', borderRadius: 2 }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

     
      <section style={{ padding: '120px 24px', background: '#fafafb', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 24, letterSpacing: '-2px' }}>One Bank. Every Feature.</h2>
            <p style={{ color: '#666', fontSize: '1.25rem', maxWidth: 640, margin: '0 auto', fontWeight: 500, lineHeight: 1.5 }}>Everything you expect from a modern financial platform, and everything you don't. Built with raw performance in mind.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            <FeatureCard icon={Zap} tag="Instant" title="Global P2P" desc="Send assets to anyone, anywhere, instantly. The boundary of geography is now obsolete." delay={0.1} />
            <FeatureCard icon={Shield} tag="Secure" title="Neural Shield" desc="Autonomous transaction monitoring that evolves with every block. Security that thinks." delay={0.2} />
            <FeatureCard icon={Wallet} tag="Unified" title="Full Aggregation" desc="Connect all legacy accounts into one stream of truth. Control your entire network." delay={0.3} />
            <FeatureCard icon={Activity} tag="Deep" title="Flow Analytics" desc="Advanced predictive modeling for your spending habits. See your future, today." delay={0.4} />
            <FeatureCard icon={CheckCircle2} tag="Verified" title="Bank-Grade" desc="Enterprise-level encryption and full regulatory compliance across all jurisdictions." delay={0.5} />
            <FeatureCard icon={Smartphone} tag="Mobile" title="Native Experience" desc="A truly mobile-first approach. Manage your empire from the palm of your hand." delay={0.6} />
          </div>
        </div>
      </section>

     
      <section style={{ padding: '140px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 120, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ background: '#000', borderRadius: 40, padding: 60, color: '#fff', overflow: 'hidden', boxShadow: '0 60px 120px -20px rgba(0,0,0,0.3)' }}
            >
              <div style={{ opacity: 0.1, position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, var(--color-render-purple) 0%, transparent 100%)' }} />
              <h3 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', marginBottom: 24 }}>Unified.<br />Universal.</h3>
              <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: 48, lineHeight: 1.6 }}>The days of fragmented banking are over. SecureBank aggregates every account into one secure, blazing-fast interface.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={18} />
                    </div>
                    <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5 }} />
                  </div>
                ))}
              </div>
            </motion.div>
           
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#000', textAlign: 'center' }}>100%<br />CLIENT SIDE</div>
            </motion.div>
          </div>
          <div>
            <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: 32, letterSpacing: '-3px', lineHeight: 1 }}>Seamlessly Sync Every Account.</h2>
            <p style={{ fontSize: '1.3rem', color: '#555', lineHeight: 1.6, marginBottom: 48 }}>
              Leverage our proprietary aggregation technology to connect any financial institution in seconds. No more siloed data. Just pure clarity.
            </p>
            <button onClick={handleAction} style={{ padding: '0 40px', height: 60, background: '#000', color: '#fff', borderRadius: 50, border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              Start Aggregating <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      
      <footer style={{ padding: '100px 24px 60px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 80 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>S</div>
              <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.8px' }}>SecureBank</span>
            </div>
            <p style={{ color: '#777', fontSize: '1rem', lineHeight: 1.6, maxWidth: 360 }}>
              The world's most advanced financial Operating System. Optimized for the future.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Status</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Documentation</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>API Reference</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Twitter</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>GitHub</span>
            <span style={{ color: '#777', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Discord</span>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '60px auto 0', paddingTop: 40, borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#bbb', fontWeight: 600 }}>&copy; 2026 SecureBank V7. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24, fontSize: '0.85rem', color: '#bbb', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

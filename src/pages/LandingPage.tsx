import React, { useState } from 'react';
import { ExternalLink, ChevronRight, ArrowRight, Sun, Moon } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import AIAgent from '../components/AIAgent';
import TokenDisplay from '../components/TokenDisplay';
import type { Token } from '../utils/tokenUtils';
import type { UserData } from '../components/AIAgent';

interface Props {
  onLogin: (type: 'user' | 'doctor', phone: string) => void;
  onProfileSave: (profile: any) => void;
  theme: string;
  toggleTheme: () => void;
}

const STATS = [
  { value: '30 Cr+', label: 'ABHA Accounts Created', icon: '🏥' },
  { value: '50,000+', label: 'Healthcare Facilities', icon: '🏨' },
  { value: '28', label: 'States & UTs Covered', icon: '🗺️' },
  { value: '₹75,000 Cr', label: 'Annual Health Budget', icon: '💚' },
];

const FEATURES = [
  { icon: '🔒', title: 'Secure Digital Health ID', desc: 'Get a unique 14-digit ABHA number linked to your health records' },
  { icon: '📱', title: 'Universal Access', desc: 'Access your health records anytime, anywhere using your ABHA ID' },
  { icon: '🤝', title: 'Healthcare Integration', desc: 'Connect with hospitals, clinics, and diagnostic labs nationwide' },
  { icon: '🌍', title: 'Multi-Language Support', desc: 'Available in Hindi, English, Tamil, Telugu, Bengali & more' },
  { icon: '🔐', title: 'Privacy First', desc: 'You control who sees your health data — consent-based sharing' },
  { icon: '💊', title: 'Complete Health Profile', desc: 'Store prescriptions, lab reports, and vaccination records digitally' },
];

const LandingPage: React.FC<Props> = ({ onLogin, onProfileSave, theme, toggleTheme }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'user' | 'doctor'>('user');
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showToken, setShowToken] = useState(false);

  const handleTokenGenerated = (token: Token) => {
    setTokens(t => [...t, token]);
    setShowAIAgent(false);
    setShowToken(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>ABHA Mission</div>
            <div style={{ fontSize: 10, color: 'var(--color-text4)', letterSpacing: 1 }}>AYUSHMAN BHARAT</div>
          </div>
        </div>
        <div className="landing-nav-actions">
          {/* Animated theme toggle pill */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="theme-pill-btn"
          >
            <span className="theme-toggle-icon" style={{ transition: 'transform 0.4s ease',
              transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)', display: 'flex' }}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost btn-sm" style={{ display: 'flex' }}>
            <ExternalLink size={13} /> <span className="hide-xs">ABDM Portal</span>
          </a>
          <button className="btn btn-secondary btn-sm" onClick={() => { setLoginTab('doctor'); setShowLogin(true); }}>
            Doctor Login
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setLoginTab('user'); setShowLogin(true); }}>
            User Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 5% 60px',
        background: 'linear-gradient(135deg,rgba(10,15,30,1) 0%,rgba(15,74,40,0.3) 50%,rgba(10,15,30,1) 100%)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(26,107,60,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,102,204,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="animate-fadeIn" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-success" style={{ marginBottom: 20, display: 'inline-flex' }}>
            🇮🇳 National Health Authority · ABDM
          </div>
          <h1 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Your Digital Health Identity<br />
            <span className="gradient-text">Powered by ABHA</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--color-text2)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Ayushman Bharat Digital Mission (ABDM) is creating a digital health ecosystem
            for every Indian. Your ABHA ID connects you to all healthcare services seamlessly.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => { setLoginTab('user'); setShowLogin(true); }}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setShowAIAgent(true)}>
              🎫 Generate Token
            </button>
            <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
              <ExternalLink size={16} /> Create ABHA Number
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 16, marginTop: 60, position: 'relative', zIndex: 1,
        }}>
          {STATS.map(s => (
            <div key={s.label} className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-primary-light)', marginTop: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About ABHA */}
      <section style={{ padding: '60px 5%', background: 'var(--color-bg2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="badge badge-info" style={{ marginBottom: 12, display: 'inline-flex' }}>About ABHA</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, marginBottom: 16 }}>
              What is ABHA?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text2)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
              <strong>Ayushman Bharat Health Account (ABHA)</strong> is a unique 14-digit health identification number
              provided by the National Health Authority (NHA) under the Ayushman Bharat Digital Mission (ABDM).
              It empowers citizens to create and manage their health records digitally, enabling seamless sharing
              with healthcare providers across India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover" style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 28 }}>{f.icon}</span>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text3)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* How ABDM works */}
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>How ABDM Works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { step: '01', title: 'Create Your ABHA', desc: 'Register using Aadhaar or mobile number at any ABDM-enabled facility or online at abha.abdm.gov.in' },
                { step: '02', title: 'Link Health Records', desc: 'Connect your health records from hospitals, clinics, and labs to your ABHA profile' },
                { step: '03', title: 'Consent-Based Sharing', desc: 'Share your health data securely with doctors and hospitals using consent-driven access control' },
                { step: '04', title: 'AI-Powered Insights', desc: 'Get personalized health recommendations based on your complete medical history' },
              ].map(s => (
                <div key={s.step} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: '#fff', fontSize: 14,
                  }}>{s.step}</div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{s.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--color-text3)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Login section */}
      <section style={{ padding: '60px 5%', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-warning" style={{ marginBottom: 12, display: 'inline-flex' }}>Get Access</div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, marginBottom: 12 }}>Login to Your Account</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 14, marginBottom: 36 }}>
            Securely login with OTP-based verification
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {[
              { type: 'user' as const, emoji: '👤', title: 'Login as User', desc: 'Access your health dashboard, records, diet plans, and token generation', color: 'var(--color-primary)' },
              { type: 'doctor' as const, emoji: '👨‍⚕️', title: 'Login as Doctor', desc: 'Scan patient QR codes, record consultations, upload prescriptions, and use AI diagnosis', color: 'var(--color-secondary)' },
            ].map(item => (
              <div key={item.type} className="card card-hover" style={{ padding: 28, cursor: 'pointer', textAlign: 'center' }}
                onClick={() => { setLoginTab(item.type); setShowLogin(true); }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.emoji}</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: item.color }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text3)', lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
                <button className="btn btn-primary w-full"
                  style={{ background: item.type === 'doctor' ? 'linear-gradient(135deg,#0066cc,#0052a3)' : undefined }}>
                  Login <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Token generation callout */}
          <div className="glass" style={{
            borderRadius: 'var(--radius-xl)', padding: 28, marginTop: 24,
            background: 'linear-gradient(135deg,rgba(26,107,60,0.08),rgba(34,197,94,0.04))',
            border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🎫 Need a Hospital Token?</h3>
            <p style={{ color: 'var(--color-text3)', fontSize: 14, marginBottom: 16 }}>
              Use our AI assistant to verify your ABHA number, select your department, and generate a token instantly.
            </p>
            <button className="btn btn-primary" onClick={() => setShowAIAgent(true)}>
              Start AI-Assisted Token Generation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 5%', borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg2)', textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="https://abdm.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text4)', fontSize: 13, textDecoration: 'none' }}>ABDM Official</a>
          <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text4)', fontSize: 13, textDecoration: 'none' }}>Create ABHA</a>
          <a href="https://nha.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text4)', fontSize: 13, textDecoration: 'none' }}>National Health Authority</a>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text4)' }}>
          🇮🇳 Government of India · National Health Authority · Ayushman Bharat Digital Mission<br />
          This is a demo application for educational purposes.
        </p>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          initialTab={loginTab}
          onLoginSuccess={(type, phone) => { setShowLogin(false); onLogin(type, phone); }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showAIAgent && (
        <AIAgent
          onClose={() => setShowAIAgent(false)}
          onTokenGenerated={handleTokenGenerated}
          existingUserData={userData}
          onUserDataSave={(data) => { setUserData(data); onProfileSave({ ...data, uploadedDocs: [] }); }}
        />
      )}

      {showToken && tokens.length > 0 && (
        <div className="overlay">
          <div style={{
            background: 'var(--color-bg2)', border: '1px solid var(--color-border2)',
            borderRadius: 'var(--radius-xl)', padding: 28,
            width: '50%', minWidth: 320, maxWidth: 700,
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <TokenDisplay tokens={tokens} onClose={() => setShowToken(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

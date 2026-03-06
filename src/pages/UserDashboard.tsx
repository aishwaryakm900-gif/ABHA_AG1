import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Salad, Ticket, LogOut,
  Activity, Pill, Heart, TrendingUp,
  Sun, Moon
} from 'lucide-react';
import HealthReports from '../components/HealthReports';
import DietPlanning from '../components/DietPlanning';
import AIAgent from '../components/AIAgent';
import TokenDisplay from '../components/TokenDisplay';
import type { Token } from '../utils/tokenUtils';
import type { UserData } from '../components/AIAgent';
import type { UserProfile, UploadedDoc } from '../App';

interface Props {
  phone: string;
  profile: UserProfile | null;
  onProfileUpdate: (p: UserProfile) => void;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

type Tab = 'dashboard' | 'reports' | 'diet' | 'token';

// Activity history items (defined at module level — sorted inside component)
const ACTIVITIES: Array<{icon:string;title:string;detail:string;type:string;color:string;date:string}> = [
  { icon: '🩸', title: 'Blood Test Report Uploaded', detail: 'CBC + LFT Panel · Jan 15, 2026', type: 'report', color: '#ef4444', date: '2026-01-15' },
  { icon: '🏥', title: 'Visited Cardiology - City Hospital', detail: 'Token #014 · Jan 10, 2026', type: 'visit', color: '#3b82f6', date: '2026-01-10' },
  { icon: '💊', title: 'Prescription Added', detail: 'Dr. Sharma · Jan 8, 2026', type: 'prescription', color: '#8b5cf6', date: '2026-01-08' },
  { icon: '🌡️', title: 'Routine Checkup Completed', detail: 'General Medicine · Dec 28, 2025', type: 'visit', color: '#22c55e', date: '2025-12-28' },
  { icon: '🦷', title: 'X-Ray Report Uploaded', detail: 'Dental · Dec 20, 2025', type: 'report', color: '#f59e0b', date: '2025-12-20' },
];

const UserDashboard: React.FC<Props> = ({ phone, profile, onProfileUpdate, onLogout, theme, toggleTheme }) => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showToken, setShowToken] = useState(false);

  // Sort activities: new users see OLDEST first; returning users see NEWEST first
  const sortedActivities = React.useMemo(() => {
    const ascending = [...ACTIVITIES].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const isReturningUser = profile && profile.uploadedDocs && profile.uploadedDocs.length > 0;
    return isReturningUser ? [...ascending].reverse() : ascending;
  }, [profile]);

  // Convert UserData (from AIAgent) into a UserProfile and persist it
  const handleUserDataSave = (data: UserData) => {
    onProfileUpdate({
      ...data,
      uploadedDocs: profile?.uploadedDocs ?? [],
    });
  };

  // Keep uploaded docs in the global profile
  const handleDocsChange = (docs: UploadedDoc[]) => {
    onProfileUpdate({
      name: profile?.name ?? '',
      phone: profile?.phone ?? phone,
      age: profile?.age ?? '',
      emergency: profile?.emergency ?? '',
      allergies: profile?.allergies ?? '',
      bloodGroup: profile?.bloodGroup ?? '',
      abhaNumber: profile?.abhaNumber ?? '',
      uploadedDocs: docs,
    });
  };

  // Build AIAgent-compatible UserData from stored profile
  const existingUserData: UserData | null = profile ? {
    name: profile.name,
    phone: profile.phone,
    age: profile.age,
    emergency: profile.emergency,
    allergies: profile.allergies,
    bloodGroup: profile.bloodGroup,
    abhaNumber: profile.abhaNumber,
  } : null;

  const handleTokenGenerated = (token: Token) => {
    setTokens(t => [...t, token]);
    setShowAIAgent(false);
    setShowToken(true);
    setTab('token');
  };

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'reports', label: 'Health Reports', icon: <FileText size={18} /> },
    { id: 'diet', label: 'Diet Planning', icon: <Salad size={18} /> },
    { id: 'token', label: 'Token', icon: <Ticket size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🏥</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>ABHA Mission</div>
              <div style={{ fontSize: 10, color: 'var(--color-text4)' }}>User Portal</div>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: '8px 10px',
            background: 'rgba(26,107,60,0.1)', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(26,107,60,0.2)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text4)' }}>Logged in as</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary-light)' }}>
              +91 {phone.slice(-10)}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map(item => (
            <button key={item.id} className={`sidebar-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => { setTab(item.id as Tab); setShowToken(false); }}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="sidebar-item" onClick={toggleTheme} style={{ width: '100%' }}>
            <span style={{ transition: 'transform 0.4s ease', transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)', display: 'flex' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            <span style={{ marginLeft: 4 }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="sidebar-item" onClick={onLogout} style={{ color: 'var(--color-danger)', width: '100%' }}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ paddingBottom: 64 }}>
        {/* Dashboard tab */}
        {tab === 'dashboard' && (
          <div className="animate-fadeIn">
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
              {profile?.name ? `Welcome back, ${profile.name}! 👋` : 'Welcome! 👋'}
            </h1>
            <p style={{ color: 'var(--color-text3)', marginBottom: 24, fontSize: 14 }}>
              {profile ? "Here's your health overview" : "Start exploring your health dashboard"}
            </p>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { icon: <Activity size={22} />, label: 'Health Reports', value: '5', sub: '2 new this month', bg: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
                { icon: <Heart size={22} />, label: 'Visits This Year', value: '8', sub: 'Last: Jan 10', bg: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
                { icon: <Pill size={22} />, label: 'Active Prescriptions', value: '2', sub: 'Updated Jan 8', bg: '#8b5cf6', iconBg: 'rgba(139,92,246,0.15)' },
                { icon: <TrendingUp size={22} />, label: 'Health Score', value: '86%', sub: 'Good condition', bg: '#22c55e', iconBg: 'rgba(34,197,94,0.15)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background: s.iconBg, color: s.bg }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text2)' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text4)' }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity timeline + Quick actions — responsive grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Recent Activity</h2>
                <div className="timeline">
                  {sortedActivities.map((a, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot" style={{ background: `${a.color}20`, borderColor: a.color }}>
                        <span style={{ fontSize: 16 }}>{a.icon}</span>
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>{a.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { emoji: '🎫', label: 'Generate Hospital Token', desc: 'Quickly get your next visit token', action: () => setShowAIAgent(true) },
                    { emoji: '📄', label: 'Upload Health Report', desc: 'Add new medical document', action: () => setTab('reports') },
                    { emoji: '🥗', label: 'View Diet Plan', desc: 'Check today\'s meal recommendations', action: () => setTab('diet') },
                  ].map(q => (
                    <button key={q.label} onClick={q.action}
                      className="card" style={{
                        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                        border: 'none', textAlign: 'left', width: '100%', background: 'var(--color-bg2)',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                      <span style={{ fontSize: 28 }}>{q.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{q.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text4)' }}>{q.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'reports' && <HealthReports docs={profile?.uploadedDocs} onDocsChange={handleDocsChange} />}
        {tab === 'diet' && <DietPlanning />}

        {tab === 'token' && (
          <div className="animate-fadeIn">
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Token Generation</h1>
            <p style={{ color: 'var(--color-text3)', marginBottom: 24, fontSize: 14 }}>Generate a hospital visit token with AI assistance</p>
            {!showToken ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: 60 }}>🎫</span>
                <h2 style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Generate Your Token</h2>
                <p style={{ color: 'var(--color-text3)', fontSize: 14, marginBottom: 24 }}>
                  Our AI assistant will verify your ABHA, select your department, and generate a token.
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => setShowAIAgent(true)}>
                  Start Token Generation
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <TokenDisplay tokens={tokens} showClose={false} />
                <div>
                  <button className="btn btn-secondary" onClick={() => { setShowToken(false); setShowAIAgent(true); }} style={{ marginBottom: 16 }}>
                    + Generate Another Token
                  </button>
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Token Instructions</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        'Show this token at the hospital registration desk',
                        'The QR code links to your medical records',
                        'Token is valid for the day of issue only',
                        'Carry your ABHA ID card for verification',
                      ].map((tip, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--color-text2)' }}>
                          <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>✓</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showAIAgent && (
        <AIAgent
          onClose={() => setShowAIAgent(false)}
          onTokenGenerated={handleTokenGenerated}
          existingUserData={existingUserData}
          onUserDataSave={handleUserDataSave}
        />
      )}

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav">
        {nav.map(item => (
          <button key={item.id}
            className={`mobile-nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => { setTab(item.id as Tab); setShowToken(false); }}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button className="mobile-nav-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button className="mobile-nav-item" onClick={onLogout} style={{ color: 'var(--color-danger)' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default UserDashboard;

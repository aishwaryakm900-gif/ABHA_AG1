import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Salad, Ticket, LogOut,
  Activity, Pill, Heart, TrendingUp,
  Sun, Moon, MessageCircle, Mic, Clock, ClipboardList,
  Bell, AlertTriangle, CreditCard, Accessibility, ChevronDown, ChevronUp
} from 'lucide-react';
import HealthReports from '../components/HealthReports';
import DietPlanning from '../components/DietPlanning';
import AIAgent from '../components/AIAgent';
import TokenDisplay from '../components/TokenDisplay';
import HealthChat from '../components/HealthChat';
import VisitRecorder from '../components/VisitRecorder';
import HealthTimeline from '../components/HealthTimeline';
import MedicineReminders from '../components/MedicineReminders';
import EmergencyCard from '../components/EmergencyCard';
import type { Token } from '../utils/tokenUtils';
import type { UserData } from '../components/AIAgent';
import type { UserProfile, UploadedDoc } from '../App';

interface Props {
  email: string;
  profile: UserProfile | null;
  onProfileUpdate: (p: UserProfile) => void;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

type Tab = 'dashboard' | 'reports' | 'diet' | 'token' | 'chat' | 'visit' | 'timeline' | 'reminders' | 'emergency';

const UserDashboard: React.FC<Props> = ({ email, profile, onProfileUpdate, onLogout, theme, toggleTheme }) => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showToken, setShowToken] = useState(false);
  const [isAIExpanded, setIsAIExpanded] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState<Partial<UserProfile>>({});

  // Sort activities based on actual user docs + tokens (No dummy data)
  const sortedActivities = React.useMemo(() => {
    const activities: Array<{icon:string;title:string;detail:string;type:string;color:string;date:string}> = [];
    
    profile?.uploadedDocs?.forEach(doc => {
      activities.push({
        icon: '📄',
        title: `Uploaded: ${doc.name}`,
        detail: `Size: ${(doc.size / 1024).toFixed(0)}KB`,
        type: 'report',
        color: '#3b82f6',
        date: doc.uploadedAt || new Date().toISOString()
      });
    });

    tokens.forEach(t => {
      activities.push({
        icon: '🎫',
        title: `Token Generated: ${t.department}`,
        detail: `Token #${t.tokenNumber}`,
        type: 'visit',
        color: '#8b5cf6',
        date: new Date().toISOString()
      });
    });

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [profile, tokens]);
  const handleUserDataSave = (data: UserData) => {
    onProfileUpdate({
      ...data,
      email: profile?.email || email,
      uploadedDocs: profile?.uploadedDocs ?? [],
    });
  };

  // Keep uploaded docs in the global profile
  const handleDocsChange = (docs: UploadedDoc[]) => {
    onProfileUpdate({
      name: profile?.name ?? '',
      email: profile?.email ?? email,
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
    phone: profile.email, // AIAgent uses 'phone' conceptually for contact
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
    // ─── New AI Modules ─────────────────────────────────────
    { id: 'chat', label: 'AI Health Chat', icon: <MessageCircle size={18} /> },
    { id: 'visit', label: 'Visit Recorder', icon: <Mic size={18} /> },
    { id: 'timeline', label: 'Health Timeline', icon: <Clock size={18} /> },
  
    { id: 'reminders', label: 'Medicine Reminders', icon: <Bell size={18} /> },
  
    { id: 'emergency', label: 'Emergency Card', icon: <CreditCard size={18} /> },
    
  ];

  // Split for sidebar: first 4 = primary, rest = AI modules
  const NAV_PRIMARY = nav.slice(0, 4);
  const NAV_AI = nav.slice(4);

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
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary-light)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {email}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_PRIMARY.map(item => (
            <button key={item.id} className={`sidebar-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => { setTab(item.id as Tab); setShowToken(false); }}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
          
          <div 
            onClick={() => setIsAIExpanded(!isAIExpanded)}
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
              margin: '12px 0 4px', padding: '6px 14px', borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}
            className="sidebar-item"
          >
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-text4)' }}>
              AI Modules
            </span>
            {isAIExpanded ? <ChevronUp size={14} color="var(--color-text4)" /> : <ChevronDown size={14} color="var(--color-text4)" />}
          </div>
          
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            overflow: 'hidden', transition: 'max-height 0.3s ease-in-out',
            maxHeight: isAIExpanded ? '400px' : '0'
          }}>
            {NAV_AI.map(item => (
              <button key={item.id} className={`sidebar-item ${tab === item.id ? 'active' : ''}`}
                onClick={() => { setTab(item.id as Tab); setShowToken(false); }}>
                {item.icon} <span>{item.label}</span>
              </button>
            ))}
          </div>
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

            {/* Stat cards based on actual data */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { icon: <Activity size={22} />, label: 'Health Reports', value: profile?.uploadedDocs?.length || 0, sub: 'Total uploaded', bg: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
                { icon: <Heart size={22} />, label: 'Tokens Generated', value: tokens.length, sub: 'Recent visits', bg: '#3b82f6', iconBg: 'rgba(59,130,246,0.15)' },
                { icon: <Pill size={22} />, label: 'Profile Completion', value: profile?.name && profile?.age ? '100%' : '50%', sub: 'Setup your details', bg: '#8b5cf6', iconBg: 'rgba(139,92,246,0.15)' },
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

            {/* Editing Profile Area */}
            {(!profile?.name || editingProfile) && (
              <div className="card animate-fadeIn" style={{ marginBottom: 24, padding: 24, border: '1px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Complete Your Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input className="input" value={draftProfile.name || profile?.name || ''} onChange={e => setDraftProfile({...draftProfile, name: e.target.value})} placeholder="E.g. Ramesh Kumar" />
                  </div>
                  <div className="input-group">
                    <label>Age</label>
                    <input className="input" type="number" value={draftProfile.age || profile?.age || ''} onChange={e => setDraftProfile({...draftProfile, age: e.target.value})} placeholder="E.g. 34" />
                  </div>
                  <div className="input-group">
                    <label>Blood Group</label>
                    <input className="input" value={draftProfile.bloodGroup || profile?.bloodGroup || ''} onChange={e => setDraftProfile({...draftProfile, bloodGroup: e.target.value})} placeholder="E.g. O+" />
                  </div>
                  <div className="input-group">
                    <label>Allergies</label>
                    <input className="input" value={draftProfile.allergies || profile?.allergies || ''} onChange={e => setDraftProfile({...draftProfile, allergies: e.target.value})} placeholder="E.g. Peanuts" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-primary" onClick={() => {
                    onProfileUpdate({
                      email,
                      name: draftProfile.name || profile?.name || '',
                      age: draftProfile.age || profile?.age || '',
                      bloodGroup: draftProfile.bloodGroup || profile?.bloodGroup || '',
                      allergies: draftProfile.allergies || profile?.allergies || '',
                      emergency: profile?.emergency || '',
                      abhaNumber: profile?.abhaNumber || '',
                      uploadedDocs: profile?.uploadedDocs || []
                    });
                    setEditingProfile(false);
                  }}>Save Profile</button>
                  {profile?.name && <button className="btn btn-ghost" onClick={() => setEditingProfile(false)}>Cancel</button>}
                </div>
              </div>
            )}
            {profile?.name && !editingProfile && (
               <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                 <button className="btn btn-ghost btn-sm" onClick={() => { setDraftProfile(profile); setEditingProfile(true); }}>
                   Edit Profile
                 </button>
               </div>
            )}

            {/* Activity timeline + Quick actions — responsive grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Recent Activity</h2>
                <div className="timeline">
                  {sortedActivities.length > 0 ? sortedActivities.map((a, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot" style={{ background: `${a.color}20`, borderColor: a.color }}>
                        <span style={{ fontSize: 16 }}>{a.icon}</span>
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>{a.detail}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--color-text3)', fontSize: 14, fontStyle: 'italic' }}>
                      No recent activity. Start by uploading a report or generating a token!
                    </div>
                  )}
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
                    { emoji: '🤖', label: 'Ask AI Health Assistant', desc: 'Get plain-language health answers', action: () => setTab('chat') },
                    { emoji: '🚑', label: 'Emergency Health Card', desc: 'View your emergency card', action: () => setTab('emergency') },
                    { emoji: '🕐', label: 'Health Timeline', desc: 'See your health history', action: () => setTab('timeline') },
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

        {/* ─── New AI Modules ─────────────────── */}
        {tab === 'chat' && (
          <div className="animate-fadeIn">
            <HealthChat />
          </div>
        )}
        {tab === 'visit' && (
          <div className="animate-fadeIn">
            <VisitRecorder />
          </div>
        )}
        {tab === 'timeline' && (
          <div className="animate-fadeIn">
            <HealthTimeline docs={profile?.uploadedDocs} />
          </div>
        )}
       
        {tab === 'reminders' && (
          <div className="animate-fadeIn">
            <MedicineReminders />
          </div>
        )}
       
        {tab === 'emergency' && (
          <div className="animate-fadeIn">
            <EmergencyCard profile={profile} onProfileUpdate={onProfileUpdate} />
          </div>
        )}
    
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

      {/* Mobile bottom navigation — shows primary tabs only */}
      <nav className="mobile-nav">
        {NAV_PRIMARY.map(item => (
          <button key={item.id}
            className={`mobile-nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => { setTab(item.id as Tab); setShowToken(false); }}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button className="mobile-nav-item" onClick={() => { setTab('chat'); setShowToken(false); }}
          style={{ color: tab === 'chat' ? 'var(--color-primary-light)' : undefined }}>
          <MessageCircle size={18} />
          <span>AI Chat</span>
        </button>
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

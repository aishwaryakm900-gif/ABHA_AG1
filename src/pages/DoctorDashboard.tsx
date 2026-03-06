import React, { useState } from 'react';
import { QrCode, Mic, FileText, Bot, LogOut, Sun, Moon } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import Recorder from '../components/Recorder';
import PrescriptionUpload from '../components/PrescriptionUpload';
import DoctorChatbot from '../components/DoctorChatbot';

interface Props {
  phone: string;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

type Tab = 'scanner' | 'recorder' | 'prescriptions' | 'chatbot';

const DoctorDashboard: React.FC<Props> = ({ phone, onLogout, theme, toggleTheme }) => {
  const [tab, setTab] = useState<Tab>('scanner');

  const nav = [
    { id: 'scanner', label: 'QR Scanner', icon: <QrCode size={18} /> },
    { id: 'recorder', label: 'Recorder', icon: <Mic size={18} /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText size={18} /> },
    { id: 'chatbot', label: 'AI Assistant', icon: <Bot size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🩺</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>ABHA Mission</div>
              <div style={{ fontSize: 10, color: 'var(--color-text4)' }}>Doctor Portal</div>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: '8px 10px',
            background: 'rgba(0,102,204,0.1)', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0,102,204,0.2)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text4)' }}>Logged in as</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa' }}>Dr. +91 {phone.slice(-10)}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map(item => (
            <button key={item.id} className={`sidebar-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id as Tab)}>
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick stats */}
        <div style={{ padding: '0 10px', marginBottom: 10 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text4)', marginBottom: 8 }}>TODAY</div>
            {[
              { label: 'Patients Seen', value: '12' },
              { label: 'Tokens Scanned', value: '9' },
              { label: 'Prescriptions', value: '7' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text3)' }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="sidebar-item" onClick={toggleTheme} style={{ width: '100%' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} <span style={{ marginLeft: 4 }}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <button className="sidebar-item" onClick={onLogout} style={{ color: 'var(--color-danger)', width: '100%' }}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="animate-fadeIn" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {tab === 'scanner' && <QRScanner />}
          {tab === 'recorder' && <Recorder />}
          {tab === 'prescriptions' && <PrescriptionUpload />}
          {tab === 'chatbot' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <DoctorChatbot />
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav">
        {nav.map(item => (
          <button key={item.id}
            className={`mobile-nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id as Tab)}>
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

export default DoctorDashboard;

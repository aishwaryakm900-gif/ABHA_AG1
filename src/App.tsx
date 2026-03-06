import React, { useState } from 'react';
import './index.css';
import './i18n';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

export interface UserProfile {
  phone: string;
  name: string;
  age: string;
  emergency: string;
  allergies: string;
  bloodGroup: string;
  abhaNumber: string;
  uploadedDocs: UploadedDoc[];
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;            // data URL or object URL for preview/download
  content?: string;       // raw base64 dataURL so that doc can survive page reloads
  uploadedAt: string;
  analysis: string;
}

type AppState = { view: 'landing' } | { view: 'user'; phone: string } | { view: 'doctor'; phone: string };

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ view: 'landing' });
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // load/save profile so reports survive refresh
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {}
  }, []);
  React.useEffect(() => {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
    }
  }, [profile]);

  // theme state (dark/light) persisted in localStorage and reflected on <html>
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const handleLogin = (type: 'user' | 'doctor', phone: string) => {
    setState({ view: type, phone });
  };

  const handleLogout = () => {
    setState({ view: 'landing' });
  };

  if (state.view === 'user') {
    return (
      <UserDashboard
        phone={state.phone}
        profile={profile}
        onProfileUpdate={setProfile}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (state.view === 'doctor') {
    return (
      <DoctorDashboard
        phone={state.phone}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <LandingPage
      onLogin={handleLogin}
      onProfileSave={setProfile}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
};

export default App;

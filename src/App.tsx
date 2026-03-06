import React, { useState } from 'react';
import './index.css';
import './i18n';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { saveProfileToDB, getProfileFromDB } from './utils/storage';
export interface UserProfile {
  email: string;
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

type AppState = { view: 'landing' } | { view: 'user'; email: string } | { view: 'doctor'; email: string };

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ view: 'landing' });
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // load/save profile so reports survive refresh
  React.useEffect(() => {
    getProfileFromDB().then((stored) => {
      if (stored) {
        setProfile(stored);
      }
      setIsLoadingProfile(false);
    }).catch(err => {
      console.error("Failed to load profile:", err);
      setIsLoadingProfile(false);
    });
  }, []);
  React.useEffect(() => {
    if (profile && !isLoadingProfile) {
      saveProfileToDB(profile).catch(console.error);
    }
  }, [profile, isLoadingProfile]);

  // theme state (dark/light) persisted in localStorage and reflected on <html>
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  if (isLoadingProfile) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--color-primary-light)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  const handleLogin = (type: 'user' | 'doctor', email: string) => {
    setState({ view: type, email });
  };

  const handleLogout = () => {
    setState({ view: 'landing' });
  };

  if (state.view === 'user') {
    return (
      <UserDashboard
        email={state.email}
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
        email={state.email}
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

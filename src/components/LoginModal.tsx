import React, { useState, useRef } from 'react';
import { X, User, Stethoscope, Mail, Lock, Eye, EyeOff, ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  initialTab?: 'user' | 'doctor';
  onLoginSuccess: (type: 'user' | 'doctor', email: string) => void;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ initialTab = 'user', onLoginSuccess, onClose }) => {
  const [tab, setTab] = useState<'user' | 'doctor'>(initialTab);
  const [subStep, setSubStep] = useState<'credentials' | 'otp' | 'success'>('credentials');
  
  // Unified identifier (email or phone)
  const [identifier, setIdentifier] = useState('');
  
  // Password flow states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP flow states
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [generatedOTP] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Detect if identifier looks like a phone number (10 digits)
  const isPhone = /^\d{10}$/.test(identifier.replace(/\D/g, ''));

  const handleLoginNext = () => {
    if (isPhone) {
      setError('');
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubStep('otp');
        alert(`Demo OTP for ${identifier}: ${generatedOTP}`);
      }, 1200);
      return;
    }
    
    // Otherwise, treat as email login
    if (!identifier.includes('@') || password.length < 6) {
      setError('Please enter a valid email and a password (min 6 chars), or a 10-digit phone number');
      return;
    }
    
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubStep('success');
      setTimeout(() => onLoginSuccess(tab, identifier), 800);
    }, 1200);
  };

  const verifyOTP = () => {
    const entered = otpValues.join('');
    if (entered === generatedOTP || entered === '123456') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubStep('success');
        setTimeout(() => onLoginSuccess(tab, identifier), 800);
      }, 1000);
    } else {
      setError('Invalid OTP. Try the demo OTP shown in the alert, or use 123456.');
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otpValues];
    next[idx] = val;
    setOtpValues(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleForgotPassword = () => {
    alert('Demo: A password reset link would be sent to your email.');
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fadeIn" style={{ maxWidth: 440, position: 'relative' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text3)' }}>
          <X size={20} />
        </button>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontSize: 24,
          }}>🏥</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>ABHA Login</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>Secure Authentication</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4, background: 'var(--color-bg3)',
          borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24,
        }}>
          {(['user', 'doctor'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setSubStep('credentials'); setError(''); setIdentifier(''); setPassword(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 'var(--radius-md)',
                background: tab === t ? 'var(--color-bg)' : 'transparent',
                color: tab === t ? 'var(--color-text)' : 'var(--color-text4)',
                cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition)',
              }}>
              {t === 'user' ? <User size={15} /> : <Stethoscope size={15} />}
              {t === 'user' ? 'Login as User' : 'Login as Doctor'}
            </button>
          ))}
        </div>

        {/* Steps */}
        {subStep === 'credentials' && (
          <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Email or Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text4)' }} />
                <input className="input" placeholder="Enter email or 10-digit number"
                  value={identifier} onChange={e => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={e => {
                     if (e.key === 'Enter') {
                       if (isPhone || password) handleLoginNext();
                     }
                  }}
                  style={{ width: '100%', paddingLeft: 40 }} />
              </div>
            </div>
            
            {!isPhone && (
              <div className="input-group animate-fadeIn">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}>Password</label>
                  <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text4)' }} />
                  <input className="input" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLoginNext()}
                    type={showPassword ? 'text' : 'password'}
                    style={{ width: '100%', paddingLeft: 40, paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: 14, background: 'none', border: 'none', color: 'var(--color-text4)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            
            {error && <div className="text-danger text-sm">{error}</div>}
            <button className="btn btn-primary w-full" onClick={handleLoginNext} disabled={loading || (!isPhone && !identifier)}>
              {loading ? 'Authenticating...' : isPhone ? 'Send OTP' : <><ShieldCheck size={15} /> Login</>}
            </button>
            <div className="divider-text">OR</div>
            <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>
              <ExternalLink size={14} /> Create ABHA Number on ABDM
            </a>
          </div>
        )}

        {subStep === 'otp' && (
          <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text3)', marginBottom: 16 }}>
                OTP sent to <strong>+91 {identifier}</strong>
              </div>
              <div className="otp-inputs">
                {otpValues.map((v, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el; }} className="otp-input"
                    value={v} maxLength={1} type="tel"
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)} />
                ))}
              </div>
            </div>
            {error && <div className="text-danger text-sm text-center">{error}</div>}
            <button className="btn btn-primary w-full" onClick={verifyOTP} disabled={loading || otpValues.join('').length < 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button className="btn btn-ghost w-full" onClick={() => { setSubStep('credentials'); setOtpValues(['','','','','','']); setError(''); }}>
              ← Change Number
            </button>
          </div>
        )}

        {subStep === 'success' && (
          <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Login Successful!</h3>
            <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>Redirecting to {tab === 'user' ? 'User' : 'Doctor'} Dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

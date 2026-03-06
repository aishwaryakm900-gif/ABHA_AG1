import React, { useState, useRef } from 'react';
import { X, User, Stethoscope, Phone, Shield, ExternalLink } from 'lucide-react';
import { generateOTP } from '../utils/tokenUtils';

interface Props {
  initialTab?: 'user' | 'doctor';
  onLoginSuccess: (type: 'user' | 'doctor', phone: string) => void;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ initialTab = 'user', onLoginSuccess, onClose }) => {
  const [tab, setTab] = useState<'user' | 'doctor'>(initialTab);
  const [subStep, setSubStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [generatedOTP] = useState(generateOTP());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOTP = () => {
    if (phone.replace(/\D/g,'').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubStep('otp');
      alert(`Demo OTP for ${phone}: ${generatedOTP}`);
    }, 1200);
  };

  const verifyOTP = () => {
    const entered = otpValues.join('');
    if (entered === generatedOTP || entered === '123456') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubStep('success');
        setTimeout(() => onLoginSuccess(tab, phone), 800);
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
          <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>Secure OTP-based authentication</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4, background: 'var(--color-bg3)',
          borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24,
        }}>
          {(['user', 'doctor'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setSubStep('phone'); setError(''); setPhone(''); setOtpValues(['','','','','','']); }}
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
        {subStep === 'phone' && (
          <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Mobile Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  background: 'var(--color-bg3)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', padding: '12px 14px', color: 'var(--color-text3)', fontSize: 14,
                }}>+91</div>
                <input className="input" placeholder="10-digit mobile number"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  type="tel" maxLength={10}
                  style={{ flex: 1 }} />
              </div>
            </div>
            {error && <div className="text-danger text-sm">{error}</div>}
            <button className="btn btn-primary w-full" onClick={sendOTP} disabled={loading}>
              {loading ? 'Sending OTP...' : <><Phone size={15} /> Send OTP</>}
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
                OTP sent to <strong>+91 {phone}</strong>
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
              {loading ? 'Verifying...' : <><Shield size={15} /> Verify OTP</>}
            </button>
            <button className="btn btn-ghost w-full" onClick={() => { setSubStep('phone'); setOtpValues(['','','','','','']); setError(''); }}>
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

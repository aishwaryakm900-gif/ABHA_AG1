import React, { useState, useRef } from 'react';
import { X, MessageSquare, Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { generateABHANumber, generateToken, type Token } from '../utils/tokenUtils';

interface Props {
  onClose: () => void;
  onTokenGenerated: (token: Token) => void;
  existingUserData?: UserData | null;
  onUserDataSave?: (data: UserData) => void;
}

export interface UserData {
  name: string;
  phone: string;
  age: string;
  emergency: string;
  allergies: string;
  bloodGroup: string;
  abhaNumber: string;
}

type Step = 'language' | 'phone' | 'otp' | 'fetch_abha' | 'first_time' | 'first_name' | 'first_age' | 'first_emergency' | 'first_allergies' | 'first_blood' | 'department' | 'payment' | 'done';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🏳️' },
  { code: 'te', label: 'తెలుగు', flag: '🏳️' },
  { code: 'bn', label: 'বাংলা', flag: '🏳️' },
];

const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'ENT', 'Gynaecology', 'Paediatrics', 'Dermatology'];

interface ChatMsg { role: 'ai' | 'user'; text: string }

const AIAgent: React.FC<Props> = ({ onClose, onTokenGenerated, existingUserData, onUserDataSave }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('language');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'ai', text: '👋 ' + t('greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [abhaNumber, setAbhaNumber] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const addAI = (text: string, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text }]);
      setIsTyping(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, delay);
  };

  const addUser = (text: string) => {
    setMessages(m => [...m, { role: 'user', text }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleLanguageSelect = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    i18n.changeLanguage(code);
    addUser(lang?.label || code);
    setTimeout(() => {
      addAI(t('enterPhone'), 600);
      setStep('phone');
    }, 300);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const val = input.trim();
    setInput('');
    addUser(val);

    setTimeout(() => {
      switch(step) {
        case 'phone': {
          if (val.replace(/\D/g,'').length >= 10) {
            const cleanPhone = val.replace(/\D/g,'').slice(-10);
            setPhone(cleanPhone);
            addAI(`${t('verifyPhone')} (Demo OTP: ${otp})`, 800);
            setStep('otp');
          } else {
            addAI('Please enter a valid 10-digit mobile number.', 500);
          }
          break;
        }
        case 'otp': {
          if (val === otp || val === '123456') {
            addAI(t('phoneVerified') + ' ✅', 600);
            setTimeout(() => {
              addAI(t('fetchABHA'), 800);
              const abha = generateABHANumber(phone);
              setAbhaNumber(abha);
              setTimeout(() => {
                addAI(`${t('abhaFound')} 🏥\n**ABHA: ${abha}**`, 1200);
                const isFirst = !existingUserData;
                setTimeout(() => {
                  if (isFirst) {
                    addAI(t('firstVisit'), 800);
                    setTimeout(() => { addAI(t('firstName'), 600); setStep('first_name'); }, 1400);
                  } else {
                    addAI(t('selectDept'), 800);
                    setStep('department');
                  }
                }, 1400);
              }, 1600);
            }, 1000);
          } else {
            addAI('Invalid OTP. Please try again. (Demo: use 123456)', 500);
          }
          break;
        }
        case 'first_name':
          setUserData(d => ({ ...d, name: val }));
          addAI(t('age'), 500);
          setStep('first_age');
          break;
        case 'first_age':
          setUserData(d => ({ ...d, age: val }));
          addAI(t('emergency'), 500);
          setStep('first_emergency');
          break;
        case 'first_emergency':
          setUserData(d => ({ ...d, emergency: val }));
          addAI(t('allergies'), 500);
          setStep('first_allergies');
          break;
        case 'first_allergies':
          setUserData(d => ({ ...d, allergies: val }));
          addAI(t('bloodGroup'), 500);
          setStep('first_blood');
          break;
        case 'first_blood': {
          const fullData: UserData = {
            name: userData.name || '', age: userData.age || '',
            emergency: userData.emergency || '', allergies: userData.allergies || '',
            bloodGroup: val, phone, abhaNumber,
          };
          setUserData(fullData);
          onUserDataSave?.(fullData);
          addAI(`Thank you, ${fullData.name}! Your health profile has been saved. 💾`, 600);
          setTimeout(() => { addAI(t('selectDept'), 800); setStep('department'); }, 1200);
          break;
        }
      }
    }, 300);
  };

  const handleDeptSelect = (dept: string) => {
    setSelectedDept(dept);
    addUser(dept);
    addAI(t('payment'), 800);
    setStep('payment');
  };

  const handlePayment = () => {
    setPaymentConfirmed(true);
    addUser('Payment of ₹12 confirmed ✅');
    addAI(t('paymentDone'), 600);
    setTimeout(() => {
      const name = existingUserData?.name || userData.name || 'Patient';
      const abha = existingUserData?.abhaNumber || abhaNumber;
      const ph = existingUserData?.phone || phone;
      // Merge existing + newly collected profile data
      const extras = {
        age: existingUserData?.age || (userData as any).age || undefined,
        bloodGroup: existingUserData?.bloodGroup || (userData as any).bloodGroup || undefined,
        allergies: existingUserData?.allergies || (userData as any).allergies || undefined,
        emergency: existingUserData?.emergency || (userData as any).emergency || undefined,
      };
      const token = generateToken(ph, abha, selectedDept, name, extras);
      addAI(`${t('tokenReady')} 🎫\nToken #${String(token.tokenNumber).padStart(3,'0')} — ${token.department}`, 1000);
      setStep('done');
      setTimeout(() => onTokenGenerated(token), 1500);
    }, 1500);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--color-bg2)',
        border: '1px solid var(--color-border2)',
        borderRadius: 'var(--radius-xl)',
        width: '90%',
        maxWidth: 560,
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg,rgba(26,107,60,0.15),rgba(34,197,94,0.05))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>ABHA Health Assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-success)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                Active · AI-Powered
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => i18n.changeLanguage(l.code)} title={l.label}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '2px 4px', borderRadius: 4, color: i18n.language === l.code ? 'var(--color-primary-light)' : 'var(--color-text4)' }}>
                  {l.label.substring(0,2)}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className={`chat-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble ai" style={{ width: 60 }}>
              <div className="typing-indicator">
                <div className="typing-dot" /> <div className="typing-dot" /> <div className="typing-dot" />
              </div>
            </div>
          )}

          {/* Language picker */}
          {step === 'language' && !isTyping && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {LANGUAGES.map(l => (
                <button key={l.code} className="btn btn-secondary btn-sm" onClick={() => handleLanguageSelect(l.code)}>
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}

          {/* Department picker */}
          {step === 'department' && !isTyping && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {DEPARTMENTS.map(d => (
                <button key={d} className="btn btn-secondary btn-sm" onClick={() => handleDeptSelect(d)}
                  style={{ borderRadius: 'var(--radius-md)' }}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Payment UI */}
          {step === 'payment' && !paymentConfirmed && !isTyping && (
            <div style={{
              background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.05))',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: 20,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-accent)', marginBottom: 8 }}>₹12</div>
              <div style={{ fontSize: 13, color: 'var(--color-text3)', marginBottom: 16 }}>Token Registration Fee · {selectedDept}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {['UPI', 'Card'].map(method => (
                  <button key={method} className="btn btn-secondary btn-sm" style={{ minWidth: 64 }} onClick={handlePayment}>
                    💳 {method}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text4)', marginTop: 10 }}>
                🔒 Secure Demo Payment · No real transaction
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!['language', 'department', 'payment', 'done'].includes(step) && (
          <div className="chat-input-area">
            <input
              className="input"
              placeholder={step === 'phone' ? 'Enter 10-digit mobile number...' : step === 'otp' ? 'Enter OTP...' : 'Type your response...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              type={step === 'phone' || step === 'otp' ? 'tel' : 'text'}
              style={{ flex: 1 }}
            />
            <button className="btn btn-ghost btn-icon" onClick={toggleVoice}
              style={{ color: isListening ? 'var(--color-danger)' : 'var(--color-text3)' }}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;

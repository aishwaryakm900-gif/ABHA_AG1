import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { doctorChatResponses } from '../utils/fakeAI';

interface Message { role: 'ai' | 'user'; text: string; time: string }

const QUICK_QUERIES = [
  'Patient has high fever and body ache',
  'Persistent cough for 2 weeks',
  'Chest pain radiating to arm',
  'Type 2 diabetes management',
  'Severe headache with nausea',
  'Joint swelling and stiffness',
];

const DoctorChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai',
    text: '👨‍⚕️ Hello Doctor! I\'m your AI clinical assistant. Describe the patient\'s symptoms or condition and I\'ll provide evidence-based diagnostic suggestions and medication recommendations.\n\n⚠️ *This is an AI assistant for reference only. Always apply clinical judgment.*',
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text: text.trim(), time: now }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = doctorChatResponses(text);
      setMessages(m => [...m, { role: 'ai', text: response, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Clinical AI Assistant</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Evidence-based diagnostic and medication suggestions</p>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, background: 'var(--color-bg2)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', minHeight: 400,
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={16} color="#fff" />
                </div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div className={`chat-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text4)', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--color-bg4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={16} color="var(--color-text3)" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div className="chat-bubble ai">
                <div className="typing-indicator">
                  <div className="typing-dot" /> <div className="typing-dot" /> <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick queries */}
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {QUICK_QUERIES.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border2)', background: 'var(--color-bg3)',
                color: 'var(--color-text3)', fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-main)', whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border2)')}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <input className="input" style={{ flex: 1 }}
            placeholder="Describe patient symptoms or condition..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)} />
          <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={!input.trim()}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorChatbot;

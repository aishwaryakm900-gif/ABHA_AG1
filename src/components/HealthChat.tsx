import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertCircle, Sparkles } from 'lucide-react';
import { healthChatResponse } from '../utils/fakeAI';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SUGGESTED = [
  'What is diabetes?',
  'What does cholesterol mean?',
  'What is blood pressure?',
  'What does hemoglobin indicate?',
  'What is Metformin used for?',
  'How do kidneys work?',
];

const formatText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
    // Bold: **text**
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    // Bullet
    if (line.startsWith('•') || line.startsWith('-')) {
      return (
        <div key={i} style={{ display: 'flex', gap: 8, paddingLeft: 8, lineHeight: 1.6 }}>
          <span style={{ color: 'var(--color-primary-light)', flexShrink: 0, fontWeight: 700 }}>•</span>
          <span>{rendered}</span>
        </div>
      );
    }
    // Numbered
    if (/^\d+\./.test(line)) {
      return <div key={i} style={{ paddingLeft: 8, lineHeight: 1.6 }}>{rendered}</div>;
    }
    return <div key={i} style={{ lineHeight: 1.6 }}>{rendered}</div>;
  });
};

const HealthChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Hello! I'm your AI Health Assistant. 👋\n\nI can help you understand:\n• Medical terms and test results\n• Common medications and their uses\n• General health conditions\n• Healthy lifestyle tips\n\n**Please note:** I provide general health education only — not medical diagnosis or treatment advice. Always consult your doctor for personal medical decisions.",
      timestamp: new Date().toLocaleTimeString('en-IN'),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN'),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiText = healthChatResponse(text.trim());
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('en-IN'),
      };
      setMessages(m => [...m, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI Health Assistant</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>
          Ask health questions and get plain-language educational answers
        </p>
      </div>

      {/* Disclaimer banner */}
      <div style={{
        padding: '10px 14px', borderRadius: 'var(--radius-md)',
        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
        display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#fbbf24',
      }}>
        <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>This assistant provides general health education only. Not a substitute for professional medical advice, diagnosis, or treatment.</span>
      </div>

      {/* Suggested questions */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-text4)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={12} /> Suggested questions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg3)', border: '1px solid var(--color-border)',
                color: 'var(--color-text2)', fontSize: 12, cursor: 'pointer',
                transition: 'var(--transition)', fontFamily: 'var(--font-main)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary-light)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text2)';
              }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div style={{
        flex: 1, minHeight: 320, maxHeight: 480,
        background: 'var(--color-bg2)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'ai' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={16} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                  : 'var(--color-bg3)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                fontSize: 13,
                animation: 'fadeIn 0.3s ease',
              }}>
                {formatText(msg.text)}
                <div style={{ fontSize: 10, marginTop: 6, opacity: 0.6 }}>{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={16} color="#fff" />
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                background: 'var(--color-bg3)', border: '1px solid var(--color-border)',
              }}>
                <div className="typing-indicator" style={{ padding: 0 }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: 12, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
          <input
            className="input"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-full)', fontSize: 13 }}
            placeholder="Ask a health question… e.g. What is cholesterol?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          />
          <button
            className="btn btn-primary btn-icon"
            title="Send message"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 14px' }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthChat;

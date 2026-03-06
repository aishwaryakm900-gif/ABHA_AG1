import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Hash, Phone, Building2, Calendar, Clock, User, Droplet, AlertTriangle, PhoneCall, XCircle } from 'lucide-react';
import type { Token } from '../utils/tokenUtils';
import { buildQRPayload } from '../utils/tokenUtils';

interface Props {
  tokens: Token[];
  onClose?: () => void;
  showClose?: boolean;
  onCancelToken?: (tokenId: string) => void;
}

const TokenDisplay: React.FC<Props> = ({ tokens, onClose, showClose = true, onCancelToken }) => {
  const handlePrint = () => window.print();

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>🎫 Health Token{tokens.length > 1 ? 's' : ''}</h2>
          <p style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>{tokens.length} token{tokens.length > 1 ? 's' : ''} generated</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary btn-sm no-print" onClick={handlePrint}>
            <Printer size={14} /> Print
          </button>
          {showClose && onClose && (
            <button 
              className="btn btn-ghost btn-sm no-print" 
              onClick={onClose}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {tokens.map(token => <TokenCard key={token.id} token={token} onCancel={onCancelToken} />)}
      </div>
    </div>
  );
};

const TokenCard: React.FC<{ token: Token; onCancel?: (tokenId: string) => void }> = ({ token, onCancel }) => {
  const [showRefund, setShowRefund] = useState(false);
  const payload = buildQRPayload(token);
  const qrString = JSON.stringify(payload);

  const handleCancel = () => {
    if (onCancel) {
      onCancel(token.id);
      setShowRefund(true);
      setTimeout(() => setShowRefund(false), 3000);
    }
  };

  const isCancelled = token.status === 'cancelled';

  return (
    <div
      className="token-print-area"
      style={{
        background: isCancelled 
          ? 'linear-gradient(145deg, #1f2937 0%, #374151 40%, #1f2937 100%)'
          : 'linear-gradient(145deg, #0b1f14 0%, #102a1c 40%, #0b1f14 100%)',
        border: isCancelled 
          ? '2px solid rgba(156,163,175,0.35)'
          : '2px solid rgba(34,197,94,0.35)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        opacity: isCancelled ? 0.7 : 1,
      }}
    >
      {/* Decorative pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(45deg, #22c55e 0, #22c55e 1px, transparent 0, transparent 50%)',
        backgroundSize: '12px 12px',
      }} />

      {/* ── TOP HEADER STRIP ── */}
      <div style={{
        background: 'linear-gradient(90deg, #0f4a28 0%, #1a6b3c 50%, #0f4a28 100%)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(34,197,94,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, border: '1px solid rgba(255,255,255,0.2)',
          }}>🏥</div>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: 1.5, fontWeight: 600 }}>AYUSHMAN BHARAT DIGITAL MISSION</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>ABHA Health Token</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>National Health Authority · India</div>
          </div>
        </div>
        {/* Token number badge */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
          padding: '8px 18px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>TOKEN NO.</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            #{String(token.tokenNumber).padStart(3, '0')}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{token.department}</div>
          {isCancelled && (
            <div style={{
              position: 'absolute', top: -8, right: -8,
              background: '#f87171', color: '#fff', borderRadius: '50%',
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>
              <XCircle size={12} />
            </div>
          )}
        </div>
        {/* Cancel button */}
        {!isCancelled && onCancel && (
          <button
            onClick={handleCancel}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#f87171',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            }}
          >
            <XCircle size={12} />
            Cancel Token
          </button>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '20px 22px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT: Patient Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Patient name row */}
          <div style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(34,197,94,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={18} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--color-text4)', letterSpacing: 0.5 }}>PATIENT NAME</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{token.patientName}</div>
            </div>
          </div>

          {/* 2-column info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InfoCell icon={<Phone size={13} />} label="Mobile" value={token.phone || 'Not provided'} color="#60a5fa" />
            <InfoCell icon={<Hash size={13} />} label="ABHA Number" value={token.abhaNumber} color="#a78bfa" />
            <InfoCell icon={<Building2 size={13} />} label="Department" value={token.department} color="#34d399" />
            <InfoCell icon={<Calendar size={13} />} label="Date" value={token.date} color="#fbbf24" />
            {token.age && <InfoCell icon={<User size={13} />} label="Age" value={`${token.age} yrs`} color="#fb923c" />}
            {token.bloodGroup && <InfoCell icon={<Droplet size={13} />} label="Blood Group" value={token.bloodGroup} color="#f87171" />}
          </div>

          {/* Allergies warning */}
          {token.allergies && token.allergies.toLowerCase() !== 'none' && token.allergies.toLowerCase() !== 'no' && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <AlertTriangle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>⚠ KNOWN ALLERGIES</div>
                <div style={{ fontSize: 13, color: 'var(--color-text2)' }}>{token.allergies}</div>
              </div>
            </div>
          )}

          {/* Emergency contact */}
          {token.emergency && (
            <div style={{
              background: 'rgba(251,191,36,0.06)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <PhoneCall size={13} color="#fbbf24" />
              <div>
                <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, letterSpacing: 0.5 }}>EMERGENCY CONTACT</div>
                <div style={{ fontSize: 13, color: 'var(--color-text2)' }}>{token.emergency}</div>
              </div>
            </div>
          )}

          {/* Token ID */}
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px',
            fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text4)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />{token.time} &nbsp;|&nbsp; ID: {token.id}
          </div>
        </div>

        {/* RIGHT: QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {/* QR frame */}
          <div style={{
            background: '#fff',
            padding: 10,
            borderRadius: 14,
            border: '3px solid rgba(34,197,94,0.5)',
            boxShadow: '0 0 20px rgba(34,197,94,0.2)',
          }}>
            <QRCodeSVG
              value={qrString}
              size={140}
              level="H"
            />
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 8, padding: '5px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, color: '#4ade80', fontWeight: 700, letterSpacing: 1 }}>SCAN FOR</div>
            <div style={{ fontSize: 10, color: 'var(--color-text3)', fontWeight: 600 }}>Patient Records</div>
            <div style={{ fontSize: 9, color: 'var(--color-text4)', marginTop: 2 }}>Full profile + new case</div>
          </div>
        </div>
      </div>

      {/* Refund message */}
      {showRefund && (
        <div style={{
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          border: '1px solid #86efac',
          borderRadius: 12,
          padding: '12px 16px',
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>
            ₹
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Token Cancelled Successfully</div>
            <div style={{ fontSize: 12, color: '#166534', opacity: 0.8 }}>₹10 has been refunded to your account</div>
          </div>
        </div>
      )}

      {/* ── FOOTER STRIP ── */}
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--color-text4)' }}>🇮🇳 NHA · ABDM · abha.abdm.gov.in</span>
          <span className="badge badge-success" style={{ fontSize: 9 }}>✓ ABHA Verified</span>
          {token.bloodGroup && (
            <span className="badge badge-danger" style={{ fontSize: 9 }}>🩸 {token.bloodGroup}</span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text4)' }}>Valid for: {token.date} only</div>
      </div>
    </div>
  );
};

const InfoCell: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '10px 12px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, color }}>
      {icon}
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</span>
    </div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0fdf4' }}>{value}</div>
  </div>
);

export default TokenDisplay;

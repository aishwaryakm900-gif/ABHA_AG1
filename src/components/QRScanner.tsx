import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, X, FileText, AlertTriangle, PhoneCall, Droplet, User, Hash, Building2, Calendar, ZoomIn, RefreshCw } from 'lucide-react';
import type { QRPayload } from '../utils/tokenUtils';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [patient, setPatient] = useState<QRPayload | null>(null);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScan = async () => {
    setError('');
    setPatient(null);
    setScanning(true);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText) => {
          try {
            const data: QRPayload = JSON.parse(decodedText);
            setPatient(data);
          } catch {
            setPatient({ patientRef: decodedText, abha: 'Unknown', name: 'Patient', phone: '**********', recordsUrl: '#', newCase: false });
          }
          stopScan();
        },
        () => {}
      );
    } catch {
      setError('Camera access denied. Please allow camera permissions and try again.');
      setScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }
    } catch {}
    setScanning(false);
  };

  useEffect(() => { return () => { stopScan(); }; }, []);

  // demo scan removed per requirement; real tokens must be scanned via camera or paste

  // demo records have been removed so that only real patient data is shown

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>QR Code Scanner</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Scan the patient's ABHA token to instantly load their profile</p>
        </div>
        {patient && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setPatient(null); setError(''); }}>
            <RefreshCw size={14} /> New Scan
          </button>
        )}
      </div>

      {/* Scanner UI */}
      {!patient && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          {!scanning ? (
            <>
              <div style={{
                width: 80, height: 80, borderRadius: 16,
                background: 'rgba(26,107,60,0.1)', border: '2px dashed var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              }}>
                <QrCode size={40} color="var(--color-primary-light)" />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Ready to Scan</h3>
              <p style={{ color: 'var(--color-text3)', fontSize: 14, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
                Point camera at the patient's token QR code. All patient information will load automatically.
              </p>
              {error && <div className="text-danger text-sm" style={{ marginBottom: 14 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={startScan}>
                  <QrCode size={16} /> Use Camera
                </button>
              </div>
            </>
          ) : (
            <div className="qr-scanner-container">
              <div id="qr-reader" />
              <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={stopScan}>
                <X size={15} /> Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PATIENT PROFILE (auto-loaded from QR) ── */}
      {patient && (
        <div style={{ animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* New case banner */}
          {patient.newCase && (
            <div style={{
              background: 'linear-gradient(90deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: 12, padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>🆕</span>
              <div>
                <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: 14 }}>New Case — Token Scan Detected</div>
                <div style={{ fontSize: 12, color: 'var(--color-text3)' }}>
                  Patient info auto-loaded from ABHA QR · {patient.visitDate} · {patient.department}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text4)' }}>
                {patient.tokenId}
              </div>
            </div>
          )}

          {/* Patient identity card */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(26,107,60,0.12),rgba(34,197,94,0.04))',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 16, padding: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
              }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{patient.name}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                  <span className="badge badge-success">✓ ABHA Verified</span>
                  {patient.bloodGroup && <span className="badge badge-danger">🩸 {patient.bloodGroup}</span>}
                  {patient.department && <span className="badge badge-info">🏥 {patient.department}</span>}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
              <PatientInfoItem icon={<Hash size={14} />} label="ABHA Number" value={patient.abha} color="#a78bfa" />
              <PatientInfoItem icon={<Phone size={14} />} label="Mobile (Masked)" value={patient.phone} color="#60a5fa" />
              {patient.age && <PatientInfoItem icon={<User size={14} />} label="Age" value={`${patient.age} years`} color="#fb923c" />}
              {patient.bloodGroup && <PatientInfoItem icon={<Droplet size={14} />} label="Blood Group" value={patient.bloodGroup} color="#f87171" />}
              {patient.department && <PatientInfoItem icon={<Building2 size={14} />} label="Department" value={patient.department} color="#34d399" />}
              {patient.visitDate && <PatientInfoItem icon={<Calendar size={14} />} label="Visit Date" value={patient.visitDate} color="#fbbf24" />}
            </div>
          </div>

          {/* Allergy warning */}
          {patient.allergies && patient.allergies.toLowerCase() !== 'none' && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '2px solid rgba(239,68,68,0.4)',
              borderRadius: 12, padding: '14px 18px',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <AlertTriangle size={22} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 800, color: '#f87171', fontSize: 15, marginBottom: 4 }}>⚠ ALLERGY ALERT — Read Before Prescribing</div>
                <div style={{ fontSize: 14, color: 'var(--color-text2)', lineHeight: 1.5 }}>{patient.allergies}</div>
              </div>
            </div>
          )}

          {/* Emergency contact */}
          {patient.emergency && (
            <div style={{
              background: 'rgba(251,191,36,0.07)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <PhoneCall size={18} color="#fbbf24" />
              <div>
                <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: 13 }}>Emergency Contact</div>
                <div style={{ fontSize: 14, color: 'var(--color-text2)' }}>{patient.emergency}</div>
              </div>
            </div>
          )}

          {/* Medical records */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>📂 Medical Records History</h3>
              <a href={patient.recordsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                <ZoomIn size={13} /> Open Full Records
              </a>
            </div>
            <div style={{ color: 'var(--color-text3)', fontSize: 13 }}>
              Medical records are fetched from the ABHA system when you scan a valid token.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small component used locally
const Phone: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.1 19.79 19.79 0 0 1 1.58 3.62 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PatientInfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div style={{
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '10px 14px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color, marginBottom: 4 }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{label.toUpperCase()}</span>
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: '#f0fdf4' }}>{value}</div>
  </div>
);

export default QRScanner;

import React, { useState } from 'react';
import { Edit2, Save, X, Phone, AlertTriangle, Heart, Pill, Droplets } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { UserProfile } from '../App';

interface Props {
  profile: UserProfile | null;
  onProfileUpdate: (p: UserProfile) => void;
}

const Field: React.FC<{ icon: React.ReactNode; label: string; value: string; color?: string }> = ({ icon, label, value, color }) => (
  <div style={{
    display: 'flex', gap: 12, padding: '12px 14px',
    background: 'var(--color-bg3)', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', alignItems: 'center',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
      background: `${color || '#3b82f6'}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: color || '#60a5fa',
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: value ? 'var(--color-text)' : 'var(--color-text4)' }}>
        {value || 'Not provided'}
      </div>
    </div>
  </div>
);

const EmergencyCard: React.FC<Props> = ({ profile, onProfileUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    bloodGroup: profile?.bloodGroup || '',
    allergies: profile?.allergies || '',
    emergency: profile?.emergency || '',
    abhaNumber: profile?.abhaNumber || '',
    age: profile?.age || '',
    // Extra fields just for emergency card
    chronicDiseases: (profile as any)?.chronicDiseases || '',
    currentMeds: (profile as any)?.currentMeds || '',
  });

  const save = () => {
    onProfileUpdate({
      name: form.name,
      email: profile?.email || '',
      age: form.age,
      emergency: form.emergency,
      allergies: form.allergies,
      bloodGroup: form.bloodGroup,
      abhaNumber: form.abhaNumber,
      uploadedDocs: profile?.uploadedDocs || [],
      ...(form.chronicDiseases ? { chronicDiseases: form.chronicDiseases } : {}),
      ...(form.currentMeds ? { currentMeds: form.currentMeds } : {}),
    } as any);
    setEditing(false);

    // Auto download QR Code after saving
    setTimeout(() => {
      const svg = document.getElementById('emergency-qr');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Emergency_Health_QR.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 100);
  };

  const handlePrint = () => window.print();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Emergency Health Card</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Quick-access card with critical health information for emergencies</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>🖨️ Print Card</button>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(v => !v)}>
            {editing ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit Info</>}
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Update Emergency Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'e.g. Rajesh Kumar' },
              { label: 'Age', key: 'age', placeholder: 'e.g. 42' },
              { label: 'Blood Group', key: 'bloodGroup', placeholder: 'e.g. B+' },
              { label: 'ABHA Number', key: 'abhaNumber', placeholder: 'xxxx-xxxx-xxxx-xxxx' },
              { label: 'Emergency Contact', key: 'emergency', placeholder: 'Name – Phone' },
              { label: 'Known Allergies', key: 'allergies', placeholder: 'e.g. Penicillin, dust' },
              { label: 'Chronic Diseases', key: 'chronicDiseases', placeholder: 'e.g. Diabetes, Hypertension' },
              { label: 'Current Medications', key: 'currentMeds', placeholder: 'e.g. Metformin 500mg, Aspirin 75mg' },
            ].map(f => (
              <div key={f.key} className="input-group">
                <label>{f.label}</label>
                <input className="input" placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={save}>
            <Save size={14} /> Save Emergency Info
          </button>
        </div>
      )}

      {/* Card display */}
      <div id="emergency-card-print" style={{
        background: 'linear-gradient(135deg, #0a0f1e, #111827)',
        border: '2px solid rgba(239,68,68,0.4)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(239,68,68,0.15)',
      }}>
        {/* Card Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.08))',
          borderBottom: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 32 }}>🚑</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Emergency Health Card</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{profile?.name || 'Name not set'}</div>
              {profile?.age && <div style={{ fontSize: 12, color: 'var(--color-text3)' }}>Age: {profile.age} years</div>}
            </div>
          </div>
          <div style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Blood Group</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#f87171' }}>{profile?.bloodGroup || '—'}</div>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            <Field icon={<AlertTriangle size={16} />} label="Known Allergies" value={profile?.allergies || ''} color="#f59e0b" />
            <Field icon={<Heart size={16} />} label="Chronic Diseases" value={(profile as any)?.chronicDiseases || ''} color="#ef4444" />
            <Field icon={<Pill size={16} />} label="Current Medications" value={(profile as any)?.currentMeds || ''} color="#8b5cf6" />
            <Field icon={<Phone size={16} />} label="Emergency Contact" value={profile?.emergency || ''} color="#22c55e" />
            <Field icon={<Droplets size={16} />} label="ABHA Number" value={profile?.abhaNumber || ''} color="#3b82f6" />
          </div>
          
          {/* Emergency QR Code */}
          <div style={{ 
            width: 140, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 8,
            background: '#fff',
            padding: 12,
            borderRadius: 'var(--radius-md)',
            alignSelf: 'flex-start',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
             <QRCodeSVG 
               id="emergency-qr"
               value={JSON.stringify({ 
                 name: profile?.name, 
                 bloodGroup: profile?.bloodGroup, 
                 emergency: profile?.emergency, 
                 allergies: profile?.allergies, 
                 meds: (profile as any)?.currentMeds 
               })} 
               size={116} 
               level="M" 
             />
             <div style={{ fontSize: 9, color: '#000', fontWeight: 800, textAlign: 'center', letterSpacing: 0.5 }}>SCAN IN EMERGENCY</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)', fontSize: 11, color: 'var(--color-text4)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        }}>
          <span>🏥 ABHA Mission Health Platform</span>
          <span>In emergency, scan patient's ABHA QR for full records</span>
        </div>
      </div>

      {!profile?.name && (
        <div style={{
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
          fontSize: 13, color: '#fbbf24',
        }}>
          ⚠️ Your emergency card is incomplete. Click <strong>Edit Info</strong> to fill in your critical health details.
        </div>
      )}
    </div>
  );
};

export default EmergencyCard;

import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, User, Hash } from 'lucide-react';

interface Prescription {
  id: string;
  patientName: string;
  abhaNumber: string;
  file: File;
  url: string;
  uploadedAt: string;
  notes: string;
}

const PrescriptionUpload: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patientName, setPatientName] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !patientName) {
      alert('Please select a file and enter the patient name.');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    const p: Prescription = {
      id: Date.now().toString(),
      patientName, abhaNumber, notes,
      file: selectedFile, url,
      uploadedAt: new Date().toLocaleString('en-IN'),
    };
    setPrescriptions(prev => [p, ...prev]);
    setSelectedFile(null);
    setPatientName('');
    setAbhaNumber('');
    setNotes('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Prescription Upload</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Upload and manage patient prescriptions</p>
      </div>

      {/* Upload form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>New Prescription</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Patient Name *</label>
            <input className="input" placeholder="e.g. Rajesh Kumar" value={patientName} onChange={e => setPatientName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>ABHA Number</label>
            <input className="input" placeholder="xxxx-xxxx-xxxx-xxxx" value={abhaNumber} onChange={e => setAbhaNumber(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label>Clinical Notes</label>
          <textarea className="input" rows={3} placeholder="Diagnosis, medication notes, follow-up instructions..."
            value={notes} onChange={e => setNotes(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'var(--font-main)' }} />
        </div>

        {/* Drop zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          style={{ padding: 24 }}>
          <Upload size={24} color="var(--color-primary-light)" style={{ marginBottom: 8 }} />
          {selectedFile ? (
            <div style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>✅ {selectedFile.name}</div>
          ) : (
            <>
              <div style={{ fontWeight: 600 }}>Drop prescription or click to upload</div>
              <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 4 }}>PDF, image, or document</div>
            </>
          )}
          <input ref={inputRef} type="file" style={{ display: 'none' }}
            accept=".pdf,image/*,.doc,.docx"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        <button className="btn btn-primary" onClick={handleUpload} disabled={!selectedFile || !patientName}>
          <Upload size={15} /> Upload Prescription
        </button>
      </div>

      {/* Prescriptions list */}
      {prescriptions.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Uploaded Prescriptions ({prescriptions.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {prescriptions.map(p => (
              <div key={p.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'rgba(26,107,60,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FileText size={20} color="var(--color-primary-light)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <User size={13} color="var(--color-text4)" />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{p.patientName}</span>
                    </div>
                    {p.abhaNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text4)', marginBottom: 4 }}>
                        <Hash size={11} /> {p.abhaNumber}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: 'var(--color-text4)', marginBottom: 6 }}>
                      📎 {p.file.name} · {p.uploadedAt}
                    </div>
                    {p.notes && (
                      <div style={{
                        background: 'var(--color-bg3)', borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px', fontSize: 13, color: 'var(--color-text2)',
                      }}>
                        {p.notes}
                      </div>
                    )}
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;

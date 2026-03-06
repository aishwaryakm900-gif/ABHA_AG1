import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, User, Hash } from 'lucide-react';
import { saveGlobalPrescription, getGlobalPrescriptions, saveProfileToDB, getProfileFromDB } from '../utils/storage';
import type { UserProfile, UploadedDoc } from '../App';

export interface Prescription {
  id: string;
  patientName: string;
  abhaNumber: string;
  fileName: string;
  size: number;
  type: string;
  url: string; // the dataUrl
  uploadedAt: string;
  notes: string;
}

const PrescriptionUpload: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patientName, setPatientName] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load historical global prescriptions
    getGlobalPrescriptions().then(data => {
      // sort latest first
      const sorted = data.sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      setPrescriptions(sorted);
    });
  }, []);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientName) {
      alert('Please select a file and enter the patient name.');
      return;
    }
    
    // Convert to Base64 so it can be stored globally in IndexedDB
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      const p: Prescription = {
        id: Date.now().toString(),
        patientName, abhaNumber, notes,
        fileName: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: dataUrl,
        uploadedAt: new Date().toLocaleString('en-IN'),
      };
      
      // Save to global prescriptions
      await saveGlobalPrescription(p);
      setPrescriptions(prev => [p, ...prev]);

      // If ABHA number is provided, also add to patient's health reports
      if (abhaNumber.trim()) {
        try {
          const profile = await getProfileFromDB();
          if (profile && profile.abhaNumber === abhaNumber) {
            // Create UploadedDoc from prescription
            const uploadedDoc: UploadedDoc = {
              id: `prescription-${p.id}`,
              name: `Prescription - ${p.fileName}`,
              size: p.size,
              type: p.type,
              url: p.url,
              content: p.url,
              uploadedAt: p.uploadedAt,
              analysis: `Prescription uploaded by doctor. Notes: ${p.notes || 'No additional notes'}`,
            };

            // Add to user's uploaded docs
            const updatedProfile: UserProfile = {
              ...profile,
              uploadedDocs: [uploadedDoc, ...profile.uploadedDocs],
            };

            await saveProfileToDB(updatedProfile);
            setUploadStatus('✅ Prescription uploaded and added to patient health reports');
            console.log('Prescription also added to patient health reports');
          } else {
            setUploadStatus('⚠️ Prescription uploaded globally (patient profile not found)');
            console.log('Patient profile not found or ABHA number mismatch - prescription saved globally only');
          }
        } catch (error) {
          setUploadStatus('⚠️ Prescription uploaded globally (error adding to patient reports)');
          console.error('Error adding prescription to patient health reports:', error);
        }
      } else {
        setUploadStatus('✅ Prescription uploaded globally');
      }

      // Clear status after 5 seconds
      setTimeout(() => setUploadStatus(''), 5000);

      setSelectedFile(null);
      setPatientName('');
      setAbhaNumber('');
      setNotes('');
      if (inputRef.current) inputRef.current.value = '';
    };
    reader.readAsDataURL(selectedFile);
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

        {uploadStatus && (
          <div style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: uploadStatus.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)',
            border: `1px solid ${uploadStatus.includes('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'}`,
            color: uploadStatus.includes('✅') ? '#166534' : '#92400e',
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
          }}>
            {uploadStatus}
          </div>
        )}
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
                      📎 {p.fileName} · {p.uploadedAt}
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

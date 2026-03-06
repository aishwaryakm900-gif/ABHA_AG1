import React, { useState, useRef } from 'react';
import { Mic, Square, FileText, Trash2, Calendar, Pill, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import { generateVisitSummary } from '../utils/fakeAI';
import type { VisitSummary } from '../utils/fakeAI';

interface VisitRecord {
  id: string;
  name: string;
  duration: string;
  createdAt: string;
  transcript: string;
  summary: VisitSummary | null;
}

const VisitRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem('visitRecords') || '[]'); } catch { return []; }
  });
  const [generatingSummaryFor, setGeneratingSummaryFor] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transcriptMode, setTranscriptMode] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const saveVisits = (updated: VisitRecord[]) => {
    // Don't store blob data in localStorage, only metadata
    const toSave = updated.map(v => ({ ...v }));
    setVisits(toSave);
    try { localStorage.setItem('visitRecords', JSON.stringify(toSave)); } catch {}
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const id = Date.now().toString();
        const newVisit: VisitRecord = {
          id,
          name: `Visit ${new Date().toLocaleDateString('en-IN')}`,
          duration: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
          createdAt: new Date().toLocaleString('en-IN'),
          transcript: '',
          summary: null,
        };
        saveVisits([newVisit, ...visits]);
        setElapsed(0);
      };
      mr.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const generateSummary = (visitId: string, transcript: string) => {
    setGeneratingSummaryFor(visitId);
    setTimeout(() => {
      const summary = generateVisitSummary(transcript || '');
      const updated = visits.map(v => v.id === visitId ? { ...v, summary, transcript: transcript || v.transcript } : v);
      saveVisits(updated);
      setGeneratingSummaryFor(null);
      setExpandedId(visitId);
    }, 1800);
  };

  const addManualTranscript = (visitId: string) => {
    const updated = visits.map(v => v.id === visitId ? { ...v, transcript: manualTranscript } : v);
    saveVisits(updated);
    setManualTranscript('');
    setTranscriptMode(false);
  };

  const deleteVisit = (id: string) => {
    saveVisits(visits.filter(v => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Doctor Visit Recorder</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>
          Record consultations and get AI-generated structured visit summaries
        </p>
      </div>

      {/* Recorder UI */}
      <div className="card" style={{
        textAlign: 'center', padding: 36,
        background: isRecording ? 'rgba(239,68,68,0.04)' : 'var(--color-bg2)',
        border: `1px solid ${isRecording ? 'rgba(239,68,68,0.35)' : 'var(--color-border)'}`,
      }}>
        {/* Waveform */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 40, marginBottom: 18 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              background: isRecording ? 'var(--color-danger)' : 'var(--color-bg4)',
              height: isRecording ? `${20 + Math.random() * 80}%` : '20%',
              animation: isRecording ? `typingDot ${0.4 + Math.random() * 0.6}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${i * 0.04}s`,
              transition: 'height 0.15s ease',
            }} />
          ))}
        </div>

        {isRecording && (
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-danger)', marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(elapsed)}
          </div>
        )}
        <div style={{ fontSize: 13, color: 'var(--color-text3)', marginBottom: 20 }}>
          {isRecording ? '🔴 Recording in progress...' : 'Record your doctor consultation'}
        </div>
        <button
          className={`btn btn-lg ${isRecording ? 'btn-accent' : 'btn-primary'}`}
          onClick={isRecording ? stopRecording : startRecording}
          style={{ borderRadius: 'var(--radius-full)', width: 72, height: 72, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {isRecording ? <Square size={28} /> : <Mic size={28} />}
        </button>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-text4)' }}>
          {isRecording ? 'Click square to stop recording' : 'Click mic to start recording'}
        </div>
      </div>

      {/* Visit Records */}
      {visits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Visit Records ({visits.length})</h3>
          {visits.map(visit => (
            <div key={visit.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Mic size={18} color="#60a5fa" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{visit.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>
                    {visit.duration} · {visit.createdAt}
                  </div>
                  {visit.summary && <span className="badge badge-success" style={{ marginTop: 4 }}>✓ Summary ready</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {visit.summary && (
                    <button className="btn btn-ghost btn-icon btn-sm" title="Toggle Summary"
                      onClick={() => setExpandedId(expandedId === visit.id ? null : visit.id)}>
                      {expandedId === visit.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  )}
                  {!visit.summary && generatingSummaryFor !== visit.id && (
                    <button className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (!visit.transcript) {
                          setTranscriptMode(true);
                          setExpandedId(visit.id);
                        } else {
                          generateSummary(visit.id, visit.transcript);
                        }
                      }}>
                      <FileText size={13} /> Generate Summary
                    </button>
                  )}
                  {generatingSummaryFor === visit.id && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-primary-light)' }}>
                      <div className="animate-spin" style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      Generating...
                    </div>
                  )}
                  <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }}
                    onClick={() => deleteVisit(visit.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Transcript input (if no transcript yet) */}
              {expandedId === visit.id && !visit.summary && transcriptMode && (
                <div style={{ padding: '14px 16px', borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-text3)' }}>
                    Enter keywords from your consultation (e.g., "diabetes sugar metformin"):
                  </div>
                  <textarea
                    className="input"
                    rows={3}
                    style={{ resize: 'vertical', fontSize: 13 }}
                    placeholder="e.g., blood pressure, amlodipine, hypertension, reduce salt..."
                    value={manualTranscript}
                    onChange={e => setManualTranscript(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => { addManualTranscript(visit.id); generateSummary(visit.id, manualTranscript); }}>
                      Generate AI Summary
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setTranscriptMode(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Summary display */}
              {expandedId === visit.id && visit.summary && (
                <div style={{ padding: '18px 20px', borderTop: '1px solid var(--color-border)', background: 'linear-gradient(135deg,rgba(59,130,246,0.04),rgba(139,92,246,0.02))', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {/* Diagnosis */}
                    <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <ClipboardList size={14} color="#f87171" />
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#f87171', textTransform: 'uppercase', letterSpacing: 0.5 }}>Diagnosis</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{visit.summary.diagnosis}</div>
                    </div>

                    {/* Follow-up */}
                    <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Calendar size={14} color="var(--color-primary-light)" />
                        <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Follow-up</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{visit.summary.followUpDate}</div>
                    </div>

                    {/* Medicines */}
                    <div style={{ padding: '12px 14px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Pill size={14} color="#a78bfa" />
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prescribed Medicines</span>
                      </div>
                      {visit.summary.medicines.map((m, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--color-text2)', display: 'flex', gap: 8, marginBottom: 4 }}>
                          <span style={{ color: '#a78bfa', fontWeight: 700 }}>💊</span> {m}
                        </div>
                      ))}
                    </div>

                    {/* Instructions */}
                    <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <FileText size={14} color="#fbbf24" />
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.5 }}>Doctor's Instructions</span>
                      </div>
                      {visit.summary.instructions.map((ins, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--color-text2)', display: 'flex', gap: 8, marginBottom: 4 }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700, flexShrink: 0 }}>✓</span> {ins}
                        </div>
                      ))}
                    </div>
                  </div>

                  {visit.summary.doctorNotes && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-text4)' }}>
                      📝 {visit.summary.doctorNotes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {visits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text4)' }}>
          <Mic size={40} style={{ marginBottom: 12, opacity: 0.35 }} />
          <p>No visit recordings yet</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Record a consultation and get an AI-generated visit summary</p>
        </div>
      )}
    </div>
  );
};

export default VisitRecorder;

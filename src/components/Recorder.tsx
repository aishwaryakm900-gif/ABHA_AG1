import React, { useState, useRef } from 'react';
import { Mic, MicOff, Download, Trash2, Play, Pause, Square } from 'lucide-react';

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  duration: string;
  createdAt: string;
}

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        setRecordings(r => [{
          id: Date.now().toString(),
          name: `Recording ${r.length + 1}`,
          blob, url,
          duration: `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`,
          createdAt: new Date().toLocaleTimeString('en-IN'),
        }, ...r]);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = (rec: Recording) => {
    let audio = audioRefs.current.get(rec.id);
    if (!audio) {
      audio = new Audio(rec.url);
      audio.onended = () => setPlayingId(null);
      audioRefs.current.set(rec.id, audio);
    }
    if (playingId === rec.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audioRefs.current.forEach((a, id) => { if (id !== rec.id) { a.pause(); a.currentTime = 0; } });
      audio.play();
      setPlayingId(rec.id);
    }
  };

  const handleDownload = (rec: Recording) => {
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = `${rec.name}.webm`;
    a.click();
  };

  const handleDelete = (id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) { audio.pause(); audioRefs.current.delete(id); }
    setRecordings(r => {
      const rec = r.find(x => x.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return r.filter(x => x.id !== id);
    });
    if (playingId === id) setPlayingId(null);
  };

  const formatElapsed = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Voice Recorder</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Record patient consultations and notes</p>
      </div>

      {/* Recorder UI */}
      <div className="card" style={{
        textAlign: 'center', padding: 40,
        background: isRecording ? 'rgba(239,68,68,0.05)' : 'var(--color-bg2)',
        border: `1px solid ${isRecording ? 'rgba(239,68,68,0.3)' : 'var(--color-border)'}`,
      }}>
        {/* Waveform visualization */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 40, marginBottom: 20 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              background: isRecording ? 'var(--color-danger)' : 'var(--color-bg4)',
              height: isRecording ? `${Math.random() * 100}%` : '20%',
              animation: isRecording ? `typingDot ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${i * 0.05}s`,
              transition: 'height 0.1s ease',
            }} />
          ))}
        </div>

        {isRecording && (
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-danger)', marginBottom: 12, fontVariantNumeric: 'tabular-nums' }}>
            {formatElapsed(elapsed)}
          </div>
        )}

        <div style={{ fontSize: 14, color: 'var(--color-text3)', marginBottom: 24 }}>
          {isRecording ? '🔴 Recording in progress...' : 'Click to start recording'}
        </div>

        <button
          className={`btn btn-lg ${isRecording ? 'btn-accent' : 'btn-primary'}`}
          onClick={isRecording ? stopRecording : startRecording}
          style={{ borderRadius: '50%', width: 72, height: 72, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {isRecording ? <Square size={28} /> : <Mic size={28} />}
        </button>
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--color-text4)' }}>
          {isRecording ? 'Click to stop' : 'Start Recording'}
        </div>
      </div>

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recordings ({recordings.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recordings.map(rec => (
              <div key={rec.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className={`btn btn-icon ${playingId === rec.id ? 'btn-accent' : 'btn-secondary'}`}
                  onClick={() => togglePlay(rec)}>
                  {playingId === rec.id ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{rec.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text4)' }}>{rec.duration} · {rec.createdAt}</div>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDownload(rec)} title="Download">
                  <Download size={15} />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(rec.id)} title="Delete"
                  style={{ color: 'var(--color-danger)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recorder;

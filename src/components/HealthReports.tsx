import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Download, Trash2, Activity, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { analyzeMedicalReport } from '../utils/fakeAI';
import type { UploadedDoc } from '../App';

interface Props {
  docs?: UploadedDoc[];
  onDocsChange?: (docs: UploadedDoc[]) => void;
}

/** Renders the plain-language AI analysis text with basic markdown (**, 📌 emoji sections) */
const AnalysisBody: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 4 }} />;
        // Section headers like "🩸 **What this report is about:**"
        const headerMatch = line.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}]*)\s*\*\*(.+?)\*\*/u);
        if (headerMatch) {
          const emoji = headerMatch[1];
          const rest = line.replace(/\*\*(.+?)\*\*/, '').replace(emoji, '').replace(/^[:：\s]+/, '').trim();
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{emoji}</span>
                <span>{headerMatch[2]}</span>
              </div>
              {rest && <div style={{ fontSize: 13, color: 'var(--color-text2)', lineHeight: 1.6, paddingLeft: 22 }}>{rest}</div>}
            </div>
          );
        }
        // Bulleted lines starting with •
        if (line.startsWith('•') || line.startsWith('- ')) {
          return (
            <div key={i} style={{ fontSize: 13, color: 'var(--color-text2)', display: 'flex', gap: 8, paddingLeft: 22 }}>
              <span style={{ color: 'var(--color-primary-light)', fontWeight: 700, flexShrink: 0 }}>•</span>
              <span style={{ lineHeight: 1.6 }}>{line.replace(/^[•\-]\s*/, '')}</span>
            </div>
          );
        }
        return (
          <div key={i} style={{ fontSize: 13, color: 'var(--color-text2)', lineHeight: 1.6, paddingLeft: 2 }}>{line}</div>
        );
      })}
    </div>
  );
};

const HealthReports: React.FC<Props> = ({ docs: externalDocs, onDocsChange }) => {
  const [localFiles, setLocalFiles] = useState<UploadedDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external (profile-linked) docs if provided, else local state
  const files = externalDocs ?? localFiles;

  // Track the most recent "files" to prevent stale closures (especially in setTimeout)
  const filesRef = useRef(files);
  filesRef.current = files;

  const setFiles = useCallback((updater: (prev: UploadedDoc[]) => UploadedDoc[]) => {
    const nextFiles = updater(filesRef.current);
    filesRef.current = nextFiles; // Optimistically handle rapid sync/async calls
    if (onDocsChange) {
      onDocsChange(nextFiles);
    } else {
      setLocalFiles(nextFiles);
    }
  }, [onDocsChange]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const hf: UploadedDoc = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: dataUrl, // store dataURL directly
        content: dataUrl,
        uploadedAt: new Date().toLocaleString('en-IN'),
        analysis: '',
      };
      setFiles(f => [hf, ...f]);
      setAnalyzing(id);
      setTimeout(() => {
        const result = analyzeMedicalReport(file.name);
        setFiles(f => f.map(x => (x.id === id ? { ...x, analysis: result } : x)));
        setAnalyzing(null);
        setExpandedId(id); // auto-open analysis for new file
      }, 2400);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(processFile);
  }, []);

  const handleDelete = (id: string) => {
    setFiles(f => {
      const file = f.find(x => x.id === id);
      if (file) URL.revokeObjectURL(file.url);
      return f.filter(x => x.id !== id);
    });
    if (expandedId === id) setExpandedId(null);
  };

  const handleDownload = (file: UploadedDoc) => {
    const a = document.createElement('a');
    a.href = file.url; a.download = file.name; a.click();
  };

  const formatSize = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
  const getIcon = (type: string) => type.includes('pdf') ? '📄' : type.includes('image') ? '🖼️' : '📋';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Health Reports</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Upload reports and get a simple explanation in plain language — no medical jargon</p>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload size={32} color="var(--color-primary-light)" style={{ marginBottom: 12 }} />
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop files here or click to upload</div>
        <div style={{ fontSize: 13, color: 'var(--color-text4)' }}>Supports PDF, images, and documents · AI will explain findings in simple language</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,image/*,.doc,.docx,.txt" style={{ display: 'none' }}
          onChange={e => {
            Array.from(e.target.files || []).forEach(processFile);
            e.target.value = '';
          }} />
      </div>

      {/* Files list */}
      {files.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
            Uploaded Documents ({files.length})
          </h3>
          {files.map(file => (
            <div key={file.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* File header row */}
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{getIcon(file.type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>
                    {formatSize(file.size)} · {file.uploadedAt}
                  </div>
                  {analyzing === file.id && (
                    <div style={{ fontSize: 12, color: 'var(--color-primary-light)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div className="animate-spin" style={{ width: 10, height: 10, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      Analysing your report...
                    </div>
                  )}
                  {file.analysis && !analyzing && (
                    <span className="badge badge-success" style={{ marginTop: 4 }}>✓ Plain language summary ready</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {file.analysis && !analyzing && (
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      title={expandedId === file.id ? 'Hide Analysis' : 'View Plain Language Analysis'}
                      onClick={() => setExpandedId(expandedId === file.id ? null : file.id)}>
                      {expandedId === file.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  )}
                  <button className="btn btn-ghost btn-icon btn-sm" title="Download" onClick={() => handleDownload(file)}>
                    <Download size={15} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Delete"
                    onClick={() => handleDelete(file.id)} style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expandable plain-language analysis */}
              {expandedId === file.id && file.analysis && (
                <div style={{
                  borderTop: '1px solid var(--color-border)',
                  padding: '18px 20px',
                  background: 'linear-gradient(135deg,rgba(26,107,60,0.05),rgba(34,197,94,0.02))',
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'rgba(34,197,94,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Activity size={14} color="var(--color-primary-light)" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary-light)' }}>
                      What Your Report Says — In Simple Words
                    </span>
                  </div>
                  <AnalysisBody text={file.analysis} />
                  <div style={{
                    marginTop: 14, padding: '8px 12px',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                    fontSize: 11, color: 'var(--color-text4)', display: 'flex', gap: 6, alignItems: 'center',
                  }}>
                    <AlertCircle size={11} />
                    This is a simplified summary. Always consult your doctor for medical advice.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text4)' }}>
          <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>No documents uploaded yet</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Upload a report and our AI will explain it in plain, everyday language</p>
        </div>
      )}
    </div>
  );
};

export default HealthReports;

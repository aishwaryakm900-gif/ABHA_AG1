import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import type { UploadedDoc } from '../App';

interface Props {
  docs?: UploadedDoc[];
}

interface TimelineEvent {
  id: string;
  type: 'report' | 'visit' | 'prescription' | 'alert';
  title: string;
  detail: string;
  date: string;
  dateLabel: string;
  icon: string;
  color: string;
  badge?: string;
}

const TYPE_COLORS: Record<string, string> = {
  report: '#3b82f6',
  visit: '#22c55e',
  prescription: '#8b5cf6',
  alert: '#f59e0b',
};

const TYPE_LABELS: Record<string, string> = {
  report: 'Health Report',
  visit: 'Doctor Visit',
  prescription: 'Prescription',
  alert: 'Health Alert',
};

const HealthTimeline: React.FC<Props> = ({ docs = [] }) => {
  const [filter, setFilter] = useState<'all' | 'report' | 'visit' | 'prescription' | 'alert'>('all');

  // Build events from uploaded docs
  const docEvents: TimelineEvent[] = docs.map(d => ({
    id: d.id,
    type: 'report' as const,
    title: d.name,
    detail: `${(d.size / 1024).toFixed(1)} KB · Uploaded ${d.uploadedAt}`,
    date: new Date().toISOString().slice(0, 10),
    dateLabel: d.uploadedAt,
    icon: d.type.includes('pdf') ? '📄' : d.type.includes('image') ? '🖼️' : '📋',
    color: '#3b82f6',
    badge: d.analysis ? 'Analysed' : undefined,
  }));

  const allEvents = [...docEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter);

  const filterCounts: Record<string, number> = { all: allEvents.length };
  allEvents.forEach(e => { filterCounts[e.type] = (filterCounts[e.type] || 0) + 1; });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Health Timeline</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>
          Your complete health journey — reports, visits, prescriptions, and alerts
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} color="var(--color-text4)" />
        {(['all', 'report', 'visit', 'prescription', 'alert'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', borderRadius: 'var(--radius-full)',
              background: filter === f ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' : 'var(--color-bg3)',
              border: filter === f ? 'none' : '1px solid var(--color-border)',
              color: filter === f ? '#fff' : 'var(--color-text3)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-main)', fontWeight: 600,
              transition: 'var(--transition)',
            }}>
            {f === 'all' ? 'All Events' : TYPE_LABELS[f]}
            <span style={{ marginLeft: 6, opacity: 0.75 }}>({filterCounts[f] || 0})</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((event, idx) => (
            <div key={event.id} style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' }}>
              {/* Line */}
              {idx < filtered.length - 1 && (
                <div style={{ position: 'absolute', left: 19, top: 44, bottom: 0, width: 2, background: 'var(--color-border)' }} />
              )}
              {/* Dot */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${event.color}18`, border: `2px solid ${event.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {event.icon}
              </div>
              {/* Content */}
              <div className="card" style={{ flex: 1, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{event.title}</span>
                      {event.badge && (
                        <span style={{
                          padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700,
                          background: `${event.color}20`, color: event.color, border: `1px solid ${event.color}40`,
                        }}>
                          {event.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text3)' }}>{event.detail}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 600,
                      background: `${TYPE_COLORS[event.type]}15`, color: TYPE_COLORS[event.type],
                      border: `1px solid ${TYPE_COLORS[event.type]}30`,
                    }}>
                      {TYPE_LABELS[event.type]}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-text4)' }}>{event.dateLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text4)' }}>
          <p>No events found for this filter</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Upload health reports or record visits to see them here</p>
        </div>
      )}
    </div>
  );
};

export default HealthTimeline;

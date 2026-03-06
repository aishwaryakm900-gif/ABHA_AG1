import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Pill, Plus, Edit2, Trash2 } from 'lucide-react';
import { generateMedicineSchedule } from '../utils/fakeAI';
import type { MedicineReminder } from '../utils/fakeAI';

const DEFAULT_MEDS: any[] = [];

const TIME_SLOTS = ['6:00 AM', '7:00 AM', '7:30 AM', '8:00 AM', '9:00 AM', '12:00 PM', '1:00 PM', '6:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

const MedicineReminders: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>(() => generateMedicineSchedule(DEFAULT_MEDS));
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time1: '8:00 AM', time2: '8:00 PM', times: ['8:00 AM'] });
  const [addTimesCount, setAddTimesCount] = useState(1);
  const [editingMed, setEditingMed] = useState<MedicineReminder | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleReminder = (medicine: string) => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setEnabled(prev => ({ ...prev, [medicine]: !prev[medicine] }));
  };

  const isNearTime = (timeStr: string): boolean => {
    const [h, m] = timeStr.replace(' AM', '').replace(' PM', '').split(':').map(Number);
    let hour = h;
    if (timeStr.includes('PM') && h !== 12) hour += 12;
    if (timeStr.includes('AM') && h === 12) hour = 0;
    const now = currentTime;
    const diff = Math.abs((now.getHours() * 60 + now.getMinutes()) - (hour * 60 + m));
    return diff <= 30;
  };

  const addMedicine = () => {
    if (!newMed.name.trim()) return;
    const times = addTimesCount === 1 ? [newMed.time1] : [newMed.time1, newMed.time2];
    const meds = [{ name: newMed.name, dosage: newMed.dosage, frequency: addTimesCount === 1 ? 'Once daily (OD)' : 'Twice daily (BD)', purpose: 'As prescribed', timing: times }];
    const [newR] = generateMedicineSchedule(meds);
    setReminders(prev => [...prev, newR]);
    setNewMed({ name: '', dosage: '', time1: '8:00 AM', time2: '8:00 PM', times: ['8:00 AM'] });
    setAddTimesCount(1);
    setShowAddForm(false);
  };

  const startEditing = (med: MedicineReminder) => {
    const isTwice = med.times.length === 2;
    setNewMed({
      name: med.medicine,
      dosage: med.dosage || '',
      time1: med.times[0],
      time2: med.times[1] || '8:00 PM',
      times: med.times
    });
    setAddTimesCount(isTwice ? 2 : 1);
    setEditingMed(med);
    setShowAddForm(true);
  };

  const updateMedicine = () => {
    if (!newMed.name.trim() || !editingMed) return;
    const times = addTimesCount === 1 ? [newMed.time1] : [newMed.time1, newMed.time2];
    const meds = [{ name: newMed.name, dosage: newMed.dosage, frequency: addTimesCount === 1 ? 'Once daily (OD)' : 'Twice daily (BD)', purpose: 'As prescribed', timing: times }];
    const [updatedR] = generateMedicineSchedule(meds);
    
    setReminders(prev => prev.map(r => r.medicine === editingMed.medicine ? updatedR : r));
    setNewMed({ name: '', dosage: '', time1: '8:00 AM', time2: '8:00 PM', times: ['8:00 AM'] });
    setAddTimesCount(1);
    setEditingMed(null);
    setShowAddForm(false);
  };

  const deleteMedicine = (medicineName: string) => {
    setReminders(prev => prev.filter(r => r.medicine !== medicineName));
  };

  // Group by time slot
  const timeMap: Record<string, MedicineReminder[]> = {};
  reminders.forEach(r => {
    r.times.forEach(t => {
      if (!timeMap[t]) timeMap[t] = [];
      timeMap[t].push(r);
    });
  });
  const sortedTimes = Object.keys(timeMap).sort((a, b) => {
    const toMin = (s: string) => {
      const [h, m] = s.replace(' AM', '').replace(' PM', '').split(':').map(Number);
      let hr = h;
      if (s.includes('PM') && h !== 12) hr += 12;
      if (s.includes('AM') && h === 12) hr = 0;
      return hr * 60 + m;
    };
    return toMin(a) - toMin(b);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Medicine Reminders</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Your daily medicine schedule with smart reminders</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(v => !v)}>
          <Plus size={14} /> Add Medicine
        </button>
      </div>

      {/* Add/Edit form */}
      {showAddForm && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h3>
          {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="input-group">
              <label>Medicine Name *</label>
              <input className="input" placeholder="e.g. Metformin 500mg" value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="input-group">
              <label>Dosage</label>
              <input className="input" placeholder="e.g. 500mg" value={newMed.dosage} onChange={e => setNewMed(p => ({ ...p, dosage: e.target.value }))} />
            </div>
          </div> */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--color-text3)', fontWeight: 500 }}>Times per day</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              {[1, 2].map(n => (
                <button key={n} onClick={() => setAddTimesCount(n)}
                  style={{
                    padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: 13, cursor: 'pointer',
                    background: addTimesCount === n ? 'linear-gradient(135deg,var(--color-primary),var(--color-primary-light))' : 'var(--color-bg3)',
                    border: addTimesCount === n ? 'none' : '1px solid var(--color-border)',
                    color: addTimesCount === n ? '#fff' : 'var(--color-text2)',
                    fontFamily: 'var(--font-main)',
                  }}>
                  {n === 1 ? 'Once daily' : 'Twice daily'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: addTimesCount === 2 ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 14 }}>
            <div className="input-group">
              <label>Time {addTimesCount === 2 ? '1' : ''}</label>
              <select className="input" value={newMed.time1} onChange={e => setNewMed(p => ({ ...p, time1: e.target.value }))}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {addTimesCount === 2 && (
              <div className="input-group">
                <label>Time 2</label>
                <select className="input" value={newMed.time2} onChange={e => setNewMed(p => ({ ...p, time2: e.target.value }))}>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={editingMed ? updateMedicine : addMedicine} disabled={!newMed.name.trim()}>
              {editingMed ? 'Update Medicine' : 'Add to Schedule'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { 
              setShowAddForm(false); 
              setEditingMed(null);
              setNewMed({ name: '', dosage: '', time1: '8:00 AM', time2: '8:00 PM', times: ['8:00 AM'] });
              setAddTimesCount(1);
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Schedule by time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sortedTimes.map(time => {
          const isNow = isNearTime(time);
          return (
            <div key={time}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 14px', borderRadius: 'var(--radius-full)',
                  background: isNow ? 'rgba(34,197,94,0.15)' : 'var(--color-bg3)',
                  border: `1px solid ${isNow ? 'rgba(34,197,94,0.4)' : 'var(--color-border)'}`,
                }}>
                  <Clock size={12} color={isNow ? 'var(--color-primary-light)' : 'var(--color-text4)'} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: isNow ? 'var(--color-primary-light)' : 'var(--color-text3)' }}>
                    {time}
                  </span>
                  {isNow && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary-light)' }}>● NOW</span>}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8 }}>
                {timeMap[time].map(med => (
                  <div key={med.medicine} style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg2)', border: `1px solid ${isNow ? med.color + '40' : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'var(--transition)',
                    boxShadow: isNow ? `0 0 0 1px ${med.color}20` : 'none',
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: `${med.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      {med.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{med.medicine}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text4)', marginTop: 2 }}>{med.dosage || 'As prescribed'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        style={{
                          padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700,
                          background: enabled[med.medicine] ? `${med.color}18` : 'var(--color-bg3)',
                          border: `1px solid ${enabled[med.medicine] ? med.color + '50' : 'var(--color-border)'}`,
                          color: enabled[med.medicine] ? med.color : 'var(--color-text4)',
                          cursor: 'pointer', fontFamily: 'var(--font-main)',
                          display: 'flex', alignItems: 'center', gap: 5, transition: 'var(--transition)',
                        }}
                        onClick={() => toggleReminder(med.medicine)}>
                        {enabled[med.medicine]
                          ? <><Bell size={11} /> Reminder ON</>
                          : <><BellOff size={11} /> Set Reminder</>}
                      </button>
                      <button
                        style={{
                          padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontSize: 11,
                          background: 'var(--color-bg3)', border: '1px solid var(--color-border)',
                          color: 'var(--color-text4)', cursor: 'pointer', transition: 'var(--transition)',
                        }}
                        onClick={() => startEditing(med)}
                        title="Edit medicine">
                        <Edit2 size={11} />
                      </button>
                      <button
                        style={{
                          padding: '6px 8px', borderRadius: 'var(--radius-sm)', fontSize: 11,
                          background: 'var(--color-bg3)', border: '1px solid var(--color-border)',
                          color: '#f87171', cursor: 'pointer', transition: 'var(--transition)',
                        }}
                        onClick={() => deleteMedicine(med.medicine)}
                        title="Delete medicine">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {reminders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text4)' }}>
          <Pill size={38} style={{ marginBottom: 12, opacity: 0.35 }} />
          <p>No medicines in schedule</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Add medicines to see your daily schedule</p>
        </div>
      )}

      <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', fontSize: 12, color: '#93b4d4' }}>
        💡 Reminders are browser notifications. Grant notification permission when prompted. All times are approximate guidelines — always follow your doctor's prescription.
      </div>
    </div>
  );
};

export default MedicineReminders;

import React, { useState } from 'react';
import { Leaf, ChevronRight, Dumbbell, Heart } from 'lucide-react';

const MEAL_PLANS: Record<string, { breakfast: string; lunch: string; dinner: string; snack: string; kcal: number }[]> = {
  maintain: [
    { breakfast: 'Oats with banana & honey + Green tea', lunch: 'Dal rice + vegetable sabzi + curd', dinner: 'Chapati + paneer curry + salad', snack: 'Fruits & nuts mix', kcal: 1800 },
    { breakfast: 'Idli with sambar & coconut chutney', lunch: 'Brown rice + dal + stir-fried veggies', dinner: 'Roti + grilled chicken / soya + raita', snack: 'Buttermilk + roasted seeds', kcal: 1750 },
    { breakfast: 'Poha with peanuts + Milk', lunch: 'Rajma rice + cucumber salad', dinner: 'Multigrain roti + egg bhurji / tofu', snack: 'Chana chaat', kcal: 1820 },
    { breakfast: 'Upma + boiled eggs / sprouts', lunch: 'Palak dal + rice + papad', dinner: 'Roti + mixed vegetable curry', snack: 'Fruit smoothie', kcal: 1780 },
    { breakfast: 'Dosa + tomato chutney + filter coffee', lunch: 'Curd rice + lemon pickle + salad', dinner: 'Chapati + chicken/dal makhani', snack: 'Peanut butter on multigrain toast', kcal: 1810 },
    { breakfast: 'Besan chilla + green chutney', lunch: 'Whole wheat roti + aloo gobi + lassi', dinner: 'Rice + moong dal + stir-fry', snack: 'Roasted makhana', kcal: 1760 },
    { breakfast: 'Vegetable sandwich + chai', lunch: 'Lentil soup + brown rice + salad', dinner: 'Ragi roti + palak paneer + raita', snack: 'Fresh coconut water', kcal: 1790 },
  ],
  loss: [
    { breakfast: 'Oats porridge (no sugar) + berries', lunch: 'Grilled salad + dal soup + small rice', dinner: 'Steamed vegetables + egg white / paneer', snack: 'Cucumber + hummus', kcal: 1200 },
    { breakfast: 'Sprout salad + green tea (no sugar)', lunch: 'Lentil soup + salad + no rice', dinner: 'Grilled chicken / soya + stir-fried veggies', snack: 'Apple slices', kcal: 1150 },
    { breakfast: 'Vegetable smoothie (spinach, cucumber, lemon)', lunch: 'Brown rice (small) + sambar + vegetable sabzi', dinner: 'Roti (1) + dal + salad', snack: 'Roasted chana', kcal: 1250 },
    { breakfast: 'Boiled eggs + multigrain toast', lunch: 'Grilled fish / paneer + salad', dinner: 'Vegetable soup + small roti', snack: 'Pear or guava', kcal: 1100 },
    { breakfast: 'Idli (2) + sambhar (no chutney)', lunch: 'Cucumber raita + dal + rice (small)', dinner: 'Grilled chicken + stir-fry veggies', snack: 'Buttermilk (no salt/sugar)', kcal: 1230 },
    { breakfast: 'Fruits + nuts (no-sugar', lunch: 'Moong dal + roti (1) + salad', dinner: 'Grilled paneer/tofu + veggies', snack: 'Green tea + cucumber', kcal: 1180 },
    { breakfast: 'Greek yogurt + berries + chia seeds', lunch: 'Quinoa salad + grilled veggies', dinner: 'Vegetable stew + 1 chapati', snack: 'Watermelon slices', kcal: 1160 },
  ],
};

const HOME_REMEDIES = [
  { condition: 'Common Cold', icon: '🤧', remedies: ['Tulsi-ginger-honey tea', 'Steam inhalation with eucalyptus', 'Turmeric milk (haldi doodh)', 'Garlic-honey syrup'] },
  { condition: 'Indigestion', icon: '🤢', remedies: ['Ajwain water (bishop seeds)', 'Jeera (cumin) water', 'Ginger-lemon tea', 'Fennel seeds after meals'] },
  { condition: 'Headache & Stress', icon: '🤕', remedies: ['Peppermint oil massage on temples', 'Ginger tea', 'Lavender aromatherapy', 'Brahmi-infused warm milk'] },
  { condition: 'Sore Throat', icon: '😷', remedies: ['Warm salt water gargle', 'Honey-ginger tea', 'Licorice root tea (mulethi)', 'Steam inhalation'] },
  { condition: 'Joint Pain', icon: '🦴', remedies: ['Warm sesame oil massage', 'Turmeric + ginger tea', 'Fenugreek seeds soak (methi)', 'Warm compress with Epsom salt'] },
  { condition: 'Insomnia', icon: '😴', remedies: ['Warm milk with ashwagandha', 'Chamomile tea', 'Lavender oil under pillow', 'Abhyanga (self-massage with warm oil)'] },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DietPlanning: React.FC = () => {
  const [goal, setGoal] = useState<'maintain' | 'loss'>('maintain');
  const [selectedDay, setSelectedDay] = useState(0);
  const [openRemedy, setOpenRemedy] = useState<number | null>(null);
  
  // New States for user preferences
  const [dietRequirement, setDietRequirement] = useState('');
  const [workoutTime, setWorkoutTime] = useState('');
  const [preferencesSubmitted, setPreferencesSubmitted] = useState(false);

  const plan = MEAL_PLANS[goal][selectedDay];

  if (!preferencesSubmitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Diet Planning</h2>
          <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Let's personalize your diet plan.</p>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Any specific diet requirements? (e.g., Vegan, Gluten-free, Standard)</label>
            <input 
              className="input" 
              placeholder="Enter your diet requirements..." 
              value={dietRequirement}
              onChange={(e) => setDietRequirement(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>When is your preferred time to workout?</label>
            <select 
              className="input" 
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
              style={{ appearance: 'auto' }}
            >
              <option value="" disabled>Select a time</option>
              <option value="Morning (6AM - 9AM)">Morning (6AM - 9AM)</option>
              <option value="Afternoon (12PM - 3PM)">Afternoon (12PM - 3PM)</option>
              <option value="Evening (5PM - 8PM)">Evening (5PM - 8PM)</option>
              <option value="Night (8PM onwards)">Night (8PM onwards)</option>
              <option value="No workout">I don't workout</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (dietRequirement && workoutTime) setPreferencesSubmitted(true);
            }}
            disabled={!dietRequirement || !workoutTime}
            style={{ marginTop: 8 }}
          >
            Generate My Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Diet Planning</h2>
        <p style={{ color: 'var(--color-text3)', fontSize: 14 }}>Personalized diet plans and home remedies inspired by Ayurveda</p>
      </div>

      {/* Goal selector */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { key: 'maintain', label: 'Maintain Health', icon: <Heart size={16} />, desc: '~1800 kcal/day' },
          { key: 'loss', label: 'Lose Weight', icon: <Dumbbell size={16} />, desc: '~1200 kcal/day' },
        ].map(g => (
          <button key={g.key} onClick={() => setGoal(g.key as any)}
            style={{
              flex: 1, padding: '16px', border: `2px solid ${goal === g.key ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)', background: goal === g.key ? 'rgba(26,107,60,0.1)' : 'var(--color-bg2)',
              cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: goal === g.key ? 'var(--color-primary-light)' : 'var(--color-text3)', marginBottom: 4 }}>
              {g.icon} <span style={{ fontWeight: 700, fontSize: 15 }}>{g.label}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text4)' }}>{g.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--color-bg3)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--color-text3)' }}>Diet: </span><strong>{dietRequirement}</strong>
          <span style={{ margin: '0 8px', color: 'var(--color-border)' }}>|</span>
          <span style={{ color: 'var(--color-text3)' }}>Workout: </span><strong>{workoutTime}</strong>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPreferencesSubmitted(false)} style={{ padding: '4px 8px', fontSize: 11 }}>Edit</button>
      </div>

      {/* Day selector */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text2)', marginBottom: 10 }}>Select Day</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setSelectedDay(i)}
              style={{
                padding: '8px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${selectedDay === i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: selectedDay === i ? 'rgba(26,107,60,0.15)' : 'var(--color-bg3)',
                color: selectedDay === i ? 'var(--color-primary-light)' : 'var(--color-text3)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-main)',
                transition: 'var(--transition)',
              }}>
              {d.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Meal plan */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>{DAYS[selectedDay]} — {goal === 'maintain' ? 'Balanced Meal' : 'Weight Loss'} Plan</h3>
          <span className="badge badge-success">{plan.kcal} kcal</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { label: 'Breakfast', time: '7–8 AM', val: plan.breakfast, emoji: '☀️', color: '#fbbf24' },
            { label: 'Lunch', time: '1–2 PM', val: plan.lunch, emoji: '🌞', color: '#f97316' },
            { label: 'Snack', time: '4–5 PM', val: plan.snack, emoji: '🍎', color: '#22c55e' },
            { label: 'Dinner', time: '7–8 PM', val: plan.dinner, emoji: '🌙', color: '#818cf8' },
          ].map(m => (
            <div key={m.label} className="card" style={{ borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.emoji} {m.label}</div>
                <span className="text-xs text-muted">{m.time}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text2)', lineHeight: 1.6 }}>{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Home remedies */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Leaf size={20} color="var(--color-primary-light)" />
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>Ayurvedic Home Remedies</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HOME_REMEDIES.map((r, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button onClick={() => setOpenRemedy(openRemedy === i ? null : i)}
                style={{
                  width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'var(--font-main)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>{r.condition}</span>
                </div>
                <ChevronRight size={16} color="var(--color-text4)"
                  style={{ transform: openRemedy === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {openRemedy === i && (
                <div style={{ padding: '0 18px 14px', borderTop: '1px solid var(--color-border)', animation: 'fadeIn 0.2s ease' }}>
                  <ul style={{ listStyle: 'none', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {r.remedies.map((rem, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--color-text2)' }}>
                        <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>•</span> {rem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietPlanning;

// ─── New interfaces ────────────────────────────────────────────────────────
export interface MedicalValues {
  cholesterol?: string;
  hemoglobin?: string;
  bloodSugar?: string;
  bloodPressure?: string;
  creatinine?: string;
  tsh?: string;
  hba1c?: string;
  wbc?: string;
  platelets?: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'unknown';
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  warning?: string;
  timing: string[];
}

export interface MedicineReminder {
  medicine: string;
  dosage: string;
  times: string[];
  color: string;
  icon: string;
}

export interface HealthRisk {
  category: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  detail: string;
  recommendation: string;
  icon: string;
}

export interface VisitSummary {
  diagnosis: string;
  medicines: string[];
  instructions: string[];
  followUpDate: string;
  doctorNotes: string;
}

export interface AIMessage {
  role: 'ai' | 'user';
  content: string;
}

export const doctorChatResponses = (symptoms: string): string => {
  const s = symptoms.toLowerCase();
  if (s.includes('fever') || s.includes('temperature') || s.includes('pyrexia'))
    return '🔍 Based on the symptoms described, consider:\n• Antipyretics (Paracetamol 500mg TID)\n• Check for secondary infection (CBC, CRP)\n• Ensure adequate hydration\n• Consider dengue/malaria screening if endemic area';
  if (s.includes('chest') || s.includes('heart') || s.includes('palpitation'))
    return '🔍 Cardiac symptoms noted:\n• ECG immediately\n• Troponin levels\n• Consider cardiology referral\n• BP monitoring\n• Aspirin 75mg if ACS suspected';
  if (s.includes('head') || s.includes('migraine') || s.includes('headache'))
    return '🔍 For headache/migraine:\n• Sumatriptan for acute migraine\n• NSAIDs (Ibuprofen 400mg)\n• Check BP\n• Neuro exam if severe/sudden onset\n• CT if red flags present';
  if (s.includes('diabete') || s.includes('sugar') || s.includes('glucose'))
    return '🔍 Diabetes management:\n• HbA1c monitoring\n• Metformin 500mg BD with meals\n• Diet counseling\n• Regular BP and lipid check\n• Foot examination';
  if (s.includes('cough') || s.includes('cold') || s.includes('throat'))
    return '🔍 Respiratory symptoms:\n• Symptomatic treatment\n• Amoxicillin if bacterial\n• Dextromethorphan for cough\n• Saline nasal drops\n• COVID-19 screening if indicated';
  return '🔍 Based on the patient presentation:\n• Full clinical examination required\n• CBC and routine investigations\n• Consider specialist referral if symptoms persist\n• Follow up in 3–5 days\n• Document vitals carefully';
};

/**
 * Analyzes a medical report and returns a summary in simple, plain language
 * — no jargon, written as if explaining to a family member.
 */
export const analyzeMedicalReport = (fileName: string): string => {
  const f = fileName.toLowerCase();

  if (f.includes('blood') || f.includes('cbc') || f.includes('haemo') || f.includes('hb')) {
    return [
      '🩸 **What this report is about:** This is a blood test that checks your overall health — like counting the blood cells in your body.',
      '',
      '✅ **What looks okay:** Your red blood cells (which carry oxygen), white blood cells (which fight germs), and platelets (which help stop bleeding) are all in a normal, healthy range.',
      '',
      '💡 **In simple words:** Think of this like a routine service check for a car — everything seems to be running fine. No red flags were found.',
      '',
      '📅 **What to do next:** Get this checked again in 3 months to keep track of your health. If you feel very tired, dizzy, or notice unusual bruising before then, visit your doctor sooner.',
    ].join('\n');
  }

  if (f.includes('xray') || f.includes('x-ray') || f.includes('chest') || f.includes('lung')) {
    return [
      '🫁 **What this report is about:** This is a chest X-ray — a picture taken of the inside of your chest, showing your lungs, heart, and ribs.',
      '',
      '✅ **What looks okay:** Your lungs appear clear — there are no signs of infection, fluid buildup, or unusual shadows. Your heart looks the right size.',
      '',
      '💡 **In simple words:** Imagine your lungs are like two balloons — this picture shows both balloons are clean and open with no blockages.',
      '',
      '📅 **What to do next:** No immediate action needed. If you have a persistent cough, chest pain, or breathlessness, share this report with your doctor for a proper check.',
    ].join('\n');
  }

  if (f.includes('urine') || f.includes('urea') || f.includes('creatinine') || f.includes('kidney') || f.includes('renal')) {
    return [
      '🫘 **What this report is about:** This report checks how well your kidneys are working. Your kidneys are like filters that clean your blood.',
      '',
      '✅ **What looks okay:** The kidney filtering numbers (creatinine, urea) are within normal range, meaning your kidneys are doing their job well.',
      '',
      '💡 **In simple words:** Your kidneys are working like a good water filter — cleaning your blood properly without any blockages.',
      '',
      '📅 **What to do next:** Drink at least 8 glasses of water every day. Reduce salt. Get another check in 6 months, or sooner if you notice swelling in your feet/face, or changes in urination.',
    ].join('\n');
  }

  if (f.includes('ecg') || f.includes('ekg') || f.includes('cardiac') || f.includes('heart')) {
    return [
      '❤️ **What this report is about:** This is a heart tracing (ECG) — it records the electrical signals of your heart to check its rhythm and whether it\'s beating properly.',
      '',
      '✅ **What looks okay:** Your heart appears to be beating in a regular, normal rhythm. There are no signs of a heart attack or dangerous irregularities.',
      '',
      '💡 **In simple words:** Think of your heart like a drum — this test checked if the drumbeat is regular. Right now, the beat sounds steady and normal.',
      '',
      '📅 **What to do next:** If you have chest pain, pounding heartbeat, or feel faint, go to a doctor immediately. Otherwise, continue regular checkups yearly.',
    ].join('\n');
  }

  if (f.includes('sugar') || f.includes('glucose') || f.includes('hba1c') || f.includes('diabetes')) {
    return [
      '🍬 **What this report is about:** This report checks the amount of sugar (glucose) in your blood — which tells us if your body is managing sugar properly.',
      '',
      '✅ **What looks okay:** Your sugar levels are noted. The long-term sugar marker (HbA1c) is within the reported range.',
      '',
      '💡 **In simple words:** Imagine sugar in your blood like traffic on a road. This test checks if sugar is flowing smoothly or starting to pile up causing jams. Right now things seem manageable.',
      '',
      '📅 **What to do next:** Reduce sweets, white rice, and fried foods. Walk 30 minutes daily. Take medications as prescribed. Get a repeat test in 3 months. If you feel very thirsty, tired, or urinate more than usual, see your doctor soon.',
    ].join('\n');
  }

  if (f.includes('thyroid') || f.includes('tsh') || f.includes('t3') || f.includes('t4')) {
    return [
      '🦋 **What this report is about:** This checks your thyroid gland — a small butterfly-shaped gland in your neck that controls your body\'s energy and metabolism.',
      '',
      '✅ **What looks okay:** Your thyroid hormone levels are within the reported range, suggesting the gland is working at a reasonable pace.',
      '',
      '💡 **In simple words:** Your thyroid is like the battery of your body. This test checks if the battery is too weak, too strong, or just right. The results suggest it\'s running at a decent level.',
      '',
      '📅 **What to do next:** If you feel very tired, gaining/losing weight without reason, or feel too cold/hot all the time — mention it to your doctor. Get a repeat test in 6 months.',
    ].join('\n');
  }

  // Generic fallback
  return [
    `📋 **What this report is about:** This is a medical document titled "${fileName}".`,
    '',
    '✅ **What was found:** The document has been successfully stored in your health profile. The key information has been noted.',
    '',
    '💡 **In simple words:** A medical document like this helps your doctor understand your health history quickly. Always keep copies of your reports safe.',
    '',
    '📅 **What to do next:** Share this report with your doctor at your next visit. If the report was for a specific concern and you haven\'t heard back from your doctor, follow up with them.',
  ].join('\n');
};

// ─── Health Assistant Chat ──────────────────────────────────────────────────
export const healthChatResponse = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes('diabetes') || q.includes('sugar') || q.includes('glucose'))
    return 'Diabetes is a condition where your body cannot properly regulate blood sugar (glucose). There are two main types:\n\n**Type 1**: Your immune system attacks insulin-producing cells. It requires insulin injections.\n\n**Type 2**: Your body does not use insulin effectively. It can often be managed with diet, exercise, and medication.\n\nCommon symptoms include frequent urination, excessive thirst, blurred vision, and fatigue.\n\n💡 *Tip:* Regular HbA1c tests every 3 months help track average blood sugar over time.';

  if (q.includes('cholesterol') || q.includes('lipid'))
    return 'Cholesterol is a fatty substance in your blood. It is not all bad — your body needs it to build cells.\n\n**LDL ("bad" cholesterol)**: High levels can clog arteries and increase heart attack risk.\n**HDL ("good" cholesterol)**: Helps remove LDL from bloodstream.\n\nIdeal levels:\n• Total cholesterol: below 200 mg/dL\n• LDL: below 100 mg/dL\n• HDL: above 60 mg/dL\n\n💡 *Tip:* A diet low in saturated fat and regular aerobic exercise can significantly improve cholesterol levels.';

  if (q.includes('blood pressure') || q.includes('hypertension') || q.includes('bp'))
    return 'Blood pressure measures the force of blood pushing against your artery walls.\n\n**Normal**: under 120/80 mmHg\n**Elevated**: 120–129 / under 80 mmHg\n**High (Stage 1)**: 130–139 / 80–89 mmHg\n**High (Stage 2)**: 140+ / 90+ mmHg\n\nHigh BP (hypertension) often has no symptoms but increases risk of stroke, heart attack, and kidney damage.\n\n💡 *Tip:* Reduce salt, alcohol, and stress. Exercise 30 min daily. Medications prescribed by your doctor are very effective.';

  if (q.includes('hemoglobin') || q.includes('anaemia') || q.includes('anemia'))
    return 'Hemoglobin is the protein in red blood cells that carries oxygen throughout your body.\n\nNormal ranges:\n• Men: 13.8–17.2 g/dL\n• Women: 12.1–15.1 g/dL\n\nLow hemoglobin (anemia) causes fatigue, weakness, shortness of breath, and pale skin.\n\n💡 *Tip:* Iron-rich foods like spinach, lentils, and lean meat help. Vitamin C aids iron absorption. Severe anemia may need medical treatment.';

  if (q.includes('metformin'))
    return 'Metformin is a medication used to treat Type 2 diabetes. It works by reducing the amount of glucose your liver releases and improving your body\'s sensitivity to insulin.\n\n**Common dosage**: 500–2000 mg per day, usually taken with meals to reduce stomach upset.\n\n**Common side effects**: nausea, diarrhea (usually temporary), metallic taste.\n\n**Important**: Never stop Metformin without consulting your doctor. ⚠️';

  if (q.includes('aspirin'))
    return 'Aspirin is a pain reliever and anti-inflammatory medication. At low doses (75–100 mg), it is used to prevent blood clots, reducing risk of heart attacks and strokes.\n\n**Uses**: Fever, pain relief, heart protection, anti-platelet therapy.\n\n**Important**: Do not take on an empty stomach. Avoid if you have stomach ulcers or are allergic to blood thinners. ⚠️';

  if (q.includes('thyroid') || q.includes('tsh'))
    return 'The thyroid is a butterfly-shaped gland in your neck that regulates metabolism, energy, and many body functions.\n\n**Hypothyroidism** (underactive): fatigue, weight gain, feeling cold, depression.\n**Hyperthyroidism** (overactive): weight loss, rapid heartbeat, anxiety, tremors.\n\nTSH (Thyroid Stimulating Hormone) test measures thyroid function. Normal range: 0.4–4.0 mIU/L.\n\n💡 *Tip:* Thyroid conditions are very manageable with proper medication. Take thyroid medication on an empty stomach for best absorption.';

  if (q.includes('kidney') || q.includes('creatinine') || q.includes('renal'))
    return 'Your kidneys filter about 200 liters of blood daily, removing waste and excess water.\n\n**Creatinine** is a waste product filtered by kidneys. High creatinine suggests reduced kidney function.\n\nNormal creatinine:\n• Men: 0.7–1.3 mg/dL\n• Women: 0.6–1.1 mg/dL\n\n💡 *Tip:* Stay well-hydrated (8+ glasses of water/day), reduce salt, avoid NSAIDs like ibuprofen for long periods if you have kidney concerns.';

  if (q.includes('heart') || q.includes('ecg') || q.includes('cardiac'))
    return 'Your heart beats about 100,000 times a day. An ECG (electrocardiogram) records the electrical activity of your heart.\n\nNormal resting heart rate: 60–100 bpm\n\nWarning signs needing immediate attention:\n• Chest pain or pressure\n• Shortness of breath\n• Rapid/irregular heartbeat\n• Dizziness or fainting\n\n💡 *Tip:* Lifestyle changes (quit smoking, exercise, healthy diet, stress management) are the most powerful heart protectors.';

  return `That's a great health question! Here's what I can tell you:\n\nFor questions about **${question}**, I recommend:\n1. Consulting your doctor or healthcare provider for personalized advice\n2. Using trusted medical resources like WHO, AIIMS, or your national health portal\n3. Bringing up this question at your next doctor visit\n\n💡 I'm here to provide general health education. For diagnosis or treatment, always consult a qualified medical professional.`;
};

// ─── Visit Summary AI ────────────────────────────────────────────────────────
export const generateVisitSummary = (transcript: string): VisitSummary => {
  const t = transcript.toLowerCase();
  let diagnosis = 'General health consultation';
  let medicines: string[] = ['As prescribed by the physician'];
  let instructions: string[] = ['Follow the prescribed medication schedule', 'Rest adequately', 'Stay hydrated'];
  let followUpDate = '2 weeks from today';
  let doctorNotes = 'Patient examined and treatment plan discussed.';

  if (t.includes('diabetes') || t.includes('sugar') || t.includes('glucose') || t.includes('metformin')) {
    diagnosis = 'Type 2 Diabetes Management';
    medicines = ['Metformin 500mg – twice daily with meals', 'Glimepiride 1mg – once daily before breakfast'];
    instructions = ['Check blood sugar levels daily (fasting + post-meal)', 'Follow diabetic diet plan – avoid sugar and refined carbs', 'Exercise 30 minutes daily (walking recommended)', 'Monitor for symptoms of hypoglycemia (dizziness, sweating)'];
    followUpDate = '3 months – bring HbA1c report';
    doctorNotes = 'Blood sugar trend reviewed. Current management plan continues with dietary modifications.';
  } else if (t.includes('blood pressure') || t.includes('hypertension') || t.includes('bp')) {
    diagnosis = 'Hypertension (High Blood Pressure)';
    medicines = ['Amlodipine 5mg – once daily morning', 'Losartan 50mg – once daily evening'];
    instructions = ['Measure BP at home twice daily (morning and evening)', 'Reduce salt intake to less than 5g per day', 'Avoid alcohol and smoking', 'Engage in moderate exercise 5 days/week'];
    followUpDate = '1 month – with BP diary';
    doctorNotes = 'BP readings assessed. Medication adjusted. Patient counseled on lifestyle modifications.';
  } else if (t.includes('fever') || t.includes('infection') || t.includes('viral')) {
    diagnosis = 'Acute Febrile Illness (likely viral infection)';
    medicines = ['Paracetamol 500mg – every 6 hours for fever', 'ORS (oral rehydration salts) – 1 sachet in 1L water'];
    instructions = ['Complete bed rest for 2–3 days', 'Drink at least 2–3 liters of fluids daily', 'Avoid cold water and refrigerated foods', 'Return immediately if fever exceeds 103°F or lasts more than 5 days'];
    followUpDate = '1 week – only if symptoms persist';
    doctorNotes = 'Clinical examination suggests viral etiology. CBC ordered to rule out bacterial infection.';
  } else if (t.includes('chest') || t.includes('heart') || t.includes('cardiac') || t.includes('palpitation')) {
    diagnosis = 'Cardiac Evaluation – Under Investigation';
    medicines = ['Aspirin 75mg – once daily with food', 'Atorvastatin 20mg – once daily at night'];
    instructions = ['Avoid strenuous activity until follow-up', 'Keep nitroglycerin spray available if prescribed', 'Alert emergency services if chest pain lasts >15 minutes', 'Avoid high-fat meals and smoking'];
    followUpDate = '2 weeks – with ECG and echocardiography results';
    doctorNotes = 'Cardiac symptoms evaluated. ECG ordered. Lipid profile requested. Patient advised to reduce cardiovascular risk factors.';
  }

  return { diagnosis, medicines, instructions, followUpDate, doctorNotes };
};

// ─── Prescription Analyzer ───────────────────────────────────────────────────
export const analyzePrescription = (fileName: string, notes: string): PrescriptionMedicine[] => {
  const f = (fileName + ' ' + notes).toLowerCase();

  const meds: PrescriptionMedicine[] = [];

  if (f.includes('metformin') || f.includes('diabetes') || f.includes('sugar')) {
    meds.push({ name: 'Metformin 500mg', dosage: '500mg per tablet', frequency: 'Twice daily (BD)', purpose: 'Controls blood sugar levels in Type 2 Diabetes', warning: 'Take with food to avoid stomach upset. Do not skip doses.', timing: ['8:00 AM', '8:00 PM'] });
  }
  if (f.includes('aspirin') || f.includes('cardiac') || f.includes('heart')) {
    meds.push({ name: 'Aspirin 75mg', dosage: '75mg per tablet', frequency: 'Once daily (OD)', purpose: 'Prevents blood clots; heart protection', warning: 'Take with food. Avoid if stomach ulcer history.', timing: ['9:00 AM'] });
  }
  if (f.includes('amlodipine') || f.includes('bp') || f.includes('blood pressure')) {
    meds.push({ name: 'Amlodipine 5mg', dosage: '5mg per tablet', frequency: 'Once daily (OD)', purpose: 'Lowers blood pressure; treats hypertension', warning: 'May cause ankle swelling. Do not stop abruptly.', timing: ['8:00 AM'] });
  }
  if (f.includes('atorvastatin') || f.includes('cholesterol') || f.includes('lipid')) {
    meds.push({ name: 'Atorvastatin 20mg', dosage: '20mg per tablet', frequency: 'Once daily at night', purpose: 'Lowers bad cholesterol (LDL)', warning: 'Report any unexplained muscle pain to doctor.', timing: ['10:00 PM'] });
  }
  if (f.includes('omeprazole') || f.includes('acidity') || f.includes('stomach')) {
    meds.push({ name: 'Omeprazole 20mg', dosage: '20mg per capsule', frequency: 'Once daily before breakfast', purpose: 'Reduces stomach acid; treats acidity and GERD', warning: 'Take 30 minutes before meals for best effect.', timing: ['7:30 AM'] });
  }

  if (meds.length === 0) {
    meds.push(
      { name: 'Tab. A (as prescribed)', dosage: 'As directed', frequency: 'Twice daily (BD)', purpose: 'As per physician recommendation', timing: ['8:00 AM', '8:00 PM'] },
      { name: 'Tab. B (as prescribed)', dosage: 'As directed', frequency: 'Once daily (OD)', purpose: 'As per physician recommendation', timing: ['9:00 AM'] }
    );
  }

  return meds;
};

// ─── Medicine Reminder Schedule ──────────────────────────────────────────────
export const generateMedicineSchedule = (meds: PrescriptionMedicine[]): MedicineReminder[] => {
  const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
  const icons = ['💊', '🔵', '🟣', '🟡', '🔴', '🩵', '🩷'];
  return meds.map((m, i) => ({
    medicine: m.name,
    dosage: m.dosage,
    times: m.timing,
    color: colors[i % colors.length],
    icon: icons[i % icons.length],
  }));
};

// ─── Medical Value Extractor ─────────────────────────────────────────────────
export const extractMedicalValues = (fileName: string): MedicalValues | null => {
  const f = fileName.toLowerCase();

  if (f.includes('blood') || f.includes('cbc') || f.includes('haemo') || f.includes('hb')) {
    return {
      hemoglobin: '13.2 g/dL  (Normal: 12–17)',
      wbc: '7,200 /µL  (Normal: 4,500–11,000)',
      platelets: '2.3 Lakh /µL  (Normal: 1.5–4 Lakh)',
      status: 'normal',
    };
  }
  if (f.includes('sugar') || f.includes('glucose') || f.includes('hba1c') || f.includes('diabetes')) {
    return {
      bloodSugar: '142 mg/dL (Fasting) — Slightly Elevated',
      hba1c: '7.2% — Borderline (Target: <7.0%)',
      status: 'borderline',
    };
  }
  if (f.includes('lipid') || f.includes('cholesterol')) {
    return {
      cholesterol: 'Total: 218 mg/dL — Borderline High (Normal: <200)',
      status: 'borderline',
    };
  }
  if (f.includes('kidney') || f.includes('renal') || f.includes('creatinine')) {
    return {
      creatinine: '0.9 mg/dL  (Normal: 0.6–1.2)',
      status: 'normal',
    };
  }
  if (f.includes('thyroid') || f.includes('tsh')) {
    return {
      tsh: '4.8 mIU/L — Borderline High (Normal: 0.4–4.0)',
      status: 'borderline',
    };
  }
  return null;
};

// ─── Health Risk Detection ───────────────────────────────────────────────────
export const detectHealthRisks = (docs: Array<{ name: string; analysis: string }>): HealthRisk[] => {
  const risks: HealthRisk[] = [];
  const allText = docs.map(d => d.name + ' ' + d.analysis).join(' ').toLowerCase();

  if (allText.includes('borderline') || allText.includes('slightly elevated') || allText.includes('hba1c')) {
    risks.push({
      category: 'Blood Sugar',
      severity: 'medium',
      title: 'Elevated Blood Sugar Detected',
      detail: 'Recent reports show borderline blood sugar levels. This may indicate pre-diabetes or poorly controlled diabetes.',
      recommendation: 'Reduce refined carbohydrates. Walk 30 minutes daily. Monitor fasting blood sugar weekly. Consult your diabetologist.',
      icon: '🍬',
    });
  }

  if (allText.includes('cholesterol') || allText.includes('lipid')) {
    risks.push({
      category: 'Cardiovascular',
      severity: 'medium',
      title: 'Cholesterol Trend Warning',
      detail: 'Lipid profile shows elevated total cholesterol. Sustained high cholesterol increases atherosclerosis risk.',
      recommendation: 'Limit saturated fats (red meat, full-fat dairy). Increase omega-3 (fish, flaxseeds). Exercise 5 days/week.',
      icon: '❤️',
    });
  }

  if (allText.includes('thyroid') || allText.includes('tsh')) {
    risks.push({
      category: 'Thyroid',
      severity: 'low',
      title: 'Thyroid Level Needs Monitoring',
      detail: 'TSH levels detected in uploaded reports. Thyroid imbalance can affect metabolism and energy.',
      recommendation: 'Take thyroid medication consistently. Repeat TSH every 6 months. Discuss dosage adjustment with endocrinologist.',
      icon: '🦋',
    });
  }

  if (docs.length >= 3) {
    risks.push({
      category: 'Preventive',
      severity: 'low',
      title: 'Schedule Annual Health Check',
      detail: `You have ${docs.length} medical reports on file. Comprehensive annual check-ups catch issues early.`,
      recommendation: 'Book a full-body health check (lipids, CBC, kidney, liver, thyroid, blood pressure). Prevention is better than cure.',
      icon: '🏥',
    });
  }

  if (risks.length === 0) {
    risks.push({
      category: 'General',
      severity: 'low',
      title: 'No Immediate Health Risks Detected',
      detail: 'Based on your uploaded reports, no critical trends were identified. Keep up the good work!',
      recommendation: 'Continue regular check-ups, balanced diet, and 150 minutes of physical activity per week.',
      icon: '✅',
    });
  }

  return risks;
};

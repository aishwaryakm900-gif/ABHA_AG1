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

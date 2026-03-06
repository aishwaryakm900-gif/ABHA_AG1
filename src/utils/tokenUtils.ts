export interface Token {
  id: string;
  tokenNumber: number;
  phone: string;
  abhaNumber: string;
  department: string;
  date: string;
  time: string;
  patientName: string;
  medicalRecordsRef: string;
  // Full profile embedded in token for QR doctor access
  age?: string;
  bloodGroup?: string;
  allergies?: string;
  emergency?: string;
}

export interface QRPayload {
  patientRef: string;
  abha: string;
  name: string;
  phone: string;          // masked
  age?: string;
  bloodGroup?: string;
  allergies?: string;
  emergency?: string;
  department?: string;
  visitDate?: string;
  tokenId?: string;
  recordsUrl: string;
  // flag for new case
  newCase: boolean;
}

export let tokenCounter = 1;
export const resetTokenCounter = () => { tokenCounter = 1; };

export function generateToken(
  phone: string,
  abhaNumber: string,
  department: string,
  patientName: string,
  extras?: { age?: string; bloodGroup?: string; allergies?: string; emergency?: string }
): Token {
  const now = new Date();
  const id = `TKN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const medicalRecordsRef = `ABHA-REC-${abhaNumber.replace(/\s/g, '-')}`;
  return {
    id,
    tokenNumber: tokenCounter++,
    phone: phone.replace(/.(?=.{4})/g, '*'),
    abhaNumber,
    department,
    date: now.toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    patientName,
    medicalRecordsRef,
    ...(extras || {}),
  };
}

export function buildQRPayload(token: Token, rawPhone: string): QRPayload {
  return {
    patientRef: token.medicalRecordsRef,
    abha: token.abhaNumber,
    name: token.patientName,
    phone: token.phone,
    age: token.age,
    bloodGroup: token.bloodGroup,
    allergies: token.allergies,
    emergency: token.emergency,
    department: token.department,
    visitDate: token.date,
    tokenId: token.id,
    recordsUrl: `https://abha.abdm.gov.in/records/${token.medicalRecordsRef}`,
    newCase: true,
  };
}

export function generateABHANumber(phone: string): string {
  const hash = phone.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const part1 = String(hash % 9000 + 1000);
  const part2 = String((hash * 7) % 9000 + 1000);
  const part3 = String((hash * 13) % 9000 + 1000);
  const part4 = String((hash * 17) % 9000 + 1000);
  return `${part1}-${part2}-${part3}-${part4}`;
}

export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

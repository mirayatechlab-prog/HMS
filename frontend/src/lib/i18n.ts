export type SupportedLocale = 'en-IN' | 'gu-IN' | 'hi-IN';

export interface PrintTemplateSpec {
  id: string;
  name: string;
  paperSize: 'A4' | '80mm';
  supportsLetterhead: boolean;
  phase: 'Phase 1+';
}

export const PRINT_TEMPLATE_SPECS: PrintTemplateSpec[] = [
  { id: 'rx-a4', name: 'OPD Prescription', paperSize: 'A4', supportsLetterhead: true, phase: 'Phase 1+' },
  { id: 'discharge-a4', name: 'IPD Discharge Summary', paperSize: 'A4', supportsLetterhead: true, phase: 'Phase 1+' },
  { id: 'lab-a4', name: 'Laboratory Report', paperSize: 'A4', supportsLetterhead: true, phase: 'Phase 1+' },
  { id: 'invoice-a4', name: 'Hospital Tax Invoice', paperSize: 'A4', supportsLetterhead: true, phase: 'Phase 1+' },
  { id: 'receipt-80mm', name: 'Payment Receipt', paperSize: '80mm', supportsLetterhead: true, phase: 'Phase 1+' },
];

export const LOCALE_CONFIG: Record<
  SupportedLocale,
  { label: string; currency: 'INR'; timezone: 'Asia/Kolkata'; enabledInPhase0: boolean }
> = {
  'en-IN': { label: 'English (India)', currency: 'INR', timezone: 'Asia/Kolkata', enabledInPhase0: true },
  'gu-IN': { label: 'ગુજરાતી (Future)', currency: 'INR', timezone: 'Asia/Kolkata', enabledInPhase0: false },
  'hi-IN': { label: 'हिन्दी (Future)', currency: 'INR', timezone: 'Asia/Kolkata', enabledInPhase0: false },
};

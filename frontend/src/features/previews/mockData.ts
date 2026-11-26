export interface DemoOpdQueueItem {
  id: string;
  token: string;
  uhid: string;
  patientName: string;
  doctorName: string;
  visitType: 'Walk-in' | 'Appointment' | 'Follow-up';
  status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED';
  timeIst: string;
}

export interface DemoPharmacyBatch {
  id: string;
  medicineName: string;
  genericName: string;
  batchNo: string;
  expiryDate: string;
  stockUnits: number;
  mrpInr: number;
  status: 'ACTIVE' | 'LOW_STOCK' | 'NEAR_EXPIRY' | 'QUARANTINED';
}

export interface DemoLabOrder {
  id: string;
  orderNumber: string;
  uhid: string;
  patientName: string;
  testName: string;
  sampleType: 'Blood' | 'Urine';
  collectorName: string;
  externalLab: string;
  orderStatus: 'REQUESTED' | 'COLLECTED' | 'IN_TRANSIT' | 'REPORT_UPLOADED' | 'RELEASED';
}

export const DEMO_OPD_QUEUE: DemoOpdQueueItem[] = [
  {
    id: 'q-1',
    token: 'OPD-014',
    uhid: 'DEMO-UHID-00104',
    patientName: 'Aarav Patel (Demo)',
    doctorName: 'Dr. Kavita Desai (Permanent)',
    visitType: 'Appointment',
    status: 'IN_CONSULTATION',
    timeIst: '10:15 IST',
  },
  {
    id: 'q-2',
    token: 'OPD-015',
    uhid: 'DEMO-UHID-00109',
    patientName: 'Meera Shah (Demo)',
    doctorName: 'Dr. Rohan Mehta (Permanent)',
    visitType: 'Walk-in',
    status: 'WAITING',
    timeIst: '10:30 IST',
  },
  {
    id: 'q-3',
    token: 'OPD-016',
    uhid: 'DEMO-UHID-00087',
    patientName: 'Suresh Nair (Demo)',
    doctorName: 'Dr. Ananya Joshi (Visiting)',
    visitType: 'Follow-up',
    status: 'COMPLETED',
    timeIst: '09:45 IST',
  },
];

export const DEMO_PHARMACY_BATCHES: DemoPharmacyBatch[] = [
  {
    id: 'bat-1',
    medicineName: 'Paracetamol 650 mg Tab',
    genericName: 'Acetaminophen',
    batchNo: 'PCM-26A',
    expiryDate: '2027-08-31',
    stockUnits: 420,
    mrpInr: 32.5,
    status: 'ACTIVE',
  },
  {
    id: 'bat-2',
    medicineName: 'Amoxicillin + Clavulanate 625 mg',
    genericName: 'Co-amoxiclav',
    batchNo: 'AMX-25C',
    expiryDate: '2026-12-15',
    stockUnits: 38,
    mrpInr: 215.0,
    status: 'NEAR_EXPIRY',
  },
  {
    id: 'bat-3',
    medicineName: 'Ceftriaxone 1g Inj',
    genericName: 'Ceftriaxone Sodium',
    batchNo: 'CEF-24Z',
    expiryDate: '2026-10-01',
    stockUnits: 12,
    mrpInr: 145.0,
    status: 'QUARANTINED',
  },
  {
    id: 'bat-4',
    medicineName: 'Pantoprazole 40 mg Tab',
    genericName: 'Pantoprazole',
    batchNo: 'PAN-26B',
    expiryDate: '2028-03-31',
    stockUnits: 18,
    mrpInr: 95.0,
    status: 'LOW_STOCK',
  },
];

export const DEMO_LAB_ORDERS: DemoLabOrder[] = [
  {
    id: 'lab-1',
    orderNumber: 'LAB-DEMO-2041',
    uhid: 'DEMO-UHID-00104',
    patientName: 'Aarav Patel (Demo)',
    testName: 'Complete Blood Count (CBC)',
    sampleType: 'Blood',
    collectorName: 'Ramesh K. (External Collector)',
    externalLab: 'Metro Diagnostics Lab',
    orderStatus: 'IN_TRANSIT',
  },
  {
    id: 'lab-2',
    orderNumber: 'LAB-DEMO-2042',
    uhid: 'DEMO-UHID-00109',
    patientName: 'Meera Shah (Demo)',
    testName: 'Urine Routine & Microscopy',
    sampleType: 'Urine',
    collectorName: 'Sita P. (External Collector)',
    externalLab: 'City Pathology Center',
    orderStatus: 'REPORT_UPLOADED',
  },
  {
    id: 'lab-3',
    orderNumber: 'LAB-DEMO-2043',
    uhid: 'DEMO-UHID-00087',
    patientName: 'Suresh Nair (Demo)',
    testName: 'HbA1c + Fasting Glucose',
    sampleType: 'Blood',
    collectorName: 'Ramesh K. (External Collector)',
    externalLab: 'Metro Diagnostics Lab',
    orderStatus: 'RELEASED',
  },
];

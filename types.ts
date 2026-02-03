export enum UserRole {
  REGULATOR = 'REGULATOR',
  VENDOR = 'VENDOR',
  SCHOOL = 'SCHOOL',
  SUSTAINABILITY = 'SUSTAINABILITY'
}

export interface IncidentReport {
  id: string;
  schoolId: string;
  schoolName: string;
  symptoms: string[];
  studentCount: number;
  timestamp: string;
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CRITICAL';
  description: string;
  location: { lat: number; lng: number };
}

export interface ConsumptionReport {
  id: string;
  schoolId: string;
  menuType: string;
  portionsSent: number;
  portionsConsumed: number;
  leftoverPct: number;
  timestamp: string;
}

export interface VendorCompliance {
  id: string;
  vendorName: string;
  lastInspection: string;
  hygieneScore: number;
  status: 'COMPLIANT' | 'WARNING' | 'SUSPENDED';
  activeOrders: number;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  details: string;
}
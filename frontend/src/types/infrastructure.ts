export type BedOperationalStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'OCCUPIED'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'BLOCKED';

export interface HospitalBuilding {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface HospitalFloor {
  id: string;
  buildingId: string;
  name: string;
  levelNumber: number;
  isActive: boolean;
}

export interface RoomCategory {
  id: string;
  name: string;
  code: string;
  baseTariffPerDay: number;
  isDefault: boolean;
}

export interface HospitalWard {
  id: string;
  floorId: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface HospitalRoom {
  id: string;
  wardId: string;
  categoryId: string;
  roomNumber: string;
  isActive: boolean;
}

export interface HospitalBed {
  id: string;
  roomId: string;
  bedCode: string;
  status: BedOperationalStatus;
  isActive: boolean;
  occupantLabel?: string;
}

export interface CapacityMetrics {
  configuredBeds: number;
  activeBeds: number;
  inactiveBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  cleaningBeds: number;
  maintenanceBeds: number;
  blockedBeds: number;
  /** Occupancy rate = occupiedBeds / activeBeds * 100 (0 when activeBeds is 0). */
  occupancyRatePercent: number;
}

/**
 * Derive all hospital capacity metrics strictly from individual bed records.
 * Never relies on any hardcoded or independently editable total_beds field.
 */
export function computeCapacityMetrics(beds: readonly HospitalBed[]): CapacityMetrics {
  let activeBeds = 0;
  let inactiveBeds = 0;
  let availableBeds = 0;
  let occupiedBeds = 0;
  let reservedBeds = 0;
  let cleaningBeds = 0;
  let maintenanceBeds = 0;
  let blockedBeds = 0;

  for (const bed of beds) {
    if (!bed.isActive) {
      inactiveBeds += 1;
      continue;
    }
    activeBeds += 1;
    switch (bed.status) {
      case 'AVAILABLE':
        availableBeds += 1;
        break;
      case 'OCCUPIED':
        occupiedBeds += 1;
        break;
      case 'RESERVED':
        reservedBeds += 1;
        break;
      case 'CLEANING':
        cleaningBeds += 1;
        break;
      case 'MAINTENANCE':
        maintenanceBeds += 1;
        break;
      case 'BLOCKED':
        blockedBeds += 1;
        break;
    }
  }

  const occupancyRatePercent =
    activeBeds > 0 ? Math.round((occupiedBeds / activeBeds) * 1000) / 10 : 0;

  return {
    configuredBeds: beds.length,
    activeBeds,
    inactiveBeds,
    availableBeds,
    occupiedBeds,
    reservedBeds,
    cleaningBeds,
    maintenanceBeds,
    blockedBeds,
    occupancyRatePercent,
  };
}

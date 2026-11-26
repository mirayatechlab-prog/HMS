import { create } from 'zustand';
import type {
  BedOperationalStatus,
  HospitalBed,
  HospitalBuilding,
  HospitalFloor,
  HospitalRoom,
  HospitalWard,
  RoomCategory,
} from '@/types/infrastructure';

export interface DemoInfrastructureState {
  hospitalName: string;
  buildings: HospitalBuilding[];
  floors: HospitalFloor[];
  wards: HospitalWard[];
  categories: RoomCategory[];
  rooms: HospitalRoom[];
  beds: HospitalBed[];
  loadPreset: (preset: 'zero' | 'five' | 'thirty' | 'hundred') => void;
  addBuilding: (name: string, code: string) => void;
  addFloor: (buildingId: string, name: string, levelNumber: number) => void;
  addWard: (floorId: string, name: string, code: string) => void;
  addCategory: (name: string, code: string, baseTariffPerDay: number) => void;
  addRoomWithBeds: (wardId: string, categoryId: string, roomNumber: string, bedCount: number) => void;
  removeBed: (bedId: string) => void;
  updateBedStatus: (bedId: string, status: BedOperationalStatus) => void;
  toggleBedActive: (bedId: string) => void;
}

const DEFAULT_CATEGORIES: RoomCategory[] = [
  { id: 'cat-gen', name: 'General Ward', code: 'GEN', baseTariffPerDay: 1200, isDefault: true },
  { id: 'cat-semi', name: 'Semi-Special', code: 'SEMI', baseTariffPerDay: 2400, isDefault: true },
  { id: 'cat-spec', name: 'Special / Private', code: 'SPEC', baseTariffPerDay: 4200, isDefault: true },
];

function buildThirtyBedFixture(): Pick<
  DemoInfrastructureState,
  'buildings' | 'floors' | 'wards' | 'categories' | 'rooms' | 'beds'
> {
  const buildings: HospitalBuilding[] = [
    { id: 'bld-main', name: 'Main Clinical Block', code: 'MAIN', isActive: true },
  ];
  const floors: HospitalFloor[] = [
    { id: 'flr-1', buildingId: 'bld-main', name: 'First Floor', levelNumber: 1, isActive: true },
    { id: 'flr-2', buildingId: 'bld-main', name: 'Second Floor', levelNumber: 2, isActive: true },
  ];
  const wards: HospitalWard[] = [
    { id: 'wrd-gen-m', floorId: 'flr-1', name: 'General Ward A', code: 'GWA', isActive: true },
    { id: 'wrd-semi', floorId: 'flr-1', name: 'Semi-Special Wing', code: 'SSW', isActive: true },
    { id: 'wrd-priv', floorId: 'flr-2', name: 'Private Suites', code: 'PVT', isActive: true },
  ];

  // Mixed room capacities totaling 30 beds (12 + 10 + 8 = 30)
  const rooms: HospitalRoom[] = [
    { id: 'rm-101', wardId: 'wrd-gen-m', categoryId: 'cat-gen', roomNumber: '101', isActive: true },
    { id: 'rm-102', wardId: 'wrd-gen-m', categoryId: 'cat-gen', roomNumber: '102', isActive: true },
    { id: 'rm-103', wardId: 'wrd-semi', categoryId: 'cat-semi', roomNumber: '103', isActive: true },
    { id: 'rm-104', wardId: 'wrd-semi', categoryId: 'cat-semi', roomNumber: '104', isActive: true },
    { id: 'rm-105', wardId: 'wrd-semi', categoryId: 'cat-semi', roomNumber: '105', isActive: true },
    { id: 'rm-201', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '201', isActive: true },
    { id: 'rm-202', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '202', isActive: true },
    { id: 'rm-203', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '203', isActive: true },
    { id: 'rm-204', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '204', isActive: true },
    { id: 'rm-205', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '205', isActive: true },
    { id: 'rm-206', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '206', isActive: true },
    { id: 'rm-207', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '207', isActive: true },
    { id: 'rm-208', wardId: 'wrd-priv', categoryId: 'cat-spec', roomNumber: '208', isActive: true },
  ];

  const roomBedCounts: Record<string, number> = {
    'rm-101': 6,
    'rm-102': 6,
    'rm-103': 4,
    'rm-104': 3,
    'rm-105': 3,
    'rm-201': 1,
    'rm-202': 1,
    'rm-203': 1,
    'rm-204': 1,
    'rm-205': 1,
    'rm-206': 1,
    'rm-207': 1,
    'rm-208': 1,
  };

  const statuses: BedOperationalStatus[] = [
    'OCCUPIED',
    'OCCUPIED',
    'AVAILABLE',
    'RESERVED',
    'CLEANING',
    'AVAILABLE',
    'OCCUPIED',
    'MAINTENANCE',
    'AVAILABLE',
    'BLOCKED',
  ];

  const beds: HospitalBed[] = [];
  let idx = 0;
  for (const room of rooms) {
    const count = roomBedCounts[room.id] ?? 1;
    for (let b = 1; b <= count; b += 1) {
      const status = statuses[idx % statuses.length] ?? 'AVAILABLE';
      beds.push({
        id: `bed-${room.roomNumber}-${b}`,
        roomId: room.id,
        bedCode: `${room.roomNumber}-B${b}`,
        status,
        isActive: idx !== 29, // 1 inactive bed to demonstrate active vs inactive separation
        occupantLabel: status === 'OCCUPIED' ? `Demo Patient #${idx + 1}` : undefined,
      });
      idx += 1;
    }
  }

  return { buildings, floors, wards, categories: DEFAULT_CATEGORIES, rooms, beds };
}

function buildScaledFixture(totalBeds: number): Pick<
  DemoInfrastructureState,
  'buildings' | 'floors' | 'wards' | 'categories' | 'rooms' | 'beds'
> {
  if (totalBeds === 0) {
    return {
      buildings: [],
      floors: [],
      wards: [],
      categories: DEFAULT_CATEGORIES,
      rooms: [],
      beds: [],
    };
  }
  if (totalBeds === 30) return buildThirtyBedFixture();

  const buildings: HospitalBuilding[] = [
    { id: 'bld-1', name: 'Main Clinical Block', code: 'MAIN', isActive: true },
  ];
  const floors: HospitalFloor[] = [
    { id: 'flr-1', buildingId: 'bld-1', name: 'Floor 1', levelNumber: 1, isActive: true },
  ];
  const wards: HospitalWard[] = [
    { id: 'wrd-1', floorId: 'flr-1', name: 'Ward Alpha', code: 'WA', isActive: true },
  ];
  const rooms: HospitalRoom[] = [];
  const beds: HospitalBed[] = [];
  const bedsPerRoom = 5;
  const roomCount = Math.ceil(totalBeds / bedsPerRoom);
  for (let r = 1; r <= roomCount; r += 1) {
    const roomId = `rm-${r}`;
    rooms.push({
      id: roomId,
      wardId: 'wrd-1',
      categoryId: r % 3 === 0 ? 'cat-spec' : r % 2 === 0 ? 'cat-semi' : 'cat-gen',
      roomNumber: `${100 + r}`,
      isActive: true,
    });
    for (let b = 1; b <= bedsPerRoom && beds.length < totalBeds; b += 1) {
      beds.push({
        id: `bed-${r}-${b}`,
        roomId,
        bedCode: `${100 + r}-B${b}`,
        status: beds.length % 3 === 0 ? 'OCCUPIED' : 'AVAILABLE',
        isActive: true,
        occupantLabel: beds.length % 3 === 0 ? `Demo Patient #${beds.length + 1}` : undefined,
      });
    }
  }
  return { buildings, floors, wards, categories: DEFAULT_CATEGORIES, rooms, beds };
}

export const useDemoInfrastructureStore = create<DemoInfrastructureState>((set) => ({
  hospitalName: 'Arogya Demo Multi-Specialty Hospital (Fictional)',
  ...buildThirtyBedFixture(),
  loadPreset: (preset) =>
    set(() => {
      if (preset === 'zero') return buildScaledFixture(0);
      if (preset === 'five') return buildScaledFixture(5);
      if (preset === 'hundred') return buildScaledFixture(100);
      return buildThirtyBedFixture();
    }),
  addBuilding: (name, code) =>
    set((state) => ({
      buildings: [
        ...state.buildings,
        { id: `bld-${Date.now()}`, name, code: code.toUpperCase(), isActive: true },
      ],
    })),
  addFloor: (buildingId, name, levelNumber) =>
    set((state) => ({
      floors: [
        ...state.floors,
        { id: `flr-${Date.now()}`, buildingId, name, levelNumber, isActive: true },
      ],
    })),
  addWard: (floorId, name, code) =>
    set((state) => ({
      wards: [
        ...state.wards,
        { id: `wrd-${Date.now()}`, floorId, name, code: code.toUpperCase(), isActive: true },
      ],
    })),
  addCategory: (name, code, baseTariffPerDay) =>
    set((state) => ({
      categories: [
        ...state.categories,
        {
          id: `cat-${Date.now()}`,
          name,
          code: code.toUpperCase(),
          baseTariffPerDay,
          isDefault: false,
        },
      ],
    })),
  addRoomWithBeds: (wardId, categoryId, roomNumber, bedCount) =>
    set((state) => {
      const roomId = `rm-${Date.now()}`;
      const newRoom: HospitalRoom = {
        id: roomId,
        wardId,
        categoryId,
        roomNumber,
        isActive: true,
      };
      const newBeds: HospitalBed[] = Array.from({ length: Math.max(0, bedCount) }, (_, i) => ({
        id: `bed-${roomId}-${i + 1}`,
        roomId,
        bedCode: `${roomNumber}-B${i + 1}`,
        status: 'AVAILABLE',
        isActive: true,
      }));
      return {
        rooms: [...state.rooms, newRoom],
        beds: [...state.beds, ...newBeds],
      };
    }),
  removeBed: (bedId) =>
    set((state) => ({
      beds: state.beds.filter((b) => b.id !== bedId),
    })),
  updateBedStatus: (bedId, status) =>
    set((state) => ({
      beds: state.beds.map((b) => (b.id === bedId ? { ...b, status } : b)),
    })),
  toggleBedActive: (bedId) =>
    set((state) => ({
      beds: state.beds.map((b) => (b.id === bedId ? { ...b, isActive: !b.isActive } : b)),
    })),
}));

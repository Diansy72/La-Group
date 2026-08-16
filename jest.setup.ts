// Global mock for fetch (used in frontend service tests)
global.fetch = jest.fn();

// Mock PrismaClient globally to intercept new PrismaClient()
const mockPrisma = {
  vehicle: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  vehicleBooking: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  rentalPackage: {
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  tourPackage: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tourBooking: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

// Mock @/lib/prisma to return the same mock client
jest.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

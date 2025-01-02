const {
  addNewBoooking,
  app,
  getAllBookingsByPackage,
  getAllPackages,
  getPackageByDestination,
  updateSlot,
} = require("../index.js");
const request = require("supertest");
const http = require("http");

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  getAllPackages: jest.fn(),
  getPackageByDestination: jest.fn(),
  addNewBoooking: jest.fn(),
  updateSlot: jest.fn(),
  getAllBookingsByPackage: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should retrieve all travel packages ", async () => {
    const mockPakages = [
      {
        packageId: 1,
        destination: "Paris",
        price: 1500,
        duration: 7,
        availableSlots: 10,
      },
      {
        packageId: 2,
        destination: "Rome",
        price: 1200,
        duration: 5,
        availableSlots: 15,
      },
    ];
    getAllPackages.mockResolvedValue(mockPakages);
    const result = await request(server).get("/packages");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockPakages);
  });

  it("Retrieve Package by Destination", async () => {
    const mockPackage = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 10,
    };
    getPackageByDestination.mockResolvedValue(mockPackage);
    const result = await request(server).get("/packages/Paris");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockPackage);
  });

  it("should Add a New Booking", async () => {
    const mockBookingData = {
      booking: {
        bookingId: 6,
        packageId: 4,
        customerName: "Raj Kulkarni",
        bookingDate: "2024-12-20",
        seats: 2,
      },
    };
    addNewBoooking.mockResolvedValue(mockBookingData);
    const result = await request(server).post("/recipes/new").send({
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockBookingData);
  });

  it("should Update Available Slots for a Package", async () => {
    const mockUpdatedData = {
      package: {
        packageId: 1,
        destination: "Paris",
        price: 1500,
        duration: 7,
        availableSlots: 8,
      },
    };
    updateSlot.mockResolvedValue(mockUpdatedData;
    const result = await request(server).post("/packages/update-seats").send({
      packageId: 1,
      seatsBooked: 2,
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockUpdatedData);
  });
  
  it("should Retrieve All Bookings for a Package", async () => {
    const mockBookingsData = {
      "bookings": [
        {
          "bookingId": 1,
          "packageId": 1,
          "customerName": "Anjali Seth",
          "bookingDate": "2024-12-01",
          "seats": 2
        }
      ]
    }
    getAllBookingsByPackage.mockResolvedValue(mockBookingsData)
    const result = await request(server).get("/bookings/1")
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockBookingsData);
  });
});

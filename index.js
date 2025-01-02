const express = require('express');
const app = express();
const { travelPackages, bookings } = require('./data');
const PORT = 3000;
app.use(express.json());

// Exercise 1: Retrieve All Travel Packages (GET)
function getAllPackages() {
  return travelPackages;
}

app.get('/packages', (req, res) => {
  try {
    const travelPackages = getAllPackages();
    res.status(200).json({ packages: travelPackages });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Exercise 2: Retrieve Travel Package by Destination (GET)
function getPackageByDestination(destination) {
  const packageByDestination = travelPackages.find(
    (package) => package.destination === destination
  );
  return packageByDestination;
}
app.get('/bookings/:destination', (req, res) => {
  try {
    const destination = req.params.destination;
    const packageByDestination = getPackageByDestination(destination);
    res.status(200).json({ package: packageByDestination });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Exercise 3: Add a New Booking  (POST)
function addNewBoooking(bookingData) {
  const newBookingData = { bookingId: bookings.length + 1, ...bookingData };
  console.log('New booking data:', newBookingData);
  return newBookingData;
}
app.post('/bookings', (req, res) => {
  try {
    const bookingData = req.body;
    const newBookingData = addNewBoooking(bookingData);
    res.status(201).json({ bookings: newBookingData });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Exercise 4: Update Available Slots for a Package(POST)
function updateSlot(packageId, seatsBooked) {
  let updatedPackage;
  for (let package of travelPackages) {
    if (package.packageId === packageId) {
      package.availableSlots -= seatsBooked;
      updatedPackage = package;
    }
  }
  return updatedPackage;
}

app.post('/packages/update-seats', (req, res) => {
  try {
    const { packageId, seatsBooked } = req.body;
    const updatedPackage = updateSlot(packageId, seatsBooked);
    res.status(200).json({ package: updatedPackage });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Exercise 5: Retrieve All Bookings for a Package (GET)
function getAllBookingsByPackage(packageId) {
  const allBookings = bookings.filter(
    (booking) => booking.packageId === packageId
  );
  return allBookings;
}

app.get('/bookings/:packageId', (req, res) => {
  try {
    const packageId = parseInt(req.params.packageId);
    const allBookings = getAllBookingsByPackage(packageId);
    res.status(200).json({ bookings: allBookings });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = {
  app,
  getAllPackages,
  getPackageByDestination,
  addNewBoooking,
  updateSlot,
  getAllBookingsByPackage,
};

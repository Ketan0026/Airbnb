const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

/* CHECKS FOR BOOKING AVAILABILITY */
router.post("/check-availability", async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const listingObjectId = new mongoose.Types.ObjectId(listingId);

    const overlappingBookings = await Booking.find({
      listingId: listingObjectId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        message: "This property is already booked for the selected dates.",
        overlappingBookings,
      });
    }

    return res.status(200).json({
      message: "This property is available for the selected dates.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while checking availability.",
      error: error.message,
    });
  }
});

/* GENERATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const listingObjectId = new mongoose.Types.ObjectId(listingId);

    const overlappingBookings = await Booking.find({
      listingId: listingObjectId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        message: "This property is already booked for the selected dates.",
        overlappingBookings,
      });
    }

    const newBooking = new Booking({
      customerId: new mongoose.Types.ObjectId(customerId),
      hostId: new mongoose.Types.ObjectId(hostId),
      listingId: listingObjectId,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalPrice,
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking successfully created.",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the booking.",
      error: error.message,
    });
  }
});

/* GET USER BOOKINGS */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await Booking.find({ customerId })
      .populate("listingId")
      .populate("hostId", "name email");

    if (bookings.length > 0) {
      return res.status(200).json({ bookings });
    } else {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

/* DELETE BOOKING */
router.delete("/:bookingId", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
});

module.exports = router;

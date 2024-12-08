const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();
const db = require("./config/database.js");
const userRoute = require("./routes/User.js");
const listingRoute = require("./routes/Listing.js");
const activityRoute = require("./routes/Activity.js");
const bookingRoute = require("./routes/Booking.js");
const host = "0.0.0.0";
const app = express();

app.use(
  cors({
    origin: "https://airbnb-silk-ten.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use("/", userRoute);
app.use("/properties", listingRoute);
app.use("/users", activityRoute);
app.use("/bookings", bookingRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(process.env.PORT, host, () => {
  console.log(`App is listening on port: http://localhost:${process.env.PORT}`);
});

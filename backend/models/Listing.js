const mongoose = require("mongoose");

const ListingSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    houseType: {
      type: String,
      required: true,
    },
    country: {
      type: {
        label: { type: String, required: true },
        latLang: {
          type: [Number],
          required: true,
        },
        region: { type: String, required: true },
        value: { type: String, required: true },
      },
      required: true,
    },
    house: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    bedroomCount: {
      type: Number,
      required: true,
    },
    bedCount: {
      type: Number,
      required: true,
    },
    bathroomCount: {
      type: Number,
      required: true,
    },
    amenities: {
      type: Array,
      default: [],
    },
    photos: [{ type: String }],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);

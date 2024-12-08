const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  firebaseUID: {
    type: String,
    default: null,
  },
  wishList: {
    type: Array,
    default: [],
  },
  propertyList: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("User", UserSchema);

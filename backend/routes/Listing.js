const router = require("express").Router();
const upload = require("../middleware/multer");
const ListingModel = require("../models/Listing");
const UserModel = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* CREATE LISTING */
router.post(
  "/create",
  authMiddleware,
  upload.array("listingPhotos"),
  async (req, res) => {
    try {
      console.log("Incoming request to /properties/create"); // Log the request

      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files); // Log uploaded files

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const {
        category,
        houseType,
        country,
        house,
        streetAddress,
        landmark,
        district,
        city,
        state,
        pincode,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        title,
        description,
        price,
      } = req.body;

      const listingPhotos = req.files;

      if (!listingPhotos) {
        return res.status(400).send("No file uploaded.");
      }
      const listingPhotoPaths = listingPhotos.map((file) => file.path);
      console.log("Processed listingPhotos:", listingPhotoPaths);

      const parsedCountry = JSON.parse(country);
      const parsedAmenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");

      const postProperty = await ListingModel.create({
        creator: req.user.id,
        category,
        houseType,
        country: parsedCountry,
        house,
        streetAddress,
        landmark,
        district,
        city,
        state,
        pincode,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities: parsedAmenities,
        photos: listingPhotoPaths,
        title,
        description,
        price,
      });

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.propertyList.push(postProperty);
      await user.save();

      res.status(200).json(postProperty);
    } catch (err) {
      res
        .status(409)
        .json({ message: "Fail to create Listing", error: err.message });
      console.log(err);
    }
  }
);

/* EDIT LISTING */
router.put(
  "/edit/:propertyId",
  authMiddleware,
  upload.array("listingPhotos"),
  async (req, res) => {
    try {
      const { propertyId } = req.params;
      const {
        category,
        houseType,
        country,
        house,
        streetAddress,
        landmark,
        district,
        city,
        state,
        pincode,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        title,
        description,
        price,
        existingPhotos,
        removedPhotos
      } = req.body;

      const listingPhotos = req.files;
      let updatedPhotoPaths = existingPhotos ? JSON.parse(existingPhotos) : [];

      if (removedPhotos) {
        const photosToRemove = JSON.parse(removedPhotos);
        updatedPhotoPaths = updatedPhotoPaths.filter(
          (photo) => !photosToRemove.includes(photo)
        );
      }

      if (listingPhotos) {
        const newPhotoPaths = listingPhotos.map((file) => file.path);
        updatedPhotoPaths = [...updatedPhotoPaths, ...newPhotoPaths];
      }

      const parsedCountry = JSON.parse(country);
      const parsedAmenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");

      const property = await ListingModel.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      property.category = category;
      property.houseType = houseType;
      property.country = parsedCountry;
      property.house = house;
      property.streetAddress = streetAddress;
      property.landmark = landmark;
      property.district = district;
      property.city = city;
      property.state = state;
      property.pincode = pincode;
      property.guestCount = guestCount;
      property.bedroomCount = bedroomCount;
      property.bedCount = bedCount;
      property.bathroomCount = bathroomCount;
      property.amenities = parsedAmenities;
      property.photos = updatedPhotoPaths;
      property.title = title;
      property.description = description;
      property.price = price;

      await property.save();

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.propertyList = user.propertyList.map((prop) =>
        prop._id.equals(propertyId) ? property : prop
      );
      await user.save();

      res.status(200).json(property);
    } catch (err) {
      res.status(500).json({ message: "Failed to edit listing", error: err.message });
      console.log(err);
    }
  }
);

/* DELETE LISTING */
router.delete("/:id", async (req, res) => {
  const propertyId = req.params.id;

  try {
    const deletedProperty = await ListingModel.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await UserModel.findById(deletedProperty.creator);
    if (user) {
      user.propertyList = user.propertyList.filter(
        (property) => property.toString() !== propertyId
      );
      await user.save();
    }

    res
      .status(200)
      .json({ message: "Property deleted successfully", propertyId });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the property",
        error,
      });
  }
});

/* GET lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
  const qCategory = req.query.category;

  try {
    let listings;
    if (qCategory) {
      listings = await ListingModel.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await ListingModel.find().populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;
  console.log(search)

  try {
    const listings = await ListingModel.find({
      $or: [
        { city: { $regex: search, $options: "i" } },
        { "country.label": { $regex: new RegExp(search, "i") } }
      ],
    }).populate("creator");

    if (listings.length > 0) {
      res.status(200).json(listings);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
    console.error(err);
  }
});


/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await ListingModel.findById(listingId).populate("creator");
    res.status(202).json(listing);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Listing can not found!", error: err.message });
  }
});

module.exports = router;
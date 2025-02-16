import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Flag from "react-flagkit";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { categories, roomType } from "../assets/categories/data";
import { amenitiesList } from "../assets/amenities/data";
import useCountries from "../components/Countries";
import Map from "../components/Map";
import PropertyCounter from "../components/PropertyCounter";
import camera from "../assets/camera.avif";
import bin from "../assets/bin.svg";
import edit from "../assets/edit.svg";
import axios from "axios";
import { UserContext } from "../UserContext";

const EditListing = () => {
  const { propertyId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [house, setHouse] = useState("");
  const [houseTypeIndex, setHouseTypeIndex] = useState(null);
  const [houseType, setHouseType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [amenities, setAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [formattedPrice, setFormattedPrice] = useState("");
  const [inputWidth, setInputWidth] = useState("auto");
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const spanRef = useRef(null);
  const inputRef = useRef(null);
  const { getAllCountries } = useCountries();
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  const [formData, setFormData] = useState({
    flat: "",
    street: "",
    landmark: "",
    district: "",
    city: "",
    state: "",
    pinCode: "",
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          `https://airbnb-bdfq.onrender.com/properties/${propertyId}`,
          {
            withCredentials: true,
          }
        );
        const property = response.data;
        setHouse(property.category);
        setHouseType(property.houseType);
        setSelectedCountry(property.country);
        setFormData({
          flat: property.house,
          street: property.streetAddress,
          landmark: property.landmark,
          district: property.district,
          city: property.city,
          state: property.state,
          pinCode: property.pincode,
        });
        setGuests(property.guestCount);
        setBedrooms(property.bedroomCount);
        setBeds(property.bedCount);
        setBathrooms(property.bathroomCount);
        setAmenities(property.amenities);
        setPhotos(property.photos);
        setTitle(property.title);
        setDescription(property.description);
        setPrice(property.price);
      } catch (err) {
        console.log("Error fetching property data", err);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  const handleFocusButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHouse = (index, label) => {
    setSelectedIndex(index);
    setHouse(label);
  };

  const handleHouseType = (index, room) => {
    setHouseTypeIndex(index);
    setHouseType(room);
  };

  const handleCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  useEffect(() => {
    if (price) {
      setFormattedPrice(formatPrice(price.toString()));
    }
  }, [price]);

  const formatPrice = (rawValue) => {
    let formattedValue = rawValue;
    if (formattedValue.length > 3) {
      const lastThreeDigits = formattedValue.slice(-3);
      const remainingDigits = formattedValue.slice(0, -3);
      formattedValue =
        remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        lastThreeDigits;
    }
    return formattedValue;
  };

  const handlePriceChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue === "") {
      setPrice("");
      setFormattedPrice("");
    } else {
      setPrice(Number(rawValue));
      setFormattedPrice(formatPrice(rawValue));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setProgressPercentage((currentStep / 10) * 100);
    }
  };

  const handleBack = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setProgressPercentage((newStep / 10) * 100);
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const listingForm = new FormData();
      listingForm.append("category", house);
      listingForm.append("houseType", houseType);
      listingForm.append("country", JSON.stringify(selectedCountry));
      listingForm.append("house", formData.flat);
      listingForm.append("streetAddress", formData.street);
      listingForm.append("landmark", formData.landmark);
      listingForm.append("district", formData.district);
      listingForm.append("city", formData.city);
      listingForm.append("state", formData.state);
      listingForm.append("pincode", formData.pinCode);
      listingForm.append("guestCount", guests);
      listingForm.append("bedroomCount", bedrooms);
      listingForm.append("bedCount", beds);
      listingForm.append("bathroomCount", bathrooms);
      listingForm.append("amenities", amenities);
      listingForm.append("title", title);
      listingForm.append("description", description);
      listingForm.append("price", price);

      const existingPhotos = photos.filter(
        (photo) => typeof photo === "string"
      );
      listingForm.append("existingPhotos", JSON.stringify(existingPhotos));

      const newPhotos = photos.filter((photo) => typeof photo !== "string");
      newPhotos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      const removedPhotos = photos.filter(
        (originalPhoto) => !existingPhotos.includes(originalPhoto)
      );
      listingForm.append("removedPhotos", JSON.stringify(removedPhotos));

      await axios
        .put(
          `https://airbnb-bdfq.onrender.com/properties/edit/${propertyId}`,
          listingForm,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          const updatedProperty = response.data;
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            propertyList: prevUserInfo.propertyList.map((property) =>
              property._id === updatedProperty._id ? updatedProperty : property
            ),
          }));
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log("Edit Listing failed", err.message);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return house !== null;
      case 2:
        return houseType !== null;
      case 3:
        return selectedCountry !== null;
      case 4:
        return Object.values(formData).every((field) =>
          typeof field === "string" ? field.trim() !== "" : field > 0
        );
      case 5:
        return guests > 0 && bedrooms > 0 && beds > 0 && bathrooms > 0;
      case 6:
        return amenities.length > 0;
      case 7:
        return photos.length > 4;
      case 8:
        return title.length > 0;
      case 9:
        return description.length > 0;
      case 10:
        return price >= 1000 && price <= 800000;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (spanRef.current && currentStep === 10) {
      setInputWidth(spanRef.current.offsetWidth + 20);
    }
  }, [price, currentStep]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="flex sticky top-0 z-50 bg-white py-4 items-center border-b-2 justify-between px-4 smd:px-8 sm:px-14">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="w-7"
          >
            <path d="M16 1c2 0 3.46.96 4.75 3.27l.53 1.02a424.58 424.58 0 0 1 7.1 14.84l.15.35c.67 1.6.9 2.48.96 3.4v.41l.01.23c0 4.06-2.88 6.48-6.36 6.48-2.22 0-4.55-1.26-6.7-3.39l-.26-.26-.17-.17h-.02l-.17.18c-2.05 2.1-4.27 3.42-6.42 3.62l-.28.01-.26.01c-3.48 0-6.36-2.42-6.36-6.48v-.47c.03-.93.23-1.77.83-3.24l.22-.53c.97-2.3 6.08-12.98 7.7-16.03C12.55 1.96 14 1 16 1zm0 2c-1.24 0-2.05.54-2.99 2.21l-.52 1a422.57 422.57 0 0 0-7.03 14.7l-.35.84a6.86 6.86 0 0 0-.6 2.24l-.01.33v.2C4.5 27.4 6.41 29 8.86 29c1.77 0 3.87-1.24 5.83-3.35-2.3-2.94-3.86-6.45-3.86-8.91 0-2.92 1.94-5.39 5.18-5.42 3.22.03 5.16 2.5 5.16 5.42 0 2.45-1.56 5.96-3.86 8.9 1.97 2.13 4.06 3.36 5.83 3.36 2.45 0 4.36-1.6 4.36-4.48v-.4a7.07 7.07 0 0 0-.72-2.63l-.25-.6C25.47 18.41 20.54 8.12 19 5.23 18.05 3.53 17.24 3 16 3zm.01 10.32c-2.01.02-3.18 1.51-3.18 3.42 0 1.8 1.18 4.58 2.96 7.04l.2.29.18-.24c1.73-2.38 2.9-5.06 3-6.87v-.22c0-1.9-1.17-3.4-3.16-3.42z"></path>
          </svg>
        </Link>
        <Link to="/">
          <button className="py-2 px-5 smd:py-3 sm:px-7 font-bold rounded-custom border hover:border-black">
            Exit
          </button>
        </Link>
      </div>

      <div className="flex flex-col my-12 mx-auto px-6 mb-48 md:px-20">
        {currentStep === 1 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Which of these best describes your place?
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto md:max-w-[700px]">
              {categories.slice(1).map((category, index) => (
                <div
                  className={`border border-custom-gray flex flex-col gap-2 flex-custom-50 p-4 smd:p-5 rounded-lg cursor-pointer md:flex-custom-33 transition duration-300 hover:opacity-100 hover:shadow-select-bs ${
                    house === category.label
                      ? "shadow-select-bs bg-[#F7F7F7]"
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleHouse(index, category.label)}
                >
                  <img
                    className="w-9"
                    src={category.icon}
                    alt={category.label}
                  />
                  <p className="break-all font-medium">{category.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              What type of place will guests have?
            </h1>
            <div className="flex flex-wrap flex-col md:m-auto justify-start gap-3 lg:gap-3.5 md:justify-center">
              {roomType.map((room, index) => (
                <div
                  onClick={() => handleHouseType(index, room.label)}
                  key={index}
                  className={`max-w-[700px] w-full cursor-pointer border border-custom-gray flex justify-between min-h-[66px] md:min-h-[88px] rounded-xl hover:shadow-select-bs ${
                    houseType === room.label
                      ? "shadow-select-bs bg-[#F7F7F7]"
                      : ""
                  }`}
                >
                  <div className="my-6 mx-4 md:m-6">
                    <h2 className="md:text-lg font-medium">{room.label}</h2>
                    <span className="text-sm md:max-w-[400px] text-[#6a6a6a]">
                      {room.description}
                    </span>
                  </div>
                  <div className="mt-6 ml-2 mr-4 md:m-6">
                    <img className="min-w-9 min-h-9" src={room.icon} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Where's your place located?
            </h1>
            <div className="flex flex-wrap flex-col justify-start gap-3 lg:gap-3.5 md:justify-center">
              <div
                className="relative inline-block max-w-[600px] w-full md:mx-auto"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between font-medium bg-white border border-gray-300 rounded-md shadow-sm px-4 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                  {selectedCountry ? (
                    <span className="flex items-center">
                      <Flag
                        country={selectedCountry.value}
                        style={{ width: "30px", marginRight: "10px" }}
                      />
                      {selectedCountry.label} / {selectedCountry.region}
                    </span>
                  ) : (
                    "Select a country"
                  )}
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : "transform rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                    {getAllCountries().map((country) => (
                      <li
                        key={country.value}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-500 hover:text-white"
                        onClick={() => handleCountry(country)}
                      >
                        <div className="flex items-center">
                          <Flag
                            country={country.value}
                            style={{ width: "30px", marginRight: "5px" }}
                          />
                          <span className="ml-3 block truncate">
                            {country.label} / {country.region}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative inline-block max-w-[600px] mt-3 w-full md:mx-auto">
                <Map locationValue={selectedCountry?.value} />
              </div>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[600px] font-medium">
              Confirm your address
            </h1>
            <div className="md:max-w-[600px] w-full mx-auto bg-white p-6 rounded-lg border-2">
              <form>
                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    Flat, house, etc.
                  </label>
                  <input
                    type="text"
                    name="flat"
                    value={formData.flat}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter flat or house details"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    Street address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    Nearby landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter nearby landmark"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    District/locality
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter district or locality"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    City / town
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter city or town"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    State/union territory
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    placeholder="Enter state or union territory"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm block text-gray-700 font-bold mb-1">
                    PIN code
                  </label>
                  <input
                    type="number"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="text-sm sm:text-base w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter PIN code"
                  />
                </div>
              </form>
            </div>
          </>
        )}

        {currentStep === 5 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[600px] font-medium">
              Share some basics about your place
            </h1>
            <div className="max-w-[600px] w-full mx-auto flex flex-wrap flex-col justify-start gap-3 lg:gap-3.5 md:justify-center">
              <PropertyCounter
                guests={guests}
                setGuests={setGuests}
                bedrooms={bedrooms}
                setBedrooms={setBedrooms}
                beds={beds}
                setBeds={setBeds}
                bathrooms={bathrooms}
                setBathrooms={setBathrooms}
              />
            </div>
          </>
        )}

        {currentStep === 6 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Tell guests what your place has to offer
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto md:max-w-[700px]">
              {amenitiesList.map((item, index) => (
                <div
                  className={`border border-custom-gray flex flex-col gap-2 flex-custom-50 p-4 rounded-lg cursor-pointer md:flex-custom-33 transition duration-300 hover:opacity-100 hover:shadow-select-bs ${
                    amenities.includes(item.label)
                      ? "shadow-select-bs bg-[#F7F7F7]"
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleAmenities(item.label)}
                >
                  <img className="w-12" src={item.icon} alt={item.label} />
                  <p className="break-all font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {currentStep === 7 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Add some photos of your house
            </h1>
            {photos.length > 0 && photos.length < 5 && (
              <div className="text-red-500 sm:text-lg mb-6 md:mx-auto md:max-w-[700px] font-medium">
                Please upload at least 5 photos to continue.
              </div>
            )}
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="drag-photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex flex-wrap gap-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <div className="mx-auto md:max-w-[650px] w-full flex aspect-square items-center justify-center flex-col max-h-[60vh] h-full border border-dashed border-[#b0b0b0] rounded-xl bg-[#f7f7f7]">
                        <img className="w-44" src={camera} alt="" />
                        <button
                          onClick={handleButtonClick}
                          className="border font-medium rounded-xl mb-2 bg-white border-black px-6 py-3 hover:bg-[#f7f7f7]"
                        >
                          Add photos
                          <input
                            id="image"
                            className="hidden"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhotos}
                            multiple
                          />
                        </button>
                      </div>
                    )}
                    {photos.length >= 1 && (
                      <div className="md:max-w-[700px] w-full flex justify-center gap-4 flex-wrap mx-auto">
                        {photos.map((photo, index) => {
                          let photoSrc;

                          if (typeof photo === "string") {
                            if (photo.startsWith("http")) {
                              photoSrc = photo;
                            } else {
                              photoSrc = `https://airbnb-bdfq.onrender.com/uploads/${photo.replace(
                                "public\\uploads\\",
                                ""
                              )}`;
                            }
                          } else {
                            photoSrc = URL.createObjectURL(photo);
                          }
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={`relative rounded-lg aspect-square ${
                                    index === 0
                                      ? "w-full smd:w-[48%] sm:w-full sm:max-h-[500px]"
                                      : "smd:w-[48%] sm:w-[48.6%]"
                                  } cursor-move`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    className={`w-full h-full rounded-lg object-cover`}
                                    src={photoSrc}
                                    alt="place"
                                  />
                                  <button
                                    className="absolute w-9 h-9 p-2 flex justify-center items-center top-3 right-3 cursor-pointer bg-black rounded-full"
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <img
                                      className="w-5 filter invert"
                                      src={bin}
                                      alt=""
                                    />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="image"
                          className="cursor-pointer aspect-square w-full smd:w-[48%] sm:w-[48.6%] flex flex-col justify-center items-center border border-dashed border-[#b0b0b0] rounded-xl bg-[#f7f7f7]"
                        >
                          <div className="text-7xl font-thin">+</div>
                          <p className="font-medium">Add more</p>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}

        {currentStep === 8 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Now, let's give your house a title
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto w-full md:max-w-[650px]">
              <textarea
                autoFocus
                value={title}
                className="p-4 md:p-5 border border-black rounded-lg text-2xl min-h-36 smd:min-h-44 max-h-80 w-full no-scrollbar"
                maxLength="32"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></textarea>
              <span className="mr-auto font-medium">{title.length}/32</span>
            </div>
          </>
        )}

        {currentStep === 9 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] md:mx-auto md:max-w-[700px] font-medium">
              Create your description
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto w-full md:max-w-[650px]">
              <textarea
                autoFocus
                value={description}
                className="p-5 md:p-5 border border-black rounded-lg text-2xl min-h-36 smd:min-h-44 max-h-96 w-full no-scrollbar"
                maxLength="500"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
              <span className="mr-auto font-medium">
                {description.length}/500
              </span>
            </div>
          </>
        )}

        {currentStep === 10 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] mx-auto md:max-w-[700px] font-medium">
              Now, set your price
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto w-full md:max-w-[700px]">
              <div className="relative w-full justify-center flex items-center">
                <span className="text-6xl md:text-7xl font-bold mr-3">₹</span>
                <span
                  ref={spanRef}
                  className="absolute invisible text-6xl md:text-7xl font-bold -z-10 whitespace-pre"
                >
                  {price || ""}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={formattedPrice}
                  onChange={handlePriceChange}
                  className="text-6xl md:text-7xl font-bold outline-none min-w-40"
                  style={{ width: inputWidth }}
                />
                <button
                  onClick={handleFocusButtonClick}
                  className="min-w-9 aspect-square mb-4 md:ml-2 md:mb-5 p-2 flex justify-center items-center border self-end rounded-full"
                >
                  <img className="w-4" src={edit} alt="" />
                </button>
              </div>
              {price === "" && (
                <p className="text-red-500 sm:text-lg mb-6 md:mx-auto md:max-w-[700px] font-medium">
                  Please add a price.
                </p>
              )}
              {price && Number(price) < 1000 && (
                <p className="text-red-500 sm:text-lg mt-4 font-medium">
                  The price is below the minimum limit of ₹1,000.
                </p>
              )}
              {price && Number(price) > 800000 && (
                <p className="text-red-500 sm:text-lg mt-4 font-medium">
                  The price exceeds the maximum limit of ₹8,00,000.
                </p>
              )}
            </div>
          </>
        )}
        {currentStep === 11 && (
          <>
            <h1 className="text-[1.625rem] mb-6 md:mb-8 md:text-[2rem] mx-auto md:max-w-[700px] font-medium">
              Review your listing
            </h1>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-3.5 mx-auto w-full md:max-w-[700px]">
              <div className="w-[350px] aspect-square shadow-navigate-bs p-3 smd:p-4 rounded-2xl">
                <div className="bg-gray-500 mb-2 smd:mb-3 rounded-2xl flex">
                  {photos?.[0] && (
                    <img
                      className="rounded-2xl max-h-96 w-full object-cover aspect-square"
                      src={
                        typeof photos[0] === "string"
                          ? `https://airbnb-bdfq.onrender.com/uploads/${photos[0]?.replace(
                              "public\\uploads\\",
                              ""
                            )}`
                          : URL.createObjectURL(photos[0])
                      }
                      alt=""
                    />
                  )}
                </div>
                <h2 className="font-bold sm:text-lg">
                  {formData.city}, {formData.state}
                </h2>
                <h3 className="text-gray-500 sm:text-lg">{title}</h3>
                <div className="mt-1 sm:text-lg">
                  <span className="font-bold">₹{formatPrice(price)}</span> per
                  night
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fixed z-20 bottom-0 left-0 right-0 bg-white flex py-4 items-center border-t-2 justify-between px-4 smd:px-8 sm:px-14">
        <div className="absolute top-0 right-0 left-0 w-full bg-gray-200 h-1 rounded-full">
          <div
            className="bg-black h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`py-3 px-5 underline font-semibold rounded-lg hover:bg-slate-100 ${
            currentStep === 1 ? "cursor-not-allowed" : "hover:border-black"
          }`}
        >
          Back
        </button>
        {currentStep < 11 && (
          <button
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className={`py-3 px-5 sm:py-3.5 sm:px-7 font-semibold bg-[#131313] text-white rounded-lg ${
              !validateStep(currentStep)
                ? "bg-gray-300 cursor-not-allowed"
                : "hover:bg-black"
            }`}
          >
            {currentStep === 10 ? "Submit" : "Next"}
          </button>
        )}
        {currentStep === 11 && (
          <button
            onClick={handlePublish}
            className="py-3 px-5 sm:py-3.5 sm:px-7 font-semibold bg-[#131313] text-white rounded-lg hover:bg-black"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default EditListing;

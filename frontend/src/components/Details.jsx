import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "./loader/Loader";
import PlaceGallery from "./PlaceGallery";
import heart from "../assets/heart.svg";
import like from "../assets/like.svg";
import Navbar from "./Navbar";
import { amenitiesList } from "../assets/amenities/data";
import { useWishlist } from "../hooks/useWishlist";
import Avatar from "./Avatar";
import DatePicker from "./datePicker/DatePicker";
import Map from "./Map";
import { UserContext } from "../UserContext";
import GuestSelector from "./GuestSelector";

const Details = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const location = useLocation();
  let { booking: initialBooking } = location.state || {};
  const [booking, setBooking] = useState(initialBooking || null);
  const [place, setPlace] = useState(null);
  const [host, setHost] = useState();
  const [hostId, setHostId] = useState();
  const [showMore, setShowMore] = useState(false);
  const [checkInDate, setCheckInDate] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState(false);
  const [guestBox, setGuestBox] = useState(false);
  const [guests, setGuests] = useState(0);
  const [infant, setInfant] = useState(0);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(null);
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const [showError, setShowError] = useState(false);
  const { isInWishlist, handleWishlistToggle } = useWishlist(propertyId);
  const { userInfo, windowWidth } = useContext(UserContext);

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestRef = useRef(null);
  const guestSelectorRef = useRef(null);

  useEffect(() => {
    if (!propertyId) return;

    axios
      .get(`https://airbnb-1tti.onrender.com/properties/${propertyId}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((error) =>
        console.error("Error fetching property details:", error)
      );
  }, [propertyId]);

  useEffect(() => {
    if (!place || !place.creator?.propertyList?.[0]) return;

    axios
      .get(`https://airbnb-1tti.onrender.com/properties/${place.creator.propertyList[0]}`)
      .then((response) => {
        setHost(response.data.createdAt);
        setHostId(response.data._id);
      })
      .catch((error) =>
        console.error("Error fetching property details:", error)
      );
  }, [place]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestBox &&
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target) &&
        guestRef.current &&
        !guestRef.current.contains(event.target)
      ) {
        setGuestBox(false);
      }

      if (
        (checkInDate || checkOutDate) &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        checkInRef.current &&
        !checkInRef.current.contains(event.target) &&
        checkOutRef.current &&
        !checkOutRef.current.contains(event.target)
      ) {
        setCheckInDate(false);
        setCheckOutDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [guestBox, checkInDate, checkOutDate]);

  const handleDateChange = (startDate, endDate) => {
    setSelectedCheckInDate(startDate);

    setShowPrice(false);
    setShowError(false);

    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      setSelectedCheckOutDate(null);
    } else {
      setSelectedCheckOutDate(endDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Add date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const checkAvailability = async () => {
    const checkIn = new Date(selectedCheckInDate);
    const checkOut = new Date(selectedCheckOutDate);

    const utcCheckIn = new Date(
      Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate())
    );
    const utcCheckOut = new Date(
      Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate())
    );

    try {
      const response = await axios.post(
        `https://airbnb-1tti.onrender.com/bookings/check-availability`,
        {
          listingId: propertyId,
          startDate: utcCheckIn.toISOString(),
          endDate: utcCheckOut.toISOString(),
        }
      );

      if (response.status === 200) {
        setShowPrice(true);
        setShowError(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error(error);
      } else {
        console.error("Error checking availability:", error);
        setShowError(true);
      }
    }
  };

  const handleBooking = async () => {
    if (!userInfo._id) {
      navigate("/login");
      return;
    }

    if (!selectedCheckInDate || !selectedCheckOutDate || guests <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const checkIn = new Date(selectedCheckInDate);
    const checkOut = new Date(selectedCheckOutDate);

    const utcCheckIn = new Date(
      Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate())
    );
    const utcCheckOut = new Date(
      Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate())
    );

    const totalNights = calculateNights(utcCheckIn, utcCheckOut);
    const totalPrice = place.price * totalNights + 7190;

    try {
      const response = await axios.post(
        `https://airbnb-1tti.onrender.com/bookings/create`,
        {
          customerId: userInfo._id,
          hostId: hostId,
          listingId: propertyId,
          startDate: utcCheckIn.toISOString(),
          endDate: utcCheckOut.toISOString(),
          totalPrice: totalPrice,
        }
      );

      if (response.status === 201) {
        alert("Booking successful!");
        setBooking(true);
        navigate(`/${userInfo._id}/trips`)
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console(
          "The property is already booked during the selected date range."
        );
      } else {
        console.error(error);
      }
    }
  };

  const cancelBooking = async (booking) => {
    try {
      await axios.delete(`https://airbnb-1tti.onrender.com/bookings/${booking}`, {
        withCredentials: true,
      });
      alert("Booking canceled");
      setBooking(false);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateNights = (checkInDate, checkOutDate) => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return nights;
    }
    return 0;
  };

  const handleCheckInClick = () => {
    setCheckInDate(!checkInDate);
    setCheckOutDate(false);
  };

  const handleCheckOutClick = () => {
    setCheckOutDate(!checkOutDate);
    setCheckInDate(false);
  };

  const totalGuests = guests + infant;

  const guestText =
    totalGuests > 0
      ? `${guests} guest${guests > 1 ? "s" : ""}${
          infant > 0 ? `, ${infant} infant${infant > 1 ? "s" : ""}` : ""
        }`
      : "Add guests";

  const amenitiesToShow = window.innerWidth < 1024 ? 5 : 10;

  if (!place) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="mt-4 md:pt-3">
        <div className="flex justify-between w-[90%] lg:w-[85%] mx-auto mb-3 items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium">{place.title}</h1>
            <span className="flex items-center opacity-65 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
              </svg>
              <a
                className="font-medium underline"
                target="_blank"
                href={"https://maps.google.com/?q=" + place.country.label}
              >
                {place.country.label}
              </a>
            </span>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle();
              }}
              className="flex transition duration-200 font-medium items-center underline p-2 rounded-lg hover:bg-[#F7F7F7]"
            >
              {isInWishlist ? (
                <img className="w-5 h-5 mr-1" src={like} alt="" />
              ) : (
                <img className="w-5 h-5 mr-1" src={heart} alt="" />
              )}
              {isInWishlist ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <div className="w-[90%] lg:w-[85%] mx-auto">
          <PlaceGallery place={place} />
          <div className="flex flex-col md:flex-row w-full mt-6 smd:mt-8 pb-4">
            <div className="relative w-full md:w-[58.33%]">
              <div className="pb-6">
                <h1 className="md:text-[1.375rem] font-medium">
                  {place.category} in {place.state}, {place.country.label}
                </h1>
                <ul className="flex items-center flex-wrap space-x-1">
                  <li>
                    {place.guestCount}{" "}
                    {place.guestCount === 1 ? "guest" : "guests"}
                  </li>
                  <span>·</span>
                  <li>
                    {place.bedroomCount}{" "}
                    {place.bedroomCount === 1 ? "bedroom" : "bedrooms"}
                  </li>
                  <span>·</span>
                  <li>
                    {place.bedCount} {place.bedCount === 1 ? "bed" : "beds"}
                  </li>
                  <span>·</span>
                  <li>
                    {place.bathroomCount}{" "}
                    {place.bathroomCount === 1 ? "bathroom" : "bathrooms"}
                  </li>
                </ul>
              </div>
              <div className="border-b-2 border-t-2">
                <div className="flex items-center gap-4 p-5">
                  <Avatar name={place.creator.name} host={true} />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      Hosted by{" "}
                      <span className="capitalize">{place.creator.name}</span>
                    </span>
                    <span className="text-sm text-[#6A6A6A]">
                      Host since {new Date(host).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b-2">
                <h1 className="md:text-[1.375rem] font-medium mb-4">
                  About this place
                </h1>
                <p className="whitespace-pre-line">{place.description}</p>
              </div>
              <div className="py-6 pb-0">
                <h1 className="md:text-[1.375rem] font-medium mb-4">
                  What this place offers
                </h1>

                <ul className="flex flex-wrap flex-col lg:flex-row">
                  {place.amenities
                    .slice(
                      0,
                      showMore ? place.amenities.length : amenitiesToShow
                    )
                    .map((amenity, index) => {
                      const matchedAmenity = amenitiesList.find(
                        (a) => a.label === amenity
                      );

                      return (
                        <li
                          key={index}
                          className="lg:w-2/4 flex items-center pb-4"
                        >
                          <>
                            <img
                              src={matchedAmenity.icon}
                              alt={matchedAmenity.label}
                              className="amenity-icon w-10 h-10"
                            />
                            <span
                              className={`${
                                matchedAmenity.label === "Pool" ? "ml-2" : ""
                              }`}
                            >
                              {matchedAmenity.label}
                            </span>
                          </>
                        </li>
                      );
                    })}
                </ul>
                {place.amenities.length > amenitiesToShow && (
                  <button
                    className="border border-text text-text py-3 px-6 mt-4 rounded-lg font-medium hover:bg-[#F7F7F7] transition duration-200"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show less" : "Show all amenities"}
                  </button>
                )}
              </div>
            </div>
            <div className="relative w-full md:ml-[8.33%] md:w-[33.33%]">
              <div className="sticky top-20 inline-block w-full mt-8">
                <div className="border border-[#ddd] rounded-xl p-6 shadow-navigate-bs">
                  {!booking ? (
                    <div className="flex flex-col">
                      <div className="mb-6">
                        <h1 className="text-[1.375rem]">
                          {selectedCheckInDate && selectedCheckOutDate ? (
                            <>
                              <span className="font-medium">
                                ₹{place.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-base"> night</span>
                            </>
                          ) : (
                            "Add dates for prices"
                          )}
                        </h1>
                      </div>
                      <div className="border-2 rounded-lg">
                        <div className="relative flex border-b-2">
                          <div
                            ref={checkInRef}
                            onClick={handleCheckInClick}
                            className="p-3 w-2/4 border-r-2 cursor-pointer"
                          >
                            <div className="font-medium text-xs">CHECK-IN</div>
                            <span
                              className={`${
                                selectedCheckInDate
                                  ? "text-black"
                                  : "text-custom-text"
                              } text-sm block truncate`}
                            >
                              {formatDate(selectedCheckInDate)}
                            </span>
                          </div>

                          {checkInDate && (
                            <div
                              ref={datePickerRef}
                              className={`w-full flex md:block md:w-auto absolute top-20 z-50 ${
                                windowWidth > 820
                                  ? "right-0"
                                  : windowWidth < 768
                                  ? "justify-center smd:justify-start"
                                  : "-right-14"
                              }`}
                            >
                              <DatePicker onDateChange={handleDateChange} />
                            </div>
                          )}

                          <div
                            ref={checkOutRef}
                            onClick={handleCheckOutClick}
                            className="p-3 w-2/4 cursor-pointer"
                          >
                            <div className="font-medium text-xs">CHECKOUT</div>
                            <span
                              className={`${
                                selectedCheckOutDate
                                  ? "text-black"
                                  : "text-custom-text"
                              } text-sm block truncate`}
                            >
                              {formatDate(selectedCheckOutDate)}
                            </span>
                          </div>

                          {checkOutDate && (
                            <div
                              ref={datePickerRef}
                              className={`w-full flex md:block md:w-auto absolute top-20 z-50 ${
                                windowWidth > 820
                                  ? "right-0"
                                  : windowWidth < 768
                                  ? "justify-center smd:justify-end"
                                  : "-right-14"
                              }`}
                            >
                              <DatePicker onDateChange={handleDateChange} />
                            </div>
                          )}
                        </div>
                        <div
                          ref={guestRef}
                          onClick={() => {
                            setGuestBox(!guestBox);
                          }}
                          className="w-full relative p-2.5 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium text-xs">GUESTS</div>
                            <span
                              className={`text-sm ${
                                guests > 0 || infant > 0
                                  ? "text-black"
                                  : "text-custom-text"
                              }`}
                            >
                              {guestText}
                            </span>
                          </div>
                        </div>
                        {guestBox && (
                          <div
                            ref={guestSelectorRef}
                            className="absolute mt-5 z-20 left-0 right-0 md:left-auto"
                          >
                            <GuestSelector
                              setGuests={setGuests}
                              setInfant={setInfant}
                              initialAdults={Math.max(0, guests - infant)}
                              initialChildren={Math.max(
                                0,
                                guests - Math.max(0, guests - infant)
                              )}
                              initialInfants={infant}
                              guestLimit={place.guestCount}
                              onClose={() => setGuestBox(false)}
                            />
                          </div>
                        )}
                      </div>
                      {showError && (
                        <div className="text-[13px] sm:text-sm text-[#b3261e] flex mt-1 sm:mt-2 gap-1 items-center tracking-wider">
                          <span>
                            <svg
                              aria-hidden="true"
                              className="Qk3oof xTjuxe"
                              fill="#b3261e"
                              focusable="false"
                              width="16px"
                              height="16px"
                              viewBox="0 0 24 24"
                              xmlns="https://www.w3.org/2000/svg"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                            </svg>
                          </span>
                          Sorry, these dates are unavailable.
                        </div>
                      )}
                      {!showPrice && (
                        <button
                          className={`p-4 font-medium mt-4 rounded-lg transition duration-200 outline-0 ${
                            selectedCheckInDate &&
                            selectedCheckOutDate &&
                            guests > 0
                              ? "bg-[#DB0C64] text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          disabled={
                            !selectedCheckInDate ||
                            !selectedCheckOutDate ||
                            guests === 0
                          }
                          onClick={checkAvailability}
                        >
                          Check availability
                        </button>
                      )}
                      {showPrice &&
                        selectedCheckInDate &&
                        selectedCheckOutDate && (
                          <button
                            className="p-4 font-medium mt-4 rounded-lg transition duration-200 bg-[#DB0C64] text-white"
                            onClick={handleBooking}
                          >
                            Reserve
                          </button>
                        )}
                      {showPrice &&
                        selectedCheckInDate &&
                        selectedCheckOutDate && (
                          <div className="flex flex-col">
                            <div className="flex justify-between mt-5">
                              <div className="underline decoration-[1px]">
                                ₹{place.price.toLocaleString("en-IN")} x{" "}
                                {calculateNights(
                                  selectedCheckInDate,
                                  selectedCheckOutDate
                                )}{" "}
                                {calculateNights(
                                  selectedCheckInDate,
                                  selectedCheckOutDate
                                ) < 2
                                  ? "night"
                                  : "nights"}
                              </div>
                              <div>
                                ₹
                                {(
                                  place.price *
                                  calculateNights(
                                    selectedCheckInDate,
                                    selectedCheckOutDate
                                  )
                                ).toLocaleString("en-IN")}
                              </div>
                            </div>
                            <div className="flex justify-between mt-3">
                              <span className="underline decoration-[1px]">
                                Airbnb service fee
                              </span>
                              <span>₹7,190</span>
                            </div>
                            <div className="flex justify-between font-medium border-t-2 mt-5 pt-5">
                              <span>Total before taxes</span>
                              <span>
                                ₹
                                {(
                                  place.price *
                                    calculateNights(
                                      selectedCheckInDate,
                                      selectedCheckOutDate
                                    ) +
                                  7190
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      <p className="mb-5">
                        Do you want to cancel your booking?
                      </p>
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="bg-[#DB0C64] text-white p-3 px-5 font-medium rounded-lg self-end"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 mb-10 border-t-2 pt-6 w-full md:mx-auto">
            <Map locationValue={place?.country?.value || null} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;

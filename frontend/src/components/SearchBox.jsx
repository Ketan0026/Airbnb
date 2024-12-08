import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "./datePicker/DatePicker.jsx";
import GuestSelector from "./GuestSelector.jsx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";

const SearchBox = ({ showSearchBox }) => {
  const [search, setSearch] = useState("");
  const [checkInDate, setCheckInDate] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState(false);
  const [guestBox, setGuestBox] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [guests, setGuests] = useState(0);
  const [infant, setInfant] = useState(0);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(null);
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(null);
  const navigate = useNavigate();
  const { windowWidth } = useContext(UserContext);

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestRef = useRef(null);
  const guestSelectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setBgColor("");
      }

      if (
        (checkInDate &&
          checkInRef.current &&
          !checkInRef.current.contains(event.target) &&
          !datePickerRef.current.contains(event.target)) ||
        (checkOutDate &&
          checkOutRef.current &&
          !checkOutRef.current.contains(event.target) &&
          !datePickerRef.current.contains(event.target))
      ) {
        setCheckInDate(false);
        setCheckOutDate(false);
      }

      if (
        guestRef.current &&
        !guestRef.current.contains(event.target) &&
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target)
      ) {
        setBgColor("");
        setGuestBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [checkInDate, checkOutDate, bgColor, guestBox]);

  const handleParentClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setBgColor("location");
  };

  const handleDateChange = (startDate, endDate) => {
    setSelectedCheckInDate(startDate);

    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      setSelectedCheckOutDate(null);
    } else {
      setSelectedCheckOutDate(endDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Add dates";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const guestText =
    guests > 0
      ? `${guests} guest${guests > 1 ? "s" : ""}${
          infant > 0 ? `, ${infant} infant${infant > 1 ? "s" : ""}` : ""
        }`
      : infant > 0
      ? `${infant} infant${infant > 1 ? "s" : ""}`
      : "Add guests";

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setBgColor(null);
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${bgColor ? "bg-custom-focus" : "bg-white"} ${
        (showSearchBox && windowWidth < 768) || windowWidth >= 768
          ? "flex"
          : "hidden"
      } mx-0 w-full flex-col relative cursor-pointer border border-custom-gray rounded-custom shadow-search-bs items-center justify-around smd:mx-8 md:flex-row md:w-[850px] md:rounded-[40px]`}
    >
      <div
        onClick={handleParentClick}
        className={`${
          bgColor === "location" ? "inputFocus" : "inputHover"
        } inputBox flex-2-0-0 flex-shrink-2`}
      >
        <div className="searchHeading">Where</div>
        <input
          type="text"
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations"
          className="bg-transparent w-11/12 md:w-[152px] placeholder:text-custom-text outline-none text-sm text-text font-medium"
        />
      </div>

      <div className="divideLine"></div>

      <div
        ref={checkInRef}
        onClick={() => {
          setCheckInDate(!checkInDate);
          setBgColor("checkin");
        }}
        className={`${
          bgColor === "checkin" ? "inputFocus" : "inputHover"
        } inputBox checkInOut`}
      >
        <div className="searchHeading">Check in</div>
        <span
          className={`${
            selectedCheckInDate ? "text-black" : "text-custom-text"
          } text-sm font-medium`}
        >
          {formatDate(selectedCheckInDate)}
        </span>
      </div>

      {checkInDate && (
        <div ref={datePickerRef} className="absolute top-20 md:top-20 z-20">
          <DatePicker onDateChange={handleDateChange} />
        </div>
      )}

      <div className="divideLine"></div>

      <div
        ref={checkOutRef}
        onClick={() => {
          setCheckOutDate(!checkOutDate);
          setBgColor("checkout");
        }}
        className={`${
          bgColor === "checkout" ? "inputFocus" : "inputHover"
        } inputBox checkInOut`}
      >
        <div className="searchHeading">Check out</div>
        <span
          className={`${
            selectedCheckOutDate ? "text-black" : "text-custom-text"
          } text-sm font-medium`}
        >
          {formatDate(selectedCheckOutDate)}
        </span>
      </div>

      {checkOutDate && (
        <div ref={datePickerRef} className="absolute top-36 md:top-20 z-20">
          <DatePicker onDateChange={handleDateChange} />
        </div>
      )}

      <div className="divideLine"></div>

      <div
        ref={guestRef}
        onClick={() => {
          setBgColor("guest");
          setGuestBox(!guestBox);
        }}
        className={`${
          bgColor === "guest" ? "inputFocus" : "inputHover"
        } inputBox flex-shrink-2 min-w-[200px] text-nowrap relative flex-2-0-0 flex justify-between items-center`}
      >
        <div>
          <div className="searchHeading">Who</div>
          <span
            className={`text-sm font-medium ${
              guests > 0 || infant > 0 ? "text-black" : "text-custom-text"
            }`}
          >
            {guestText}
          </span>
        </div>

        <button
          onClick={handleButtonClick}
          className="bg-[#FF385C] rounded-custom absolute gap-2 h-12 w-12 right-2 px-4 p-2 flx transition duration-200 hover:bg-[#E00B41] sm:w-auto md:w-12 md:rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="white"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span className="text-white hidden sm:block tracking-wide font-medium md:hidden">
            Search
          </span>
        </button>
      </div>
      {bgColor === "guest" && guestBox && (
        <div
          ref={guestSelectorRef}
          className="absolute top-64 sm:top-72 z-20 left-0 right-0 md:top-20 md:left-auto"
        >
          <GuestSelector
            setGuests={setGuests}
            setInfant={setInfant}
            initialAdults={Math.max(0, guests - infant)}
            initialChildren={Math.max(0, guests - Math.max(0, guests - infant))}
            initialInfants={infant}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;

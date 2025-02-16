import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import heart from "../assets/heart.svg";
import like from "../assets/like.svg";
import bin from "../assets/bin.svg";
import menu from "../assets/menu.svg";
import pencil from "../assets/pencil.svg";
import axios from "axios";
import { useWishlist } from "../hooks/useWishlist";
import { UserContext } from "../UserContext";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN").format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Card = ({
  listingId,
  listingPhotoPaths,
  city,
  state,
  country,
  category,
  houseType,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { windowWidth } = useContext(UserContext);
  const { isInWishlist, handleWishlistToggle } = useWishlist(listingId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  const handlePrev = (e) => {
    e.stopPropagation();

    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + (listingPhotoPaths?.length || 0)) %
        (listingPhotoPaths?.length || 1)
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();

    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (listingPhotoPaths?.length || 1)
    );
  };

  const handleDeleteProperty = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(
        `https://airbnb-bdfq.onrender.com/properties/${listingId}`
      );
      if (response.status === 200) {
        onDelete(listingId);
      } else {
        console.error("Failed to delete the property.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the property:", error);
    }
  };

  return (
    <div
      className="relative p-3 rounded-xl cursor-pointer"
      onClick={() => {
        navigate(`/properties/${listingId}`, { state: { booking } });
      }}
    >
      <div className="relative w-full overflow-hidden rounded-xl mb-3 group">
        <div
          className="flex transition-transform duration-300 ease-in"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                className="w-full h-full object-cover aspect-square"
                src={photo}
                alt={`photo ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className={`top-1/2 left-3 transform -translate-y-1/2 absolute bg-white h-8 w-8 flex justify-center items-center z-10 border border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs ${
              windowWidth <= 768
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="w-3 h-3 block"
            >
              <path d="m10.55.3 1.42 1.4L5.67 8l6.3 6.3-1.42 1.4-6.59-6.58a1.58 1.58 0 0 1-.1-2.13l.1-.11z"></path>
            </svg>
          </button>
        )}

        {currentIndex < listingPhotoPaths.length - 1 && (
          <button
            onClick={handleNext}
            className={`top-1/2 right-3 transform -translate-y-1/2 absolute bg-white h-8 w-8 flex justify-center items-center z-10 border border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs ${
              windowWidth <= 768
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="w-3 h-3 block"
            >
              <path d="M5.41.3 4 1.7 10.3 8 4 14.3l1.41 1.4 6.6-6.58c.57-.58.6-1.5.1-2.13l-.1-.11z"></path>
            </svg>
          </button>
        )}

        {!onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className={`${
              onDelete ? "right-14" : "right-3"
            } top-3 border p-1 absolute bg-white h-8 w-8 flex justify-center items-center z-10 border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs`}
          >
            {isInWishlist ? (
              <img className="w-6 h-6" src={like} alt="" />
            ) : (
              <img className="w-6 h-6" src={heart} alt="" />
            )}
          </button>
        )}

        {onDelete && (
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions((prevState) => !prevState);
            }}
            className="top-3 right-3 border-2 absolute bg-white h-8 w-8 flex justify-center items-center z-10 border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs"
          >
            <img className="w-6 h-6 transform rotate-90" src={menu} alt="" />
          </button>
        )}
        {showOptions && (
          <div
            ref={menuRef}
            className="w-56 smd:w-60 rounded-lg bg-white absolute top-14 right-2 smd:right-3 p-2 smd:p-3 z-20 shadow-search-bs"
          >
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle();
                }}
                className="flex items-center p-1 transition duration-200 hover:font-medium hover:bg-slate-200"
              >
                {isInWishlist ? (
                  <img className="w-6 h-6 mr-1" src={like} alt="" />
                ) : (
                  <img className="w-6 h-6 mr-1" src={heart} alt="" />
                )}
                {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              </div>
              <div className="border-b py-1 mb-1"></div>
              <div
                onClick={handleDeleteProperty}
                className="flex items-center p-1 transition duration-200 hover:font-medium hover:bg-slate-200"
              >
                <img
                  className="w-6 h-6 mr-1"
                  style={{ filter: "opacity(0.5)" }}
                  src={bin}
                  alt=""
                />
                Delete this property
              </div>
              <div className="border-b py-1 mb-1"></div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit/${listingId}`);
                }}
                className="flex items-center p-1 transition duration-200 hover:font-medium hover:bg-slate-200"
              >
                <img className="w-6 h-6 mr-1" src={pencil} alt="" />
                Edit this property
              </div>
            </>
          </div>
        )}
      </div>

      <h3 className="font-medium">
        {city}, {state}, {country.label}
      </h3>
      <p className="text-gray-500">{category}</p>

      {!booking ? (
        <>
          <p>{houseType}</p>
          <p>
            <span className="font-medium">₹{formatPrice(price)}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <p>
            <span className="font-medium">₹{formatPrice(totalPrice)}</span>{" "}
            total
          </p>
        </>
      )}
    </div>
  );
};

export default Card;

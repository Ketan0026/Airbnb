import { useState, useEffect } from "react";
import arrow from "../assets/arrow.svg";
import { useWishlist } from "../hooks/useWishlist";
import { useParams } from "react-router-dom";
import like from "../assets/like.svg";

function Slider({ images, initialIndex = 0, closeSlider }) {

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { propertyId } = useParams();
  const { isInWishlist, handleWishlistToggle } = useWishlist(propertyId);

  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    if (initialIndex < 0 || initialIndex >= images.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const touchX = e.touches[0].clientX;
    const diffX = startX - touchX;

    if (diffX > 50) {
      goToNext();
      setIsSwiping(false);
    } else if (diffX < -50) {
      goToPrevious();
      setIsSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <div className="absolute top-0 w-[95%] mx-auto flex justify-between items-center p-2">
          <button
            className="flex items-center py-2 px-5 font-medium rounded-lg text-white hover:bg-[#4A4A4A]"
            onClick={closeSlider}
          >
            <span className="mr-1.5">
              <svg
                viewBox="0 0 12 12"
                role="presentation"
                aria-hidden="true"
                focusable="false"
                className="w-3.5 h-3.5 fill-current"
              >
                <path
                  d="m11.5 10.5c.3.3.3.8 0 1.1s-.8.3-1.1 0l-4.4-4.5-4.5 4.5c-.3.3-.8.3-1.1 0s-.3-.8 0-1.1l4.5-4.5-4.4-4.5c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l4.4 4.5 4.5-4.5c.3-.3.8-.3 1.1 0s.3.8 0 1.1l-4.5 4.5z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </span>{" "}
            <span className="hidden md:block">Close</span>
          </button>
          <div className=" text-white font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className="flex transition duration-200 font-medium items-center underline p-2 rounded-lg text-white"
          >
            <span className="flex justify-center items-center w-9 h-9 rounded-full hover:bg-[#4A4A4A]">
              {isInWishlist ? (
                <img className="w-5 h-5" src={like} alt="" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="w-5 h-5"
                  style={{
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                  }}
                >
                  <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
                </svg>
              )}
            </span>
          </button>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <div className="max-h-[500px] md:max-w-[750px] h-full">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-auto h-full max-w-full object-contain"
            />
          </div>
        </div>
        {currentIndex > 0 && (
          <button
            className="absolute top-1/2 left-10 w-14 h-14 hidden justify-center items-center transform -translate-y-1/2 border-2 border-white text-white p-2 rounded-full transition duration-150 hover:bg-[#4A4A4A] lg:flex"
            onClick={goToPrevious}
          >
            <img className="w-5 h-5" src={arrow} alt="" />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            className="absolute top-1/2 right-10 w-14 h-14 hidden justify-center items-center transform -translate-y-1/2 border-2 border-white text-white p-2 rounded-full transition duration-150 hover:bg-[#4A4A4A] lg:flex"
            onClick={goToNext}
          >
            <img className="w-5 h-5 rotate-180" src={arrow} alt="" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Slider;

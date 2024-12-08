import { useContext, useState } from "react";
import Image from "./Image.jsx";
import heart from "../assets/heart.svg";
import like from "../assets/like.svg";
import { UserContext } from "../UserContext.jsx";
import { useWishlist } from "../hooks/useWishlist.js";
import { useParams } from "react-router-dom";
import Slider from "./Slider";

export default function PlaceGallery({ place }) {
  const { propertyId } = useParams();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { windowWidth } = useContext(UserContext);
  const { isInWishlist, handleWishlistToggle } = useWishlist(propertyId);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const openSlider = (index) => {
    setSelectedPhotoIndex(index);
    setShowAllPhotos(true);
  };
  
  if (showAllPhotos && selectedPhotoIndex !== null) {
    return (
      <Slider
        images={place?.photos}
        initialIndex={selectedPhotoIndex}
        closeSlider={() => setSelectedPhotoIndex(null)}
      />
    );
  }

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 z-50 bg-white min-h-screen">
        <div className="bg-white">
          <div className="sticky top-0 z-10 bg-white flex justify-between p-2 px-4 smd:p-2.5 smd:px-8 md:px-12">
            <span
              onClick={() => setShowAllPhotos(false)}
              className="w-9 h-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-[#f7f7f7]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="block h-4 w-4 stroke-current overflow-visible"
                strokeWidth="4"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"
                ></path>
              </svg>
            </span>
            <span>
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
            </span>
          </div>
          <div className="flex flex-col items-center pb-10 sm:max-w-[600px] md:max-w-[700px] gap-2 w-full mx-auto">
            {place?.photos?.length > 0 && (
              <div className="w-full flex flex-wrap gap-2">
                {place.photos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => openSlider(index)}
                    className={`relative cursor-pointer rounded-lg ${
                      index % 3 === 0
                        ? "aspect-square w-full sm:max-h-[450px] md:max-h-[550px]"
                        : "aspect-square w-full sm:w-[49.3%] md:w-[49.4%] sm:max-h-[300px]"
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`grid gap-2 ${
          windowWidth > 1200
            ? "grid-cols-[2fr_1fr_1fr]"
            : windowWidth <= 640
            ? "grid-cols-[1fr]"
            : "grid-cols-[1.5fr_1fr]"
        } sm:min-h-[500px] lg:min-h-[450px] rounded-3xl overflow-hidden`}
      >
        <div>
          {place.photos?.[0] && (
            <div className="h-full">
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="w-full h-full object-cover cursor-pointer hover:brightness-90"
                src={place.photos[0]}
                alt="Photo 1"
              />
            </div>
          )}
        </div>
        {windowWidth > 640 && (
          <div className="grid grid-cols-1 gap-2">
            <div className="relative h-full overflow-hidden">
              {place.photos?.[1] && (
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute w-full h-full object-cover cursor-pointer hover:brightness-90"
                  src={place.photos[1]}
                  alt="Photo 2"
                />
              )}
            </div>
            <div className="relative h-full overflow-hidden">
              {place.photos?.[2] && (
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute w-full h-full object-cover cursor-pointer hover:brightness-90"
                  src={place.photos[2]}
                  alt="Photo 3"
                />
              )}
            </div>
          </div>
        )}
        {windowWidth > 1200 && (
          <div className="grid grid-cols-1 gap-2">
            <div className="relative h-full overflow-hidden">
              {place.photos?.[3] && (
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute w-full h-full object-cover cursor-pointer hover:brightness-90"
                  src={place.photos[3]}
                  alt="Photo 4"
                />
              )}
            </div>
            <div className="relative h-full overflow-hidden">
              {place.photos?.[4] && (
                <Image
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute w-full h-full object-cover cursor-pointer hover:brightness-90"
                  src={place.photos[4]}
                  alt="Photo 5"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex items-center text-sm md:text-base gap-1 border border-text text-text font-medium absolute bottom-4 right-4 py-2 px-4 bg-white rounded-lg hover:bg-[#F7F7F7]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          aria-hidden="true"
          role="presentation"
          focusable="false"
          className="block h-4 w-4 text-current"
        >
          <path
            fillRule="evenodd"
            d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
          ></path>
        </svg>
        Show all photos
      </button>
    </div>
  );
}

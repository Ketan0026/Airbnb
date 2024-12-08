import { useState, useRef, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { categories } from "../assets/categories/data";
import { UserContext } from "../UserContext";

const Categories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slctdCategory, setSlctdCategory] = useState("All");
  const containerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const { setSelectedCategory: setGlobalSelectedCategory } =
    useContext(UserContext);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const visibleItemsCount = Math.floor(
          containerWidth / (isMobile ? 90 : 100)
        );
        const newWidth = containerWidth / (visibleItemsCount + 1);
        setItemWidth(newWidth);
        setContainerWidth(containerWidth);
      }
    };
    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, [isMobile]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  const handleNext = () => {
    const maxIndex = Math.max(
      0,
      categories.length - Math.floor(containerWidth / itemWidth)
    );
    setCurrentIndex((prev) => Math.min(prev + 3, maxIndex));
  };
  const handleCategorySelect = (categoryLabel) => {
    setSlctdCategory(categoryLabel);
    setGlobalSelectedCategory(categoryLabel);
  };
  return (
    <div className="relative w-[90%] mt-8 mx-auto flex items-center">
      {!isMobile && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="left-0 bg-white absolute h-8 w-8 flex justify-center items-center z-10 border border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs"
        >
          <span>
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
          </span>
        </button>
      )}
      <div
        className={`w-full ${
          isMobile ? "overflow-x-scroll no-scrollbar" : "overflow-hidden"
        }`}
        ref={containerRef}
      >
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * itemWidth}px)` }}
        >
          {categories.map((category, index) => (
            <div
              className={`flex flex-col items-center gap-2 cursor-pointer ${
                slctdCategory === category.label ? "opacity-100" : "opacity-55"
              } hover:opacity-100 transition-all duration-200`}
              key={index}
              style={{ minWidth: `${itemWidth}px` }}
              onClick={() => handleCategorySelect(category.label)}
            >
              <img
                className="w-[30px]"
                src={category.icon}
                alt={category.label}
              />
              <p className="text-xs text-nowrap font-medium">
                {category.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {!isMobile &&
        currentIndex <
          categories.length - Math.floor(containerWidth / itemWidth) && (
          <button
            onClick={handleNext}
            className="right-0 bg-white absolute h-8 w-8 flex justify-center items-center z-10 border border-[#0000004d] rounded-full transition duration-200 hover:scale-105 hover:shadow-navigate-bs"
          >
            <span>
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
            </span>
          </button>
        )}
    </div>
  );
};

export default Categories;

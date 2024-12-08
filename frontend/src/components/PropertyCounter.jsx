import React from "react";

const Counter = ({ label, value, onIncrement, onDecrement,isLast }) => {
  return (
    <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b' : ''}`}>
      <span className="text-lg font-medium">{label}</span>
      <div className="flex items-center">
        <button
          onClick={onDecrement}
          className={`guestBtn ${
            value === 1 ? "opacity-50 cursor-not-allowed" : "hover:border-black"
          }`}
          disabled={value === 1}
        >
          <svg
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="size-3"
          >
            <path d="m.75 6.75h10.5v-1.5h-10.5z"></path>
          </svg>
        </button>
        <span className="mx-4 font-medium">{value}</span>
        <button
          className="guestBtn hover:border-black"
          onClick={onIncrement}
        >
          <svg
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="size-3"
          >
            <g>
              <path d="m6.75.75v4.5h4.5v1.5h-4.5v4.5h-1.5v-4.5h-4.5v-1.5h4.5v-4.5z"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

const PropertyCounter = ({
  guests,
  setGuests,
  bedrooms,
  setBedrooms,
  beds,
  setBeds,
  bathrooms,
  setBathrooms,
}) => {
  return (
    <>
      <Counter
        label="Guests"
        value={guests}
        onIncrement={() => setGuests(guests + 1)}
        onDecrement={() => setGuests(guests - 1)}
        isLast={false}
      />
      <Counter
        label="Bedrooms"
        value={bedrooms}
        onIncrement={() => setBedrooms(bedrooms + 1)}
        onDecrement={() => setBedrooms(bedrooms - 1)}
        isLast={false}
      />
      <Counter
        label="Beds"
        value={beds}
        onIncrement={() => setBeds(beds + 1)}
        onDecrement={() => setBeds(beds - 1)}
        isLast={false}
      />
      <Counter
        label="Bathrooms"
        value={bathrooms}
        onIncrement={() => setBathrooms(bathrooms + 1)}
        onDecrement={() => setBathrooms(bathrooms - 1)}
        isLast={true}
      />
    </>
  );
};

export default PropertyCounter;

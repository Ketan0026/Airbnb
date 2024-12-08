import { useEffect, useState } from "react";

const GuestSelector = ({
  setGuests,
  setInfant,
  initialAdults,
  initialChildren,
  initialInfants,
  guestLimit = null,
}) => {
  const [adults, setAdults] = useState(initialAdults || 0);
  const [children, setChildren] = useState(initialChildren || 0);
  const [infants, setInfants] = useState(initialInfants || 0);

  const [hoveredIncrement, setHoveredIncrement] = useState(null);
  const [hoveredDecrement, setHoveredDecrement] = useState(null);

  const totalGuests = adults + children + infants;

  const incrementAdults = () => {
    if (guestLimit === null || totalGuests < guestLimit) {
      setAdults(adults + 1);
    }
  };

  const incrementChildren = () => {
    if (guestLimit === null || totalGuests < guestLimit) {
      setChildren(children + 1);
    }
  };

  const incrementInfants = () => {
    if (guestLimit === null || totalGuests < guestLimit) {
      setInfants(infants + 1);
    }
  };

  const decrementAdults = () => setAdults(adults > 0 ? adults - 1 : 0);
  const decrementChildren = () => setChildren(children > 0 ? children - 1 : 0);
  const decrementInfants = () => setInfants(infants > 0 ? infants - 1 : 0);

  useEffect(() => {
    setGuests(adults + children);
    setInfant(infants);
  }, [adults, children, infants, setGuests, setInfant]);

  const guests = [
    {
      label: "Adults",
      age: "Ages 13 or above",
      value: adults,
      increment: incrementAdults,
      decrement: decrementAdults,
      id: "adults",
    },
    {
      label: "Children",
      age: "Ages 2–12",
      value: children,
      increment: incrementChildren,
      decrement: decrementChildren,
      id: "children",
    },
    {
      label: "Infants",
      age: "Under 2",
      value: infants,
      increment: incrementInfants,
      decrement: decrementInfants,
      id: "infants",
    },
  ];

  return (
    <div className="px-8 py-6 w-full md:w-96 bg-white rounded-lg shadow-focus-bs mx-auto">
      {guests.map(({ label, age, value, increment, decrement, id }, index) => (
        <div key={label}>
          <div
            className={`flex justify-between items-center ${
              index < guests.length - 1 ? "mb-4" : ""
            }`}
          >
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-gray-500 text-sm">{age}</div>
            </div>
            <div className="flex items-center gap-1 space-x-2 smd:gap-2">
              <button
                onClick={decrement}
                onMouseEnter={() => setHoveredDecrement(id)}
                onMouseLeave={() => setHoveredDecrement(null)}
                className={`guestBtn ${
                  value === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-black"
                }`}
                disabled={value === 0}
              >
                <svg
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="size-3"
                  style={{ fill: hoveredDecrement === id ? "#000" : "#6A6A6A" }}
                >
                  <path d="m.75 6.75h10.5v-1.5h-10.5z"></path>
                </svg>
              </button>
              <span>{value}</span>
              <button
                onClick={increment}
                onMouseEnter={() => setHoveredIncrement(id)}
                onMouseLeave={() => setHoveredIncrement(null)}
                className={`guestBtn ${
                  guestLimit !== null && totalGuests >= guestLimit
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-black"
                }`}
                disabled={guestLimit !== null && totalGuests >= guestLimit}
              >
                <svg
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="size-3"
                  style={{ fill: hoveredIncrement === id ? "#000" : "#6A6A6A" }}
                >
                  <g>
                    <path d="m6.75.75v4.5h4.5v1.5h-4.5v4.5h-1.5v-4.5h-4.5v-1.5h4.5v-4.5z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          {index < guests.length - 1 && <hr className="border-gray-300 mb-4" />}
        </div>
      ))}
    </div>
  );
};

export default GuestSelector;

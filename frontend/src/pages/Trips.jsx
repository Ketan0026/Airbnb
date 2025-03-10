import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader/Loader";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-bdfq.onrender.com/bookings`,
        {
          withCredentials: true,
        }
      );
      setTrips(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching trips:",
        error.response?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="w-[90%] mx-auto mt-8 sm:mt-10 md:mt-12 border-b-2">
        <h1 className="text-[33px] smd:text-4xl font-medium mb-3 smd:mb-5">
          Bookings
        </h1>
      </div>

      {trips.length > 0 ? (
        <div className="mt-8 w-[90%] mx-auto grid grid-flow-row-dense sm:grid-cols-2 sm:gap-y-2 lg:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
          {trips.map(
            ({
              _id,
              listingId,
              startDate,
              endDate,
              totalPrice,
            }) => {
              return (
                <Card
                  key={_id}
                  listingId={listingId._id}
                  creator={listingId.hostId?.name}
                  listingPhotoPaths={listingId.photos}
                  city={listingId.city}
                  state={listingId.state}
                  country={listingId.country}
                  category={listingId.category}
                  houseType={listingId.houseType}
                  totalPrice={totalPrice}
                  booking={{ _id }}
                  startDate={startDate}
                  endDate={endDate}
                />
              );
            }
          )}
        </div>
      ) : (
        <div className="w-[90%] mx-auto">
          <div className="mt-6 smd:mt-8 border-b-2 pb-7">
            <div>
              <span className="text-2xl sm:text-[27px] text-text font-medium">
                No trips booked ... yet!
              </span>
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-xl mb-5 smd:mb-6">
              <span>Your booked trips will appear here.</span>
            </div>
            <Link to="/">
              <button className="border border-text text-text py-3 px-6 rounded-lg font-medium hover:bg-[#F7F7F7] transition duration-200">
                Start exploring
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Trips;

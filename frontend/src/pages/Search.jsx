import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader/Loader";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const { search } = useParams();

  const getSearchListings = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-bdfq.onrender.com/properties/search/${search}`
      );
      setListings(response.data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="w-[90%] mx-auto mt-8 sm:mt-10 md:mt-12 border-b-2">
        <h1 className="text-[33px] smd:text-4xl font-medium mb-3 smd:mb-5">
          Search results for "{search}"
        </h1>
      </div>

      {listings.length > 0 ? (
        <div className="mt-8 w-[90%] mx-auto grid grid-flow-row-dense sm:grid-cols-2 sm:gap-y-2 lg:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
          {listings?.map(
            ({
              _id,
              creator,
              photos = [],
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <Card
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={photos}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
              />
            )
          )}
        </div>
      ) : (
        <div className="w-[90%] mx-auto">
          <div className="mt-6 smd:mt-8 border-b-2 pb-7">
            <div>
              <span className="text-2xl sm:text-[27px] text-text font-medium">
                No listed homes ... yet!
              </span>
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-xl mb-5 smd:mb-6">
              <span>
                No listings found for "{search}". Try a different location or
                category.
              </span>
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

export default Search;

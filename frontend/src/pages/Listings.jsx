import { useEffect, useContext, useState } from "react";
import Card from "../components/Card.jsx";
import Loader from "../components/loader/Loader.jsx";
import { UserContext } from "../UserContext.jsx";
import { Link } from "react-router-dom";

const Listings = () => {
  const { listings, fetchListings, selectedCategory } =
    useContext(UserContext);
  
  const [displayedListings, setDisplayedListings] = useState(listings);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (selectedCategory !== pendingCategory) {
      setPendingCategory(selectedCategory);
      setIsFetching(true);
      fetchListings(selectedCategory).finally(() => {
        setIsFetching(false);
      });
    }
  }, [selectedCategory, fetchListings, pendingCategory]);

  useEffect(() => {
    if (!isFetching) {
      setDisplayedListings(listings);
    }
  }, [listings, isFetching]);

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : displayedListings.length === 0 ? (
        <>
          <div className="w-[90%] mx-auto mt-8 sm:mt-10 md:mt-12 border-b-2">
            <h1 className="text-[33px] smd:text-4xl font-medium mb-3 smd:mb-5">
              No Property😔
            </h1>
          </div>
          <div className="w-[90%] mx-auto">
            <div className="mt-6 smd:mt-8 border-b-2 pb-7">
              <div>
                <span className="text-2xl smd:text-[27px] text-text font-medium">
                  No listed property ... yet!
                </span>
              </div>
              <div className="mt-1 sm:mt-2 text-lg sm:text-xl mb-5 smd:mb-6">
                <span>Listed homes will appear here.</span>
              </div>
              <Link to="/create">
                <button className="border border-text text-text py-3 px-6 rounded-lg font-medium hover:bg-[#F7F7F7] transition duration-200">
                  Add a property
                </button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          {selectedCategory !== "All" && (
            <div className="w-[90%] mx-auto mt-12 border-b-2">
              <h1 className="text-[33px] smd:text-4xl sm:text-[42px] font-medium mb-3 smd:mb-5">
                {selectedCategory}
              </h1>
            </div>
          )}
          <div className="mt-8 w-[90%] mx-auto grid grid-flow-row-dense sm:grid-cols-2 sm:gap-y-2 lg:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
            {displayedListings.map(
              ({
                _id,
                creator,
                photos,
                city,
                state,
                country,
                category,
                houseType,
                price,
                booking = false,
              }) => (
                <Card
                  key={_id}
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={photos}
                  city={city}
                  state={state}
                  country={country}
                  category={category}
                  houseType={houseType}
                  price={price}
                  booking={booking}
                />
              )
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Listings;

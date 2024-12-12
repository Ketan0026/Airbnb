import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loading from "../components/loader/Loader";
import { UserContext } from "../UserContext";

const WishList = () => {
  const { userInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const wishList = userInfo?.wishList || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="w-[90%] mx-auto mt-8">
          <Loading />
        </div>
      ) : (
        <>
          <div className="w-[90%] mx-auto mt-8 sm:mt-10 md:mt-12 border-b-2">
            <h1 className="text-[33px] smd:text-4xl font-medium mb-3 smd:mb-5">
              Wishlists
            </h1>
          </div>
          {wishList.length > 0 ? (
            <div className="mt-8 w-[90%] mx-auto grid grid-flow-row-dense sm:grid-cols-2 sm:gap-y-2 lg:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
              {wishList.map(
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
                }) => {
                  return (
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
                  );
                }
              )}
            </div>
          ) : (
            <div className="w-[90%] mx-auto">
              <div className="mt-6 smd:mt-8 border-b-2 pb-7">
                <div>
                  <span className="text-2xl sm:text-[27px] text-text font-medium">
                    No homes added to wishlist ... yet!
                  </span>
                </div>
                <div className="mt-1 sm:mt-2 text-lg sm:text-xl mb-5 smd:mb-6">
                  <span>Homes you’ve wishlisted will appear here.</span>
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
      )}
    </>
  );
};

export default WishList;

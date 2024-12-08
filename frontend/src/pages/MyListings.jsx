import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/loader/Loader";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Link } from "react-router-dom";

const MyListings = () => {
  const [loading, setLoading] = useState(true);
  const { userInfo,setUserInfo } = useContext(UserContext);
  const propertyList = userInfo?.propertyList;

  const getPropertyList = async () => {
    try {
      const response = await axios.get(
        `https://airbnb-bdfq.onrender.com/users/${userInfo._id}/properties`
      );
      const data = response.data;
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        propertyList: [...data],
      }));
      
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);


  const handleDelete = (id) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      propertyList: prevUserInfo.propertyList.filter(
        (property) => property._id !== id
      ),
    }));
  };


  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="w-[90%] mx-auto mt-8 sm:mt-10 md:mt-12 border-b-2">
        <h1 className="text-[33px] smd:text-4xl font-medium mb-3 smd:mb-5">
        My Properties
        </h1>
      </div>
      {propertyList.length > 0 ? (
      <div className="mt-8 w-[90%] mx-auto grid grid-flow-row-dense sm:grid-cols-2 sm:gap-y-2 lg:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
        {propertyList.map(
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
                  onDelete={handleDelete}
                />
              );
            }
          )}
      </div>):(<div className="w-[90%] mx-auto">
          <div className="mt-6 smd:mt-8 border-b-2 pb-7">
            <div>
              <span className="text-2xl sm:text-[27px] text-text font-medium">
                You haven't posted any home ... yet!
              </span>
            </div>
            <div className="mt-1 sm:mt-2 text-lg sm:text-xl mb-5 smd:mb-6">
              <span>Homes you’ve posted will appear here.</span>
            </div>
            <Link to="/create">
              <button className="border border-text text-text py-3 px-6 rounded-lg font-medium hover:bg-[#F7F7F7] transition duration-200">
                Post property
              </button>
            </Link>
          </div>
        </div>)}
    </>
  );
};

export default MyListings;

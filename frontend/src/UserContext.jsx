import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInfo, setUserInfo] = useState({});
  const [user, setUser] = useState(false);
  const [listings, setListings] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchUserWishlist = async () => {
      try {
        const userId = userInfo?._id;
        if (userId) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`
          );
          setWishList(response.data.wishList || []);
        }
      } catch (err) {
        console.error("Failed to fetch user wishlist:", err);
      }
    };

    if (userInfo._id) {
      fetchUserWishlist();
    }
  }, [userInfo]);

  const fetchListings = async (category) => {
    try {
      const response = await axios.get(
        category !== "All"
          ? `${import.meta.env.VITE_BACKEND_URL}/properties?category=${category}`
          : `${import.meta.env.VITE_BACKEND_URL}/properties`
      );
      setListings(response.data);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (propertyId) => {
    return wishList.some((item) => item._id === propertyId);
  };

  const toggleWishlist = async (propertyId) => {
    try {
      const userId = userInfo?._id;
      if (!userId) {
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/${propertyId}`;
      const method = "patch";
      const response = await axios({ method, url });

      if (response.status === 200) {
        const updatedWishList = response.data.wishList;
        setWishList(updatedWishList);
        setUserInfo((prev) => ({
          ...prev,
          wishList: updatedWishList,
        }));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        windowWidth,
        userInfo,
        setUserInfo,
        user,
        setUser,
        listings,
        loading,
        fetchListings,
        selectedCategory,
        setSelectedCategory,
        wishList,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

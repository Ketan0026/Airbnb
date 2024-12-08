import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export const useWishlist = (propertyId) => {
  const { user, isInWishlist, toggleWishlist } = useContext(UserContext);
  const navigate = useNavigate();

  const handleWishlistToggle = async () => {
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      setTimeout(() => {
        navigate("/login");
      }, 200);
      return;
    }

    await toggleWishlist(propertyId);
  };

  return {
    isInWishlist: isInWishlist(propertyId),
    handleWishlistToggle,
  };
};

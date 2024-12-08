import React, { useContext } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const { setUserInfo,setUser } = useContext(UserContext);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios
        .post(
          `https://airbnb-1tti.onrender.com/googleSignin`,
          {
            name: user.displayName,
            email: user.email,
            firebaseUID: user.uid,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setUserInfo(response.data);
          setUser(true);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setUserInfo({});
          setUser(false);
        });
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };
  return (
    <div>
      <div className="flx my-4 smd:my-5 sm:my-6">
        <span className="line"></span>
        <span className="mx-4 text-gray-500 text-sm smd:text-[15px] sm:text-base text-nowrap">or sign in with</span>
        <span className="line"></span>
      </div>
      <button
        onClick={handleGoogleSignIn}
        className="flx w-full p-3 smd:p-3.5 sm:p-4 smd:text-[17px] sm:text-lg font-medium text-gray-900 bg-white border border-gray-300 rounded-sm shadow-sm mb-3 transition duration-300 hover:bg-gray-50"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;

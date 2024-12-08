import { useContext, useState } from "react";
import loginBg from "../assets/login-bg.svg";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";
import axios from "axios";
import { UserContext } from "../UserContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo, setUser } = useContext(UserContext);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { name, email, password };
    await axios
      .post(`https://airbnb-bdfq.onrender.com/register`, data, {
        withCredentials: true,
      })
      .then((response) => {
        setUserInfo(response.data);
        setUser(true);
        navigate("/");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message === "User already exists"
        ) {
          setShowErrorMessage(true);
        } else {
          setShowErrorMessage(false);
        }
        setUserInfo({});
        setUser(false);
      });
  };

  return (
    <div className="flex justify-center">
      <img
        className="authBg"
        src={loginBg}
        alt=""
      />
      <div className="relative">
        <div className="authFormBox">
          <h1 className="authFormHeading">
            Sign Up
          </h1>
          <form onSubmit={handleLogin}>
            <div className="inputContainer">
              <label>Name</label>
              <input
                className="authInput mb-3 sm:mb-4"
                placeholder="Name"
                type="text"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="inputContainer">
              <label>Email</label>
              <input
                className={`${
                  showErrorMessage ? "mb-1 sm:mb-2 " : "mb-3 sm:mb-4 "
                } authInput`}
                placeholder="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {showErrorMessage && (
                <div className="text-xs sm:text-sm text-[#b3261e] flex mb-2 sm:mb-3 gap-1 items-center tracking-wider">
                  <span>
                    <svg
                      aria-hidden="true"
                      className="Qk3oof xTjuxe"
                      fill="#b3261e"
                      focusable="false"
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                      xmlns="https://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                    </svg>
                  </span>
                  Email already in use
                </div>
              )}
            </div>
            <div className="relative inputContainer">
              <label>Password</label>
              <input
                className="authInput mb-3 sm:mb-4"
                placeholder="Password"
                type={`${showPassword ? "text" : "password"}`}
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {!showPassword && (
                <span
                  onClick={() => setShowPassword(true)}
                  className="absolute cursor-pointer right-4 top-[33px] smd:top-[37px] sm:top-[45px]"
                >
                  <i className="ri-eye-off-line"></i>
                </span>
              )}
              {showPassword && (
                <span
                  onClick={() => setShowPassword(false)}
                  className="absolute cursor-pointer right-4 top-[33px] smd:top-[37px] sm:top-[45px]"
                >
                  <i className="ri-eye-line"></i>
                </span>
              )}
            </div>
            <button
              className="formSubmitBtn"
              type="submit"
            >
              Register
            </button>
          </form>
          <span className="text-sm smd:text-[15px] sm:text-base">
            Already have an account?{" "}
            <Link className="text-blue-600 underline" to="/login">
              Login here
            </Link>
          </span>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;

import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Search from "./pages/Search.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import WishList from "./pages/WishList.jsx";
import Trips from "./pages/Trips.jsx";
import MyListings from "./pages/MyListings.jsx";
import EditListing from "./pages/EditListing.jsx";
import Details from "./components/Details.jsx";

function App() {
  const { user, setUser, setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [userIdData, setUserIdData] = useState(null);

  useEffect(() => {
    const fetchId = async () => {
      try {
        await axios
          .get(`https://airbnb-bdfq.onrender.com/userId`, {
            withCredentials: true,
          })
          .then((response) => {
            setUserIdData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userIdData) {
        try {
          const response = await axios.get(
            `https://airbnb-bdfq.onrender.com/user/${userIdData}`
          );
          setUserInfo(response.data);
          setUser(true);
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, [userIdData, setUserInfo, setUser]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/" element={<Layout />}>
        </Route>
          <Route path="/search/:search" element={<Search />} />
          <Route path={`/properties/:propertyId`} element={<Details />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path={`/:${userIdData}/wishlist`} element={<WishList />} />
          <Route path={`/:${userIdData}/trips`} element={<Trips />} />
          <Route path={`/:${userIdData}/listings`} element={<MyListings />} />
          <Route path={`/edit/:propertyId`} element={<EditListing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

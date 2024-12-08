import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import Listings from "./Listings";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Categories />
      <Listings/>
      <Outlet />
    </div>
  );
}

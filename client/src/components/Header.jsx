import { useEffect, useState } from "react";
import { Link, useAsyncError } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdShoppingCart } from "react-icons/md";
import log from "../img/log.jpg";
import DropdownMenu from "./DropdownMenu";

export default function () {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  console.log(totalItems);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isDropdownOpen &&
        event.target.closest(".dropdown-menu") === null &&
        event.target.closest("button") === null
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const CurrentuserId = currentUser ? currentUser._id : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/items/cartitem/${CurrentuserId}`);
        const data = await response.json();

        console.log("data", data);

        if (data.length > 0) {
          setTotalItems(data.length);
        } else {
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching bid data:", error);
      }
    };

    fetchData();
  }, [CurrentuserId]);

  return (
    <div className="bg-white">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
      <Link to="/">
          <h1 className="font-bold ">The gym</h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>

          {currentUser ? (
            <>
              <div className="relative">
                <button onClick={toggleDropdown}>
                  <div className="relative">
                    <MdShoppingCart className="text-2xl text-blue-500" />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </div>
                  </div>
                </button>
                {isDropdownOpen && (
                  <DropdownMenu
                    isOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                  />
                )}
              </div>
              <Link to="/order">
                <h1>payment</h1>
              </Link>

              <Link to={"/profil"}>
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              </Link>
            </>
          ) : (
            <Link to="/sign-in">
              <li>Sing In</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { useLocationContext } from "../../context/locationContext/useLocationContext";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { getProfile } from "../../apiCalls/productapi";
const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Products", href: "/products" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { address, detectLocation } = useLocationContext();
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id)
        .then((data) => {
          if (data?.images?.url) {
            setAvatar(data.images.url);
          }
        })
        .catch((error) => console.error("Failed to load navbar profile photo", error));
    } else {
      setAvatar(null);
    }
  }, [user?._id]);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      alert("Please login to access cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">

            {/* LOGO */}
            <div
              className="text-xl font-bold text-green-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              DesiCart
            </div>

            {/* LOCATION */}
            <div
              onClick={detectLocation}
              className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              <span className="material-symbols-outlined text-green-600">
                location_on
              </span>

              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-500">Deliver to</span>
                <span className="text-sm font-semibold truncate max-w-[160px]">
                  {address}
                </span>
              </div>
            </div>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex gap-6">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* SEARCH (Desktop only) */}
            <div className="hidden lg:flex items-center border border-gray-300 rounded-md px-3 py-1.5 focus-within:border-green-500 transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="ml-2 w-40 bg-transparent text-sm outline-none"
              />
            </div>

            {/* CART */}
            <button
              onClick={handleCartClick}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[22px]">
                shopping_cart
              </span>
            </button>

            <button
              onClick={() => navigate("/favorite")}
              className="p-2 rounded-md hover:bg-gray-100">
              <span className="material-symbols-outlined">
                favorite
              </span>
            </button>

            {/* NOTIFICATION */}
            <button className="p-2 rounded-md hover:bg-gray-100">
              <BellIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* PROFILE MENU (Desktop only) */}
            <Menu as="div" className="relative hidden lg:block">
              <MenuButton>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                  alt="Profile"
                />
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                  {isAuthenticated ? (
                    <>
                      <MenuItem>
                        <button
                          onClick={() => navigate("/profile")}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Profile
                        </button>
                      </MenuItem>

                      <MenuItem>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem>
                      <button
                        onClick={() => navigate("/login")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Login
                      </button>
                    </MenuItem>
                  )}
                </MenuItems>
              </Transition>
            </Menu>

            {/* MOBILE MENU BUTTON */}
            <DisclosureButton className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              <Bars3Icon className="h-6 w-6 text-gray-700 data-open:hidden" />
              <XMarkIcon className="h-6 w-6 text-gray-700 hidden data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL */}
      <DisclosurePanel className="lg:hidden bg-white border-t border-gray-200">

        <div className="space-y-1 px-4 py-3 flex flex-col">

          {/* Navigation */}
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-base font-medium ${isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <hr className="my-2" />

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  if (!user?._id) return;
                  navigate(`/profile/${user._id}`);
                }}
                className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-green-500">
            <span className="material-symbols-outlined text-gray-500">
              search
            </span>
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

      </DisclosurePanel>
    </Disclosure>
  );
}

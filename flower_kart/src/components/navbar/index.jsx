import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfile } from "../../apiCalls/productapi";
import { useToast } from "../ui/ToastProvider.jsx";
import { useLocationContext } from "../../context/locationContext/useLocationContext";
import { useAuth } from "../../context/auth.context";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Shops", href: "/shop" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const { notify } = useToast();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { address, setAddress, coordinates, detectLocation } = useLocationContext();
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    pincode: "",
    phone: "",
  });

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
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
      notify({
        title: "Login required",
        message: "Please sign in before continuing to your cart.",
        type: "info",
      });
      navigate("/login");
      return;
    }

    navigate("/cart");
  };

  const confirmLocation = () => {
    if (!addressDetails.houseNo || !addressDetails.street || !addressDetails.pincode || !addressDetails.phone) {
      notify({
        title: "Missing address details",
        message: "Please fill all required address fields first.",
        type: "error",
      });
      return;
    }

    if (address === "Select Location") {
      notify({
        title: "Detect your location first",
        message: "Use auto-detect so we can anchor the rest of your address correctly.",
        type: "info",
      });
      return;
    }

    const parts = [
      `House: ${addressDetails.houseNo}`,
      `Street: ${addressDetails.street}`,
      addressDetails.landmark ? `Landmark: ${addressDetails.landmark}` : "",
      `City/State: ${address}`,
      `Pincode: ${addressDetails.pincode}`,
      `Phone: ${addressDetails.phone}`,
    ].filter(Boolean);

    const finalAddress = parts.join(", ");
    if (setAddress) {
      setAddress(finalAddress);
    }
    localStorage.setItem("deliveryAddress", finalAddress);
    setIsLocationModalOpen(false);
    notify({
      title: "Delivery address saved",
      message: "Your next order will use this address.",
      type: "success",
    });
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex min-h-[84px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-left"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">
                Fresh delivery
              </p>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                flowerKart
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60 md:block"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Deliver to
              </p>
              <p className="mt-1 max-w-[180px] truncate text-sm font-medium text-slate-700">
                {address}
              </p>
            </button>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex rounded-full border border-slate-200 bg-slate-50/75 p-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
              <span className="material-symbols-outlined text-[20px] text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search bouquets, roses, orchids..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleSearch}
                className="ml-2 w-56 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="ml-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
              >
                Go
              </button>
            </div>

            <button
              type="button"
              onClick={handleCartClick}
              className="rounded-full border border-slate-200 bg-white p-3 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-[22px] text-slate-700">shopping_cart</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/favorite")}
              className="rounded-full border border-slate-200 bg-white p-3 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60"
              aria-label="Wishlist"
            >
              <span className="material-symbols-outlined text-[22px] text-slate-700">favorite</span>
            </button>

            <button
              type="button"
              className="hidden rounded-full border border-slate-200 bg-white p-3 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60 md:flex"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5 text-slate-700" />
            </button>

            <Menu as="div" className="relative hidden lg:block">
              <MenuButton className="overflow-hidden rounded-full border border-slate-200 shadow-sm transition hover:border-rose-200">
                <img
                  className="h-11 w-11 object-cover"
                  src={avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                  alt="Profile"
                />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition duration-200"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
              >
                <MenuItems className="absolute right-0 mt-3 w-64 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                  <div className="rounded-[22px] bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Signed in as
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-950">
                      {user?.email || "Guest user"}
                    </p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {isAuthenticated ? (
                      <>
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              type="button"
                              onClick={() => navigate("/profile")}
                              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                                focus ? "bg-rose-50 text-rose-600" : "text-slate-700"
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">person</span>
                              My profile
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              type="button"
                              onClick={() => {
                                logout();
                                navigate("/login");
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                                focus ? "bg-rose-50 text-rose-600" : "text-slate-700"
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">logout</span>
                              Logout
                            </button>
                          )}
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                              focus ? "bg-rose-50 text-rose-600" : "text-slate-700"
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">login</span>
                            Login / Sign up
                          </button>
                        )}
                      </MenuItem>
                    )}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            <DisclosureButton className="rounded-full border border-slate-200 bg-white p-3 shadow-sm transition hover:border-rose-200 lg:hidden">
              <Bars3Icon className="h-5 w-5 text-slate-700 data-open:hidden" />
              <XMarkIcon className="hidden h-5 w-5 text-slate-700 data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 lg:hidden">
        <div className="space-y-3">
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-50/75 px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search bouquets, roses, orchids..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleSearch}
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-left shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Deliver to</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{address}</p>
          </button>
          <div className="grid gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                className={({ isActive }) =>
                  `rounded-[18px] px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <button type="button" onClick={() => navigate("/profile")} className="rounded-[18px] bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-[18px] bg-rose-50 px-4 py-3 text-left text-sm font-medium text-rose-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button type="button" onClick={() => navigate("/login")} className="rounded-[18px] bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700">
                Login / Sign up
              </button>
            )}
          </div>
        </div>
      </DisclosurePanel>

      <Dialog open={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.22)] md:p-8">
            <DialogTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Set your delivery address
            </DialogTitle>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              A stronger checkout starts with a trustworthy address step, so this modal now captures both fast detection and exact doorstep details.
            </p>

            <div className="mt-6 grid gap-4">
              <button
                type="button"
                onClick={detectLocation}
                className="secondary-button w-full px-5 py-3 text-sm"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
                Auto-detect city and state
              </button>

              {coordinates ? (
                <div className="overflow-hidden rounded-[24px] border border-slate-200 shadow-sm">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="220"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.005},${coordinates.lat - 0.005},${coordinates.lng + 0.005},${coordinates.lat + 0.005}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                  />
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    House / flat no
                  </label>
                  <input
                    type="text"
                    value={addressDetails.houseNo}
                    onChange={(event) => setAddressDetails({ ...addressDetails, houseNo: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                    placeholder="e.g. 101"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addressDetails.pincode}
                    onChange={(event) => setAddressDetails({ ...addressDetails, pincode: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                    placeholder="e.g. 400001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Street / area
                  </label>
                  <input
                    type="text"
                    value={addressDetails.street}
                    onChange={(event) => setAddressDetails({ ...addressDetails, street: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                    placeholder="MG Road, Near Park"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addressDetails.landmark}
                    onChange={(event) => setAddressDetails({ ...addressDetails, landmark: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={addressDetails.phone}
                    onChange={(event) => setAddressDetails({ ...addressDetails, phone: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="secondary-button px-5 py-3 text-sm"
                >
                  Cancel
                </button>
                <button type="button" onClick={confirmLocation} className="cta-button px-5 py-3 text-sm">
                  Save delivery address
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Disclosure>
  );
}

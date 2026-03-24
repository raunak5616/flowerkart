import { useState } from "react";
import { LocationContext } from "./location.context";

export const LocationProvider = ({ children }) => {
  const [address, setAddress] = useState(() => {
  return localStorage.getItem("deliveryAddress") || "Select Location";
});



  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await response.json();

        const shortAddress = `${data.address.city || data.address.town || ""}, ${data.address.state || ""}`;

        setAddress(shortAddress);
        localStorage.setItem("deliveryAddress", shortAddress);
      },
      () => alert("Please allow location access")
    );
  };

  return (
    <LocationContext.Provider value={{ address, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

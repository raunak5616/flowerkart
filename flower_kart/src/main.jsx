import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/auth.context/index.jsx";
import { LocationProvider } 
from "./context/locationContext/location.provider.jsx";
import { CartProvider } from "./context/card.context/card.provider.jsx";
import { ToastProvider } from "./components/ui/ToastProvider.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
              <App />
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);

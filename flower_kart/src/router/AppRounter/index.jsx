import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../../components/navbar";
import Home from "../../pages/home";
import { Cart } from "../../pages/cart";
import Contact from "../../pages/contact";
import Shop from "../../pages/shop";
import Support from "../../pages/support";
import Product from "../../pages/product";
import Login from "../../pages/login";
import Signup from "../../pages/signup";
import Profile from "../../pages/profile";
import Footer from "../../components/footer";
import { ShopByProduct } from "../../pages/shopByProduct";
import Favorite from "../../pages/fav";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/Products" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop/:id" element={<ShopByProduct />} />
        <Route path="favorite" element={<Favorite />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRouter;

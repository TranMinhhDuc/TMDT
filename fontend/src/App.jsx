import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Footer from "./component/Footer";
import Collection from "./pages/Collection";
import SearchBar from "./component/SearchBar";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Profile from "./pages/Profile";
import PaymentResultPage from "./pages/PaymentResultPage";
import Orders from "./pages/Orders";

const App = () => {
  return (
    <div className = "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<PlaceOrder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/order" element={<Orders />} />
      </Routes>
      {/* <Footer /> */}
      <Footer />
    </div>
  ); 
};

export default App;
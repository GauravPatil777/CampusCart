import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home';
import { AuthProvider } from './contexts/auth.context';
import { SearchProvider } from './contexts/search.context';
import Item from './pages/Item';
import Register from './pages/Register';
import Login from './pages/Login';
import SellItem from './pages/SellItem';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import MyProducts from './pages/MyProducts';
import VerifyOtp from './pages/VerifyOtp';
import PageNotFound from './pages/PageNotFound';
import Landing from './pages/Landing';
import Navbar from './pages/Navbar';
import { useLocation } from 'react-router-dom';
import EditProduct from './pages/EditProduct';


function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/verify-otp"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <AuthProvider>
      <SearchProvider>
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sell" element={<SellItem />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/edit-product/:id"
            element={<EditProduct/>}
          />
        </Routes>

        {/* Toast container here */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </SearchProvider>

    </AuthProvider>
  )
}

export default App
import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../contexts/search.context";
import { useSearchProducts } from './../hooks/useSearchProducts';
import "../styles/Navbar.css";
const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { query, setQuery, setResults } = useSearch();
  const { search } = useSearchProducts();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await search(query);
      setResults(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Search failed");
      console.log(error);
    }
  };

  return (
    <div className="navbar">

      {/* LOGO */}
      <div
        className="appHead"
        onClick={() => navigate("/home")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        {/* Logo Icon */}
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "lightgreen",
            borderRadius: "10px",
            boxShadow: "0 4px 3px rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cart Body */}
            <path
              d="M40 60 H150 L135 120 H60 L40 60Z"
              stroke="#3B82F6"
              strokeWidth="6"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Wheels (UPDATED opacity) */}
            <circle cx="70" cy="145" r="8" fill="#8B5CF6" opacity="0.9" />
            <circle cx="120" cy="145" r="8" fill="#8B5CF6" opacity="0.9" />

            {/* Handle */}
            <path
              d="M40 60 L30 40"
              stroke="#3B82F6"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Graduation Cap */}
            <path d="M60 40 L100 25 L140 40 L100 55 Z" fill="#3B82F6" />

            {/* Tassel */}
            <line x1="140" y1="40" x2="150" y2="55" stroke="#FACC15" strokeWidth="3" />
            <circle cx="150" cy="58" r="3" fill="#FACC15" />
          </svg>
        </div>

        {/* App Name (INCREASED SIZE) */}
        <h1
          style={{
            cursor: "pointer",
            fontStyle: "oblique",
            fontSize: "33px",   
            fontWeight: "750",
            margin: 0,
          }}
        >
          Campus<span style={{ color: "#3B82F6" }}>Cart</span>
        </h1>
      </div>

      {/* SEARCH */}
      <div className="searchBox">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* MENU */}
      <div>
        <Button classN onClick={handleClick}>
          <MenuIcon sx={{ fontSize: "35px", background: "lightgreen", borderRadius: "20%" }} />
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {user ? (
            <>
              <MenuItem onClick={() => navigate("/me")}>
                <AccountCircleIcon /> My Profile
              </MenuItem>

              <MenuItem onClick={() => navigate("/wishlist")}>
                <FavoriteIcon /> Wishlist
              </MenuItem>

              <MenuItem onClick={() => navigate("/my-products")}>
                <Inventory2Icon /> My Products
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
              >
                <LogoutIcon /> Logout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem component={Link} to="/login">
                <LoginIcon /> Login
              </MenuItem>

              <MenuItem component={Link} to="/register">
                <PersonAddIcon /> Sign Up
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
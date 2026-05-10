import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "react-toastify";
import { useSearch } from "../contexts/search.context";
const API = import.meta.env.VITE_API_URL;

const Home = () => {

  const { user } = useAuth();
  const { results } = useSearch();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState([]);
  useEffect(() => {
    if (results && results.length > 0) {
      setProducts(results);
    } else {
      setProducts([]);
    }
  }, [results]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    const fetchWislist = async () => {
      if (!user) {
        setLiked([]);
        return;
      }
      try {
        const res = await axios.get(`${API}/api/wishlist`, { withCredentials: true });
        const likedProds = res.data.wishlist.map(item => item._id);
        setLiked(likedProds)
      }
      catch (error) {
        console.error(error?.response?.data || error.message);
      }
    }; fetchWislist()
  }, [user])

  const handleWishlist = async (productId) => {
    try {
      const isLiked = liked.includes(productId);

      if (!isLiked) {
        await axios.post(
          `${API}/api/wishlist`,
          { productId },
          { withCredentials: true }
        );

        toast.success("Added to wishlist");
        setLiked((prev) => [...prev, productId]);
      } else {
        await axios.delete(
          `${API}/api/wishlist/${productId}`,
          { withCredentials: true }
        );

        toast.success("Removed from wishlist");
        setLiked((prev) => prev.filter((id) => id !== productId));
      }
    } catch (error) {
      console.log(error?.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Content...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="myCard">
        {products.length === 0 ? (
          <div className="noProducts">
            <div className="noProductsBox">
              <h2>No Products Found</h2>
              <p>We couldn’t find anything matching your search</p>
              <span>Try different keywords or browse all products</span>
            </div>
          </div>
        ) : (
          products.map((item) => {
            const discount =
              item.originalPrice && item.discountedPrice
                ? Math.round(
                  ((item.originalPrice - item.discountedPrice) /
                    item.originalPrice) *
                  100
                )
                : 0;

            return (
              <div key={item._id} className="productCard">
                <div className="CardMedia">
                  <Link to={`/item/${item._id}`}>
                    {discount > 0 && (
                      <span className="discount">-{discount}% OFF</span>
                    )}
                    <img src={item.image} alt="product" />
                  </Link>
                </div>

                <div className="CardContent">
                  <div className="cardName">
                    <h3>{item.productName}</h3>

                    <button onClick={() => handleWishlist(item._id)}>
                      {liked.includes(item._id) ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </button>
                  </div>

                  <div className="cardPriceSection">
                    <h3 style={{ marginLeft: "8px" }}>
                      ₹{item.discountedPrice}
                    </h3>
                    <h3
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                        fontWeight: "lighter",
                      }}
                    >
                      ₹{item.originalPrice}
                    </h3>

                    <h3
                      style={{
                        background: item.productType === "new" ? "lightgreen" : "#3B82F6",
                        borderRadius: "10px",
                        width: "60px",
                        textAlign: "center",
                        padding: "4px 8px",
                        color: "black"
                      }}
                    >
                      {item.productType}
                    </h3>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div >
  );
};

export default Home;
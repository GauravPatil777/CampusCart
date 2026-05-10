import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import emptyWishlist from "../assets/empty-wishlist.jpg";
import { toast } from "react-toastify";
import { useSearch } from "../contexts/search.context";
const API = import.meta.env.VITE_API_URL;

const Wishlist = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [liked, setLiked] = useState([]);

    const navigate = useNavigate();
    const { results } = useSearch();

    useEffect(() => {
        if (results && results.length > 0) {
            setProducts(results);
        } else {
            setProducts([]);
        }
    }, [results]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) {
                setLiked([]);
                setProducts([]);
                return;
            }

            try {
                setLoading(true);

                const res = await axios.get(
                    `${API}http://localhost:3000/api/wishlist`,
                    { withCredentials: true }
                );

                const likedProds = res.data.wishlist.map(
                    (item) => item._id
                );

                const products = res.data.wishlist;

                setLiked(likedProds);
                setProducts(products);
            } catch (error) {
                console.error(
                    error?.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const handleWishlist = async (productId) => {
        try {
            const isLiked = liked.includes(productId);

            if (!isLiked) {
                await axios.post(
                   ` ${API}http://localhost:3000/api/wishlist`,
                    { productId },
                    { withCredentials: true }
                );

                toast.success("Added to wishlist");

                setLiked((prev) => [
                    ...prev,
                    productId,
                ]);
            } else {
                await axios.delete(
                    `${API}/api/wishlist/${productId}`,
                    { withCredentials: true }
                );

                toast.success(
                    "Removed from wishlist"
                );

                setLiked((prev) =>
                    prev.filter(
                        (id) => id !== productId
                    )
                );

                setProducts((prev) =>
                    prev.filter(
                        (item) =>
                            item._id !== productId
                    )
                );
            }
        } catch (error) {
            console.error(
                error?.response?.data || error.message
            );

            toast.error(
                "Failed to update wishlist"
            );
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Wishlist...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="myCard">
                {products.length === 0 ? (
                    <div className="emptyWishlist">
                        <img
                            src={emptyWishlist}
                            alt="Empty Wishlist"
                        />

                        <h2
                            style={{
                                color: "gray",
                                marginBottom: "20px",
                            }}
                        >
                            Your wishlist is empty!
                        </h2>

                        <button
                            style={{
                                marginTop: "-10px",
                            }}
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    products.map((item) => {
                        const discount =
                            item.originalPrice &&
                                item.discountedPrice
                                ? Math.round(
                                    ((item.originalPrice -
                                        item.discountedPrice) /
                                        item.originalPrice) *
                                    100
                                )
                                : 0;

                        return (
                            <div
                                key={item._id}
                                className="productCard"
                            >
                                <div className="CardMedia">
                                    <Link
                                        to={`/item/${item._id}`}
                                    >
                                        {discount > 0 && (
                                            <span className="discount">
                                                -{discount}% OFF
                                            </span>
                                        )}

                                        <img
                                            src={item.image}
                                            alt={`${item.productName} image`}
                                        />
                                    </Link>
                                </div>

                                <div className="CardContent">
                                    <div className="cardName">
                                        <h3>
                                            {item.productName}
                                        </h3>

                                        <button
                                            onClick={() =>
                                                handleWishlist(
                                                    item._id
                                                )
                                            }
                                        >
                                            {liked.includes(
                                                item._id
                                            ) ? (
                                                <FavoriteIcon
                                                    sx={{
                                                        color:
                                                            "red",
                                                    }}
                                                />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </button>
                                    </div>

                                    <div className="cardPriceSection">
                                        <h3
                                            style={{
                                                marginLeft:
                                                    "8px",
                                            }}
                                        >
                                            ₹
                                            {
                                                item.discountedPrice
                                            }
                                        </h3>

                                        <h3
                                            style={{
                                                textDecoration:
                                                    "line-through",
                                                color: "gray",
                                                fontWeight:
                                                    "lighter",
                                            }}
                                        >
                                            ₹
                                            {
                                                item.originalPrice
                                            }
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
        </div>
    );
};

export default Wishlist;
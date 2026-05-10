import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import emptyProduct from "../assets/emptyProduct.png";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useSearch } from "../contexts/search.context";
const API = import.meta.env.VITE_API_URL;

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const { results } = useSearch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (results && results.length > 0) {
            setProducts(results);
        } else {
            setProducts([]);
        }
    }, [results]);

    useEffect(() => {
        const fetchMyProducts = async () => {
            setLoading(true);

            try {
                const products = await axios.get(
                    `${API}/api/products/my-products`,
                    { withCredentials: true }
                );
                    
                setProducts(products.data);
            } catch (error) {
                console.error(
                    error?.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(
                `${API}/api/products/${productId}`,
                { withCredentials: true }
            );

            toast.success(
                "Product deleted successfully"
            );

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (prod) => prod._id !== productId
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Your Products...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="myCard">
                {products.length === 0 ? (
                    <div className="emptyWishlist">
                        <img
                            src={emptyProduct}
                            alt="No Products"
                        />

                        <button
                            className="exploreBtn"
                            onClick={() =>
                                navigate("/sell")
                            }
                        >
                            Sell Something Now!
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
                                    </div>

                                    <div
                                        className="cardPriceSection"
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                marginLeft: "8px",
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

                                        <button
                                            style={{
                                                background:
                                                    "lightgreen",
                                                width: "70px",
                                                borderRadius:
                                                    "5px",
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `/edit-product/${item._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <DeleteIcon
                                            sx={{
                                                color: "red",
                                                scale: "1.2",
                                                fontWeight:
                                                    "bold",
                                                cursor: "pointer",
                                                marginLeft:
                                                    "10px",
                                                borderRadius:
                                                    "5px",
                                                border:
                                                    "1px solid black",
                                                position:
                                                    "absolute",
                                                right: "20px",
                                            }}
                                            onClick={() =>
                                                handleDelete(
                                                    item._id
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <button
                    className="floatingSellBtn"
                    onClick={() =>
                        navigate("/sell")
                    }
                >
                    + Sell Item
                </button>
            </div>
        </div>
    );
};

export default MyProducts;
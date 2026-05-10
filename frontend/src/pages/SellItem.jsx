import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SellItem.css";
import { toast } from "react-toastify";
import SellIcon from '@mui/icons-material/Sell';
const API = import.meta.env.VITE_API_URL;

const SellItem = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productDescription: "",
        productName: "",
        productType: "",
        productCategory: "",
        productImage: null,
        originalPrice: "",
        discountedPrice: "",
    });

    const handleChange = (e) => {
        if (e.target.name === "productImage") {
            const productImage = e.target.files[0];

            if (productImage) {
                setPreview(URL.createObjectURL(productImage));
            }

            setFormData({
                ...formData,
                productImage
            });

        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            data.append("productDescription", formData.productDescription);
            data.append("productName", formData.productName);
            data.append("productType", formData.productType);
            data.append("productCategory", formData.productCategory);
            data.append("productImage", formData.productImage);
            data.append("originalPrice", formData.originalPrice);
            data.append("discountedPrice", formData.discountedPrice);
            setLoading(true)
            const res=await axios.post(
                `${API}/api/products/sell`,
                data,
                {
                    withCredentials: true,
                }
            );
            setLoading(false)
            toast.success("Product listed successfully!");
            navigate("/home");


        } catch (error) {
            if (error.response.data.message === "Please complete your profile first to sell products") {
                navigate("/me");
            } else {
                toast.error("Error listing product");
                setLoading(false)
            }
        }
    };


    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Listing Product...</p>
            </div>
        );
    }
    return (
        <div className="sell-container">
            <div className="sell-card">
                <h2 className="sell-title">
                    Sell Your Item
                    <SellIcon
                        style={{
                            marginLeft: "4px",
                            marginBottom: "-4px",
                            scale: "1.3"
                        }}
                    />
                </h2>

                <form className="sell-form" onSubmit={handleSubmit}>

                    {/* Product Name */}
                    <input
                        type="text"
                        name="productName"
                        placeholder="Item Title"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                    />
                    {/* Product Description */}
                    <textarea
                        name="productDescription"
                        placeholder="Product Description..."
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                    {/* Product Type */}
                    <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Product Type</option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                    </select>

                    {/* Product Category */}
                    <select
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="stationary">Stationary</option>
                        <option value="essentials">Essentials</option>
                    </select>

                    <label
                        htmlFor="productImage"
                        style={{ fontWeight: "bolder" }}
                    >
                        Select Your Image
                    </label>

                    <input
                        type="file"
                        name="productImage"
                        onChange={handleChange}
                        required
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }}
                        />
                    )}

                    <div className="row">
                        <input
                            type="number"
                            name="originalPrice"
                            placeholder="Original Price"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="discountedPrice"
                            placeholder="Discounted Price"
                            value={formData.discountedPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">
                        List Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default SellItem;
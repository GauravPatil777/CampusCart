import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/Item.css";
const API = import.meta.env.VITE_API_URL;

const Item = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${API}/api/products/${id}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error?.response?.data?.message
        );
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  const whatsappMessage = `Hello ${
    product.seller?.name
  }, I'm interested in your product "${
    product.productName
  }"`;

  const whatsappLink = `https://wa.me/91${
    product.seller?.contact
  }?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="item-page-wrapper">
      <div className="productSection">
        <div className="item-container">

          {/* LEFT IMAGE */}
          <div className="image-section">
            <div className="image-wrapper">
              <img
                src={product.image}
                alt={product.productName}
              />

              {discount > 0 && (
                <span className="discount-tag">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="content-section">
            <div className="product-header">
              <h1 className="product-title">
                {product.productName}
              </h1>

              <div className="price-group">
                <span className="current-price">
                  ₹{product.discountedPrice}
                </span>

                <span className="original-price">
                  ₹{product.originalPrice}
                </span>
              </div>
            </div>

            <hr className="divider" />

            {/* PRODUCT INFO */}
            <div className="info-card">
              <h3 className="section-title">
                Product Information
              </h3>

              <div className="seller-grid">
                <div className="seller-item">
                  <span>Product Type:</span>
                  <strong>
                    {product.productType || "N/A"}
                  </strong>
                </div>

                <div className="seller-item">
                  <span>Category:</span>
                  <strong>
                    {product.productCategory || "N/A"}
                  </strong>
                </div>

                <div className="seller-item product-description">
                  <span>Description:</span>
                  <strong>
                    {product.productDescription ||
                      "No description available"}
                  </strong>
                </div>
              </div>
            </div>

            {/* SELLER INFO */}
            <div className="info-card">
              <h3 className="section-title">
                Seller Information
              </h3>

              <div className="seller-grid">
                <div className="seller-item">
                  <span>Seller Name:</span>
                  <strong>
                    {product.seller?.name}
                  </strong>
                </div>

                <div className="seller-item">
                  <span>Branch:</span>
                  <strong>
                    {product.seller?.branch}
                  </strong>
                </div>

                <div className="seller-item">
                  <span>Year:</span>
                  <strong>
                    {product.seller?.year} Year
                  </strong>
                </div>

                <div className="seller-item">
                  <span>Semester:</span>
                  <strong>
                    {product.seller?.sem || "N/A"}
                  </strong>
                </div>

                <div className="seller-item">
                  <span>Contact Number:</span>
                  <strong>
                    {product.seller?.contact ||
                      "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            {/* WHATSAPP BUTTON */}
            <div className="message-card">
              <h3 className="section-title">
                Interested? Message the Seller
              </h3>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                Message Seller on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
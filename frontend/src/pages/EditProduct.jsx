import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );

        const p = res.data;

        setProductName(p.productName);
        setProductDescription(p.productDescription);
        setProductCategory(p.productCategory);
        setProductType(p.productType);
        setOriginalPrice(p.originalPrice);
        setDiscountedPrice(p.discountedPrice);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productName", productName);
      formData.append(
        "productDescription",
        productDescription
      );
      formData.append(
        "productCategory",
        productCategory
      );
      formData.append("productType", productType);
      formData.append(
        "originalPrice",
        originalPrice
      );
      formData.append(
        "discountedPrice",
        discountedPrice
      );

      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `http://localhost:3000/api/products/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success("Product updated successfully");
      navigate("/my-products");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Edit Product</h2>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Product Description"
            value={productDescription}
            onChange={(e) =>
              setProductDescription(
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={productCategory}
            onChange={(e) =>
              setProductCategory(
                e.target.value
              )
            }
            required
          />

          <select
            value={productType}
            onChange={(e) =>
              setProductType(e.target.value)
            }
            required
          >
            <option value="">
              Select Product Type
            </option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <input
            type="number"
            placeholder="Original Price"
            value={originalPrice}
            onChange={(e) =>
              setOriginalPrice(
                e.target.value
              )
            }
            required
          />

          <input
            type="number"
            placeholder="Discounted Price"
            value={discountedPrice}
            onChange={(e) =>
              setDiscountedPrice(
                e.target.value
              )
            }
            required
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
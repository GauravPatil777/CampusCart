import { Router } from "express";
import { fetchProducts, sellProduct, fetchProduct, fetchMyProducts, deleteProduct, searchProducts, updateProduct } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "college-sell-app",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });
const router = Router()
router.get("/", fetchProducts);
// Rule: always put specific routes before dynamic routes
router.get("/my-products", authMiddleware, fetchMyProducts);
router.get("/search", searchProducts)
router.post("/sell", authMiddleware, upload.single("productImage"), sellProduct)
router.put("/:id",authMiddleware, upload.single("productImage"),updateProduct)
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", fetchProduct);


export default router
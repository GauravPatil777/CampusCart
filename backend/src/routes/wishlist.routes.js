import { Router } from "express";
import { addToWishlist, getAllWishlist, removeFromWishlist } from "../controllers/wishlit.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router()

// Add to wishlist
router.post("/", authMiddleware, addToWishlist);

// Get wishlist
router.get("/", authMiddleware, getAllWishlist);

// Remove from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

export default router;
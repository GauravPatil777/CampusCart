import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateProfile } from "../controllers/user.controller.js";
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
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.put("/update-profile", authMiddleware, upload.single("profilePic"), updateProfile);
// router.post("/resend-otp", resendOtp);
// router.post("/verify-otp", verifyOtp);
router.get("/me", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to dashboard", user: req.user });
});


export default router;

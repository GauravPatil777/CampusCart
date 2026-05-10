import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from './routes/user.routes.js';
import productRoutes from "./routes/product.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import cookieParser from "cookie-parser"


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin:[ "https://campus-cart-theta.vercel.app","http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "20kb", extended: true }));

app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/wishlist",wishlistRoutes);

// Routes
app.get("/", (req, res) => {
    res.send("App is working");
});

// DB + Server Start
const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Mongo URI not found");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1); // exit if DB fails
    }
};

startServer();
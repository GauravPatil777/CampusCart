import userModel from "../models/user.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ message: "ProductId is required" });
        }

        await userModel.findByIdAndUpdate(userId, {
            $addToSet: { wishlist: productId }
        });

        return res.status(200).json({
            success: true,
            message: "Added to wishlist"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAllWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).populate("wishlist")
        return res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ message: "ProductId is required" });
        }

        await userModel.findByIdAndUpdate(userId, {
            $pull: { wishlist: productId }
        });

        return res.status(200).json({
            success: true,
            message: "Removed to wishlist"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
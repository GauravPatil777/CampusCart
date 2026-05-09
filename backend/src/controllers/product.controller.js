import productModel from './../models/product.model.js';
import cloudinary from "../config/cloudinary.js"
import userModel from '../models/user.model.js';
export const sellProduct = async (req, res) => {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const { productName, originalPrice, discountedPrice,productType,productCategory,productDescription } = req.body
    if (!productName || !originalPrice || !discountedPrice) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(!user.year || !user.branch || !user.sem){
        return res.status(400).json({ message: "Please complete your profile first to sell products" });
    }
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await await cloudinary.uploader.upload(file.path)
        const ImageUrl = result.secure_url;
        const product = await productModel.create(
            {
                productName: productName.trim(),
                productDescription: productDescription.trim(),
                originalPrice: Number(originalPrice),
                discountedPrice: Number(discountedPrice),
                productType,
                productCategory,
                image: ImageUrl,
                seller: req.user?._id || null
            }
        );
        res.status(201).json(
            {
                message: "Product listed successfully",
                product
            }
        )
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }

}

export const fetchProducts = async (req, res) => {
    try {
        const products = await productModel
            .find()
            .populate("seller", "name branch year ");

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const fetchProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id).populate("seller", "name branch year sem contact");
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const deleteProduct = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const product = await productModel.findOneAndDelete({ _id: id, seller: userId });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const fetchMyProducts = async (req, res) => {
    const userId = req.user.id;
    try {
        const products = await productModel.find({ seller: userId });
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        let results = [];
        if (query.trim()) {
            results = await productModel.find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } })
            if (results.length === 0) {
                results = await productModel.find({
                    productName: { $regex: query, $options: "i" }
                });
            }
        }
        res.json(results)
    } catch (error) {
        console.error("Search API error:", error);
        res.status(500).json({ message: "Search error" });
    }

}


export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Only seller can edit
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    product.productName =
      req.body.productName || product.productName;

    product.productDescription =
      req.body.productDescription ||
      product.productDescription;

    product.productCategory =
      req.body.productCategory ||
      product.productCategory;

    product.productType =
      req.body.productType || product.productType;

    product.originalPrice =
      req.body.originalPrice ||
      product.originalPrice;

    product.discountedPrice =
      req.body.discountedPrice ||
      product.discountedPrice;

    // If new image uploaded
    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
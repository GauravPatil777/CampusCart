import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productDescription: {
        type: String,
        required: true,
        trim: true
    },
    productCategory: {
        type: String,
        required: true,
        trim: true
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    productType: {
        type:String,
        required:true,
        trim:true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1609697299491-69d2d5ed2c36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2NpZWNudGlmaWMlMjBjYWxjfGVufDB8fDB8fHww"
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true }).index({
    productName: "text"
})

const productModel = mongoose.model("Product", productSchema)
export default productModel
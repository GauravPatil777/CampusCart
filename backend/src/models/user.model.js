import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  // Optional: user can fill later in profile
  branch: {
    type: String,
    default: "",
  },

  year: {
    type: Number,
    default: null,
  },

  sem: {
    type: Number,
    default: null,
  },

  profilePic: {
    type: String,
    default: "",
  },
  contact: {
    type: String,
    min: 10,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  otpExpiry: Date,

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;
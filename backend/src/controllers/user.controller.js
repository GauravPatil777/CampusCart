import bcrypt from 'bcrypt';
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../config/cloudinary.js"

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExist = await userModel.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP expiry = 1 minute
        const otpExpiry = Date.now() + 1 * 60 * 1000;

        const user = await userModel.create({
            name,
            email,
            otp,
            otpExpiry,
            isVerified: false,
            password: hash,
        });

        // Email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Send OTP email
        try {
            await transporter.sendMail({
                from: `"SellIt App" <${process.env.EMAIL}>`,
                to: email,
                subject: "Verify Your Email",

                text: `Your OTP is ${otp}. It is valid for 1 minute.`,

                headers: {
                    "X-Priority": "1",
                    "X-MSMail-Priority": "High",
                    "Importance": "high",
                },

                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
                    <h2 style="color: #111827;">
                        SellIt Email Verification
                    </h2>

                    <p style="font-size: 16px; color: #374151;">
                        Use the OTP below to verify your email:
                    </p>

                    <div style="
                        font-size: 36px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        color: #4f46e5;
                        background: #eef2ff;
                        display: inline-block;
                        padding: 12px 20px;
                        border-radius: 8px;
                        margin: 15px 0;
                    ">
                        ${otp}
                    </div>

                    <p style="color: #6b7280;">
                        This OTP is valid for <b>1 minute</b>.
                    </p>

                    <hr style="margin: 20px 0;" />

                    <p style="font-size: 12px; color: #9ca3af;">
                        If you did not request this, you can ignore this email.
                    </p>
                </div>
                `,
            });
        } catch (mailError) {
            console.log(mailError);
        }

        return res.status(201).json({
            message: "User registered successfully. OTP sent to email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // generate 6 digit otp
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email already verified"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // expiry = 1 min
        const otpExpiry = Date.now() + 1 * 60 * 1000;

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // send email
        try {
            await transporter.sendMail({
                from: `"SellIt App" <${process.env.EMAIL}>`,
                to: email,
                subject: "Verify Your Email",

                // helps Gmail fallback display if HTML fails
                text: `Your OTP is ${otp}. It is valid for 1 minute.`,

                headers: {
                    "X-Priority": "1",
                    "X-MSMail-Priority": "High",
                    "Importance": "high",
                },

                html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
      
      <h2 style="color: #111827;">SellIt Email Verification</h2>
      
      <p style="font-size: 16px; color: #374151;">
        Use the OTP below to verify your email:
      </p>

      <div style="
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #4f46e5;
        background: #eef2ff;
        display: inline-block;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
      ">
        ${otp}
      </div>

      <p style="color: #6b7280;">
        This OTP is valid for <b>1 minute</b>.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 12px; color: #9ca3af;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `,
            });

        } catch (mailError) {
            console.log(mailError);
        }
        return res.status(200).json({
            message: "OTP resent successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }


}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        if (user.otp != otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
            message: "Email verified successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "please provide info" });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Email not verified",
                user: {
                    email: user.email,
                    isVerified: false
                }
            });
        }

        // if password valid
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,        // true in production (HTTPS)
            sameSite: "None",      // helps with CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            }
        });

    } catch (error) {
        res.json(`something went wrong ${error}`)
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { branch, year, semester, contact } = req.body;
        const userId = req.user.id;
        const updateData = {};

        // Add only provided fields
        if (branch) updateData.branch = branch;
        if (year) updateData.year = year;
        if (semester) updateData.sem = semester;
        if (contact) updateData.contact = contact;

        // If image uploaded
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.profilePic = result.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        res.json(`something went wrong ${error}`)
    }
}
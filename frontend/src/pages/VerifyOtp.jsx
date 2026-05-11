import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/verifyOtp.css";
import { useAuth } from '../hooks/useAuth';
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;
const VerifyOtp = () => {

  const { user, setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  //  resend timer
  const [timer, setTimer] = useState(60 * 5);

  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    return () => setTimer(60 * 5);
  }, []);
  //  countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  //  verify otp
  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/users/verify-otp`,
        { email, otp: otp.trim() },
        { withCredentials: true }
      );

      setUser(res.data.user);

      toast.success("OTP verified successfully. You are now logged in.");

      navigate("/home");

    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
      setOtp("");

    } finally {
      setLoading(false);
    }
  };

  //  resend otp
  const resendOtp = async () => {
    try {
      setResendLoading(true);

      await axios.post(
        `${API}/api/users/resend-otp`,
        { email },
        { withCredentials: true }
      );


      setTimer(60 * 5);

    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to resend OTP");

    } finally {
      setResendLoading(false);
    }
  };
  return (
    <div className="otp-container">

      <div className="otp-card">

        <div className="otp-icon">📩</div>

        <h2>Verify Your Email</h2>

        <p className="otp-subtitle">
          We sent a 6-digit code to
        </p>

        <span className="otp-email">{email}</span>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only numbers
            setOtp(value);
          }}
          maxLength={6}
          className="otp-input"
        />
        <p style={{ fontSize: "18px", color: "black", margin: "5px" }}>
          You can also enter <b>123456</b> as otp if didn't recieve.
        </p>
        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="verify-btn"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="resend-section">

          <p>
            Didn't get the code? Check spam or resend it.
          </p>

          <button
            onClick={resendOtp}
            disabled={timer > 0 || resendLoading}
            className={`resend-btn ${timer > 0 ? "disabled-btn" : ""
              }`}
          >
            {resendLoading
              ? "Sending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default VerifyOtp;
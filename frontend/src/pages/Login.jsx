import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from "react-toastify";
import axios from 'axios'
import "../styles/loginForm.css"
import loginImg from "../assets/login.jpg"
const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const img = new Image();
    img.src = loginImg;
    img.onload = () => {
      setImgLoaded(true);
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("All fields are required");
    }
    setLoading(true)
    try {
      setError("");
      const data = await handleLogin({
        email,
        password
      });

      // clear only after successful verified login
      setEmail("");
      setPassword("");
      setLoading(false)
      navigate("/home");

    } catch (error) {

      // if email not verified
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.user?.isVerified === false
      ) {
        const res=await axios.post(
          `${API}/api/users/resend-otp`,
          { email: error.response.data.user.email },
          { withCredentials: true }
        );
        console.log(res);
        toast.info("OTP resent to your email. Please verify to login.");
        navigate("/verify-otp", {
          state: {
            email: error.response.data.user.email
          }
        });

        return;
      }
      setLoading(false)
      setError(
        error?.response?.data?.message || "Login failed"
      );
    }
  };
  return (
    <div className='authContainer'>
      <div className="left">
        {!imgLoaded && <div className="imageSkeleton" />}
        <img
          src={loginImg}
          alt="LoginImage"
          onLoad={() => setImgLoaded(true)} />
      </div>
      <div className='right'>
        <div className='authbox'>

          {/* LOGO */}
          <div
            className="appHead"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {/* Logo Icon */}
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "lightgreen",
                borderRadius: "10px",
                boxShadow: "0 4px 3px rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cart Body */}
                <path
                  d="M40 60 H150 L135 120 H60 L40 60Z"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Wheels (UPDATED opacity) */}
                <circle cx="70" cy="145" r="8" fill="#8B5CF6" opacity="0.9" />
                <circle cx="120" cy="145" r="8" fill="#8B5CF6" opacity="0.9" />

                {/* Handle */}
                <path
                  d="M40 60 L30 40"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Graduation Cap */}
                <path d="M60 40 L100 25 L140 40 L100 55 Z" fill="#3B82F6" />

                {/* Tassel */}
                <line x1="140" y1="40" x2="150" y2="55" stroke="#FACC15" strokeWidth="3" />
                <circle cx="150" cy="58" r="3" fill="#FACC15" />
              </svg>
            </div>

            {/* App Name */}
            <h1
              style={{
                fontStyle: "oblique",
                fontSize: "33px",
                fontWeight: "750",
                margin: 0,
              }}
            >
              Campus<span style={{ color: "#3B82F6" }}>Cart</span>
            </h1>
          </div>

          <h1>Login</h1>
          {error && <p style={{ color: "red",fontWeight:"bold" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className='inputbox'>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id='email'
                placeholder='Enter Your Email'
                value={email}
                onChange={(e) => {setEmail(e.target.value)
                   setError("")
                }}
                required
              />
            </div>

            <div className='inputbox'>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => {setPassword(e.target.value)
                  setError("")
                }}
                required
              />
            </div>
            <button type='submit'>
              {loading?"⏳ Logging in...":"Login"}
            </button>

            <p>Don't have an account?<Link to="/register" style={{ color: "white", background: "red", borderRadius: "10px", padding: "3px", textDecorationLine: "none", margin: "2px" }} >SignUp</Link></p>
          </form>
        </div>
      </div>

    </div>
  )
}
export default Login
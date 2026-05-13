import React, { useContext } from 'react'
import { AuthContext } from "../contexts/auth.context.jsx"
import { register, login, logout } from '../services/auth.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export const useAuth = () => {
  const navigate=useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const handleRegister = async ({ name, email, password,year,branch,sem }) => {
    try {
      const data = await register({ name, email, password,year,branch,sem })
      if (data) {
        setUser(data.user)
      }
    } catch (error) {
      const message = error?.response.data.message;
      // throw message
      throw error
    }

  }
  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password })
      if (data) {
        setUser(data.user)
      }
      return data;
    } catch (error) {
      const message = error?.response.data.message;
      // throw message
      throw error
    }

  }
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null)
      toast.success("Logged out successfully");
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return {
    user,setUser, handleLogin, handleLogout, handleRegister
  }
}


import { createContext, useState, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // important

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API}/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user); // store full user
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
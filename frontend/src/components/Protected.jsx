import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../contexts/auth.context";

const Protected = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const {setUser}=useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res=await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        const name=res.data.user.name;
        setUser(name);
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

 



if (loading) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <CircularProgress />
    </div>
  );
}
  return isAuth ? children : <Navigate to="/login" />;
};

export default Protected;
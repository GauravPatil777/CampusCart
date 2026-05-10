import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const searchProducts = async (query) =>{
    const res=await axios.get(`${API}/api/products/search?q=${query}`);
    return res.data;
}
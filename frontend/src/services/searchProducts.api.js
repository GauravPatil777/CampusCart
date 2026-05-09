import axios from "axios";

export const searchProducts = async (query) =>{
    const res=await axios.get(`http://localhost:3000/api/products/search?q=${query}`);
    return res.data;
}
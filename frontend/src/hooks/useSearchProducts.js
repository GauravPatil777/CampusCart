import { useState } from "react";
import { searchProducts } from "../services/searchProducts.api";
import { toast } from "react-toastify";

export const useSearchProducts = () => {
    const [loadingState, setLoadingState] = useState(false)
    const [searchedProducts, setSearchedProducts] = useState([]);

    const search =async (query) => {
        setLoadingState(true);
        const data=await searchProducts(query);
        setSearchedProducts(data);
        setLoadingState(false);
        return data;
    }
    return { loadingState, searchedProducts, search };
}
import { createContext, useContext,useState } from "react";

const searchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([]);

    return (<searchContext.Provider value={{ query, setQuery, results, setResults }}>
        {children}
    </searchContext.Provider >);
}


export const useSearch = () => useContext(searchContext);
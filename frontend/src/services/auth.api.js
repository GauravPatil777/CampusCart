import axios from "axios"
const API = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API}/api/users`,
    withCredentials: true
})

export const register = async ({ name, email, password,year,branch,sem }) => {

    try {
        const res = await api.post("/register", { name, email, password,year,branch,sem })
        return res.data;
    } catch (error) {
        throw error
    }
}

export const login = async ({ email, password }) => {

    try {
        const res = await api.post("/login", { email, password })
        return res.data;
    } catch (error) {
        throw error
    }
}

export async function logout() {
    try {
        const res = await api.post("/logout")
        return res.data
    } catch (error) {
        throw error;
    }
}
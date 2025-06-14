import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://artnova-backend.onrender.com",
    withCredentials: true,
})

export default apiRequest

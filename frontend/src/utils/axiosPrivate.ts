import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;;

const axiosPrivate = axios.create({
    baseURL,
    withCredentials: true
});

export default axiosPrivate;
import axios from "axios";

const baseURL = "http://localhost:8000";

const axiosPrivate = axios.create({
    baseURL,
    withCredentials: true
});

export default axiosPrivate;
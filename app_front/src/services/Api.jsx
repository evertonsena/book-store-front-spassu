import axios from "axios";
import { getToken, logout } from "./auth";

const Api = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_PROD_API_URL
            : process.env.REACT_APP_DEV_API_URL,
    validateStatus: function(status) {
        if (status === 401) {
            logout();
        }
        return true;
    }
});

Api.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api;

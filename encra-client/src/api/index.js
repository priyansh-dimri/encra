import axios from "axios";
import { useAuth } from "../context/useAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_ENCRA_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isCSRFSet = false;

api.interceptors.request.use(async (config) => {
  const data = useAuth();
  const { authData, setTokens } = data;

  if (!isCSRFSet) {
    const res = await axios.get("/auth/csrf-token", { withCredentials: true });
    const csrfToken = res.data.csrfToken;
    setTokens(null, csrfToken);
    isCSRFSet = true;
  }

  if (authData.csrfToken) {
    config.headers["X-CSRF-Token"] = authData.csrfToken;
  }
  return config;
});

export default api;

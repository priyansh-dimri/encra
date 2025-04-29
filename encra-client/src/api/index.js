import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_ENCRA_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const setupAxiosInterceptors = (authData, setTokens, navigate) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 403 && !originalRequest._retry) {
        if (!authData.csrfToken) {
          return;
        }
        originalRequest._retry = true;

        try {
          console.log(authData.csrfToken);
          const refreshResponse = await api.post(
            "/auth/refresh",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                "x-csrf-token": authData.csrfToken,
              },
              withCredentials: true,
            }
          );

          const newAuthToken = refreshResponse.data.authToken;
          setTokens(newAuthToken, null);

          originalRequest.headers["Authorization"] = `Bearer ${newAuthToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await api.post(
            "/auth/logout",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                "x-csrf-token": authData.csrfToken,
              },
              withCredentials: true,
            }
          );
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;

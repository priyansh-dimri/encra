import api from "../api";

export const fetchCsrfToken = () =>
  api.get("/auth/csrf-token", { withCredentials: true });

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerRequest = (data) => api.post("/auth/register", data);

export const logoutRequest = () =>
  api.post("/logout", null, { withCredentials: true });

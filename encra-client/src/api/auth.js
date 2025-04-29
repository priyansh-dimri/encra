import api from "../api";

export const fetchCsrfToken = () =>
  api.get("/auth/csrf-token", { withCredentials: true });

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password }, { withCredentials: true });

export const registerRequest = (data) =>
  api.post("/auth/register", data, { withCredentials: true });

export const logoutRequest = (csrfToken) =>
  api.post(
    "/auth/logout",
    {},
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );

export const refreshToken = async (csrfToken) => {
  if(!csrfToken) return;
  const res = await api.post(
    "/auth/refresh",
    {},
    {
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return res.data.accessToken;
};

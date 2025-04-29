import { io } from "socket.io-client";
import { refreshToken } from "../api/auth";

let socket = null;

export function initSocket(initialToken, csrfToken, setTokens, logout) {
  socket = io(import.meta.env.VITE_ENCRA_SOCKET_URL, {
    auth: { token: initialToken },
    withCredentials: true,
    autoConnect: false,
  });

  socket.on("connect_error", async (err) => {
    console.error("Socket connection error:", err.message);
    if (err.message === "AUTH_FAILED" || err.message === "AUTH_REQUIRED") {
      console.warn("Socket auth failed, attempting token refresh...");

      try {
        const newToken = await refreshToken(csrfToken);
        setTokens(newToken, null);
        socket.auth = { token: newToken };
        socket.connect();
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        logout();
      }
    }
  });

  socket.connect();
  return socket;
}

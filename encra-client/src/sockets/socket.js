import { io } from "socket.io-client";

export function initSocket(token) {
  return io(import.meta.env.VITE_ENCRA_SOCKET_URL, {
    auth: { token },
    withCredentials: true,
  });
}

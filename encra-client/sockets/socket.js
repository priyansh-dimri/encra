import { io } from "socket.io-client";

let socket = null;

export function initSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_ENCRA_API_URL, {
      auth: { token },
      withCredentials: true,
    });
  }
  return socket;
}

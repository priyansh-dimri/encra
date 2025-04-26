import { useEffect, useRef } from "react";
import { initSocket } from "../sockets/socket";

const useChatSocket = ({
  token,
  activeConversation,
  setMessages,
  fetchConversations,
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const sock = initSocket(token);
    socketRef.current = sock;

    sock.onAny((e, ...args) => {
      console.log("⏺ socket event:", e, args);
    });

    sock.on("connect", () => {
      console.log("✅ socket connected:", sock.id);
      if (activeConversation) {
        sock.emit("joinRoom", activeConversation);
      }
    });

    sock.on("message:receive", (msg) => {
      console.log("📩 got message", msg);
      if (msg.chat.toString() === activeConversation) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    sock.on("conversation:invite", () => {
      console.log("🎟 got conversation invite");
      fetchConversations(token);
    });

    sock.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      sock.disconnect();
    };
  }, [token, activeConversation, setMessages, fetchConversations]);

  // Re-join room when activeConversation changes
  useEffect(() => {
    if (!socketRef.current || !activeConversation) return;
    console.log("Rejoining room:", activeConversation);
    socketRef.current.emit("joinRoom", activeConversation);
  }, [activeConversation]);
};

export default useChatSocket;

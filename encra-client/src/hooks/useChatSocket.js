import { useEffect } from "react";
import { initSocket } from "../sockets/socket";

export default function useChatSocket({
  token,
  onNewMessage,
  onConversationInvite,
}) {
  useEffect(() => {
    const sock = initSocket(token);
    if (onNewMessage) {
      sock.on("message:receive", onNewMessage);
    }
    if (onConversationInvite) {
      sock.on("conversation:updated", onConversationInvite);
    }

    return () => {
      if (onNewMessage) {
        sock.off("message:receive", onNewMessage);
      }
      if (onConversationInvite) {
        sock.off("conversation:updated", onConversationInvite);
      }
    };
  }, [token, onNewMessage, onConversationInvite]);
}

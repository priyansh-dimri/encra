import ChatHeader from "./chat/ChatHeader";
import MessagesArea from "./chat/MessagesArea";
import MessageInput from "./chat/MessageInput";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import { generateAesKeyFromHash } from "../../utils/encryption";

const ChatWindow = ({ topBarHeight, messages, activeConversation, socket }) => {
  const { authData } = useAuth();
  console.log(authData.aesKeys);
  const [aesKey, setAesKey] = useState();
  useEffect(() => {
    const loadKey = async () => {
      const aesKeyEntry = authData.aesKeys.find(
        (e) => e.conversationId === activeConversation
      );
      if (aesKeyEntry?.aesKey) {
        const key = await generateAesKeyFromHash(aesKeyEntry.aesKey);
        setAesKey(key);
      } else {
        setAesKey(null);
      }
    };

    if (activeConversation) {
      loadKey();
    }
  }, [activeConversation, authData.aesKeys]);
  // 1. Header with recipient name + username + menu icon
  // 2. Scrollable messages area
  // 3. Bottom message input box with send button
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader topBarHeight={topBarHeight} />
      <MessagesArea
        messages={messages}
        activeConversation={activeConversation}
        aesKey={aesKey}
      />
      <MessageInput
        activeConversation={activeConversation}
        socket={socket}
        aesKey={aesKey}
      />
    </div>
  );
};

export default ChatWindow;

import React, { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { getConversations, getMessages } from "../api/chat/message";
import { useAuth } from "../context/useAuth";
import useChatSocket from "../hooks/useChatSocket";

const TOP_BAR_HEIGHT = 64;
const ChatPage = ({ mode, toggleTheme }) => {
  const { authData } = useAuth();
  const token = authData.accessToken;
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      try {
        const res = await getMessages(activeConversation);
        setMessages(res.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  useChatSocket({
    token,
    onNewMessage: (message) => {
      if (message.chatId === activeConversation) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    },

    onConversationInvite: () => {
      fetchConversations();
    },
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        topBarHeight={TOP_BAR_HEIGHT}
        mode={mode}
        toggleTheme={toggleTheme}
        conversations={conversations}
        setActiveConversation={setActiveConversation}
        activeConversation={activeConversation}
      />
      <ChatWindow
        topBarHeight={TOP_BAR_HEIGHT}
        messages={messages}
        activeConversation={activeConversation}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatPage;

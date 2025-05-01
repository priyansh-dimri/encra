import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import WelcomeModal from "../components/chat/WelcomeModal";
import { getConversations } from "../api/chat/conversation";
import { getMessages } from "../api/chat/message";
import { useAuth } from "../context/useAuth";
import { initSocket } from "../sockets/socket";
import { useMediaQuery, useTheme } from "@mui/material";

const TOP_BAR_HEIGHT = 64;
const ChatPage = ({ mode, toggleTheme }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { authData, setTokens, clearAuthData } = useAuth();
  const token = authData.accessToken;
  const csrfToken = authData.csrfToken;

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [socket, setSocket] = useState(null);
  const [activeView, setActiveView] = useState("sidebar");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const requiredKeys = [
      "dilithiumPrivateKey",
      "kyberPrivateKey",
      "encraSalt",
    ];
    const missingKey = requiredKeys.find((key) => !localStorage.getItem(key));

    if (missingKey) {
      navigate("/login", {
        replace: true,
        state: { missing: missingKey },
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.justRegistered) {
      setShowWelcome(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchConversations = async (accessToken) => {
    try {
      const res = await getConversations(accessToken);
      setConversations(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations(token);
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      try {
        const res = await getMessages(token, activeConversation);
        setMessages(res.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [token, activeConversation]);

  useEffect(() => {
    const logout = () => {
      clearAuthData();

      navigate("/login", { replace: true });
    };
    if (!token) return;
    const sock = initSocket(token, csrfToken, setTokens, logout);
    setSocket(sock);

    sock.on("connect", () => {
      console.log("socket connected:", sock.id);
      if (activeConversation) {
        sock.emit("joinRoom", activeConversation);
      }
    });

    const rejoin = (conv) => {
      console.log("joining room", conv);
      sock.emit("joinRoom", conv);
    };
    if (activeConversation) rejoin(activeConversation);

    sock.on("conversation:invite", () => fetchConversations(token));

    if (activeConversation) {
      sock.on("message:receive", (msg) => {
        console.log("Message received: ", msg);
        if (msg.chat.toString() === activeConversation) {
          setMessages((m) => [...m, msg]);
        }
      });

      sock.on("message:delete", ({ messageId }) => {
        console.log("Message deleted via socket:", messageId);
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      });
    }

    sock.on("conversation:delete", ({ conversationId }) => {
      console.log("Conversation deleted via socket:", conversationId);
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
      if (conversationId === activeConversation) {
        setActiveConversation(null);
        setMessages([]);
      }
    });

    // cleanup
    return () => {
      sock.disconnect();
    };
  }, [
    token,
    activeConversation,
    csrfToken,
    setTokens,
    clearAuthData,
    navigate,
  ]);

  return (
    <>
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        {(isMdUp || activeView === "sidebar") && (
          <Sidebar
            topBarHeight={TOP_BAR_HEIGHT}
            mode={mode}
            toggleTheme={toggleTheme}
            conversations={conversations}
            setConversations={setConversations}
            setActiveConversation={(id) => {
              setActiveConversation(id);
              if (!isMdUp) setActiveView("chat");
            }}
            activeConversation={activeConversation}
            setActiveView={setActiveView}
          />
        )}

        {(isMdUp || activeView === "chat") && (
          <ChatWindow
            topBarHeight={TOP_BAR_HEIGHT}
            messages={messages}
            activeConversation={activeConversation}
            setMessages={setMessages}
            socket={socket}
            conversations={conversations}
            setActiveView={setActiveView}
          />
        )}
      </div>
      <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} />
    </>
  );
};

export default ChatPage;

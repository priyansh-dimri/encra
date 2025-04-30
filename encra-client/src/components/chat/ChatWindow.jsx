import ChatHeader from "./chat/ChatHeader";
import MessagesArea from "./chat/MessagesArea";
import MessageInput from "./chat/MessageInput";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import { generateAesKeyFromHash } from "../../utils/encryption";
import { getMessages } from "../../api/chat/message";

const ChatWindow = ({
  topBarHeight,
  messages,
  setMessages,
  activeConversation,
  socket,
  conversations,
  setActiveView,
}) => {
  const { authData } = useAuth();
  const [aesKey, setAesKey] = useState();
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  useEffect(() => {
    if (activeConversation) {
      setHasMoreMessages(true);
    }
  }, [activeConversation]);

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

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!activeConversation) return;

      try {
        const res = await getMessages(authData.accessToken, activeConversation);

        if (res.length > 0) {
          res.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(res);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading initial messages:", error);
      }
    };

    loadInitialMessages();
  }, [activeConversation, authData.accessToken, setMessages]);

  const handleScroll = async (container) => {
    if (!container || !hasMoreMessages || fetchingMore) return;

    if (container.scrollTop <= 20) {
      console.log("HERE!");
      await loadOlderMessages();
    }
  };

  const loadOlderMessages = async () => {
    if (!messages.length || !activeConversation) return;

    try {
      setFetchingMore(true);

      const oldestMessage = messages[0];
      const before = oldestMessage.createdAt;

      const res = await getMessages(
        authData.accessToken,
        activeConversation,
        before
      );

      if (res.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const filteredNewMessages = res.filter(
            (msg) => !existingIds.has(msg._id)
          );

          if (filteredNewMessages.length > 0) {
            const mergedMessages = [...filteredNewMessages, ...prev];
            mergedMessages.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            return mergedMessages;
          }

          return prev;
        });
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setFetchingMore(false);
    }
  };

  const deleteMessageUsingId = (messageId) => {
    if (!socket || !activeConversation) return;

    socket.emit("message:delete", {
      messageId,
      conversationId: activeConversation,
    });
  };

  const deleteConvoUsingId = () => {
    if (!socket) return;

    socket.emit("conversation:delete", {
      conversationId: activeConversation,
    });
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader
        topBarHeight={topBarHeight}
        conversations={conversations}
        activeConversation={activeConversation}
        deleteConvoUsingId={deleteConvoUsingId}
        setActiveView={setActiveView}
      />
      <MessagesArea
        messages={messages}
        aesKey={aesKey}
        myUserId={authData.myUserId}
        onScroll={handleScroll}
        fetchingMore={fetchingMore}
        deleteMessageUsingId={deleteMessageUsingId}
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

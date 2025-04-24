import ChatHeader from "./chat/ChatHeader";
import MessagesArea from "./chat/MessagesArea";
import MessageInput from "./chat/MessageInput";

const ChatWindow = ({
  topBarHeight,
  messages,
  activeConversation,
  setMessages,
}) => {
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
      <MessagesArea />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

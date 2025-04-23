import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
const TOP_BAR_HEIGHT = 64;

const ChatPage = ({mode, toggleTheme}) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left panel: Recent chats, search, Encra branding */}
      <Sidebar topBarHeight={TOP_BAR_HEIGHT} mode={mode} toggleTheme={toggleTheme} />

      {/* Right panel: Active chat window with header, messages, and input */}
      <ChatWindow topBarHeight={TOP_BAR_HEIGHT} />
    </div>
  );
};

export default ChatPage;

import TopBar from "./sidebar/TopBar";
import SearchBar from "./sidebar/SearchBar";
import RecentChats from "./sidebar/RecentChats";
import { useTheme } from "@emotion/react";

const Sidebar = ({
  topbarHeight,
  mode,
  toggleTheme,
  conversations,
  setActiveConversation,
  activeConversation,
}) => {
  const theme = useTheme();
  // 1. Top section with "Encra" and theme toggler
  // 2. Search bar (only for starting new chats)
  // 3. List of recent conversations with unread indicators
  return (
    <div
      style={{
        width: "300px",
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <TopBar height={topbarHeight} mode={mode} toggleTheme={toggleTheme} />
      <SearchBar />
      <RecentChats />
    </div>
  );
};

export default Sidebar;

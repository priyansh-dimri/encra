import TopBar from "./sidebar/TopBar";
import SearchBar from "./sidebar/SearchBar";
import RecentChats from "./sidebar/RecentChats";
import { Box, useTheme, useMediaQuery } from "@mui/material";

const Sidebar = ({
  topbarHeight,
  mode,
  toggleTheme,
  conversations,
  setConversations,
  setActiveConversation,
  activeConversation,
  setActiveView,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 300 },
        borderRight: isMdUp ? `1px solid ${theme.palette.divider}` : "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <TopBar height={topbarHeight} mode={mode} toggleTheme={toggleTheme} />
      <SearchBar
        setConversations={setConversations}
        setActiveConversation={(id) => {
          setActiveConversation(id);
          if (!isMdUp) setActiveView("chat");
        }}
      />
      <RecentChats
        conversations={conversations}
        setActiveConversation={(id) => {
          setActiveConversation(id);
          if (!isMdUp) setActiveView("chat");
        }}
        activeConversation={activeConversation}
      />
    </Box>
  );
};

export default Sidebar;

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { motion } from "framer-motion";

const RecentChats = ({
  conversations,
  setActiveConversation,
  activeConversation,
}) => {
  const theme = useTheme();
  console.log(conversations);
  console.log(activeConversation);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
      }}
    >
      {conversations.map((chat) => {
        const isActive = activeConversation === chat?._id;

        return (
          <Box
            key={chat._id}
            onClick={() => setActiveConversation(chat?._id)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              cursor: "pointer",
              backgroundColor: isActive
                ? theme.palette.action.selected
                : "transparent",
              borderLeft: isActive
                ? `4px solid ${theme.palette.primary.main}`
                : "4px solid transparent",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="text.primary"
                noWrap
              >
                @{chat.otherUser.username}
              </Typography>
              {chat.otherUser.name && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ fontWeight: 400 }}
                >
                  {chat.otherUser.name}
                </Typography>
              )}
            </Box>

            {chat.hasUnread && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FiberManualRecordIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: "0.75rem",
                  }}
                />
              </motion.div>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default RecentChats;

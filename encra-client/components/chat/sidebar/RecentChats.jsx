import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { motion } from "framer-motion";

// Dummy data for now
const recentChats = [
  { id: 1, username: "johndoe", name: "John Doe", hasUnread: true },
  { id: 2, username: "janedoe", name: "Jane Doe", hasUnread: false },
  { id: 3, username: "alice", name: "Alice", hasUnread: true },
  { id: 4, username: "bob", name: "Bob Doe", hasUnread: true },
  { id: 5, username: "Someone", name: "Someone Doe", hasUnread: false },
  { id: 6, username: "Doe", name: "Doe", hasUnread: true },
];

const RecentChats = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
      }}
    >
      {recentChats.map((chat) => (
        <Box
          key={chat.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
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
              @{chat.username}
            </Typography>
            {chat.name && (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ fontWeight: 400 }}
              >
                {chat.name}
              </Typography>
            )}
          </Box>

          {chat.hasUnread && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
      ))}
    </Box>
  );
};

export default RecentChats;

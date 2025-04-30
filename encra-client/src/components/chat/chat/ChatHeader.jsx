import React, { useState } from "react";
import AccountModal from "./AccountModal";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  MenuItem,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = ({ topBarHeight, conversations, activeConversation }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const activeChat = conversations.find((c) => c._id === activeConversation);
  const otherUser = activeChat?.otherUser;

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        height: `${topBarHeight + 0.9}px`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        position: "relative",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {otherUser?.username ? `@${otherUser.username}` : ""}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {otherUser?.name || ""}
        </Typography>
      </Box>

      <Box>
        <IconButton onClick={handleToggle}>
          <MoreVertIcon />
        </IconButton>

        <AnimatePresence>
          {open && (
            <ClickAwayListener onClickAway={handleClose}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "1rem",
                  zIndex: 10,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{ borderRadius: 3, overflow: "hidden", p: 2 }}
                >
                  {activeConversation && (
                    <>
                      <MenuItem
                        onClick={handleClose}
                        sx={{ p: 2, borderRadius: 3 }}
                      >
                        <InfoOutlinedIcon
                          sx={{ mr: 1, color: theme.palette.primary.main }}
                        />
                        Info
                      </MenuItem>
                      <MenuItem
                        onClick={handleClose}
                        sx={{ p: 2, borderRadius: 3 }}
                      >
                        <DeleteOutlineIcon
                          sx={{ mr: 1, color: theme.palette.secondary.main }}
                        />
                        Delete
                      </MenuItem>
                    </>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setAccountModalOpen(true);
                    }}
                    sx={{ p: 2, borderRadius: 3 }}
                  >
                    <ManageAccountsOutlinedIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    Account
                  </MenuItem>
                </Paper>
              </motion.div>
            </ClickAwayListener>
          )}
        </AnimatePresence>
      </Box>
      <AnimatePresence>
        {accountModalOpen && (
          <AccountModal
            onClose={() => setAccountModalOpen(false)}
            user={otherUser}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ChatHeader;

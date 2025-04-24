import React from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  ClickAwayListener,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";

const StartChatModal = ({ result, onClose, onConfirm }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: -1,
        }}
      />
      <ClickAwayListener onClickAway={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              minWidth: 300,
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">@{result.username}</Typography>
            <Typography>{result.name}</Typography>
            <Typography sx={{ mt: 1 }} color="text.secondary">
              {result.bio}
            </Typography>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <IconButton onClick={onConfirm}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      </ClickAwayListener>
    </Box>
  );
};

export default StartChatModal;

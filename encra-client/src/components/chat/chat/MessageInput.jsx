import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { encryptData } from "../../../utils/encryption";
import screenfull from "screenfull";

const MessageInput = ({ activeConversation, socket, aesKey }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [message, setMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (screenfull.isEnabled) {
      const handler = () => {
        setIsFullscreen(screenfull.isFullscreen);
      };
      screenfull.on("change", handler);
      setIsFullscreen(screenfull.isFullscreen);
      return () => {
        screenfull.off("change", handler);
      };
    }
  }, []);

  useEffect(() => {
    if (window.visualViewport) {
      const onResize = () => {
        const vh = window.innerHeight;
        const vvh = window.visualViewport.height;
        const inset = vh - vvh;
        setKeyboardHeight(inset);
      };
      window.visualViewport.addEventListener("resize", onResize);
      onResize();
      return () => {
        window.visualViewport.removeEventListener("resize", onResize);
      };
    }
  }, []);

  const handleSend = async () => {
    const text = message.trim();
    if (!socket || !activeConversation || !text) return;

    try {
      const encrypted = await encryptData(text, aesKey);
      socket.emit("message:send", {
        conversationId: activeConversation,
        content: encrypted,
        messageType: "text",
      });
      setMessage("");
    } catch (err) {
      console.error("Encryption failed, message not sent:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMdUp) {
    return (
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: theme.palette.background.default,
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSend} edge="end">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    );
  }

  const extraOffset = isFullscreen ? 48 : 0;

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      sx={{
        position: "fixed",
        bottom: `${Math.max(keyboardHeight + extraOffset, 0)}px`,
        left: 0,
        right: 0,
        p: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        zIndex: 1000,
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: theme.palette.background.default,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default MessageInput;

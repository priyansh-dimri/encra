import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { encryptData } from "../../../utils/encryption";

const MessageInput = ({ activeConversation, socket, aesKey }) => {
  const theme = useTheme();
  const [message, setMessage] = useState("");

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

  return (
    <div
      style={{
        padding: "1rem",
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
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
                <IconButton
                  onClick={handleSend}
                  edge="end"
                  aria-label="send message"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};

export default MessageInput;

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { decryptData } from "../../../utils/encryption";
import { motion } from "framer-motion";
import { format } from "date-fns";

const MotionBox = motion.create(Box);

const DecryptedMessage = ({ message, aesKey, isOwnMessage, onClick }) => {
  const [plaintext, setPlaintext] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const decryptMessage = async () => {
      try {
        const decrypted = await decryptData(message.content, aesKey);
        setPlaintext(decrypted);
      } catch {
        setPlaintext("Decryption error");
      }
    };
    decryptMessage();
  }, [message.content, aesKey]);

  const dateObj = new Date(message.createdAt);
  const formattedDate = format(dateObj, "MMMM d, yyyy");
  const formattedTime = format(dateObj, "HH:mm");

  const handleClick = () => {
    console.log("Message clicked:", message._id);
    onClick?.(message._id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        px: 2,
        py: 0.5,
      }}
      onClick={handleClick} // Attach click event
    >
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          pointerEvents: "auto",
          maxWidth: "70%",
          bgcolor: isOwnMessage
            ? theme.palette.primary.main
            : theme.palette.action.hover,
          color: isOwnMessage
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          p: 1.25,
          borderRadius: 3,
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body1">{plaintext}</Typography>
        <Typography
          variant="caption"
          component="div"
          sx={{
            textAlign: "right",
            mt: 0.5,
            opacity: 0.7,
            fontSize: "0.75rem",
          }}
        >
          {formattedDate} • {formattedTime}
        </Typography>
      </MotionBox>
    </Box>
  );
};

export default DecryptedMessage;

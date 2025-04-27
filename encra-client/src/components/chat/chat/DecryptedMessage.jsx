import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { decryptData } from "../../../utils/encryption";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DecryptedMessage = ({ message, aesKey, isOwnMessage }) => {
  const [plaintext, setPlaintext] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const decryptMessage = async () => {
      try {
        const decrypted = await decryptData(message.content, aesKey);
        setPlaintext(decrypted);
      } catch (err) {
        console.error("Failed to decrypt:", err);
        setPlaintext("Decryption error");
      }
    };
    decryptMessage();
  }, [message.content, aesKey]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        paddingX: "1rem",
        paddingY: "0.1rem",
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          maxWidth: "70%",
          backgroundColor: isOwnMessage
            ? theme.palette.primary.main
            : theme.palette.action.hover,
          color: isOwnMessage
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          padding: "0.75rem 1rem",
          borderRadius: "1.25rem",
          // borderTopRightRadius: isOwnMessage ? 0 : "1.25rem",
          // borderTopLeftRadius: isOwnMessage ? "1.25rem" : 0,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          transition: "background-color 0.3s ease",
        }}
      >
        <Typography variant="body1" fontSize="0.95rem">
          {plaintext}
        </Typography>
      </MotionBox>
    </Box>
  );
};

export default DecryptedMessage;

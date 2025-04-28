import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import DecryptedMessage from "./DecryptedMessage";
import { motion, AnimatePresence } from "framer-motion";

const MessagesArea = ({
  messages,
  aesKey,
  myUserId,
  onScroll,
  fetchingMore,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const handleScroll = () => {
      if (onScroll) {
        onScroll(container);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [onScroll]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <AnimatePresence>
        {fetchingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: "center",
              padding: "10px",
              fontSize: "14px",
              color: "#999",
            }}
          >
            Loading older messages...
          </motion.div>
        )}
      </AnimatePresence>
      {messages.map((msg) => (
        <DecryptedMessage
          key={msg._id}
          message={msg}
          aesKey={aesKey}
          isOwnMessage={msg.sender === myUserId}
        />
      ))}
      <div style={{ height: "1px" }} />{" "}
      {/* Dummy div for proper bottom scroll */}
    </Box>
  );
};

export default MessagesArea;

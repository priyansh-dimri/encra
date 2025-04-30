import React, { useRef, useState, useEffect } from "react";
import { Box, Modal, Button, Typography } from "@mui/material";
import DecryptedMessage from "./DecryptedMessage";
import { motion, AnimatePresence } from "framer-motion";

const MessagesArea = ({
  messages,
  aesKey,
  myUserId,
  onScroll,
  fetchingMore,
  deleteMessageUsingId,
}) => {
  const containerRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

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

  const handleMessageClick = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      await deleteMessageUsingId(messageToDelete);
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

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
          onClick={() => handleMessageClick(msg._id)}
        />
      ))}

      <Modal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this message?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{ marginRight: 2, borderRadius: 3 }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteCancel}
            sx={{ borderRadius: 3 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default MessagesArea;

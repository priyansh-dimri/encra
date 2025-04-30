import React from "react";
import { Box, Modal, Button, Typography } from "@mui/material";

const ConversationDeleteModal = ({ open, onConfirm, onCancel }) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
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
          Are you sure you want to delete this conversation?
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ marginRight: 2, borderRadius: 3 }}
        >
          Confirm
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: 3 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ConversationDeleteModal;

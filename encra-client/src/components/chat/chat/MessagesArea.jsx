import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Buffer } from "buffer";
import { getPublicKeyByUserId } from "../../../api/chat/user";
import { verifySignature } from "../../../utils/dilithium";
import { decapsulateSharedSecret } from "../../../utils/kyber";
import { encryptData, hashSharedSecret } from "../../../utils/encryption";
import DecryptedMessage from "./DecryptedMessage";
import { fetchAESKey } from "../../../api/chat/key";
import { useAuth } from "../../../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const MessagesArea = ({
  messages,
  aesKey,
  myUserId,
  onScroll,
  fetchingMore,
  deleteMessageUsingId,
  activeConversation,
}) => {
  console.log(aesKey);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const containerRef = useRef(null);
  const { authData, setDecryptedData } = useAuth();
  const { accessToken, csrfToken, kyberPrivateKey } = authData;
  console.log(csrfToken)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleFetchKey = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAESKey(activeConversation, accessToken, csrfToken);
      const encryptedKey = Buffer.from(res.encryptedKey, "base64");
      const signature = Buffer.from(res.signature, "base64");
      const senderId = res.senderId;

      const senderPublicKeys = await getPublicKeyByUserId(
        senderId,
        accessToken
      );
      const dilithiumPublicKey = Buffer.from(
        senderPublicKeys.dilithiumPublicKey,
        "base64"
      );

      const isVerified = verifySignature(
        encryptedKey,
        signature,
        dilithiumPublicKey
      );
      if (!isVerified) {
        console.error("Encrypted AES key could not be verified. Aborting.");
        return;
      }

      const decryptedKey = decapsulateSharedSecret(
        encryptedKey,
        kyberPrivateKey
      );
      const hashedSharedSecret = await hashSharedSecret(decryptedKey);
      const derivedKey = authData.derivedKey;

      if (!derivedKey) {
        console.error("Derived key not found in authData.");
        return;
      }

      const updatedAesKeys = [
        ...authData.aesKeys,
        {
          conversationId: activeConversation,
          aesKey: hashedSharedSecret,
        },
      ];

      const encryptedAesKeys = await encryptData(updatedAesKeys, derivedKey);
      localStorage.setItem("aesKeys", encryptedAesKeys);

      setDecryptedData(null, null, null, updatedAesKeys);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(
          "No key on server. Cannot retrieve. You'll need your original browser data."
        );
      } else {
        setError("Error fetching key. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!activeConversation) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          👋 Welcome to Encra
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Select a conversation to start chatting securely.
        </Typography>
        <Typography variant="caption">
          All messages are end-to-end encrypted. 🔒
        </Typography>
      </Box>
    );
  }

  if (!aesKey) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Encryption Key Missing
        </Typography>
        <Typography variant="body2" sx={{ my: 2, textAlign: "center" }}>
          Your encryption key for this chat is missing(maybe you cleared
          storage).
        </Typography>
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchKey}
          disabled={loading}
          size="large"
          sx={{ mt: 2, px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
        >
          {loading ? "Fetching Key…" : "Fetch Key"}
        </Button>
      </Box>
    );
  }

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
        pb: isMdUp ? undefined : "calc(1rem + 56px)",
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

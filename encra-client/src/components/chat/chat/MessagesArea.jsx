import React, { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { fetchAESKey } from "../../../api/chat/key";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Buffer } from "buffer";
import { getPublicKeyByUserId } from "../../../api/chat/user";
import { verifySignature } from "../../../utils/dilithium";
import { decapsulateSharedSecret } from "../../../utils/kyber";
import { encryptData, hashSharedSecret } from "../../../utils/encryption";
import DecryptedMessage from "./DecryptedMessage";

const MessagesArea = ({ messages, activeConversation, aesKey }) => {
  // Scrollable container for chat messages
  // Only supports text messages for now
  const theme = useTheme();
  const { authData, setDecryptedData } = useAuth();
  const myUserId = authData.myUserId;
  const { accessToken, csrfToken, kyberPrivateKey } = authData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log(senderPublicKeys);
      console.log(encryptedKey);
      console.log(signature);
      console.log(dilithiumPublicKey);

      const isVerified = verifySignature(
        encryptedKey,
        signature,
        dilithiumPublicKey
      );

      if (!isVerified) {
        console.error(
          "Encrypted AES key could not be verified. Aborting AES Key fetch."
        );
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

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      {messages.map((msg) => (
        <DecryptedMessage
          key={msg._id}
          message={msg}
          aesKey={aesKey}
          isOwnMessage={msg.sender === myUserId}
        />
      ))}
    </div>
  );
};

export default MessagesArea;

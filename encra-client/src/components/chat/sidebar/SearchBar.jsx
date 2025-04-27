import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence } from "framer-motion";
import {
  getPublicKeyByUserId,
  getUserByUsername,
} from "../../../api/chat/user";
import SearchResultCard from "./SearchResultCard";
import StartChatModal from "./StartChatModal";
import { useAuth } from "../../../context/useAuth.js";
import { startConversation } from "../../../api/chat/conversation";
import { encapsulateSharedSecretWithPublicKey } from "../../../utils/kyber.js";
import { encryptData, hashSharedSecret } from "../../../utils/encryption.js";
import { Buffer } from "buffer";
import { signMessage, verifySignature } from "../../../utils/dilithium.js";

const SearchBar = ({ setConversations, setActiveConversation }) => {
  const { authData, setDecryptedData } = useAuth();
  const token = authData.accessToken;
  const csrfToken = authData.csrfToken;
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setShowModal(false);

    try {
      const user = await getUserByUsername(query.trim(), token);
      if (user) {
        console.log(user);
        setResult(user);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!result?._id) return;

    try {
      const recipientPublicKey = await getPublicKeyByUserId(result._id, token);

      const kyberPublicKey = Buffer.from(
        recipientPublicKey.kyberPublicKey,
        "base64"
      );
      const dilithiumPublicKey = Buffer.from(
        recipientPublicKey.dilithiumPublicKey,
        "base64"
      );
      const kyberPublicKeySignature = Buffer.from(
        recipientPublicKey.kyberPublicKeySignature,
        "base64"
      );

      const isVerified = verifySignature(
        kyberPublicKey,
        kyberPublicKeySignature,
        dilithiumPublicKey
      );

      if (!isVerified) {
        console.error(
          "Kyber public key could not be verified. Aborting conversation start."
        );
        return;
      }

      const { cipherText, sharedSecret } =
        encapsulateSharedSecretWithPublicKey(kyberPublicKey);

      const dilithiumPrivateKey = authData.dilithiumPrivateKey;

      const signature = signMessage(cipherText, dilithiumPrivateKey);

      const convoResponse = await startConversation(
        result._id,
        Buffer.from(cipherText).toString("base64"),
        token,
        csrfToken,
        Buffer.from(signature).toString("base64")
      );

      setActiveConversation(convoResponse.conversation._doc._id);

      if (convoResponse.created) {
        const convoId = convoResponse.conversation._id;
        const hashedSharedSecret = await hashSharedSecret(sharedSecret);
        const derivedKey = authData.derivedKey;

        if (!derivedKey) {
          console.error("Derived key not found in authData.");
          return;
        }

        const updatedAesKeys = [
          ...authData.aesKeys,
          {
            conversationId: convoId,
            aesKey: hashedSharedSecret,
          },
        ];

        const encryptedAesKeys = await encryptData(updatedAesKeys, derivedKey);
        localStorage.setItem("aesKeys", encryptedAesKeys);

        setDecryptedData(null, null, null, updatedAesKeys);
        setConversations((prevData) => [
          convoResponse.conversation,
          ...prevData,
        ]);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    } finally {
      setShowModal(false);
      setResult(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <TextField
        variant="outlined"
        placeholder="Start a new chat..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearch}
                  edge="end"
                  aria-label="search for new chat"
                >
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <AnimatePresence>
        {result && !showModal && (
          <SearchResultCard
            result={result}
            onClickAway={() => setResult(null)}
            onStartChat={() => setShowModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && result && (
          <StartChatModal
            result={result}
            onClose={() => {
              setShowModal(false);
              setResult(null);
            }}
            onConfirm={handleStartConversation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

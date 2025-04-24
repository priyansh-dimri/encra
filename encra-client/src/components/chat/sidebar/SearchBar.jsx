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

import SearchResultCard from "./SearchResultCard";
import StartChatModal from "./StartChatModal";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setShowModal(false);

    // Dummy fetch time out
    setTimeout(() => {
      setResult({
        username: "john",
        name: "John Doe",
        bio: "Loves privacy and cryptography 🛡️",
      });
      setLoading(false);
    }, 1000);
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
            onConfirm={() => {
              console.log("Start convo with", result.username);
              setShowModal(false);
              setResult(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

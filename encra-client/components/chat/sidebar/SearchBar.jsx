import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const theme = useTheme();

  const handleSearch = () => {
    if (query.trim()) {
      console.log("Searching for:", query);
    }
  };

  const handleKeyPress = (e) => {
    // TODO: Add search logic
    if (e.key === "Enter") {
      handleSearch();
    }
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
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};

export default SearchBar;

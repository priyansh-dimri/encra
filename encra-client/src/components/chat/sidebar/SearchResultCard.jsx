import React from "react";
import { Box, Paper, Typography, IconButton, ClickAwayListener } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";

const SearchResultCard = ({ result, onClickAway, onStartChat }) => {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ marginTop: "1rem" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Box>
            <Typography fontWeight="bold">@{result.username}</Typography>
            <Typography color="text.secondary">{result.name}</Typography>
          </Box>
          <IconButton onClick={onStartChat}>
            <SendIcon />
          </IconButton>
        </Paper>
      </motion.div>
    </ClickAwayListener>
  );
};

export default SearchResultCard;

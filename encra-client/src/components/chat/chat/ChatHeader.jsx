import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  MenuItem,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = ({ topBarHeight }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        height: `${topBarHeight + 0.9}px`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        position: "relative",
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          @username
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Recipient Name
        </Typography>
      </Box>

      <Box>
        <IconButton onClick={handleToggle}>
          <MoreVertIcon />
        </IconButton>

        <AnimatePresence>
          {open && (
            <ClickAwayListener onClickAway={handleClose}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "1rem",
                  zIndex: 10,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{ borderRadius: 3, overflow: "hidden" }}
                >
                  <MenuItem onClick={handleClose} sx={{ padding: 2 }}>
                    <InfoOutlinedIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    Info
                  </MenuItem>
                  <MenuItem onClick={handleClose} sx={{ padding: 2 }}>
                    <DeleteOutlineIcon
                      sx={{ mr: 1, color: theme.palette.secondary.main }}
                    />
                    Delete
                  </MenuItem>
                </Paper>
              </motion.div>
            </ClickAwayListener>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default ChatHeader;

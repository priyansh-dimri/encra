import React from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Button,
  ClickAwayListener,
  useTheme,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion } from "framer-motion";

const AccountModal = ({ onClose, onLogout, onDelete }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: -1,
        }}
      />

      <ClickAwayListener onClickAway={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              minWidth: 320,
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Account Options
            </Typography>

            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Button
                variant="outlined"
                startIcon={<LogoutOutlinedIcon />}
                onClick={onLogout}
                sx={{
                  justifyContent: "flex-start",
                  px: 2,
                  borderRadius: 3,
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                }}
              >
                Logout
              </Button>

              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                onClick={onDelete}
                sx={{
                  justifyContent: "flex-start",
                  px: 2,
                  borderRadius: 3,
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.text.primary,
                  },
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </ClickAwayListener>
    </Box>
  );
};

export default AccountModal;

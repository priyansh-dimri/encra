import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  ClickAwayListener,
  useTheme,
  Alert,
  TextField,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteMyAccount } from "../../../api/chat/user";

const AccountModal = ({ onClose }) => {
  const theme = useTheme();
  const { authData, clearAuthData } = useAuth();
  const { accessToken, csrfToken } = authData;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteClick = () => {
    console.log("OK");
    setShowPasswordInput(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteMyAccount(accessToken, csrfToken, password);
    if (success) {
      clearAuthData();
      localStorage.clear();
      navigate("/register", { state: { accountDeleted: true } });
    } else {
      setError("Incorrect password or failed to delete account.");
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

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
                onClick={handleLogout}
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
                onClick={handleDeleteClick}
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

              {showPasswordInput && (
                <>
                  <TextField
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    color="error"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirmDelete}
                    fullWidth
                    sx={{ mt: 1, borderRadius: 3 }}
                  >
                    Confirm Delete
                  </Button>
                </>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        </motion.div>
      </ClickAwayListener>
    </Box>
  );
};

export default AccountModal;

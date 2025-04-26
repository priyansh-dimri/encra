import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Button,
  useTheme,
} from "@mui/material";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { delay: 0.1 },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: { ease: "easeInOut" },
  },
};

const WelcomeModal = ({ show, onClose }) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              background: theme.palette.background.paper,
              padding: "1.5rem",
              borderRadius: theme.shape.borderRadius * 3,
              width: "90%",
              maxWidth: 480,
              maxHeight: "80vh",
              boxShadow: theme.shadows[5],
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" gutterBottom>
              👋 Welcome to{" "}
              <Box
                component="strong"
                sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
              >
                Encra
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              A privacy first chat experience where <strong>only you</strong> hold the keys 🔐
            </Typography>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                my: 2,
                bgcolor: theme.palette.background.default, borderRadius: 3
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ⚠️ <strong>End-to-End. Browser Only.</strong>
                </Typography>
                <Typography variant="body2">
                  Your AES and private keys live entirely in your browser{" "}
                  <strong>never</strong> on our servers.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  🚫 <strong>No Password Recovery</strong>
                </Typography>
                <Typography variant="body2">
                  Forget your password? There's no reset link. You'll lose access to all encrypted data.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  💾 <strong>Backup Your Keys</strong>
                </Typography>
                <Typography variant="body2">
                  Before clearing browser storage, export & save your encrypted keys. There is no undo.
                </Typography>
              </Box>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label="I have read and understood the above"
            />

            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={onClose}
                disabled={!checked}
                sx={{ fontWeight: 600, borderRadius: 3 }}
              >
                Let's Go 🚀
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;

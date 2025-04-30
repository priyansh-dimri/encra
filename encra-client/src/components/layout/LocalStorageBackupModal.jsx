import React, { useRef, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  ClickAwayListener,
  Alert,
} from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import RestorePageOutlinedIcon from "@mui/icons-material/RestorePageOutlined";
import { motion } from "framer-motion";

const LocalStorageBackupModal = ({ open, onClose }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDownload = () => {
    try {
      const backupData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backupData[key] = localStorage.getItem(key);
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "encra-backup.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to create backup file.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (typeof importedData !== "object" || Array.isArray(importedData)) {
          throw new Error("Invalid backup format");
        }

        for (const [key, value] of Object.entries(importedData)) {
          localStorage.setItem(key, value);
        }

        setSuccess("Backup imported successfully. Reloading...");
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        setError("Invalid backup file. Please try again.");
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!open) return null;

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
              LocalStorage Backup
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Download a JSON backup of your encrypted localStorage data or
              restore it from a previous backup.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<BackupOutlinedIcon />}
                onClick={handleDownload}
                sx={{ borderRadius: 3 }}
              >
                Download Backup
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestorePageOutlinedIcon />}
                onClick={triggerFileInput}
                sx={{ borderRadius: 3 }}
              >
                Import Backup
              </Button>

              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && <Alert severity="success">{success}</Alert>}
            </Box>

            <Button onClick={onClose} sx={{ mt: 3, borderRadius: 3 }} fullWidth>
              Close
            </Button>
          </Paper>
        </motion.div>
      </ClickAwayListener>
    </Box>
  );
};

export default LocalStorageBackupModal;

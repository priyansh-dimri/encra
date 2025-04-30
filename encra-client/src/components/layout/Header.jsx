import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LocalStorageBackupModal from "./LocalStorageBackupModal";

const Header = ({ toggleTheme }) => {
  const theme = useTheme();
  const [backupModalOpen, setBackupModalOpen] = useState(false);

  const handleOpenBackup = () => setBackupModalOpen(true);
  const handleCloseBackup = () => setBackupModalOpen(false);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: theme.palette.background.paper }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            color="primary"
            sx={{ textDecoration: "none", fontWeight: "bold" }}
          >
            ENCRA
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
            <Button component={RouterLink} to="/register" color="inherit">
              Register
            </Button>
            <Button onClick={handleOpenBackup} color="inherit">
              Backup
            </Button>
          </Box>

          <IconButton
            onClick={toggleTheme}
            sx={{ color: theme.palette.primary.main }}
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <LocalStorageBackupModal
        open={backupModalOpen}
        onClose={handleCloseBackup}
      />
    </>
  );
};

export default Header;

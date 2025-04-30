import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import LocalStorageBackupModal from "./LocalStorageBackupModal";
import FullscreenButton from "./FullScreenButton";

const Header = ({ toggleTheme }) => {
  const theme = useTheme();
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenBackup = () => setBackupModalOpen(true);
  const handleCloseBackup = () => setBackupModalOpen(false);
  const toggleDrawer = () => setDrawerOpen((o) => !o);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: theme.palette.background.paper }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            color="primary"
            sx={{ textDecoration: "none", fontWeight: "bold" }}
          >
            ENCRA
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
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

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
          </Box>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <FullscreenButton />
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
            <IconButton
              onClick={toggleDrawer}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 200,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <List>
          <ListItem button component={RouterLink} to="/" onClick={toggleDrawer}>
            <ListItemText
              primary="Home"
              slotProps={{
                primary: { style: { color: theme.palette.primary.main } },
              }}
            />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/login"
            onClick={toggleDrawer}
          >
            <ListItemText
              primary="Login"
              slotProps={{
                primary: { style: { color: theme.palette.primary.main } },
              }}
            />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/register"
            onClick={toggleDrawer}
          >
            <ListItemText
              primary="Register"
              slotProps={{
                primary: { style: { color: theme.palette.primary.main } },
              }}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              toggleDrawer();
              handleOpenBackup();
            }}
          >
            <ListItemText
              primary="Backup"
              slotProps={{
                primary: { style: { color: theme.palette.primary.main } },
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      <LocalStorageBackupModal
        open={backupModalOpen}
        onClose={handleCloseBackup}
      />
    </>
  );
};

export default Header;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const TopBar = ({ toggleTheme, topBarHeight }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: `${topBarHeight}px`,
        justifyContent: "center",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: 2,
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left-aligned App Name */}
        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          Encra
        </Typography>

        {/* Right-aligned theme toggle icon */}
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
  );
};

export default TopBar;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FullscreenButton from "../../layout/FullScreenButton";

const TopBar = ({ toggleTheme, topBarHeight }) => {
  const theme = useTheme();
  // Show fullscreen toggle only on mobile screens (below 'md')
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <FullscreenButton />
            </Box>
          )}
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
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

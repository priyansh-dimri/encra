import React from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatHeader = ({ topBarHeight }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: `${topBarHeight + 0.9}px`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
          @username
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Recipient Name
        </Typography>
      </Box>

      {/* Right side: Menu icon */}
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

export default ChatHeader;

import React from "react";
import screenfull from "screenfull";
import { IconButton, Tooltip } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const FullscreenButton = () => {
  const handleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    } else {
      alert("Fullscreen not supported on this browser.");
    }
  };

  return (
    <Tooltip title="Toggle Fullscreen">
      <IconButton onClick={handleFullscreen} color="inherit">
        <FullscreenIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenButton;

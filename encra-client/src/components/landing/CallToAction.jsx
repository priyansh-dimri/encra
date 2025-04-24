import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        my: { xs: 8, md: 12 },
        py: { xs: 4, md: 6 },
        textAlign: "center",
        bgcolor: "background.default",
        borderRadius: 3,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={2}>
          Don't want your messages tracked?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start using Encra now and experience messaging that's truly private.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default CallToAction;

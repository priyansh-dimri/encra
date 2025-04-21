import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        my: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          Private messaging, reimagined for the next era.
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 4,
            textAlign: "center",
            maxWidth: 700,
            mx: "auto",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
          }}
        >
          Encra lets you chat with complete confidence using next-gen
          encryption. No tracking, no data mining — just fast, private messaging
          you control.
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
          >
            Try Encra now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;

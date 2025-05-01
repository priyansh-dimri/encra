import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "3rem", md: "4rem" },
            mb: 2,
          }}
        >
          404 - Page Not Found
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: 4,
            fontSize: { xs: "1rem", md: "1.2rem" },
          }}
        >
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundSection;

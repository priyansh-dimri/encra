import React from "react";
import { Typography, Container, Box, useTheme } from "@mui/material";
import cryptoTech from "./cryptoTechData";
import InfoCard from "./InfoCard";

const CryptoTechSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        my: { xs: 8, md: 12 },
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Built with{" "}
          <span style={{ color: theme.palette.primary.main }}>
            Trusted Cryptography
          </span>
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {cryptoTech.map((tech, i) => (
            <InfoCard
              key={i}
              title={tech.title}
              description={tech.description}
              icon={tech.icon}
              iconSize={40}
              iconMb={2}
              padding={3}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CryptoTechSection;

import React from "react";
import { Typography, Container, Box, useTheme } from "@mui/material";
import features from "./featuresData";
import InfoCard from "./InfoCard";

const FeaturesSection = () => {
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
          Why choose{" "}
          <span style={{ color: theme.palette.primary.main }}>Encra?</span>
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {features.map((feature, i) => (
            <InfoCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconSize={48}
              iconMb={1}
              padding={2}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;

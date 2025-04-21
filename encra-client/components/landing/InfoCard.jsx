import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";

const InfoCard = ({
  icon,
  title,
  description,
  iconSize = 48,
  iconMb = 1,
  padding = 2,
}) => {
  const Icon = icon;
  const theme = useTheme();
  return (
    <Card
      elevation={3}
      sx={{
        textAlign: "center",
        p: padding,
        borderRadius: 2,
        bgcolor: "background.paper",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <Box
        sx={{
          mb: iconMb,
          color: theme.palette.primary.main,
          fontSize: iconSize,
        }}
      >
        <Icon fontSize="inherit" />
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;

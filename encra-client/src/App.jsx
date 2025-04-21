import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import AppRouter from "../routes/AppRouter";

export default function App() {
  const [mode, setMode] = useState("dark");
  const theme = mode === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter mode={mode} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

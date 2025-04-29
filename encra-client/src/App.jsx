import React, { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import AppRouter from "./routes/AppRouter";
import { useSetupCSRF } from "./hooks/useSetupCSRF";
import { useAuth } from "./context/useAuth";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptors } from "./api";

export default function App() {
  const [mode, setMode] = useState("dark");
  const theme = mode === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const { authData, setTokens } = useAuth();
  const navigate = useNavigate();

  useSetupCSRF();

  useEffect(() => {
    if (authData) {
      setupAxiosInterceptors(authData, setTokens, navigate);
    }
  }, [authData, setTokens, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter mode={mode} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

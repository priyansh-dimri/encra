import { createTheme } from "@mui/material/styles";

const common = {
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
};

export const lightTheme = createTheme({
  ...common,
  palette: {
    mode: "light",
    primary: {
      main: "#22d3ee", // cyan-500
    },
    secondary: {
      main: "#fda4af", // rose-300
    },
    background: {
      default: "#f8fafc", // slate-100
      paper: "#e2e8f0", // slate-200
    },
    text: {
      primary: "#111827", // gray-900
      secondary: "#4b5563", // gray-600
    },
  },
});

export const darkTheme = createTheme({
  ...common,
  palette: {
    mode: "dark",
    primary: {
      main: "#22d3ee", // cyan-400
    },
    secondary: {
      main: "#fb7185", // rose-400
    },
    background: {
      default: "#18181b", // zinc-900
      paper: "#27272a", // zinc-800
    },
    text: {
      primary: "#f3f4f6", // gray-100
      secondary: "#d1d5db", // gray-400
    },
  },
});
